#!/usr/bin/env node

/**
 * Music Automation MCP Server
 * Orchestrates audio pipeline with AI-driven decision making
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

// Import services
import { SpotifyService } from './services/spotify.js';
import { ElevenLabsService } from './services/elevenlabs.js';
import { MIDIGeneratorService } from './services/midi-generator.js';
import { LettaService } from './services/letta.js';
import { AudioMixerService } from './services/audio-mixer.js';

// Import pipeline components
import { PipelineOrchestrator } from './pipeline/orchestrator.js';
import { LayerManager } from './pipeline/layer-manager.js';
import { AudioProcessor } from './pipeline/audio-processor.js';

// Import types
import {
  ProcessAudioPipelineRequest,
  AnalyzeSpotifyTrackRequest,
  GenerateAudioLayerRequest,
  GenerateMIDIPatternRequest,
  MixAudioLayersRequest,
  QueryLettaAgentRequest,
  GetPipelineStatusRequest,
} from './types/index.js';

// Load environment variables
dotenv.config();

// Initialize services
const spotifyService = process.env.SPOTIFY_CLIENT_ID &&
  process.env.SPOTIFY_CLIENT_SECRET
  ? new SpotifyService(
      process.env.SPOTIFY_CLIENT_ID,
      process.env.SPOTIFY_CLIENT_SECRET
    )
  : undefined;

const elevenLabsService = process.env.ELEVENLABS_API_KEY
  ? new ElevenLabsService(process.env.ELEVENLABS_API_KEY)
  : undefined;

const lettaService =
  process.env.LETTA_API_KEY && process.env.LETTA_AGENT_ID
    ? new LettaService(
        process.env.LETTA_API_KEY,
        process.env.LETTA_AGENT_ID,
        process.env.LETTA_BASE_URL
      )
    : undefined;

const midiGenerator = new MIDIGeneratorService();
const audioMixer = new AudioMixerService();

// Initialize pipeline components
const layerManager = new LayerManager();
const audioProcessor = new AudioProcessor(
  process.env.OUTPUT_DIR || './output',
  process.env.TEMP_DIR || './temp'
);

const orchestrator = new PipelineOrchestrator(layerManager, audioProcessor, {
  spotify: spotifyService,
  elevenLabs: elevenLabsService,
  letta: lettaService,
});

// Initialize MCP Server
const server = new Server(
  {
    name: 'music-automation-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============================================================================
// TOOL HANDLERS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'process_audio_pipeline',
        description:
          'Orchestrates the complete audio pipeline from analysis to mixing. Processes a Spotify track or creates new audio from configuration.',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: {
              type: 'string',
              description: 'Name for the project',
            },
            spotifyTrackId: {
              type: 'string',
              description: 'Optional Spotify track ID for analysis',
            },
            config: {
              type: 'object',
              description: 'Pipeline configuration',
              properties: {
                tempo: { type: 'number' },
                key: { type: 'string' },
                timeSignature: { type: 'string' },
                outputFormat: {
                  type: 'string',
                  enum: ['wav', 'mp3', 'flac'],
                },
                layers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['vocals', 'drums', 'bass', 'synth', 'fx', 'midi'],
                      },
                      name: { type: 'string' },
                      parameters: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
          required: ['projectName'],
        },
      },
      {
        name: 'analyze_spotify_track',
        description:
          'Fetches audio features and detailed analysis from Spotify API for a given track ID.',
        inputSchema: {
          type: 'object',
          properties: {
            trackId: {
              type: 'string',
              description: 'Spotify track ID',
            },
          },
          required: ['trackId'],
        },
      },
      {
        name: 'generate_audio_layer',
        description:
          'Creates a new audio layer using ElevenLabs API for vocals, effects, or ambient sounds.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Project ID to add the layer to',
            },
            type: {
              type: 'string',
              enum: ['vocals', 'fx', 'ambient'],
              description: 'Type of audio to generate',
            },
            text: {
              type: 'string',
              description: 'Text description or content for generation',
            },
            voiceId: {
              type: 'string',
              description: 'Optional voice ID for vocals',
            },
            parameters: {
              type: 'object',
              description: 'Additional generation parameters',
            },
          },
          required: ['projectId', 'type', 'text'],
        },
      },
      {
        name: 'generate_midi_pattern',
        description:
          'Creates MIDI patterns based on musical parameters and style preferences.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Project ID to associate the pattern with',
            },
            parameters: {
              type: 'object',
              properties: {
                style: {
                  type: 'string',
                  enum: ['jazz', 'rock', 'edm', 'classical', 'hip-hop', 'ambient'],
                },
                complexity: {
                  type: 'string',
                  enum: ['simple', 'medium', 'complex'],
                },
                tempo: { type: 'number' },
                key: { type: 'string' },
                timeSignature: { type: 'string' },
                numberOfBars: { type: 'number' },
              },
            },
          },
          required: ['projectId', 'parameters'],
        },
      },
      {
        name: 'mix_audio_layers',
        description:
          'Combines multiple audio layers with specified mixing parameters (gain, pan, effects).',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Project ID to mix',
            },
            mixingParameters: {
              type: 'object',
              properties: {
                masterGain: { type: 'number' },
                layers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      layerId: { type: 'string' },
                      gain: { type: 'number' },
                      pan: { type: 'number' },
                      mute: { type: 'boolean' },
                      solo: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
          required: ['projectId', 'mixingParameters'],
        },
      },
      {
        name: 'query_letta_agent',
        description:
          'Communicates with Letta AI agent for creative decisions and pipeline orchestration.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Question or request for the AI agent',
            },
            context: {
              type: 'object',
              description: 'Additional context for the query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_pipeline_status',
        description:
          'Returns the current status of pipeline processing jobs and projects.',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Optional project ID to filter status',
            },
            jobId: {
              type: 'string',
              description: 'Optional job ID to get specific job status',
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'process_audio_pipeline': {
        const args = request.params.arguments as unknown as ProcessAudioPipelineRequest;

        // Create default config if not provided
        const defaultConfig = {
          projectId: '',
          outputFormat: 'wav' as const,
          layers: args.config?.layers || [],
          ...args.config,
        };

        const project = orchestrator.createProject(args.projectName, defaultConfig);

        // Process the pipeline
        const result = await orchestrator.processAudioPipeline(
          project.id,
          args.spotifyTrackId
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  projectId: result.id,
                  status: result.status,
                  layers: result.layers.length,
                  outputPath: (result as any).outputPath,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'analyze_spotify_track': {
        if (!spotifyService) {
          throw new McpError(
            ErrorCode.InternalError,
            'Spotify service not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.'
          );
        }

        const args = request.params.arguments as unknown as AnalyzeSpotifyTrackRequest;
        const data = await spotifyService.getCompleteTrackData(args.trackId);
        const params = spotifyService.extractMusicalParameters(
          data.features,
          data.analysis
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  features: data.features,
                  musicalParameters: params,
                  sections: data.analysis.sections.length,
                  beats: data.analysis.beats.length,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'generate_audio_layer': {
        if (!elevenLabsService) {
          throw new McpError(
            ErrorCode.InternalError,
            'ElevenLabs service not configured. Please set ELEVENLABS_API_KEY.'
          );
        }

        const args = request.params.arguments as unknown as GenerateAudioLayerRequest;

        const audioData = await elevenLabsService.generateAudioLayer(
          args.type,
          args.text,
          { voiceId: args.voiceId, ...args.parameters }
        );

        // Create a layer in the project
        const project = orchestrator.getProject(args.projectId);
        if (!project) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Project ${args.projectId} not found`
          );
        }

        const layer = layerManager.createLayer(args.projectId, {
          type: args.type,
          name: `${args.type} layer`,
          parameters: args.parameters || {},
        });

        layerManager.updateLayerAudio(layer.id, audioData);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  layerId: layer.id,
                  projectId: args.projectId,
                  type: args.type,
                  audioSize: audioData.length,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'generate_midi_pattern': {
        const args = request.params.arguments as unknown as GenerateMIDIPatternRequest;

        const pattern = midiGenerator.generatePattern(args.parameters);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(pattern, null, 2),
            },
          ],
        };
      }

      case 'mix_audio_layers': {
        const args = request.params.arguments as unknown as MixAudioLayersRequest;

        const project = orchestrator.getProject(args.projectId);
        if (!project) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Project ${args.projectId} not found`
          );
        }

        const mixedAudio = await audioMixer.mixLayers(
          project.layers,
          args.mixingParameters
        );

        const outputPath = await audioProcessor.saveAudioToFile(
          mixedAudio,
          `${project.name}_custom_mix`,
          project.config.outputFormat
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  projectId: args.projectId,
                  outputPath,
                  audioSize: mixedAudio.length,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'query_letta_agent': {
        if (!lettaService) {
          throw new McpError(
            ErrorCode.InternalError,
            'Letta service not configured. Please set LETTA_API_KEY and LETTA_AGENT_ID.'
          );
        }

        const args = request.params.arguments as unknown as QueryLettaAgentRequest;

        const response = await lettaService.sendMessage(args.query, args.context);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case 'get_pipeline_status': {
        const args = request.params.arguments as unknown as GetPipelineStatusRequest;

        if (args.jobId) {
          const job = layerManager.getJob(args.jobId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(job || { error: 'Job not found' }, null, 2),
              },
            ],
          };
        }

        if (args.projectId) {
          const project = orchestrator.getProject(args.projectId);
          const summary = orchestrator.getProjectSummary(args.projectId);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    project: summary,
                    layers: project?.layers.map((l) => ({
                      id: l.id,
                      name: l.name,
                      type: l.type,
                      status: l.status,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        const stats = layerManager.getStats();
        const projects = orchestrator.getAllProjects().map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          layers: p.layers.length,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  stats,
                  projects,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
    }
  } catch (error: any) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool: ${error.message}`
    );
  }
});

// ============================================================================
// RESOURCE HANDLERS
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const projects = orchestrator.getAllProjects();

  return {
    resources: [
      {
        uri: 'pipeline://config',
        name: 'Pipeline Configuration',
        description: 'Default pipeline configuration and settings',
        mimeType: 'application/json',
      },
      {
        uri: 'pipeline://projects',
        name: 'Active Projects',
        description: 'List of all active music automation projects',
        mimeType: 'application/json',
      },
      {
        uri: 'pipeline://stats',
        name: 'Pipeline Statistics',
        description: 'Current pipeline statistics and job status',
        mimeType: 'application/json',
      },
      ...projects.map((project) => ({
        uri: `pipeline://projects/${project.id}`,
        name: `Project: ${project.name}`,
        description: `Details for project ${project.name}`,
        mimeType: 'application/json',
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'pipeline://config') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              defaultOutputFormat: 'wav',
              defaultTempo: 120,
              defaultTimeSignature: '4/4',
              maxConcurrentJobs: 3,
              servicesConfigured: {
                spotify: !!spotifyService,
                elevenLabs: !!elevenLabsService,
                letta: !!lettaService,
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'pipeline://projects') {
    const projects = orchestrator.getAllProjects();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            projects.map((p) => orchestrator.getProjectSummary(p.id)),
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'pipeline://stats') {
    const stats = layerManager.getStats();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }

  if (uri.startsWith('pipeline://projects/')) {
    const projectId = uri.replace('pipeline://projects/', '');
    const project = orchestrator.getProject(projectId);

    if (!project) {
      throw new McpError(ErrorCode.InvalidRequest, `Project ${projectId} not found`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(project, null, 2),
        },
      ],
    };
  }

  throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function main() {
  // Initialize audio processor
  await audioProcessor.initialize();

  // Start cleanup interval for temp files
  setInterval(() => {
    audioProcessor.cleanupTempFiles().catch(console.error);
    layerManager.clearCompletedJobs();
  }, 3600000); // Every hour

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Music Automation MCP Server running on stdio');
  console.error('Configured services:', {
    spotify: !!spotifyService,
    elevenLabs: !!elevenLabsService,
    letta: !!lettaService,
  });
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
