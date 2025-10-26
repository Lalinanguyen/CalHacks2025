/**
 * Spotify API Integration Service
 * Handles track analysis and audio feature extraction
 */

import axios from 'axios';
import {
  SpotifyTrackFeatures,
  SpotifyTrackAnalysis,
  SpotifyAuthToken,
  MusicAutomationError,
} from '../types/index.js';

export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';
  private authUrl = 'https://accounts.spotify.com/api/token';
  private clientId: string;
  private clientSecret: string;
  private accessToken: SpotifyAuthToken | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Authenticate with Spotify API using client credentials flow
   */
  private async authenticate(): Promise<void> {
    if (this.accessToken && Date.now() < this.accessToken.expiresAt) {
      return; // Token still valid
    }

    try {
      const credentials = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString('base64');

      const response = await axios.post(
        this.authUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = {
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to authenticate with Spotify',
        'SPOTIFY_AUTH_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Get audio features for a track
   */
  async getTrackFeatures(trackId: string): Promise<SpotifyTrackFeatures> {
    await this.authenticate();

    try {
      const response = await axios.get(
        `${this.baseUrl}/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken!.access_token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new MusicAutomationError(
        `Failed to fetch track features for ${trackId}`,
        'SPOTIFY_FEATURES_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Get detailed audio analysis for a track
   */
  async getTrackAnalysis(trackId: string): Promise<SpotifyTrackAnalysis> {
    await this.authenticate();

    try {
      const response = await axios.get(
        `${this.baseUrl}/audio-analysis/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken!.access_token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new MusicAutomationError(
        `Failed to fetch track analysis for ${trackId}`,
        'SPOTIFY_ANALYSIS_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Get both features and analysis in one call
   */
  async getCompleteTrackData(trackId: string): Promise<{
    features: SpotifyTrackFeatures;
    analysis: SpotifyTrackAnalysis;
  }> {
    const [features, analysis] = await Promise.all([
      this.getTrackFeatures(trackId),
      this.getTrackAnalysis(trackId),
    ]);

    return { features, analysis };
  }

  /**
   * Extract key musical parameters from track analysis
   */
  extractMusicalParameters(
    features: SpotifyTrackFeatures,
    analysis: SpotifyTrackAnalysis
  ): {
    tempo: number;
    key: string;
    mode: 'major' | 'minor';
    timeSignature: string;
    energy: number;
    danceability: number;
    sections: number;
  } {
    const keyNames = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const keyName = keyNames[features.key] || 'C';
    const mode = features.mode === 1 ? 'major' : 'minor';

    return {
      tempo: features.tempo,
      key: `${keyName} ${mode}`,
      mode,
      timeSignature: `${features.time_signature}/4`,
      energy: features.energy,
      danceability: features.danceability,
      sections: analysis.sections.length,
    };
  }
}
