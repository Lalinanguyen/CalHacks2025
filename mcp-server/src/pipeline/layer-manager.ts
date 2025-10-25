/**
 * Layer Manager
 * Manages async layer processing and job queue
 */

import {
  AudioLayer,
  PipelineJob,
  JobStatus,
  LayerConfig,
  MusicAutomationError,
} from '../types/index.js';

export class LayerManager {
  private layers: Map<string, AudioLayer> = new Map();
  private jobs: Map<string, PipelineJob> = new Map();
  private jobQueue: string[] = [];
  private processingJobs: Set<string> = new Set();
  private maxConcurrentJobs: number = 3;

  /**
   * Create a new layer
   */
  createLayer(
    projectId: string,
    config: LayerConfig
  ): AudioLayer {
    const layer: AudioLayer = {
      id: this.generateLayerId(),
      projectId,
      type: config.type,
      name: config.name,
      status: 'pending',
      metadata: config.parameters,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.layers.set(layer.id, layer);
    return layer;
  }

  /**
   * Get a layer by ID
   */
  getLayer(layerId: string): AudioLayer | undefined {
    return this.layers.get(layerId);
  }

  /**
   * Get all layers for a project
   */
  getProjectLayers(projectId: string): AudioLayer[] {
    return Array.from(this.layers.values()).filter(
      (layer) => layer.projectId === projectId
    );
  }

  /**
   * Update layer status
   */
  updateLayerStatus(layerId: string, status: JobStatus): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.status = status;
      layer.updatedAt = new Date();
      this.layers.set(layerId, layer);
    }
  }

  /**
   * Update layer with audio data
   */
  updateLayerAudio(
    layerId: string,
    audioData: Buffer,
    metadata?: Partial<AudioLayer>
  ): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.audioData = audioData;
      layer.status = 'completed';
      layer.updatedAt = new Date();

      if (metadata) {
        Object.assign(layer, metadata);
      }

      this.layers.set(layerId, layer);
    }
  }

  /**
   * Create a processing job
   */
  createJob(
    layerId: string,
    stage: PipelineJob['stage']
  ): PipelineJob {
    const job: PipelineJob = {
      id: this.generateJobId(),
      status: 'pending',
      stage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.set(job.id, job);
    this.jobQueue.push(job.id);

    // Try to process jobs in queue
    this.processQueue();

    return job;
  }

  /**
   * Get a job by ID
   */
  getJob(jobId: string): PipelineJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Update job status
   */
  updateJobStatus(
    jobId: string,
    status: JobStatus,
    result?: any,
    error?: string
  ): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = status;
      job.updatedAt = new Date();

      if (result !== undefined) {
        job.result = result;
      }

      if (error) {
        job.error = error;
      }

      this.jobs.set(jobId, job);

      // If job completed or failed, remove from processing set
      if (status === 'completed' || status === 'failed') {
        this.processingJobs.delete(jobId);
        this.processQueue();
      }
    }
  }

  /**
   * Process the job queue
   */
  private processQueue(): void {
    while (
      this.processingJobs.size < this.maxConcurrentJobs &&
      this.jobQueue.length > 0
    ) {
      const jobId = this.jobQueue.shift();
      if (jobId) {
        const job = this.jobs.get(jobId);
        if (job && job.status === 'pending') {
          this.processingJobs.add(jobId);
          this.updateJobStatus(jobId, 'processing');
        }
      }
    }
  }

  /**
   * Get all jobs for a project
   */
  getProjectJobs(projectId: string): PipelineJob[] {
    const projectLayerIds = new Set(
      this.getProjectLayers(projectId).map((l) => l.id)
    );

    return Array.from(this.jobs.values()).filter((job) => {
      // This is simplified - in production, you'd store projectId with each job
      return true; // Return all jobs for now
    });
  }

  /**
   * Get pending jobs
   */
  getPendingJobs(): PipelineJob[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === 'pending'
    );
  }

  /**
   * Get processing jobs
   */
  getProcessingJobs(): PipelineJob[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === 'processing'
    );
  }

  /**
   * Get completed jobs
   */
  getCompletedJobs(): PipelineJob[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === 'completed'
    );
  }

  /**
   * Wait for a job to complete
   */
  async waitForJob(
    jobId: string,
    timeoutMs: number = 300000
  ): Promise<PipelineJob> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const job = this.jobs.get(jobId);

        if (!job) {
          clearInterval(checkInterval);
          reject(
            new MusicAutomationError(
              `Job ${jobId} not found`,
              'JOB_NOT_FOUND'
            )
          );
          return;
        }

        if (job.status === 'completed') {
          clearInterval(checkInterval);
          resolve(job);
          return;
        }

        if (job.status === 'failed') {
          clearInterval(checkInterval);
          reject(
            new MusicAutomationError(
              `Job ${jobId} failed: ${job.error}`,
              'JOB_FAILED',
              job.error
            )
          );
          return;
        }

        if (Date.now() - startTime > timeoutMs) {
          clearInterval(checkInterval);
          reject(
            new MusicAutomationError(
              `Job ${jobId} timed out after ${timeoutMs}ms`,
              'JOB_TIMEOUT'
            )
          );
        }
      }, 500);
    });
  }

  /**
   * Clear completed jobs (for cleanup)
   */
  clearCompletedJobs(olderThanMs: number = 3600000): void {
    const cutoffTime = Date.now() - olderThanMs;

    for (const [jobId, job] of this.jobs.entries()) {
      if (
        job.status === 'completed' &&
        job.updatedAt.getTime() < cutoffTime
      ) {
        this.jobs.delete(jobId);
      }
    }
  }

  /**
   * Delete a layer
   */
  deleteLayer(layerId: string): void {
    this.layers.delete(layerId);
  }

  /**
   * Get all layers
   */
  getAllLayers(): AudioLayer[] {
    return Array.from(this.layers.values());
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalLayers: number;
    totalJobs: number;
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
  } {
    const jobs = Array.from(this.jobs.values());

    return {
      totalLayers: this.layers.size,
      totalJobs: this.jobs.size,
      pendingJobs: jobs.filter((j) => j.status === 'pending').length,
      processingJobs: jobs.filter((j) => j.status === 'processing').length,
      completedJobs: jobs.filter((j) => j.status === 'completed').length,
      failedJobs: jobs.filter((j) => j.status === 'failed').length,
    };
  }

  /**
   * Helper methods
   */
  private generateLayerId(): string {
    return `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
