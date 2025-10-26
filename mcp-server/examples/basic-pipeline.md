# Example 1: Basic Pipeline Execution

This example shows how to run a complete audio pipeline with Spotify analysis and custom layers.

## Scenario

Create a remix of a Spotify track with added vocals and effects.

## Steps

### 1. Analyze the Track

First, analyze a Spotify track to extract its musical features:

```typescript
const analysis = await use_mcp_tool("music-automation", "analyze_spotify_track", {
  trackId: "3n3Ppam7vgaVa1iaRUc9Lp"
});

// Output will include:
// - Tempo: 122 BPM
// - Key: C# major
// - Time signature: 4/4
// - Energy: 0.85
// - Danceability: 0.75
```

### 2. Create Project with Pipeline

Use the analyzed data to create a project with custom layers:

```typescript
const project = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Daft Punk Remix",
  spotifyTrackId: "3n3Ppam7vgaVa1iaRUc9Lp",
  config: {
    outputFormat: "wav",
    layers: [
      {
        type: "vocals",
        name: "Robot Vocals",
        parameters: {
          text: "Around the world, around the world",
          stability: 0.7,
          similarityBoost: 0.8
        }
      },
      {
        type: "fx",
        name: "Synth Sweep",
        parameters: {
          text: "Futuristic synth sweep rising sound",
          duration: 8
        }
      },
      {
        type: "ambient",
        name: "Atmospheric Pad",
        parameters: {
          text: "Ethereal ambient pad with reverb",
          duration: 10
        }
      }
    ]
  }
});

// Output:
// {
//   "success": true,
//   "projectId": "project_1730000000_abc123",
//   "status": "completed",
//   "layers": 3,
//   "outputPath": "./output/Daft_Punk_Remix_mixed.wav"
// }
```

### 3. Check Pipeline Status

Monitor the progress of your project:

```typescript
const status = await use_mcp_tool("music-automation", "get_pipeline_status", {
  projectId: project.projectId
});

// Output shows:
// - Project status: completed
// - Number of layers: 3
// - Individual layer statuses
```

## Expected Output

The pipeline will:
1. Analyze the Spotify track for musical parameters
2. Generate three audio layers in parallel
3. Process each layer (if effects are specified)
4. Mix all layers together
5. Output a final WAV file at `./output/Daft_Punk_Remix_mixed.wav`

## Customization

You can customize:

- **Number of layers**: Add as many as needed
- **Layer types**: vocals, fx, ambient, midi
- **Output format**: wav, mp3, or flac
- **Generation parameters**: Adjust stability, duration, voice, etc.

## Time Estimate

- Analysis: ~2 seconds
- Layer generation: ~5-10 seconds per layer (parallel)
- Mixing: ~2 seconds
- **Total: ~15-20 seconds**
