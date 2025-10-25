/**
 * Audio Processor
 * Utilities for audio processing and conversion
 */

import { promises as fs } from 'fs';
import path from 'path';
import { MusicAutomationError } from '../types/index.js';

export class AudioProcessor {
  private outputDir: string;
  private tempDir: string;

  constructor(outputDir: string = './output', tempDir: string = './temp') {
    this.outputDir = outputDir;
    this.tempDir = tempDir;
  }

  /**
   * Initialize directories
   */
  async initialize(): Promise<void> {
    await this.ensureDirectory(this.outputDir);
    await this.ensureDirectory(this.tempDir);
  }

  /**
   * Save audio buffer to file
   */
  async saveAudioToFile(
    audioData: Buffer,
    filename: string,
    format: 'wav' | 'mp3' | 'flac' = 'wav'
  ): Promise<string> {
    const filepath = path.join(this.outputDir, `${filename}.${format}`);

    try {
      await fs.writeFile(filepath, audioData);
      return filepath;
    } catch (error: any) {
      throw new MusicAutomationError(
        `Failed to save audio file: ${filepath}`,
        'AUDIO_SAVE_ERROR',
        error
      );
    }
  }

  /**
   * Load audio file to buffer
   */
  async loadAudioFromFile(filepath: string): Promise<Buffer> {
    try {
      return await fs.readFile(filepath);
    } catch (error: any) {
      throw new MusicAutomationError(
        `Failed to load audio file: ${filepath}`,
        'AUDIO_LOAD_ERROR',
        error
      );
    }
  }

  /**
   * Save temporary file
   */
  async saveTempFile(data: Buffer, prefix: string = 'temp'): Promise<string> {
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const filepath = path.join(this.tempDir, filename);

    try {
      await fs.writeFile(filepath, data);
      return filepath;
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to save temporary file',
        'TEMP_FILE_ERROR',
        error
      );
    }
  }

  /**
   * Delete temporary file
   */
  async deleteTempFile(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error: any) {
      // Ignore errors for temp file deletion
      console.warn(`Failed to delete temp file ${filepath}:`, error);
    }
  }

  /**
   * Clean up old temporary files
   */
  async cleanupTempFiles(olderThanMs: number = 3600000): Promise<void> {
    try {
      const files = await fs.readdir(this.tempDir);
      const cutoffTime = Date.now() - olderThanMs;

      for (const file of files) {
        const filepath = path.join(this.tempDir, file);
        const stats = await fs.stat(filepath);

        if (stats.mtimeMs < cutoffTime) {
          await this.deleteTempFile(filepath);
        }
      }
    } catch (error: any) {
      console.warn('Failed to cleanup temp files:', error);
    }
  }

  /**
   * Convert audio format (placeholder)
   */
  async convertFormat(
    audioData: Buffer,
    fromFormat: string,
    toFormat: string
  ): Promise<Buffer> {
    // In production, this would use ffmpeg or similar
    // For now, return the original data
    return audioData;
  }

  /**
   * Resample audio (placeholder)
   */
  async resample(
    audioData: Buffer,
    fromSampleRate: number,
    toSampleRate: number
  ): Promise<Buffer> {
    // In production, implement resampling algorithm
    return audioData;
  }

  /**
   * Get audio duration from buffer (placeholder)
   */
  async getAudioDuration(audioData: Buffer): Promise<number> {
    // This is a very rough estimate for MP3
    // In production, parse the audio file header properly
    const estimatedBitrate = 128000; // 128 kbps
    const durationSeconds = (audioData.length * 8) / estimatedBitrate;
    return durationSeconds;
  }

  /**
   * Get audio metadata (placeholder)
   */
  async getAudioMetadata(audioData: Buffer): Promise<{
    duration: number;
    sampleRate: number;
    channels: number;
    format: string;
  }> {
    // In production, parse audio file headers
    return {
      duration: await this.getAudioDuration(audioData),
      sampleRate: 44100,
      channels: 2,
      format: 'mp3',
    };
  }

  /**
   * Trim audio (placeholder)
   */
  async trimAudio(
    audioData: Buffer,
    startSeconds: number,
    endSeconds: number
  ): Promise<Buffer> {
    // In production, implement audio trimming
    return audioData;
  }

  /**
   * Fade in/out (placeholder)
   */
  async applyFade(
    audioData: Buffer,
    fadeInSeconds: number = 0,
    fadeOutSeconds: number = 0
  ): Promise<Buffer> {
    // In production, implement fade curves
    return audioData;
  }

  /**
   * Concatenate audio files
   */
  async concatenateAudio(audioBuffers: Buffer[]): Promise<Buffer> {
    if (audioBuffers.length === 0) {
      return Buffer.alloc(0);
    }

    if (audioBuffers.length === 1) {
      return audioBuffers[0];
    }

    // Simple concatenation - in production, ensure format compatibility
    return Buffer.concat(audioBuffers);
  }

  /**
   * Create WAV header for raw PCM data
   */
  createWavHeader(
    dataLength: number,
    sampleRate: number = 44100,
    channels: number = 2,
    bitsPerSample: number = 16
  ): Buffer {
    const header = Buffer.alloc(44);

    // RIFF header
    header.write('RIFF', 0);
    header.writeUInt32LE(dataLength + 36, 4);
    header.write('WAVE', 8);

    // fmt chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // fmt chunk size
    header.writeUInt16LE(1, 20); // audio format (1 = PCM)
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(
      sampleRate * channels * (bitsPerSample / 8),
      28
    ); // byte rate
    header.writeUInt16LE(channels * (bitsPerSample / 8), 32); // block align
    header.writeUInt16LE(bitsPerSample, 34);

    // data chunk
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);

    return header;
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error: any) {
      throw new MusicAutomationError(
        `Failed to create directory: ${dirPath}`,
        'DIRECTORY_ERROR',
        error
      );
    }
  }

  /**
   * Get output directory path
   */
  getOutputDir(): string {
    return this.outputDir;
  }

  /**
   * Get temp directory path
   */
  getTempDir(): string {
    return this.tempDir;
  }

  /**
   * List output files
   */
  async listOutputFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.outputDir);
      return files.map((f) => path.join(this.outputDir, f));
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to list output files',
        'LIST_FILES_ERROR',
        error
      );
    }
  }
}
