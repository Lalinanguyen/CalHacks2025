# Example 4: Advanced Usage Patterns

This example demonstrates advanced techniques for working with the Music Automation MCP Server.

## Multi-Stage Production Workflow

### Complete Track Production from Analysis to Master

```typescript
// ============================================================================
// STAGE 1: RESEARCH AND ANALYSIS
// ============================================================================

// Analyze reference tracks for inspiration
const reference1 = await use_mcp_tool("music-automation", "analyze_spotify_track", {
  trackId: "daft-punk-track-id"
});

const reference2 = await use_mcp_tool("music-automation", "analyze_spotify_track", {
  trackId: "deadmau5-track-id"
});

// Get AI guidance based on analysis
const direction = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "Based on these two tracks, suggest a unique direction for a progressive house track that combines elements from both",
  context: {
    reference1: reference1.musicalParameters,
    reference2: reference2.musicalParameters,
    targetStyle: "progressive house"
  }
});

// ============================================================================
// STAGE 2: FOUNDATION BUILDING
// ============================================================================

// Create project
const project = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Progressive House Track",
  config: {
    tempo: 125,
    key: "Am",
    outputFormat: "wav",
    layers: []
  }
});

const projectId = project.projectId;

// Generate base MIDI patterns
const drumPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId,
  parameters: {
    style: "edm",
    complexity: "medium",
    tempo: 125,
    key: "Am",
    numberOfBars: 32
  }
});

const bassPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId,
  parameters: {
    style: "edm",
    complexity: "simple",
    tempo: 125,
    key: "Am",
    numberOfBars: 32
  }
});

// ============================================================================
// STAGE 3: LAYER GENERATION
// ============================================================================

// Generate multiple layers in parallel
const layerPromises = [
  // Vocal elements
  use_mcp_tool("music-automation", "generate_audio_layer", {
    projectId,
    type: "vocals",
    text: "Lost in the rhythm, found in the sound",
    parameters: { stability: 0.6 }
  }),

  // Atmospheric elements
  use_mcp_tool("music-automation", "generate_audio_layer", {
    projectId,
    type: "ambient",
    text: "Deep atmospheric pad with evolving texture",
    parameters: { duration: 30 }
  }),

  // Effects and transitions
  use_mcp_tool("music-automation", "generate_audio_layer", {
    projectId,
    type: "fx",
    text: "Sweeping riser with white noise buildup",
    parameters: { duration: 16 }
  }),

  use_mcp_tool("music-automation", "generate_audio_layer", {
    projectId,
    type: "fx",
    text: "Impact hit with reverb tail",
    parameters: { duration: 4 }
  })
];

const layers = await Promise.all(layerPromises);

// ============================================================================
// STAGE 4: INTELLIGENT MIXING
// ============================================================================

// Get AI mixing recommendations
const mixAdvice = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "I have vocals, atmospheric pad, riser, and impact layers. How should I arrange and mix these for maximum impact in a progressive house drop?",
  context: {
    layers: layers.map(l => ({ name: l.name, type: l.type })),
    style: "progressive house",
    section: "drop"
  }
});

// Apply mixing based on AI suggestions
const firstMix = await use_mcp_tool("music-automation", "mix_audio_layers", {
  projectId,
  mixingParameters: {
    masterGain: -3,
    layers: [
      { layerId: layers[0].layerId, gain: -2, pan: 0 },      // Vocals
      { layerId: layers[1].layerId, gain: -8, pan: 0 },      // Pad
      { layerId: layers[2].layerId, gain: -6, pan: 0.2 },    // Riser
      { layerId: layers[3].layerId, gain: 0, pan: 0 }        // Impact
    ],
    masterEffects: [
      { type: "compression", parameters: { ratio: 4, threshold: -12 } },
      { type: "eq", parameters: { lowShelf: -2, highShelf: 1 } }
    ]
  }
});

// ============================================================================
// STAGE 5: ITERATION AND REFINEMENT
// ============================================================================

// Check status
const status = await use_mcp_tool("music-automation", "get_pipeline_status", {
  projectId
});

// Get feedback for improvements
const feedback = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "The mix sounds good but lacks punch. How can I make it hit harder without losing clarity?",
  context: {
    currentMix: firstMix,
    issue: "lacks punch"
  }
});

// Generate additional layer based on feedback
const punchLayer = await use_mcp_tool("music-automation", "generate_audio_layer", {
  projectId,
  type: "fx",
  text: "Punchy sub bass hit with tight envelope",
  parameters: { duration: 2 }
});

// Final mix with all layers
const finalMix = await use_mcp_tool("music-automation", "mix_audio_layers", {
  projectId,
  mixingParameters: {
    masterGain: -2,
    layers: [
      { layerId: layers[0].layerId, gain: -1, pan: 0 },
      { layerId: layers[1].layerId, gain: -7, pan: 0 },
      { layerId: layers[2].layerId, gain: -5, pan: 0.2 },
      { layerId: layers[3].layerId, gain: 1, pan: 0 },
      { layerId: punchLayer.layerId, gain: 2, pan: 0 }  // Boosted punch
    ],
    masterEffects: [
      { type: "compression", parameters: { ratio: 6, threshold: -10 } },
      { type: "eq", parameters: { lowShelf: 0, highShelf: 2 } },
      { type: "reverb", parameters: { roomSize: 0.3, wetLevel: 0.15 } }
    ]
  }
});
```

