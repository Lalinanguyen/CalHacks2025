/**
 * MIDI Pattern Generation Service
 * Creates MIDI patterns based on analysis parameters
 */

import {
  MIDIPattern,
  MIDITrack,
  MIDINote,
  MIDIGenerationParameters,
  SpotifyTrackAnalysis,
} from '../types/index.js';

export class MIDIGeneratorService {
  /**
   * Generate a MIDI pattern based on parameters
   */
  generatePattern(params: MIDIGenerationParameters): MIDIPattern {
    const tempo = params.tempo || 120;
    const numberOfBars = params.numberOfBars || 8;
    const timeSignature = this.parseTimeSignature(params.timeSignature || '4/4');

    const pattern: MIDIPattern = {
      id: this.generateId(),
      name: `Generated ${params.style || 'generic'} pattern`,
      tempo,
      timeSignature,
      key: params.key,
      tracks: [],
      createdAt: new Date(),
    };

    // Generate tracks based on style
    const style = params.style || 'edm';
    const complexity = params.complexity || 'medium';

    pattern.tracks.push(
      this.generateDrumTrack(tempo, numberOfBars, style, complexity),
      this.generateBassTrack(tempo, numberOfBars, style, complexity, params.key),
      this.generateMelodyTrack(tempo, numberOfBars, style, complexity, params.key)
    );

    return pattern;
  }

  /**
   * Generate pattern based on Spotify track analysis
   */
  generateFromAnalysis(
    analysis: SpotifyTrackAnalysis,
    numberOfBars: number = 8
  ): MIDIPattern {
    const tempo = analysis.track.tempo;
    const key = this.getKeyName(analysis.track.key, analysis.track.mode);
    const timeSignature = this.parseTimeSignature(
      `${analysis.track.time_signature}/4`
    );

    const pattern: MIDIPattern = {
      id: this.generateId(),
      name: 'Pattern from Spotify analysis',
      tempo,
      timeSignature,
      key,
      tracks: [],
      createdAt: new Date(),
    };

    // Analyze beat patterns from Spotify data
    const beatPattern = this.extractBeatPattern(analysis, numberOfBars);

    pattern.tracks.push(
      this.generateDrumTrackFromBeats(beatPattern, tempo),
      this.generateBassTrackFromSections(analysis.sections.slice(0, 2), tempo, key),
      this.generateMelodyFromSegments(analysis.segments.slice(0, 32), tempo, key)
    );

    return pattern;
  }

  /**
   * Generate drum track
   */
  private generateDrumTrack(
    tempo: number,
    bars: number,
    style: string,
    complexity: string
  ): MIDITrack {
    const track: MIDITrack = {
      name: 'Drums',
      channel: 9, // MIDI channel 10 (0-indexed as 9)
      instrument: 0, // General MIDI drums
      notes: [],
    };

    const beatsPerBar = 4;
    const totalBeats = bars * beatsPerBar;
    const ticksPerBeat = 480; // Standard MIDI ticks

    // Kick drum (MIDI note 36)
    for (let beat = 0; beat < totalBeats; beat += 1) {
      if (beat % beatsPerBar === 0 || (style === 'edm' && beat % 2 === 0)) {
        track.notes.push({
          pitch: 36,
          velocity: 100,
          startTime: beat * ticksPerBeat,
          duration: ticksPerBeat / 4,
        });
      }
    }

    // Snare (MIDI note 38)
    for (let beat = 0; beat < totalBeats; beat += 1) {
      if (beat % beatsPerBar === 1 || beat % beatsPerBar === 3) {
        track.notes.push({
          pitch: 38,
          velocity: 90,
          startTime: beat * ticksPerBeat,
          duration: ticksPerBeat / 4,
        });
      }
    }

    // Hi-hat (MIDI note 42)
    if (complexity !== 'simple') {
      for (let i = 0; i < totalBeats * 2; i++) {
        track.notes.push({
          pitch: 42,
          velocity: 60 + Math.random() * 20,
          startTime: i * (ticksPerBeat / 2),
          duration: ticksPerBeat / 8,
        });
      }
    }

    return track;
  }

  /**
   * Generate bass track
   */
  private generateBassTrack(
    tempo: number,
    bars: number,
    style: string,
    complexity: string,
    key?: string
  ): MIDITrack {
    const track: MIDITrack = {
      name: 'Bass',
      channel: 1,
      instrument: 33, // Electric Bass (finger)
      notes: [],
    };

    const rootNote = this.getKeyRootNote(key || 'C');
    const scale = this.getMinorPentatonicScale(rootNote);
    const ticksPerBeat = 480;
    const totalBeats = bars * 4;

    for (let beat = 0; beat < totalBeats; beat++) {
      if (beat % 2 === 0) {
        const noteIndex = Math.floor(Math.random() * 3); // Use first 3 notes of scale
        track.notes.push({
          pitch: scale[noteIndex],
          velocity: 80,
          startTime: beat * ticksPerBeat,
          duration: ticksPerBeat,
        });
      }
    }

    return track;
  }

