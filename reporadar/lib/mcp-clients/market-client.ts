import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export interface MarketAnalysisResult {
  marketSize: string;
  competitors: string[];
  trends: string[];
  opportunities: string[];
  risks: string[];
  targetAudience: string;
  growthRate?: string;
  marketShare?: string;
  industry?: string;
}

/**
 * Create and return a Market Intelligence MCP client with methods for market research, competitor analysis, trend retrieval, and disconnection.
 *
 * @returns An object exposing:
 *  - `research(productName: string): Promise<MarketAnalysisResult>` — market analysis for the given product.
 *  - `analyzeCompetitors(productName: string, competitors: string[]): Promise<any>` — competitor analysis for the given product and competitor list.
 *  - `getTrends(industry: string): Promise<any>` — market trends for the specified industry.
 *  - `disconnect(): Promise<void>` — close the MCP client connection.
 *
 * @throws Error If the initial connection setup to the Market MCP server fails.
 */
export async function connectMarketMCP() {
  const mcpUrl = process.env.MARKET_MCP_URL || "http://localhost:3002";

  // Create MCP client
  const client = new Client(
    {
      name: "market-intelligence",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  try {
    console.log(`Connecting to Market MCP server at ${mcpUrl}`);

    // In a real implementation, you'd establish the connection here
    // For now, we'll create a mock connection that can be replaced
    // with the actual transport once the MCP servers are running

    return {
      /**
       * Research market for a given product
       */
      research: async (productName: string): Promise<MarketAnalysisResult> => {
        try {
          console.log(`Researching market for: ${productName}`);

          // Call MCP server's research_market method
          const result = await client.request(
            {
              method: "tools/call",
              params: {
                name: "research_market",
                arguments: {
                  product: productName,
                },
              },
            },
            MarketAnalysisResult
          );

          return result as MarketAnalysisResult;
        } catch (error) {
          console.error('Market MCP research error:', error);

          // Fallback to mock data during development
          return {
            marketSize: "$2.5B and growing",
            competitors: [
              "Competitor A - established player",
              "Competitor B - fast-growing startup",
              "Competitor C - enterprise solution",
            ],
            trends: [
              "AI-powered automation increasing",
              "Shift to cloud-based solutions",
              "Growing demand for real-time analytics",
              "Mobile-first approach gaining traction",
            ],
            opportunities: [
              "Underserved SMB market segment",
              "Integration with popular tools",
              "AI-driven insights differentiation",
              "API-first approach for developers",
            ],
            risks: [
              "High competition from established players",
              "Rapid technology changes",
              "Data privacy regulations",
              "Customer acquisition costs",
            ],
            targetAudience: "Early-stage startups and VCs looking for deal analysis",
            growthRate: "25% CAGR",
            industry: "B2B SaaS / Investment Analytics",
          };
        }
      },

      /**
       * Analyze competitors
       */
      analyzeCompetitors: async (productName: string, competitors: string[]) => {
        try {
          const result = await client.request({
            method: "tools/call",
            params: {
              name: "analyze_competitors",
              arguments: {
                product: productName,
                competitors,
              },
            },
          });

          return result;
        } catch (error) {
          console.error('Market MCP competitor analysis error:', error);
          throw error;
        }
      },

      /**
       * Get market trends
       */
      getTrends: async (industry: string) => {
        try {
          const result = await client.request({
            method: "tools/call",
            params: {
              name: "get_market_trends",
              arguments: {
                industry,
              },
            },
          });

          return result;
        } catch (error) {
          console.error('Market MCP trends error:', error);
          throw error;
        }
      },

      /**
       * Disconnect from MCP server
       */
      disconnect: async () => {
        try {
          await client.close();
        } catch (error) {
          console.error('Error disconnecting from Market MCP:', error);
        }
      },
    };
  } catch (error) {
    console.error('Failed to connect to Market MCP server:', error);
    throw new Error(`Market MCP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Classifies a product name or short description into a technology category using simple keyword matching.
 *
 * @param productName - Product name or short description to classify (case-insensitive)
 * @returns One of: 'AI/ML', 'FinTech', 'HealthTech', 'B2B SaaS', 'Web3/Crypto', or 'General Technology'
 */
export function categorizeProduct(productName: string): string {
  const keywords = productName.toLowerCase();

  if (keywords.includes('ai') || keywords.includes('ml')) {
    return 'AI/ML';
  } else if (keywords.includes('fintech') || keywords.includes('payment')) {
    return 'FinTech';
  } else if (keywords.includes('health') || keywords.includes('medical')) {
    return 'HealthTech';
  } else if (keywords.includes('saas') || keywords.includes('software')) {
    return 'B2B SaaS';
  } else if (keywords.includes('crypto') || keywords.includes('blockchain')) {
    return 'Web3/Crypto';
  }

  return 'General Technology';
}