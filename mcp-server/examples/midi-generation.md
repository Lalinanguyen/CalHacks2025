# Example 3: MIDI Pattern Generation

This example demonstrates creating MIDI patterns for different musical styles.

## Scenario

Generate MIDI patterns that can be used as a foundation for music production or exported to a DAW.

## Basic MIDI Generation

### 1. Generate an EDM Pattern

Create a typical EDM drum and bass pattern:

```typescript
const edmPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: "project_123",
  parameters: {
    style: "edm",
    complexity: "medium",
    tempo: 128,
    key: "Am",
    timeSignature: "4/4",
    numberOfBars: 8
  }
});

// Output includes:
// - Kick drum on every beat (4/4 house kick)
// - Snare on beats 2 and 4
// - Hi-hat 8th or 16th notes
// - Bass line following kick pattern
// - Lead synth melody
```

### 2. Generate a Jazz Pattern

Create a jazz-inspired pattern with swing:

```typescript
const jazzPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: "project_456",
  parameters: {
    style: "jazz",
    complexity: "complex",
    tempo: 140,
    key: "Bb",
    timeSignature: "4/4",
    numberOfBars: 16
  }
});

// Output includes:
// - Swing drum pattern
// - Walking bass line
// - Chord comping
// - Melodic improvisation
```

### 3. Generate an Ambient Pattern

Create a minimal, atmospheric pattern:

```typescript
const ambientPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: "project_789",
  parameters: {
    style: "ambient",
    complexity: "simple",
    tempo: 80,
    key: "Em",
    timeSignature: "4/4",
    numberOfBars: 32
  }
});

// Output includes:
// - Sparse, long sustained notes
// - Minimal percussion
// - Evolving pad chords
// - Occasional melodic phrases
```

## Advanced MIDI Generation

### Using Spotify Analysis

Generate patterns based on analyzed tracks:

```typescript
// 1. Analyze a track
const analysis = await use_mcp_tool("music-automation", "analyze_spotify_track", {
  trackId: "3n3Ppam7vgaVa1iaRUc9Lp"
});

// 2. Create a project with the analysis
const project = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Analyzed MIDI",
  spotifyTrackId: "3n3Ppam7vgaVa1iaRUc9Lp",
  config: {
    layers: [
      {
        type: "midi",
        name: "Generated from Analysis",
        parameters: {
          basedOnAnalysis: true,
          numberOfBars: 16
        }
      }
    ]
  }
});

// The MIDI pattern will match:
// - Tempo from the analyzed track
// - Key and mode
// - Time signature
// - Beat structure from Spotify's beat analysis
```

## Pattern Structures

### EDM Style

**Characteristics:**
- Kick on every quarter note (4/4 time)
- Snare on beats 2 and 4
- Hi-hats at 16th note resolution
- Bass following kick pattern
- Synth lead with arpeggios

**Use Cases:**
- House, Techno, Trance
- Dance-oriented tracks
- Club music

### Jazz Style

**Characteristics:**
- Swing rhythm (triplet feel)
- Complex chord progressions
- Walking bass lines
- Syncopated melodies
- Ride cymbal patterns

**Use Cases:**
- Jazz compositions
- Sophisticated background music
- Improvisational foundations

### Ambient Style

**Characteristics:**
- Long, sustained notes
- Minimal rhythmic elements
- Evolving harmonic textures
- Sparse melodic content
- Focus on atmosphere

**Use Cases:**
- Soundscapes
- Meditation music
- Background atmospheres

### Rock Style

```typescript
const rockPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: "project_rock",
  parameters: {
    style: "rock",
    complexity: "medium",
    tempo: 120,
    key: "E",
    timeSignature: "4/4",
    numberOfBars: 8
  }
});

// Includes:
// - Standard rock drum beat
// - Power chord progressions
// - Bass following root notes
// - Guitar riffs
```

### Hip-Hop Style