## Batch Processing Multiple Projects

Process multiple variations simultaneously:

```typescript
// Define project variations
const variations = [
  { name: "Version A - Bright", key: "C", tempo: 128, style: "uplifting" },
  { name: "Version B - Dark", key: "Am", tempo: 125, style: "dark" },
  { name: "Version C - Minimal", key: "Em", tempo: 122, style: "minimal" }
];

// Create all projects in parallel
const projects = await Promise.all(
  variations.map(v =>
    use_mcp_tool("music-automation", "process_audio_pipeline", {
      projectName: v.name,
      config: {
        tempo: v.tempo,
        key: v.key,
        layers: [
          {
            type: "vocals",
            name: "Main Vocals",
            parameters: { text: "Feel the energy rise" }
          },
          {
            type: "midi",
            name: "Pattern",
            parameters: { style: "edm", complexity: "medium" }
          }
        ]
      }
    })
  )
);

// Monitor all projects
const allStatuses = await Promise.all(
  projects.map(p =>
    use_mcp_tool("music-automation", "get_pipeline_status", {
      projectId: p.projectId
    })
  )
);
```

## Dynamic Layer Generation Based on Analysis

Use Spotify analysis to dynamically generate matching layers:

```typescript
// Analyze source track
const analysis = await use_mcp_tool("music-automation", "analyze_spotify_track", {
  trackId: "source-track-id"
});

// Extract key characteristics
const { tempo, key, energy, danceability } = analysis.musicalParameters;

// Generate layers that match the vibe
const dynamicLayers = [];

// High energy = more layers
if (energy > 0.7) {
  dynamicLayers.push(
    {
      type: "fx",
      name: "High Energy Sweep",
      parameters: { text: "Intense rising energy sweep", duration: 8 }
    },
    {
      type: "vocals",
      name: "Energetic Vocals",
      parameters: { text: "Let's go!", stability: 0.8 }
    }
  );
}

// High danceability = rhythmic elements
if (danceability > 0.7) {
  dynamicLayers.push({
    type: "midi",
    name: "Dance Pattern",
    parameters: { style: "edm", complexity: "complex", tempo }
  });
}

// Create project with dynamic layers
const adaptiveProject = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Adaptive Track",
  spotifyTrackId: "source-track-id",
  config: {
    tempo,
    key,
    layers: dynamicLayers
  }
});
```

## Resource Monitoring and Management

Access pipeline resources for monitoring:

```typescript
// Get pipeline configuration
const config = await read_resource("pipeline://config");

// List all projects
const projects = await read_resource("pipeline://projects");

// Get pipeline statistics
const stats = await read_resource("pipeline://stats");

// Monitor specific project
const projectDetails = await read_resource(`pipeline://projects/${projectId}`);

