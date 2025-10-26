# Market Fit Chatbot

An AI-powered chatbot agent that helps answer questions about startup market fit based on analysis data from the RepoRadar platform.

## Overview

The Market Fit Chatbot is designed to provide personalized insights and answer questions about:
- Market opportunity and fit
- Investment potential and recommendations
- Technical quality and code metrics
- Founder background and credibility
- Competitive landscape
- Key risks and opportunities

## Architecture

The chatbot consists of three main components:

### 1. Chatbot Client (`lib/mcp-clients/chatbot-client.ts`)
- Handles the core chatbot logic
- Processes analysis context and generates responses
- Provides suggested questions based on context
- Can be extended to integrate with LLM APIs (OpenAI, Anthropic, etc.)

### 2. API Endpoint (`app/api/chat/route.ts`)
- **POST /api/chat** - Processes chat messages with analysis context
- **GET /api/chat** - Returns chatbot status and suggested questions

### 3. UI Component (`components/chat/market-fit-chatbot.tsx`)
- React component providing the chat interface
- Real-time messaging with loading states
- Suggested questions for quick interaction
- Scrollable message history
- Responsive design

## Usage

### Basic Integration

```tsx
import { MarketFitChatbot } from "@/components/chat/market-fit-chatbot";

// In your component
<MarketFitChatbot
  analysisContext={{
    technical: technicalData,
    market: marketData,
    founder: founderData,
    report: reportData
  }}
  className="h-[600px]"
/>
```

### With Analysis Results

```tsx
// Example: Integrating with the results page
import { MarketFitChatbot } from "@/components/chat/market-fit-chatbot";

export default function ResultsPage({ analysisId }: { analysisId: string }) {
  const [analysisData, setAnalysisData] = useState(null);

  // Fetch analysis data...

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Analysis Results */}
      <div className="lg:col-span-2">
        <ReportViewer data={analysisData} />
      </div>

      {/* Chatbot */}
      <div className="lg:col-span-1">
        <MarketFitChatbot
          analysisContext={analysisData}
          className="h-[800px] sticky top-4"
        />
      </div>
    </div>
  );
}
```

### Standalone Usage

```tsx
// Can also be used without analysis context
<MarketFitChatbot />
// Will prompt users to run an analysis first
```

## API Reference

### POST /api/chat

Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "What is the market fit for this startup?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message..."
    },
    {
      "role": "assistant",
      "content": "Previous response..."
    }
  ],
  "analysisContext": {
    "technical": { ... },
    "market": { ... },
    "founder": { ... },
    "report": { ... }
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on the analysis, the market size is...",
  "suggestedQuestions": [
    "What are the main risks?",
    "How competitive is this market?"
  ],
  "timestamp": "2025-10-26T..."
}
```

### GET /api/chat

Get chatbot status and suggested questions.

**Query Parameters:**
- `hasContext` (boolean) - Whether analysis context is available

**Response:**
```json
{
  "success": true,
  "status": "ready",
  "message": "Chatbot is ready to assist with market fit analysis",
  "suggestedQuestions": [...]
}
```

## Features

### Context-Aware Responses
The chatbot analyzes the provided analysis context and generates relevant responses based on:
- Technical metrics (code quality, test coverage, contributors)
- Market data (size, competitors, trends, opportunities, risks)
- Founder profile (experience, credibility, expertise)
- Overall scores and investment recommendations

### Suggested Questions
The chatbot provides intelligent suggested questions based on:
- Available analysis data
- Investment grade (suggests different questions for high vs. low scores)
- Identified issues (e.g., low test coverage, high competition)

### Conversation History
Maintains conversation history for context-aware follow-up responses.

### Error Handling
Gracefully handles errors and provides user-friendly error messages.

## Extending the Chatbot

### Integrating with LLM APIs

The current implementation uses keyword-based fallback responses. To integrate with a real LLM API:

1. Update `chatbot-client.ts` in the `generateResponse` method:

```typescript
private async generateResponse(
  userMessage: string,
  contextString: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  // Example: OpenAI integration
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant specialized in startup market fit analysis...

Context: ${contextString}`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user",
        content: userMessage
      }
    ]
  });

  return response.choices[0].message.content;
}
```

2. Add environment variables for API keys:

```bash
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

### Adding New Analysis Types

To support new types of analysis:

1. Update the `AnalysisContext` interface in `chatbot-client.ts`
2. Update the `buildContextString` method to include new data
3. Update the fallback response logic if needed

### Customizing Suggested Questions

Modify the `getSuggestedQuestions` method in `chatbot-client.ts`:

```typescript
getSuggestedQuestions(analysisContext?: AnalysisContext): string[] {
  const suggestions = [];

  // Add your custom logic here
  if (analysisContext?.yourNewData) {
    suggestions.push("Your custom question?");
  }

  return suggestions;
}
```

## Styling

The chatbot uses Tailwind CSS and shadcn/ui components. Customize the appearance by:

1. Modifying the component's className prop
2. Updating the Tailwind classes in `market-fit-chatbot.tsx`
3. Adjusting the theme colors in your Tailwind config

## Performance Considerations

- Messages are stored in React state (client-side only)
- Consider adding persistence (localStorage, database) for longer sessions
- API responses are not cached - add caching if needed for high traffic
- Conversation history is sent with each request - truncate if it gets too long

## Future Enhancements

- [ ] Integrate with OpenAI/Anthropic for advanced responses
- [ ] Add conversation persistence to database
- [ ] Support file uploads and image analysis
- [ ] Add voice input/output capabilities
- [ ] Implement streaming responses for longer answers
- [ ] Add export conversation feature
- [ ] Multi-language support
- [ ] Analytics and feedback collection
