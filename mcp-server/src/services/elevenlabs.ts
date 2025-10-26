/**
 * ElevenLabs API Integration Service
 * Handles audio generation, TTS, and sound effects
 */

import axios from 'axios';
import {
  ElevenLabsVoice,
  ElevenLabsGenerateRequest,
  ElevenLabsSoundGenerationRequest,
  MusicAutomationError,
} from '../types/index.js';

export class ElevenLabsService {
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data.voices;
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to fetch ElevenLabs voices',
        'ELEVENLABS_VOICES_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Generate speech from text
   */
  async generateSpeech(
    request: ElevenLabsGenerateRequest
  ): Promise<Buffer> {
    const voiceId = request.voice_id || 'EXAVITQu4vr4xnSDxMaL'; // Default voice

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text: request.text,
          model_id: request.model_id || 'eleven_monolingual_v1',
          voice_settings: request.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to generate speech',
        'ELEVENLABS_TTS_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Generate sound effects from text description
   */
  async generateSoundEffect(
    request: ElevenLabsSoundGenerationRequest
  ): Promise<Buffer> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/sound-generation`,
        {
          text: request.text,
          duration_seconds: request.duration_seconds || 5,
          prompt_influence: request.prompt_influence || 0.3,
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to generate sound effect',
        'ELEVENLABS_SFX_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Generate audio layer based on type and parameters
   */
  async generateAudioLayer(
    type: 'vocals' | 'fx' | 'ambient',
    text: string,
    parameters?: Record<string, any>
  ): Promise<Buffer> {
    if (type === 'vocals') {
      return this.generateSpeech({
        text,
        voice_id: parameters?.voiceId,
        voice_settings: {
          stability: parameters?.stability || 0.5,
          similarity_boost: parameters?.similarityBoost || 0.75,
          style: parameters?.style,
          use_speaker_boost: parameters?.useSpeakerBoost,
        },
      });
    } else {
      // For FX and ambient, use sound generation
      return this.generateSoundEffect({
        text,
        duration_seconds: parameters?.duration || 5,
        prompt_influence: parameters?.promptInfluence || 0.3,
      });
    }
  }

  /**
   * Stream audio generation (for longer content)
   */
  async *streamSpeech(
    request: ElevenLabsGenerateRequest
  ): AsyncGenerator<Buffer> {
    const voiceId = request.voice_id || 'EXAVITQu4vr4xnSDxMaL';

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}/stream`,
        {
          text: request.text,
          model_id: request.model_id || 'eleven_monolingual_v1',
          voice_settings: request.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'stream',
        }
      );

      for await (const chunk of response.data) {
        yield Buffer.from(chunk);
      }
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to stream speech',
        'ELEVENLABS_STREAM_ERROR',
        error.response?.data
      );
    }
  }
}