// Check which services are available
if (config.servicesConfigured.letta) {
  // Use AI features
} else {
  // Fallback to manual decisions
}
```

## Error Handling and Recovery

Robust error handling for production use:

```typescript
async function robustPipelineExecution(config) {
  try {
    const project = await use_mcp_tool("music-automation", "process_audio_pipeline", config);
    return { success: true, project };
  } catch (error) {
    console.error("Pipeline error:", error);

    // Check what went wrong
    if (error.message.includes("Spotify")) {
      // Retry without Spotify analysis
      const fallbackConfig = { ...config };
      delete fallbackConfig.spotifyTrackId;
      return await use_mcp_tool("music-automation", "process_audio_pipeline", fallbackConfig);
    }

    if (error.message.includes("ElevenLabs")) {
      // Skip audio generation layers
      const fallbackConfig = {
        ...config,
        config: {
          ...config.config,
          layers: config.config.layers.filter(l => l.type === "midi")
        }
      };
      return await use_mcp_tool("music-automation", "process_audio_pipeline", fallbackConfig);
    }

    throw error;
  }
}

// Use with retry logic
const result = await robustPipelineExecution({
  projectName: "Resilient Project",
  config: { layers: [...] }
});
```

## Performance Optimization

Optimize for faster processing:

```typescript
// 1. Use parallel generation
const parallelLayers = await Promise.all([
  generateLayer1(),
  generateLayer2(),
  generateLayer3()
]);

// 2. Batch similar operations
const allMidiPatterns = await Promise.all(
  [1, 2, 3, 4].map(i =>
    use_mcp_tool("music-automation", "generate_midi_pattern", {
      projectId,
      parameters: { style: "edm", numberOfBars: 8 * i }
    })
  )
);

// 3. Monitor job queue
const stats = await use_mcp_tool("music-automation", "get_pipeline_status", {});
console.log(`Processing: ${stats.stats.processingJobs}`);
console.log(`Pending: ${stats.stats.pendingJobs}`);

// 4. Cleanup completed jobs periodically
// (Happens automatically every hour)
```

## Integration Patterns

### Pattern 1: Research → Create → Refine

```typescript
// Research
const research = await analyzeMultipleTracks([track1, track2, track3]);
const insights = await getAIInsights(research);

// Create
const project = await createFromInsights(insights);

// Refine
const feedback = await getAIFeedback(project);
const final = await applyRefinements(project, feedback);
```

### Pattern 2: Template-Based Production

```typescript
// Define template
const template = {
  intro: [{ type: "ambient", duration: 16 }],
  buildup: [{ type: "fx", text: "rising tension" }],
  drop: [
    { type: "vocals", text: "..." },
    { type: "midi", style: "edm" }
  ],
  outro: [{ type: "ambient", duration: 16 }]
};

// Apply template
const track = await createFromTemplate(template);
```

### Pattern 3: AI-Assisted Workflow

```typescript
// Loop: Create → AI Review → Refine
let currentMix = await initialMix();
let iteration = 0;

while (iteration < 3) {
  const aiReview = await use_mcp_tool("music-automation", "query_letta_agent", {
    query: "Review this mix and suggest improvements",
    context: { mix: currentMix, iteration }
  });

  currentMix = await applyAISuggestions(currentMix, aiReview);
  iteration++;
}
```

## Best Practices Summary

1. **Use Parallel Processing**: Generate layers concurrently
2. **Monitor Status**: Check pipeline state regularly
3. **Handle Errors Gracefully**: Implement fallback strategies
4. **Leverage AI**: Use Letta for creative decisions
5. **Iterate**: Don't expect perfection on first try
6. **Resource Awareness**: Check service availability
7. **Batch Operations**: Group similar tasks
8. **Document Workflow**: Track successful patterns
9. **Version Control**: Keep track of variations
10. **Cleanup**: Remove old projects and jobs

## Advanced Tips

- **Pre-analyze**: Analyze reference tracks before starting
- **Template Library**: Build reusable configuration templates
- **AI Context**: Provide rich context for better AI suggestions
- **Layer Library**: Reuse successful layer configurations
- **Mix Presets**: Save working mixing parameters
- **Workflow Automation**: Script repetitive tasks
- **Quality Checks**: Implement validation steps
- **Backup Strategy**: Save project states
- **Performance Profiling**: Monitor generation times
- **Feedback Loop**: Learn from AI suggestions
