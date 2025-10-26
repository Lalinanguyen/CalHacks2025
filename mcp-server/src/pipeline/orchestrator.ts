/**
 * Pipeline Orchestrator
 * Main coordinator for the audio automation pipeline
 */

import {
  Project,
  PipelineConfig,
  PipelineStage,
  AudioLayer,
  MIDIPattern,
  MixingParameters,
  MusicAutomationError,
} from '../types/index.js';
import { SpotifyService } from '../services/spotify.js';
import { ElevenLabsService } from '../services/elevenlabs.js';
import { MIDIGeneratorService } from '../services/midi-generator.js';
import { LettaService } from '../services/letta.js';
import { AudioMixerService } from '../services/audio-mixer.js';
import { LayerManager } from './layer-manager.js';
import { AudioProcessor } from './audio-processor.js';

export class PipelineOrchestrator {
  private projects: Map<string, Project> = new Map();
  private layerManager: LayerManager;
  private audioProcessor: AudioProcessor;

  private spotifyService?: SpotifyService;
  private elevenLabsService?: ElevenLabsService;
  private midiGenerator: MIDIGeneratorService;
  private lettaService?: LettaService;
  private audioMixer: AudioMixerService;

  constructor(
    layerManager: LayerManager,
    audioProcessor: AudioProcessor,
    services: {
      spotify?: SpotifyService;
      elevenLabs?: ElevenLabsService;
      letta?: LettaService;
    } = {}
  ) {
    this.layerManager = layerManager;
    this.audioProcessor = audioProcessor;
    this.spotifyService = services.spotify;
    this.elevenLabsService = services.elevenLabs;
    this.lettaService = services.letta;

    this.midiGenerator = new MIDIGeneratorService();
    this.audioMixer = new AudioMixerService();
  }

  /**
   * Create a new project
   */
  createProject(name: string, config: PipelineConfig): Project {
    const project: Project = {
      id: this.generateProjectId(),
      name,
      description: `Music automation project: ${name}`,
      config,
      layers: [],
      status: 'initialized',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
    };

    this.projects.set(project.id, project);
    return project;
  }

