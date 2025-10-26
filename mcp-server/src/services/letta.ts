/**
 * Letta Agent Integration Service
 * Handles AI-driven decision making and orchestration
 */

import axios from 'axios';
import {
  LettaMessage,
  LettaAgentRequest,
  LettaAgentResponse,
  AgentAction,
  MusicAutomationError,
} from '../types/index.js';

export class LettaService {
  private baseUrl: string;
  private apiKey: string;
  private agentId: string;

  constructor(apiKey: string, agentId: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.agentId = agentId;
    this.baseUrl = baseUrl || 'https://api.letta.ai';
  }

  /**
   * Send a message to the Letta agent
   */
  async sendMessage(
    message: string,
    context?: Record<string, any>
  ): Promise<LettaAgentResponse> {
    try {
      const messages: LettaMessage[] = [
        {
          role: 'user',
          content: message,
        },
      ];

      const request: LettaAgentRequest = {
        messages,
        context,
      };

      const response = await axios.post(
        `${this.baseUrl}/agents/${this.agentId}/messages`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.parseAgentResponse(response.data);
    } catch (error: any) {
      throw new MusicAutomationError(
        'Failed to communicate with Letta agent',
        'LETTA_MESSAGE_ERROR',
        error.response?.data
      );
    }
  }

  /**
   * Query the agent for creative decisions
   */
  async getCreativeDecision(
    scenario: string,
    options: string[],
    context?: Record<string, any>
  ): Promise<{
    choice: string;
    reasoning: string;
    suggestions: string[];
  }> {
    const message = `
Given the following scenario in music production:
${scenario}

Available options:
${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

Please choose the best option and explain your reasoning. Also provide any additional creative suggestions.
    `.trim();

    const response = await this.sendMessage(message, context);

    return {
      choice: this.extractChoice(response.response, options),
      reasoning: response.response,
      suggestions: response.suggestions || [],
    };
  }

  /**
   * Get mixing suggestions from the agent
   */
  async getMixingSuggestions(
    layers: { name: string; type: string }[],
    context?: Record<string, any>
  ): Promise<{
    suggestions: string[];
    parameters: Record<string, any>;
  }> {
    const message = `
I have the following audio layers in my mix:
${layers.map((l, i) => `${i + 1}. ${l.name} (${l.type})`).join('\n')}

Please provide mixing suggestions including gain levels, panning, and effects recommendations.
    `.trim();

    const response = await this.sendMessage(message, context);

    return {
      suggestions: response.suggestions || [],
      parameters: response.parameters || {},
    };
  }

  /**
   * Ask the agent to generate layer creation instructions
   */
  async generateLayerInstructions(
    projectContext: Record<string, any>,
    targetStyle: string
  ): Promise<AgentAction[]> {
    const message = `
Based on the following project context:
${JSON.stringify(projectContext, null, 2)}

Generate instructions for creating audio layers that fit the style: ${targetStyle}

Provide specific parameters for each layer including type, content, and processing.
    `.trim();

    const response = await this.sendMessage(message, projectContext);

    return response.actions || [];
  }

  /**
   * Get pipeline orchestration decisions
   */
  async orchestratePipeline(
    currentStage: string,
    availableData: Record<string, any>
  ): Promise<{
    nextSteps: string[];
    parameters: Record<string, any>;
    priority: 'high' | 'medium' | 'low';
  }> {
    const message = `
Current pipeline stage: ${currentStage}

Available data:
${JSON.stringify(availableData, null, 2)}

What should be the next steps in the pipeline? Provide specific parameters and prioritization.
    `.trim();

    const response = await this.sendMessage(message, availableData);

    return {
      nextSteps: response.suggestions || [],
      parameters: response.parameters || {},
      priority: this.extractPriority(response.response),
    };
  }

  /**
   * Parse agent response into structured format
   */
  private parseAgentResponse(data: any): LettaAgentResponse {
    // Handle different response formats from Letta API
    if (typeof data === 'string') {
      return {
        response: data,
        suggestions: [],
        parameters: {},
        actions: [],
      };
    }

    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      return {
        response: lastMessage.content || lastMessage.text || '',
        suggestions: this.extractSuggestions(lastMessage.content),
        parameters: this.extractParameters(lastMessage.content),
        actions: this.extractActions(lastMessage.content),
      };
    }

    return {
      response: data.response || data.text || '',
      suggestions: data.suggestions || [],
      parameters: data.parameters || {},
      actions: data.actions || [],
    };
  }

  /**
   * Extract choice from response text
   */
  private extractChoice(response: string, options: string[]): string {
    // Simple extraction - look for option numbers or exact matches
    for (let i = 0; i < options.length; i++) {
      if (
        response.includes(`${i + 1}.`) ||
        response.toLowerCase().includes(options[i].toLowerCase())
      ) {
        return options[i];
      }
    }
    return options[0]; // Default to first option
  }

  /**
   * Extract suggestions from response text
   */
  private extractSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)) {
        suggestions.push(line.replace(/^[-*•\d.]\s+/, '').trim());
      }
    }

    return suggestions;
  }

  /**
   * Extract parameters from response (look for JSON or key-value pairs)
   */
  private extractParameters(text: string): Record<string, any> {
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parsing fails, return empty object
    }

    return {};
  }

  /**
   * Extract action items from response
   */
  private extractActions(text: string): AgentAction[] {
    // This is a simple implementation - could be enhanced with better parsing
    const actions: AgentAction[] = [];
    const actionKeywords = ['generate', 'adjust', 'add', 'modify', 'create'];

    const lines = text.split('\n');
    for (const line of lines) {
      for (const keyword of actionKeywords) {
        if (line.toLowerCase().includes(keyword)) {
          actions.push({
            type: this.mapToActionType(keyword),
            target: 'layer',
            parameters: {},
          });
        }
      }
    }

    return actions;
  }

  /**
   * Map keyword to action type
   */
  private mapToActionType(keyword: string): AgentAction['type'] {
    const mapping: Record<string, AgentAction['type']> = {
      'generate': 'generate_layer',
      'adjust': 'adjust_mix',
      'add': 'add_effect',
      'modify': 'modify_tempo',
    };
    return mapping[keyword] || 'generate_layer';
  }

  /**
   * Extract priority from response
   */
  private extractPriority(text: string): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('urgent') || lowerText.includes('high priority')) {
      return 'high';
    }
    if (lowerText.includes('low priority') || lowerText.includes('optional')) {
      return 'low';
    }
    return 'medium';
  }
}
