import { NextRequest, NextResponse } from "next/server";
import { chatbotClient } from "@/lib/mcp-clients/chatbot-client";

// Type definitions
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  conversationHistory?: ChatMessage[];
  analysisContext?: {
    technical?: any;
    market?: any;
    founder?: any;
    report?: any;
  };
}

/**
 * POST /api/chat
 * Handle chatbot interactions with context from analysis data
 */
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message, conversationHistory = [], analysisContext } = body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Ensure chatbot client is connected
    await chatbotClient.connect();

    // Generate response
    const response = await chatbotClient.chat(
      message,
      analysisContext,
      conversationHistory
    );

    // Get suggested follow-up questions
    const suggestedQuestions = chatbotClient.getSuggestedQuestions(analysisContext);

    return NextResponse.json({
      success: true,
      response,
      suggestedQuestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Get chatbot status and suggested questions
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const hasContext = searchParams.get("hasContext") === "true";

    // If context is indicated, provide context-aware suggestions
    const suggestedQuestions = hasContext
      ? chatbotClient.getSuggestedQuestions({})
      : [
          "What can you help me with?",
          "How do you analyze market fit?",
          "What factors do you consider for investment recommendations?",
        ];

    return NextResponse.json({
      success: true,
      status: "ready",
      message: "Chatbot is ready to assist with market fit analysis",
      suggestedQuestions,
    });
  } catch (error) {
    console.error("Error in chat status endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get chatbot status",
      },
      { status: 500 }
    );
  }
}