  /**
   * Get a project by ID
   */
  getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId);
  }

  /**
   * Process complete audio pipeline
   */
  async processAudioPipeline(
    projectId: string,
    spotifyTrackId?: string
  ): Promise<Project> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new MusicAutomationError(
        `Project ${projectId} not found`,
        'PROJECT_NOT_FOUND'
      );
    }

    try {
      // Stage 1: Analysis
      if (spotifyTrackId && this.spotifyService) {
        await this.runAnalysisStage(project, spotifyTrackId);
      }

      // Stage 2: Generation
      await this.runGenerationStage(project);

      // Stage 3: Processing
      await this.runProcessingStage(project);

      // Stage 4: Mixing
      await this.runMixingStage(project);

      // Update project status
      project.status = 'completed';
      project.updatedAt = new Date();
      this.projects.set(projectId, project);

      return project;
    } catch (error: any) {
      project.status = 'failed';
      project.updatedAt = new Date();
      this.projects.set(projectId, project);
      throw error;
    }
  }

  /**
   * Run analysis stage
   */
  private async runAnalysisStage(
    project: Project,
    trackId: string
  ): Promise<void> {
    if (!this.spotifyService) {
      throw new MusicAutomationError(
        'Spotify service not configured',
        'SERVICE_NOT_CONFIGURED'
      );
    }

    project.status = 'analyzing';
    this.projects.set(project.id, project);

    const { features, analysis } = await this.spotifyService.getCompleteTrackData(
      trackId
    );

    // Extract musical parameters
    const musicalParams = this.spotifyService.extractMusicalParameters(
      features,
      analysis
    );

    // Update project config with analyzed parameters
    project.config.tempo = musicalParams.tempo;
    project.config.key = musicalParams.key;
    project.config.timeSignature = musicalParams.timeSignature;

    // Store analysis in project metadata
    (project as any).spotifyFeatures = features;
    (project as any).spotifyAnalysis = analysis;

    project.updatedAt = new Date();
    this.projects.set(project.id, project);
  }

  /**
   * Run generation stage
   */
  private async runGenerationStage(project: Project): Promise<void> {
    project.status = 'generating';
    this.projects.set(project.id, project);

    const generationPromises: Promise<AudioLayer>[] = [];

    // Generate layers based on configuration
    for (const layerConfig of project.config.layers) {
      generationPromises.push(
        this.generateLayer(project.id, layerConfig)
      );
    }

    // Wait for all layers to be generated
    const layers = await Promise.all(generationPromises);
    project.layers = layers;

    project.updatedAt = new Date();
    this.projects.set(project.id, project);
  }

  /**
   * Generate a single layer
   */
  private async generateLayer(
    projectId: string,
    layerConfig: any
  ): Promise<AudioLayer> {
    const layer = this.layerManager.createLayer(projectId, layerConfig);
    const job = this.layerManager.createJob(layer.id, 'generating');

    try {
      let audioData: Buffer | undefined;

      if (layerConfig.type === 'midi') {
        // Generate MIDI pattern
        const midiPattern = this.midiGenerator.generatePattern(
          layerConfig.parameters
        );
        // In production, convert MIDI to audio
        // For now, store MIDI data as metadata
        layer.metadata.midiPattern = midiPattern;
        audioData = Buffer.from('MIDI placeholder'); // Placeholder
      } else if (this.elevenLabsService) {
        // Generate audio using ElevenLabs
        audioData = await this.elevenLabsService.generateAudioLayer(
          layerConfig.type,
          layerConfig.parameters.text || 'Generated audio',
          layerConfig.parameters
        );
      }

      if (audioData) {
        this.layerManager.updateLayerAudio(layer.id, audioData, {
          duration: await this.audioProcessor.getAudioDuration(audioData),
        });
      }

      this.layerManager.updateJobStatus(job.id, 'completed', layer);
      return this.layerManager.getLayer(layer.id)!;
    } catch (error: any) {
      this.layerManager.updateJobStatus(
        job.id,
        'failed',
        null,
        error.message
      );
      this.layerManager.updateLayerStatus(layer.id, 'failed');
      throw error;
    }
  }

  /**
   * Run processing stage
   */
  private async runProcessingStage(project: Project): Promise<void> {
    project.status = 'processing';
    this.projects.set(project.id, project);

    // Apply any post-processing to layers
    for (const layer of project.layers) {
      if (layer.metadata.effects && layer.metadata.effects.length > 0) {
        const job = this.layerManager.createJob(layer.id, 'processing');

        try {
          if (layer.audioData) {
            const processedAudio = await this.audioMixer.applyEffects(
              layer.audioData,
              layer.metadata.effects
            );

            this.layerManager.updateLayerAudio(layer.id, processedAudio);
          }

          this.layerManager.updateJobStatus(job.id, 'completed');
        } catch (error: any) {
          this.layerManager.updateJobStatus(
            job.id,
            'failed',
            null,
            error.message
          );
        }
      }
    }

    project.updatedAt = new Date();
    this.projects.set(project.id, project);
  }

  /**
   * Run mixing stage
   */
  private async runMixingStage(project: Project): Promise<void> {
    project.status = 'mixing';
    this.projects.set(project.id, project);

    // Create default mixing parameters
    const mixingParams: MixingParameters = {
      masterGain: 0,
      layers: project.layers.map((layer) => ({
        layerId: layer.id,
        gain: layer.metadata.gain || 0,
        pan: layer.metadata.pan || 0,
      })),
    };

    // Get AI suggestions if Letta is available
    if (this.lettaService) {
      try {
        const suggestions = await this.lettaService.getMixingSuggestions(
          project.layers.map((l) => ({ name: l.name, type: l.type }))
        );

        if (suggestions.parameters) {
          Object.assign(mixingParams, suggestions.parameters);
        }
      } catch (error) {
        console.warn('Failed to get AI mixing suggestions:', error);
      }
    }

    // Perform the mix
    const mixedAudio = await this.audioMixer.mixLayers(
      project.layers,
      mixingParams
    );

    // Save the mixed audio
    const outputPath = await this.audioProcessor.saveAudioToFile(
      mixedAudio,
      `${project.name}_mixed`,
      project.config.outputFormat
    );

    (project as any).outputPath = outputPath;

    project.updatedAt = new Date();
    this.projects.set(project.id, project);
  }

  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  /**
   * Get project summary
   */
  getProjectSummary(projectId: string) {
    const project = this.projects.get(projectId);
    if (!project) {
      return null;
    }

    return {
      id: project.id,
      name: project.name,
      status: project.status,
      layerCount: project.layers.length,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  /**
   * Delete a project
   */
  deleteProject(projectId: string): void {
    const project = this.projects.get(projectId);
    if (project) {
      // Clean up layers
      for (const layer of project.layers) {
        this.layerManager.deleteLayer(layer.id);
      }

      this.projects.delete(projectId);
    }
  }

  /**
   * Generate project ID
   */
  private generateProjectId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
