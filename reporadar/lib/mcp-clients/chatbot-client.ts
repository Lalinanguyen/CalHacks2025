import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface AnalysisContext {
  technical?: {
    codeQuality: number;
    commitActivity: string;
    contributors: number;
    languages: string[];
    testCoverage: number;
    issues: { open: number; closed: number };
  };
  market?: {
    marketSize: string;
    competitors: string[];
    trends: string[];
    opportunities: string[];
    risks: string[];
  };
  founder?: {
    experience: string[];
    previousCompanies: string[];
    education: string;
    expertise: string[];
    credibility: number;
  };
  report?: {
    overallScore: number;
    investmentGrade: string;
    recommendation: string;
    keyTakeaways: string[];
    nextSteps: string[];
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class ChatbotClient {
  private client: Client | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      // For now, we'll use a direct implementation without MCP server
      // since the chatbot is more about AI processing than external tool calling
      this.isConnected = true;
      console.log("Chatbot client initialized");
    } catch (error) {
      console.error("Failed to connect chatbot client:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    this.isConnected = false;
  }

  /**
   * Generate a contextual response based on the user's question and analysis data
   */
  async chat(
    userMessage: string,
    analysisContext?: AnalysisContext,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      // Build context string from analysis data
      const contextString = this.buildContextString(analysisContext);

      // Generate response using AI (this would typically call an LLM API)
      const response = await this.generateResponse(
        userMessage,
        contextString,
        conversationHistory
      );

      return response;
    } catch (error) {
      console.error("Error generating chatbot response:", error);
      return "I apologize, but I'm having trouble processing your question right now. Please try again.";
    }
  }

  /**
   * Build a context string from analysis data
   */
  private buildContextString(context?: AnalysisContext): string {
    if (!context) {
      return "No analysis data available. Please run an analysis first.";
    }

    const parts: string[] = [];

    // Technical context
    if (context.technical) {
      parts.push(`Technical Analysis:
- Code Quality: ${context.technical.codeQuality ?? 'N/A'}/100
- Commit Activity: ${context.technical.commitActivity ?? 'N/A'}
- Contributors: ${context.technical.contributors ?? 'N/A'}
- Languages: ${context.technical.languages?.join(", ") ?? 'N/A'}
- Test Coverage: ${context.technical.testCoverage ?? 'N/A'}%
- Issues: ${context.technical.issues?.open ?? 0} open, ${context.technical.issues?.closed ?? 0} closed`);
    }

    // Market context
    if (context.market) {
      parts.push(`Market Analysis:
- Market Size: ${context.market.marketSize ?? 'N/A'}
- Competitors: ${context.market.competitors?.join(", ") ?? 'N/A'}
- Key Trends: ${context.market.trends?.join(", ") ?? 'N/A'}
- Opportunities: ${context.market.opportunities?.join(", ") ?? 'N/A'}
- Risks: ${context.market.risks?.join(", ") ?? 'N/A'}`);
    }

    // Founder context
    if (context.founder) {
      parts.push(`Founder Profile:
- Experience: ${context.founder.experience?.join(", ") ?? 'N/A'}
- Previous Companies: ${context.founder.previousCompanies?.join(", ") ?? 'N/A'}
- Education: ${context.founder.education ?? 'N/A'}
- Expertise: ${context.founder.expertise?.join(", ") ?? 'N/A'}
- Credibility Score: ${context.founder.credibility ?? 'N/A'}/100`);
    }

    // Overall report
    if (context.report) {
      parts.push(`Overall Assessment:
- Investment Grade: ${context.report.investmentGrade ?? 'N/A'}
- Overall Score: ${context.report.overallScore ?? 'N/A'}/100
- Recommendation: ${context.report.recommendation ?? 'N/A'}
- Key Takeaways: ${context.report.keyTakeaways?.join("; ") ?? 'N/A'}
- Next Steps: ${context.report.nextSteps?.join("; ") ?? 'N/A'}`);
    }

    return parts.join("\n\n");
  }

  /**
   * Generate AI response (placeholder for actual LLM integration)
   * In production, this would call OpenAI, Anthropic, or another LLM API
   */
  private async generateResponse(
    userMessage: string,
    contextString: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    // This is a mock implementation
    // In production, you would integrate with an actual LLM API

    const systemPrompt = `You are an AI assistant specialized in startup market fit analysis and investment evaluation.
You have access to comprehensive analysis data about a startup including technical assessment, market analysis, and founder profile.

Your role is to:
1. Answer questions about the startup's market fit and investment potential
2. Provide actionable insights based on the analysis data
3. Explain complex metrics in simple terms
4. Offer strategic recommendations
5. Be honest about both strengths and weaknesses

Context about the startup:
${contextString}

Conversation history:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n")}

User question: ${userMessage}`;

    // For now, return intelligent fallback responses based on keywords
    return this.generateFallbackResponse(userMessage, contextString);
  }

  /**
   * Generate fallback responses based on keyword matching
   * This is used when no LLM API is available
   */
  private generateFallbackResponse(
    userMessage: string,
    contextString: string
  ): string {
    const lowerMessage = userMessage.toLowerCase();

    // Market fit questions
    if (lowerMessage.includes("market fit") || lowerMessage.includes("market size")) {
      if (contextString.includes("Market Size:")) {
        const marketMatch = contextString.match(/Market Size: ([^\n]+)/);
        const opportunitiesMatch = contextString.match(/Opportunities: ([^\n]+)/);
        return `Based on the analysis, the market size is ${marketMatch?.[1] || "not specified"}. ${
          opportunitiesMatch
            ? `Key opportunities identified include: ${opportunitiesMatch[1]}.`
            : ""
        } This indicates ${
          contextString.includes("Large") || contextString.includes("Billion")
            ? "strong market potential"
            : "a focused market opportunity"
        }.`;
      }
    }

    // Investment/score questions
    if (lowerMessage.includes("invest") || lowerMessage.includes("score") || lowerMessage.includes("grade")) {
      const gradeMatch = contextString.match(/Investment Grade: ([^\n]+)/);
      const scoreMatch = contextString.match(/Overall Score: (\d+)\/100/);
      const recommendationMatch = contextString.match(/Recommendation: ([^\n]+)/);

      return `The startup received an investment grade of ${gradeMatch?.[1] || "N/A"} with an overall score of ${
        scoreMatch?.[1] || "N/A"
      }/100. ${recommendationMatch ? recommendationMatch[1] : "Further analysis is recommended."}`;
    }

    // Technical questions
    if (
      lowerMessage.includes("technical") ||
      lowerMessage.includes("code") ||
      lowerMessage.includes("quality")
    ) {
      const qualityMatch = contextString.match(/Code Quality: (\d+)\/100/);
      const coverageMatch = contextString.match(/Test Coverage: (\d+)%/);
      const contributorsMatch = contextString.match(/Contributors: (\d+)/);

      return `The technical analysis shows: Code quality is ${qualityMatch?.[1] || "N/A"}/100, test coverage is ${
        coverageMatch?.[1] || "N/A"
      }%, and there are ${contributorsMatch?.[1] || "N/A"} contributors. ${
        (qualityMatch && parseInt(qualityMatch[1]) >= 70)
          ? "This indicates solid technical foundation."
          : "There's room for improvement in the technical implementation."
      }`;
    }

    // Founder questions
    if (lowerMessage.includes("founder") || lowerMessage.includes("team")) {
      const credibilityMatch = contextString.match(/Credibility Score: (\d+)\/100/);
      const experienceMatch = contextString.match(/Experience: ([^\n]+)/);
      const expertiseMatch = contextString.match(/Expertise: ([^\n]+)/);

      return `The founder analysis shows a credibility score of ${credibilityMatch?.[1] || "N/A"}/100. ${
        experienceMatch ? `They have experience in: ${experienceMatch[1]}.` : ""
      } ${expertiseMatch ? `Their expertise includes: ${expertiseMatch[1]}.` : ""}`;
    }

    // Risk questions
    if (lowerMessage.includes("risk") || lowerMessage.includes("challenge")) {
      const risksMatch = contextString.match(/Risks: ([^\n]+)/);
      return `${
        risksMatch
          ? `The main risks identified are: ${risksMatch[1]}. `
          : ""
      }It's important to carefully evaluate these challenges when making investment decisions.`;
    }

    // Competitor questions
    if (lowerMessage.includes("competitor") || lowerMessage.includes("competition")) {
      const competitorsMatch = contextString.match(/Competitors: ([^\n]+)/);
      return `${
        competitorsMatch
          ? `The main competitors identified are: ${competitorsMatch[1]}. `
          : "No specific competitors were identified in the analysis. "
      }Understanding the competitive landscape is crucial for market positioning.`;
    }

    // Next steps questions
    if (lowerMessage.includes("next step") || lowerMessage.includes("what should") || lowerMessage.includes("recommend")) {
      const nextStepsMatch = contextString.match(/Next Steps: ([^\n]+)/);
      const recommendationMatch = contextString.match(/Recommendation: ([^\n]+)/);

      return `${recommendationMatch ? recommendationMatch[1] + " " : ""}${
        nextStepsMatch
          ? `Recommended next steps include: ${nextStepsMatch[1]}.`
          : "Consider conducting deeper due diligence before making a decision."
      }`;
    }

    // Default response
    return `I can help you understand the market fit analysis for this startup. Based on the available data, I can answer questions about:

- Market opportunity and size
- Technical quality and code metrics
- Founder background and credibility
- Investment recommendations and scores
- Competitive landscape
- Key risks and opportunities

What specific aspect would you like to know more about?`;
  }

  /**
   * Get suggested questions based on analysis context
   */
  getSuggestedQuestions(analysisContext?: AnalysisContext): string[] {
    const suggestions = [
      "What is the market fit for this startup?",
      "Should I invest in this startup?",
      "What are the main risks I should be aware of?",
      "How does the technical quality compare?",
    ];

    if (analysisContext?.report) {
      if (analysisContext.report.overallScore < 60) {
        suggestions.push("What improvements would increase the investment grade?");
      }
      if (analysisContext.report.overallScore >= 80) {
        suggestions.push("What makes this a strong investment opportunity?");
      }
    }

    if (analysisContext?.market?.competitors && analysisContext.market.competitors.length > 0) {
      suggestions.push("How competitive is this market?");
    }

    if (analysisContext?.technical?.testCoverage && analysisContext.technical.testCoverage < 50) {
      suggestions.push("Is the low test coverage a concern?");
    }

    return suggestions;
  }
}

// Export singleton instance
export const chatbotClient = new ChatbotClient();
