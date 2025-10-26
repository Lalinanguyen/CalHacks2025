# Music Automation MCP Server

A comprehensive Model Context Protocol (MCP) server for music production automation that orchestrates a complete AI-driven audio pipeline. This server integrates Spotify analysis, ElevenLabs audio generation, MIDI pattern creation, Letta AI agent decision-making, and advanced audio mixing capabilities.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Tools](#tools)
- [Resources](#resources)
- [Examples](#examples)
- [Extending the Server](#extending-the-server)
- [API Reference](#api-reference)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   MCP Client (Claude, etc.)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ MCP Protocol (stdio)
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              Music Automation MCP Server                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Pipeline Orchestrator                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐           │   │
│  │  │ Analysis│→ │Generate │→ │ Process  │→ Mix      │   │
│  │  └─────────┘  └─────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Layer Manager                           │   │
│  │  - Job Queue System                                  │   │
│  │  - Async Processing                                  │   │
│  │  - Status Tracking                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Service Integrations                    │   │
│  │  ┌──────────┐ ┌───────────┐ ┌──────┐ ┌────────┐   │   │
│  │  │ Spotify  │ │ ElevenLabs│ │ MIDI │ │ Letta  │   │   │
│  │  │ Analysis │ │   Audio   │ │ Gen  │ │   AI   │   │   │
│  │  └──────────┘ └───────────┘ └──────┘ └────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Flow

1. **Analysis Stage**: Extract musical features from Spotify tracks
   - Tempo, key, time signature detection
   - Beat and section analysis
   - Energy and danceability metrics

2. **Generation Stage**: Create audio layers and MIDI patterns
   - AI-generated vocals and sound effects (ElevenLabs)
   - MIDI pattern generation based on analysis
   - Parallel layer processing

3. **Processing Stage**: Apply effects and transformations
   - Layer-specific effects (reverb, delay, compression, etc.)
   - Audio format conversion
   - Sample rate alignment

4. **Mixing Stage**: Combine layers with intelligent mixing
   - AI-suggested mixing parameters (Letta)
   - Gain, pan, and effect controls
   - Master effects and normalization

## Features

- **Complete Audio Pipeline**: From analysis to final mix
- **Async Job Processing**: Handle multiple layers concurrently
- **AI-Driven Decisions**: Letta agent for creative guidance
- **Spotify Integration**: Deep track analysis and feature extraction
- **Audio Generation**: ElevenLabs for vocals, FX, and ambient sounds
- **MIDI Creation**: Algorithmic pattern generation
- **Modular Architecture**: Easy to extend with new processors
- **Status Tracking**: Real-time job and project monitoring
- **Resource Management**: MCP resources for pipeline state

## Installation

### Prerequisites

- Node.js 18+ and npm
- API keys for:
  - Spotify (Client ID and Secret)
  - ElevenLabs
  - Letta (optional)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Build the project:
```bash
npm run build
```

5. Run the server:
```bash
npm start
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# ElevenLabs API Configuration (Required for audio generation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Spotify API Configuration (Required for track analysis)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Letta Agent Configuration (Optional - for AI decision making)
LETTA_API_KEY=your_letta_api_key_here
LETTA_AGENT_ID=your_letta_agent_id_here
LETTA_BASE_URL=https://api.letta.ai

# Server Configuration
PORT=3000
NODE_ENV=development

# Output Configuration
OUTPUT_DIR=./output
TEMP_DIR=./temp
```

### Getting API Keys

#### Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret

#### ElevenLabs API

1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Go to Profile Settings → API Keys
3. Generate a new API key

#### Letta API

1. Sign up at [Letta](https://letta.ai)
2. Create an agent
3. Copy API key and Agent ID

## Usage

### Using with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "music-automation": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "ELEVENLABS_API_KEY": "your_key",
        "SPOTIFY_CLIENT_ID": "your_id",
        "SPOTIFY_CLIENT_SECRET": "your_secret"
      }
    }
  }
}
```

### Using with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Tools

### process_audio_pipeline

Orchestrates the complete pipeline from analysis to mixing.

**Parameters:**
- `projectName` (required): Name for the project
- `spotifyTrackId` (optional): Spotify track ID for analysis
- `config` (optional): Pipeline configuration object

**Example:**
```typescript
{
  "projectName": "My EDM Track",
  "spotifyTrackId": "3n3Ppam7vgaVa1iaRUc9Lp",
  "config": {
    "outputFormat": "wav",
    "layers": [
      {
        "type": "vocals",
        "name": "Lead Vocals",
        "parameters": {
          "text": "Let the music take control"
        }
      },
      {
        "type": "midi",
        "name": "Bass Line",
        "parameters": {
          "style": "edm",
          "complexity": "medium"
        }
      }
    ]
  }
}
```

### analyze_spotify_track

Fetches detailed audio analysis from Spotify.

**Parameters:**
- `trackId` (required): Spotify track ID

**Returns:**
- Audio features (tempo, key, energy, etc.)
- Musical parameters
- Sections and beats

### generate_audio_layer

Creates audio using ElevenLabs API.

**Parameters:**
- `projectId` (required): Project to add layer to
- `type` (required): 'vocals', 'fx', or 'ambient'
- `text` (required): Text or description
- `voiceId` (optional): ElevenLabs voice ID
- `parameters` (optional): Additional settings

### generate_midi_pattern

Creates MIDI patterns based on musical parameters.

**Parameters:**
- `projectId` (required): Project ID
- `parameters` (required): Generation parameters
  - `style`: 'jazz', 'rock', 'edm', etc.
  - `complexity`: 'simple', 'medium', 'complex'
  - `tempo`, `key`, `timeSignature`
  - `numberOfBars`

### mix_audio_layers

Combines layers with mixing parameters.

**Parameters:**
- `projectId` (required): Project to mix
- `mixingParameters` (required): Mix settings
  - `masterGain`: Overall volume
  - `layers`: Array of layer settings (gain, pan, mute, solo)

### query_letta_agent

Communicates with Letta AI agent for decisions.

**Parameters:**
- `query` (required): Question or request
- `context` (optional): Additional context

### get_pipeline_status

Returns current pipeline status.

**Parameters:**
- `projectId` (optional): Filter by project
- `jobId` (optional): Get specific job status

## Resources

The server exposes the following MCP resources:

- `pipeline://config` - Default pipeline configuration
- `pipeline://projects` - List of active projects
- `pipeline://stats` - Pipeline statistics
- `pipeline://projects/{id}` - Individual project details

## Examples

### Example 1: Analyze and Remix a Spotify Track

```typescript
// 1. Analyze a track
const analysis = await use_mcp_tool("music-automation", "analyze_spotify_track", {
  trackId: "3n3Ppam7vgaVa1iaRUc9Lp"
});

// 2. Create project with custom layers
const project = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Daft Punk Remix",
  spotifyTrackId: "3n3Ppam7vgaVa1iaRUc9Lp",
  config: {
    layers: [
      {
        type: "vocals",
        name: "Robot Vocals",
        parameters: {
          text: "Around the world, around the world",
          stability: 0.7
        }
      },
      {
        type: "fx",
        name: "Synth Sweep",
        parameters: {
          text: "Futuristic synth sweep sound",
          duration: 8
        }
      }
    ]
  }
});
```

### Example 2: Generate Original Music with AI Guidance

```typescript
// 1. Get creative suggestions from AI
const suggestions = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "I want to create an ambient electronic track. What layers should I include?",
  context: { genre: "ambient", mood: "relaxing" }
});

// 2. Generate MIDI pattern
const midi = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: project.projectId,
  parameters: {
    style: "ambient",
    complexity: "medium",
    tempo: 80,
    key: "Am",
    numberOfBars: 16
  }
});

// 3. Add ambient layers
const layer = await use_mcp_tool("music-automation", "generate_audio_layer", {
  projectId: project.projectId,
  type: "ambient",
  text: "Ethereal pad with gentle waves"
});
```

### Example 3: Custom Mixing with AI Suggestions

```typescript
// 1. Create project with multiple layers
const project = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Layered Track",
  config: {
    layers: [
      { type: "vocals", name: "Lead", parameters: { text: "..." } },
      { type: "ambient", name: "Pad", parameters: { text: "..." } },
      { type: "fx", name: "Riser", parameters: { text: "..." } }
    ]
  }
});

// 2. Get AI mixing suggestions
const mixSuggestions = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "How should I mix these layers?",
  context: { layers: ["Lead vocals", "Ambient pad", "FX riser"] }
});

// 3. Apply custom mix
const mixed = await use_mcp_tool("music-automation", "mix_audio_layers", {
  projectId: project.projectId,
  mixingParameters: {
    masterGain: -3,
    layers: [
      { layerId: "layer1", gain: 0, pan: 0 },
      { layerId: "layer2", gain: -6, pan: -0.3 },
      { layerId: "layer3", gain: -12, pan: 0.3 }
    ]
  }
});
```

### Example 4: Monitor Pipeline Status

```typescript
// Get overall statistics
const stats = await use_mcp_tool("music-automation", "get_pipeline_status", {});

// Get specific project status
const projectStatus = await use_mcp_tool("music-automation", "get_pipeline_status", {
  projectId: "project_123"
});

// Check job progress
const jobStatus = await use_mcp_tool("music-automation", "get_pipeline_status", {
  jobId: "job_456"
});
```

## Extending the Server

### Adding a New Service

1. Create service file in `src/services/`:

```typescript
// src/services/my-service.ts
export class MyService {
  async processAudio(input: Buffer): Promise<Buffer> {
    // Implementation
  }
}
```

2. Add to orchestrator in `src/pipeline/orchestrator.ts`:

```typescript
import { MyService } from '../services/my-service.js';

// In constructor
this.myService = new MyService();
```

3. Create tool in `src/index.ts`:

```typescript
{
  name: 'my_custom_tool',
  description: 'Does something amazing',
  inputSchema: { /* ... */ }
}
```

### Adding Custom Processing Steps

Extend the `AudioProcessor` class:

```typescript
// src/pipeline/audio-processor.ts
export class AudioProcessor {
  async myCustomEffect(audio: Buffer): Promise<Buffer> {
    // Custom processing logic
    return processedAudio;
  }
}
```

### Adding New MIDI Generators

Extend `MIDIGeneratorService`:

```typescript
// src/services/midi-generator.ts
generateCustomPattern(params: CustomParams): MIDIPattern {
  // Custom MIDI generation logic
  return pattern;
}
```

## API Reference

### Type Definitions

See `src/types/index.ts` for complete TypeScript definitions:

- `PipelineConfig` - Pipeline configuration
- `AudioLayer` - Audio layer metadata
- `MIDIPattern` - MIDI pattern structure
- `MixingParameters` - Mixing settings
- `SpotifyTrackFeatures` - Spotify analysis data
- And many more...

### Service Classes

- **SpotifyService**: Spotify API integration
- **ElevenLabsService**: Audio generation
- **MIDIGeneratorService**: MIDI pattern creation
- **LettaService**: AI agent communication
- **AudioMixerService**: Audio mixing and effects
- **PipelineOrchestrator**: Main pipeline coordinator
- **LayerManager**: Job queue and layer management
- **AudioProcessor**: Audio file utilities

## Development

### Running in Development Mode

```bash
npm run dev
```

### Watch Mode

```bash
npm run watch
```

### Testing

```bash
# Add your test command
npm test
```

## Troubleshooting

### Common Issues

**Server not connecting:**
- Verify stdio transport is configured correctly
- Check MCP client configuration
- Review error logs in console

**API errors:**
- Verify API keys are correct in `.env`
- Check API rate limits
- Ensure network connectivity

**Build errors:**
- Run `npm install` to update dependencies
- Clear dist folder and rebuild
- Check TypeScript version compatibility

### Debug Mode

Set `NODE_ENV=development` for verbose logging.

## License

MIT

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Acknowledgments

- Built on [Model Context Protocol SDK](https://github.com/anthropics/mcp)
- Powered by ElevenLabs, Spotify, and Letta APIs
- Inspired by modern music production workflows