```typescript
const hiphopPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: "project_hiphop",
  parameters: {
    style: "hip-hop",
    complexity: "medium",
    tempo: 95,
    key: "Cm",
    timeSignature: "4/4",
    numberOfBars: 16
  }
});

// Includes:
// - Boom-bap drum pattern
// - Syncopated hi-hats
// - Deep bass line
// - Sample-style chord stabs
```

## MIDI Pattern Output

Each generated pattern includes:

```typescript
{
  "id": "midi_1730000000_abc123",
  "name": "Generated edm pattern",
  "tempo": 128,
  "timeSignature": {
    "numerator": 4,
    "denominator": 4
  },
  "key": "Am",
  "tracks": [
    {
      "name": "Drums",
      "channel": 9,
      "instrument": 0,
      "notes": [
        {
          "pitch": 36, // Kick drum
          "velocity": 100,
          "startTime": 0,
          "duration": 120
        },
        // ... more notes
      ]
    },
    {
      "name": "Bass",
      "channel": 1,
      "instrument": 33,
      "notes": [ /* ... */ ]
    },
    {
      "name": "Melody",
      "channel": 0,
      "instrument": 81,
      "notes": [ /* ... */ ]
    }
  ],
  "createdAt": "2024-10-25T16:00:00.000Z"
}
```

## Complexity Levels

### Simple
- Basic rhythms
- Straightforward melodies
- Minimal variation
- Easy to follow
- Good for: Loops, backgrounds, learning

### Medium
- Moderate rhythmic variety
- More melodic movement
- Some variation
- Balanced complexity
- Good for: Full tracks, versatile use

### Complex
- Intricate rhythms
- Advanced harmonies
- High variation
- Sophisticated patterns
- Good for: Detailed compositions, showcases

## Working with Generated MIDI

### In Your DAW

1. **Export**: Save pattern to MIDI file
2. **Import**: Load into your DAW
3. **Assign Instruments**: Map to synths/samplers
4. **Customize**: Edit notes as needed
5. **Layer**: Combine with other elements

### Further Processing

```typescript
// Generate base pattern
const basePattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: "project_id",
  parameters: {
    style: "edm",
    complexity: "simple",
    tempo: 128,
    numberOfBars: 4
  }
});

// Use as foundation for variations
// - Loop the pattern
// - Add fills and breaks
// - Layer with audio
// - Apply effects
```

## Tips for MIDI Generation

1. **Start Simple**: Use simple complexity first, then add
2. **Match Style**: Choose style that fits your genre
3. **Adjust Tempo**: Experiment with different tempos
4. **Layer Patterns**: Combine multiple patterns
5. **Use as Inspiration**: Don't be afraid to edit
6. **Consider Context**: Match to your project's vibe

## Common Use Cases

### 1. Quick Sketching
Generate patterns to quickly sketch ideas without playing instruments.

### 2. Learning Tool
Study generated patterns to understand style characteristics.

### 3. Jam Track Foundation
Create backing tracks for practice or improvisation.

### 4. Production Starting Point
Use as foundation, then customize to your needs.

### 5. Reference Material
Generate examples to understand different styles.

## Combining MIDI with Audio Layers

```typescript
// Create project with both MIDI and audio
const mixedProject = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "MIDI and Audio Mix",
  config: {
    tempo: 120,
    layers: [
      {
        type: "midi",
        name: "Drum Pattern",
        parameters: {
          style: "edm",
          complexity: "medium"
        }
      },
      {
        type: "vocals",
        name: "Vocal Hook",
        parameters: {
          text: "Feel the rhythm, feel the beat"
        }
      },
      {
        type: "fx",
        name: "Riser",
        parameters: {
          text: "Building tension sweep sound"
        }
      }
    ]
  }
});
```

## Next Steps

After generating MIDI:

1. **Convert to Audio**: Render MIDI with virtual instruments
2. **Export Files**: Save MIDI files for DAW import
3. **Add Audio Layers**: Combine with generated audio
4. **Mix and Master**: Process the complete arrangement
5. **Iterate**: Generate variations and A/B test
