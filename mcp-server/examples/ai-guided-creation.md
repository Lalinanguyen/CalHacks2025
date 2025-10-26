# Example 2: AI-Guided Music Creation

This example demonstrates using the Letta AI agent to guide creative decisions in music production.

## Scenario

Create an original ambient electronic track with AI assistance for layer selection and mixing.

## Steps

### 1. Get Creative Direction from AI

Ask the AI agent for suggestions:

```typescript
const creativeSuggestions = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "I want to create a relaxing ambient electronic track, around 90 BPM. What layers should I include and how should they be arranged?",
  context: {
    genre: "ambient electronic",
    mood: "relaxing",
    targetDuration: 180, // 3 minutes
    tempo: 90
  }
});

// AI might suggest:
// - Ambient pad as foundation
// - Subtle percussion or rhythm
// - Occasional melodic elements
// - Sound design elements (rain, wind, etc.)
```

### 2. Create Base Project

Initialize a project based on AI suggestions:

```typescript
const project = await use_mcp_tool("music-automation", "process_audio_pipeline", {
  projectName: "Ambient Journey",
  config: {
    tempo: 90,
    key: "Am",
    timeSignature: "4/4",
    outputFormat: "wav",
    layers: [] // We'll add layers individually
  }
});

const projectId = project.projectId;
```

### 3. Generate MIDI Pattern

Create a subtle melodic MIDI pattern:

```typescript
const midiPattern = await use_mcp_tool("music-automation", "generate_midi_pattern", {
  projectId: projectId,
  parameters: {
    style: "ambient",
    complexity: "simple",
    tempo: 90,
    key: "Am",
    timeSignature: "4/4",
    numberOfBars: 16
  }
});

// Pattern will include:
// - Gentle bass notes
// - Sparse melodic elements
// - Minimal percussion
```

### 4. Generate Audio Layers

Create atmospheric audio layers:

```typescript
// Layer 1: Ambient Pad
const pad = await use_mcp_tool("music-automation", "generate_audio_layer", {
  projectId: projectId,
  type: "ambient",
  text: "Deep ethereal ambient pad with slow evolution and subtle movement",
  parameters: {
    duration: 30
  }
});

// Layer 2: Nature Sounds
const nature = await use_mcp_tool("music-automation", "generate_audio_layer", {
  projectId: projectId,
  type: "fx",
  text: "Gentle rain and distant thunder, peaceful atmosphere",
  parameters: {
    duration: 30
  }
});

// Layer 3: Melodic Element
const melody = await use_mcp_tool("music-automation", "generate_audio_layer", {
  projectId: projectId,
  type: "fx",
  text: "Soft crystalline bell tones, sparse and meditative",
  parameters: {
    duration: 20
  }
});
```

### 5. Get AI Mixing Suggestions

Ask for mixing advice:

```typescript
const mixingSuggestions = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "I have these layers: ambient pad, rain sounds, and bell tones. How should I mix them for a relaxing ambient track?",
  context: {
    layers: [
      { name: "Ambient Pad", type: "ambient" },
      { name: "Rain Sounds", type: "fx" },
      { name: "Bell Tones", type: "fx" }
    ],
    genre: "ambient"
  }
});

// AI might suggest:
// - Pad: 0dB, center
// - Rain: -6dB, slight stereo width
// - Bells: -9dB, panned slightly left
// - Add reverb to bells
// - Master gain: -3dB for headroom
```

### 6. Apply Custom Mix

Implement the AI's suggestions:

```typescript
const finalMix = await use_mcp_tool("music-automation", "mix_audio_layers", {
  projectId: projectId,
  mixingParameters: {
    masterGain: -3,
    layers: [
      {
        layerId: pad.layerId,
        gain: 0,
        pan: 0,
        mute: false
      },
      {
        layerId: nature.layerId,
        gain: -6,
        pan: 0.1, // Slight right
        mute: false
      },
      {
        layerId: melody.layerId,
        gain: -9,
        pan: -0.2, // Slight left
        mute: false
      }
    ],
    masterEffects: [
      {
        type: "reverb",
        parameters: {
          roomSize: 0.8,
          damping: 0.5,
          wetLevel: 0.3
        }
      }
    ]
  }
});
```

### 7. Iterative Refinement

Get feedback and iterate:

```typescript
const feedback = await use_mcp_tool("music-automation", "query_letta_agent", {
  query: "The mix sounds good but I want it to be even more spacious and dreamy. What should I adjust?",
  context: {
    currentMix: finalMix,
    feedback: "needs more space and dreaminess"
  }
});

// AI might suggest:
// - Increase reverb wet level to 0.5
// - Add slight delay to bells
// - Reduce rain sounds to -8dB
// - Add subtle chorus effect to pad
```

## AI Agent Capabilities

The Letta agent can help with:

1. **Creative Direction**
   - Suggest layer combinations
   - Recommend musical styles and parameters
   - Provide arrangement ideas

2. **Mixing Decisions**
   - Balance recommendations
   - Effect suggestions
   - Panning strategies

3. **Problem Solving**
   - Troubleshoot mix issues
   - Suggest alternatives
   - Provide technical guidance

4. **Workflow Optimization**
   - Recommend next steps
   - Prioritize tasks
   - Offer efficiency tips

## Best Practices

1. **Provide Context**: Include genre, mood, and goals
2. **Be Specific**: Ask clear, focused questions
3. **Iterate**: Use AI feedback to refine iteratively
4. **Combine Expertise**: Blend AI suggestions with your taste
5. **Experiment**: Try AI-suggested variations

## Sample Queries for AI Agent

```typescript
// Arrangement
"How should I structure a 4-minute progressive house track?"

// Sound Design
"What kind of vocal effects would work for a dark techno track?"

// Mixing
"My kick drum is getting lost in the mix. How can I fix this?"

// Creative
"Suggest some unusual sound combinations for experimental electronic music"

// Technical
"What's the best approach to master this track for streaming platforms?"
```

## Expected Workflow

1. Consult AI for direction (1-2 min)
2. Generate layers based on suggestions (5-10 min)
3. Get mixing recommendations (1-2 min)
4. Apply and iterate (5-10 min)
5. Final refinement with AI feedback (5 min)

**Total: ~20-30 minutes for a complete track**

## Tips for Working with AI

- **Start broad, then refine**: Begin with general direction, then get specific
- **Provide examples**: Reference existing tracks or styles
- **Use context**: Include relevant project information
- **Ask "why"**: Understanding AI reasoning helps learning
- **Experiment**: Try suggestions even if they seem unusual
