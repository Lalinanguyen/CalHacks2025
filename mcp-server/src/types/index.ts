/**
 * Type definitions for Music Automation MCP Server
 */

// ============================================================================
// Pipeline Types
// ============================================================================

export type PipelineStage =
  | 'initialized'
  | 'analyzing'
  | 'generating'
  | 'processing'
  | 'mixing'
  | 'completed'
  | 'failed';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PipelineJob {
  id: string;
  status: JobStatus;
  stage: PipelineStage;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  result?: any;
}

export interface PipelineConfig {
  projectId: string;
  trackId?: string;
  tempo?: number;
  key?: string;
  timeSignature?: string;
  outputFormat: 'wav' | 'mp3' | 'flac';
  layers: LayerConfig[];
}

export interface LayerConfig {
  type: 'vocals' | 'drums' | 'bass' | 'synth' | 'fx' | 'midi' | 'ambient';
  name: string;
  parameters: Record<string, any>;
}

// ============================================================================
// Audio Layer Types
// ============================================================================

export interface AudioLayer {
  id: string;
  projectId: string;
  type: 'vocals' | 'drums' | 'bass' | 'synth' | 'fx' | 'midi' | 'ambient';
  name: string;
  status: JobStatus;
  audioUrl?: string;
  audioData?: Buffer;
  duration?: number;
  sampleRate?: number;
  channels?: number;
  metadata: AudioLayerMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioLayerMetadata {
  gain?: number;
  pan?: number;
  effects?: AudioEffect[];
  startTime?: number;
  endTime?: number;
  [key: string]: any;
}

export interface AudioEffect {
  type: 'reverb' | 'delay' | 'compression' | 'eq' | 'distortion' | 'chorus';
  parameters: Record<string, any>;
}

export interface MixingParameters {
  masterGain: number;
  layers: {
    layerId: string;
    gain: number;
    pan: number;
    mute?: boolean;
    solo?: boolean;
  }[];
  masterEffects?: AudioEffect[];
}

// ============================================================================
// Spotify API Types
// ============================================================================

export interface SpotifyTrackFeatures {
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
  key: number;
  mode: number;
  tempo: number;
  loudness: number;
  energy: number;
  danceability: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
}

export interface SpotifyTrackAnalysis {
  meta: {
    analyzer_version: string;
    platform: string;
    detailed_status: string;
    status_code: number;
    timestamp: number;
    analysis_time: number;
    input_process: string;
  };
  track: {
    duration: number;
    sample_md5: string;
    offset_seconds: number;
    window_seconds: number;
    analysis_sample_rate: number;
    analysis_channels: number;
    end_of_fade_in: number;
    start_of_fade_out: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
  };
  bars: TimeInterval[];
  beats: TimeInterval[];
  sections: Section[];
  segments: Segment[];
  tatums: TimeInterval[];
}

export interface TimeInterval {
  start: number;
  duration: number;
  confidence: number;
}

export interface Section {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}

export interface Segment {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
}

export interface SpotifyAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiresAt: number;
}

// ============================================================================
// ElevenLabs API Types
// ============================================================================

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface ElevenLabsGenerateRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  output_format?: string;
}

export interface ElevenLabsSoundGenerationRequest {
  text: string;
  duration_seconds?: number;
  prompt_influence?: number;
}

// ============================================================================
// MIDI Types
// ============================================================================

export interface MIDIPattern {
  id: string;
  name: string;
  tempo: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  };
  key?: string;
  tracks: MIDITrack[];
  createdAt: Date;
}

export interface MIDITrack {
  name: string;
  channel: number;
  instrument: number;
  notes: MIDINote[];
}

export interface MIDINote {
  pitch: number;
  velocity: number;
  startTime: number; // in ticks or beats
  duration: number;
}

export interface MIDIGenerationParameters {
  style?: 'jazz' | 'rock' | 'edm' | 'classical' | 'hip-hop' | 'ambient';
  complexity?: 'simple' | 'medium' | 'complex';
  tempo?: number;
  key?: string;
  timeSignature?: string;
  numberOfBars?: number;
  basedOnAnalysis?: SpotifyTrackAnalysis;
}

// ============================================================================
// Letta Agent Types
// ============================================================================

export interface LettaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LettaAgentRequest {
  messages: LettaMessage[];
  context?: Record<string, any>;
}

export interface LettaAgentResponse {
  response: string;
  suggestions?: string[];
  parameters?: Record<string, any>;
  actions?: AgentAction[];
}

export interface AgentAction {
  type: 'generate_layer' | 'adjust_mix' | 'add_effect' | 'modify_tempo';
  target: string;
  parameters: Record<string, any>;
}

// ============================================================================
// Project Management Types
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description?: string;
  config: PipelineConfig;
  layers: AudioLayer[];
  status: PipelineStage;
  createdAt: Date;
  updatedAt: Date;
  jobs: PipelineJob[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: PipelineStage;
  layerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MCP Tool Request/Response Types
// ============================================================================

export interface ProcessAudioPipelineRequest {
  projectName: string;
  spotifyTrackId?: string;
  config?: Partial<PipelineConfig>;
}

export interface AnalyzeSpotifyTrackRequest {
  trackId: string;
}

export interface GenerateAudioLayerRequest {
  projectId: string;
  type: 'vocals' | 'fx' | 'ambient';
  text: string;
  voiceId?: string;
  parameters?: Record<string, any>;
}

export interface GenerateMIDIPatternRequest {
  projectId: string;
  parameters: MIDIGenerationParameters;
}

export interface MixAudioLayersRequest {
  projectId: string;
  mixingParameters: MixingParameters;
}

export interface QueryLettaAgentRequest {
  query: string;
  context?: Record<string, any>;
}

export interface GetPipelineStatusRequest {
  projectId?: string;
  jobId?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

export class MusicAutomationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'MusicAutomationError';
  }
}