  /**
   * Generate melody track
   */
  private generateMelodyTrack(
    tempo: number,
    bars: number,
    style: string,
    complexity: string,
    key?: string
  ): MIDITrack {
    const track: MIDITrack = {
      name: 'Melody',
      channel: 0,
      instrument: 81, // Lead synth
      notes: [],
    };

    const rootNote = this.getKeyRootNote(key || 'C') + 12; // One octave higher
    const scale = this.getMajorScale(rootNote);
    const ticksPerBeat = 480;
    const totalBeats = bars * 4;

    let currentTime = 0;
    while (currentTime < totalBeats * ticksPerBeat) {
      const noteIndex = Math.floor(Math.random() * scale.length);
      const duration = ticksPerBeat * (Math.random() > 0.5 ? 0.5 : 1);

      track.notes.push({
        pitch: scale[noteIndex],
        velocity: 70 + Math.floor(Math.random() * 20),
        startTime: currentTime,
        duration,
      });

      currentTime += duration;
    }

    return track;
  }

  /**
   * Helper methods
   */
  private generateId(): string {
    return `midi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private parseTimeSignature(sig: string): { numerator: number; denominator: number } {
    const parts = sig.split('/');
    return {
      numerator: parseInt(parts[0]),
      denominator: parseInt(parts[1]),
    };
  }

  private getKeyName(keyNum: number, mode: number): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const modeStr = mode === 1 ? 'major' : 'minor';
    return `${keys[keyNum]} ${modeStr}`;
  }

  private getKeyRootNote(key: string): number {
    const keyMap: Record<string, number> = {
      'C': 36, 'C#': 37, 'D': 38, 'D#': 39, 'E': 40, 'F': 41,
      'F#': 42, 'G': 43, 'G#': 44, 'A': 45, 'A#': 46, 'B': 47,
    };
    const keyName = key.split(' ')[0];
    return keyMap[keyName] || 36;
  }

  private getMajorScale(root: number): number[] {
    return [root, root + 2, root + 4, root + 5, root + 7, root + 9, root + 11, root + 12];
  }

  private getMinorPentatonicScale(root: number): number[] {
    return [root, root + 3, root + 5, root + 7, root + 10, root + 12];
  }

  private extractBeatPattern(analysis: SpotifyTrackAnalysis, bars: number): number[] {
    const beatsPerBar = analysis.track.time_signature;
    const totalBeats = bars * beatsPerBar;
    const pattern: number[] = [];

    for (let i = 0; i < Math.min(totalBeats, analysis.beats.length); i++) {
      pattern.push(analysis.beats[i].confidence);
    }

    return pattern;
  }

  private generateDrumTrackFromBeats(beatPattern: number[], tempo: number): MIDITrack {
    const track: MIDITrack = {
      name: 'Drums (from analysis)',
      channel: 9,
      instrument: 0,
      notes: [],
    };

    const ticksPerBeat = 480;

    beatPattern.forEach((confidence, i) => {
      if (confidence > 0.5) {
        track.notes.push({
          pitch: 36, // Kick
          velocity: Math.floor(confidence * 127),
          startTime: i * ticksPerBeat,
          duration: ticksPerBeat / 4,
        });
      }
    });

    return track;
  }

  private generateBassTrackFromSections(sections: any[], tempo: number, key?: string): MIDITrack {
    const track: MIDITrack = {
      name: 'Bass (from analysis)',
      channel: 1,
      instrument: 33,
      notes: [],
    };

    const rootNote = this.getKeyRootNote(key || 'C');
    const ticksPerBeat = 480;

    sections.forEach((section, i) => {
      const startTime = i * ticksPerBeat * 16; // Assume 16 beats per section
      track.notes.push({
        pitch: rootNote,
        velocity: Math.floor(section.loudness + 60),
        startTime,
        duration: ticksPerBeat * 2,
      });
    });

    return track;
  }

  private generateMelodyFromSegments(segments: any[], tempo: number, key?: string): MIDITrack {
    const track: MIDITrack = {
      name: 'Melody (from analysis)',
      channel: 0,
      instrument: 81,
      notes: [],
    };

    const rootNote = this.getKeyRootNote(key || 'C') + 12;
    const scale = this.getMajorScale(rootNote);
    const ticksPerBeat = 480;

    segments.forEach((segment, i) => {
      const maxPitchIndex = segment.pitches.indexOf(Math.max(...segment.pitches));
      const scaleNote = scale[maxPitchIndex % scale.length];

      track.notes.push({
        pitch: scaleNote,
        velocity: 70,
        startTime: i * ticksPerBeat / 2,
        duration: ticksPerBeat / 2,
      });
    });

    return track;
  }
}
