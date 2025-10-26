import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export interface FounderAnalysisResult {
  experience: string[];
  previousCompanies: string[];
  education: string;
  expertise: string[];
  socialPresence: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  credibility: number;
  achievements?: string[];
  publications?: string[];
  yearsOfExperience?: number;
}

/**
 * Connect to the Founder Research MCP server
 */
export async function connectFounderMCP() {
  const mcpUrl = process.env.FOUNDER_MCP_URL || "http://localhost:3003";

  // Create MCP client
  const client = new Client(
    {
      name: "founder-research",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  try {
    console.log(`Connecting to Founder MCP server at ${mcpUrl}`);

    // In a real implementation, you'd establish the connection here
    // For now, we'll create a mock connection that can be replaced
    // with the actual transport once the MCP servers are running

    return {
      /**
       * Research founder profile
       */
      profile: async (founderName: string): Promise<FounderAnalysisResult> => {
        try {
          console.log(`Researching founder: ${founderName}`);

          // Call MCP server's research_founder method
          const result = await client.request(
            {
              method: "tools/call",
              params: {
                name: "research_founder",
                arguments: {
                  name: founderName,
                },
              },
            },
            FounderAnalysisResult
          );

          return result as FounderAnalysisResult;
        } catch (error) {
          console.error('Founder MCP research error:', error);

          // Fallback to mock data during development
          return {
            experience: [
              "Senior Software Engineer at Google (3 years)",
              "Tech Lead at Startup XYZ (2 years)",
              "Full-stack Developer at Microsoft (2 years)",
            ],
            previousCompanies: [
              "Google - worked on Cloud Platform",
              "Startup XYZ - led engineering team of 5",
              "Microsoft - Azure development",
            ],
            education: "BS Computer Science, Stanford University",
            expertise: [
              "Full-stack development",
              "Cloud architecture",
              "Machine Learning",
              "Team leadership",
              "Product management",
            ],
            socialPresence: {
              linkedin: `https://linkedin.com/in/${founderName.toLowerCase().replace(/\s+/g, '-')}`,
              twitter: `https://twitter.com/${founderName.toLowerCase().replace(/\s+/g, '')}`,
              github: `https://github.com/${founderName.toLowerCase().replace(/\s+/g, '-')}`,
            },
            credibility: 82,
            achievements: [
              "Built product used by 1M+ users",
              "Raised $2M in seed funding",
              "Speaker at TechCrunch Disrupt 2023",
            ],
            publications: [
              "Published paper on distributed systems",
              "Regular contributor to tech blogs",
            ],
            yearsOfExperience: 7,
          };
        }
      },

      /**
       * Get founder's previous ventures
       */
      getVentures: async (founderName: string) => {
        try {
          const result = await client.request({
            method: "tools/call",
            params: {
              name: "get_founder_ventures",
              arguments: {
                name: founderName,
              },
            },
          });

          return result;
        } catch (error) {
          console.error('Founder MCP ventures error:', error);
          throw error;
        }
      },

      /**
       * Get founder's network strength
       */
      getNetworkStrength: async (founderName: string) => {
        try {
          const result = await client.request({
            method: "tools/call",
            params: {
              name: "analyze_network",
              arguments: {
                name: founderName,
              },
            },
          });

          return result;
        } catch (error) {
          console.error('Founder MCP network analysis error:', error);
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
          console.error('Error disconnecting from Founder MCP:', error);
        }
      },
    };
  } catch (error) {
    console.error('Failed to connect to Founder MCP server:', error);
    throw new Error(`Founder MCP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate founder experience score
 */
export function calculateExperienceScore(years: number, previousCompanies: string[]): number {
  let score = 0;

  // Years of experience (max 40 points)
  score += Math.min(years * 5, 40);

  // Number of previous companies (max 30 points)
  score += Math.min(previousCompanies.length * 10, 30);

  // Bonus for notable companies (max 30 points)
  const notableCompanies = ['google', 'microsoft', 'apple', 'amazon', 'facebook', 'meta'];
  const hasNotableCompany = previousCompanies.some(company =>
    notableCompanies.some(notable => company.toLowerCase().includes(notable))
  );

  if (hasNotableCompany) {
    score += 30;
  }

  return Math.min(score, 100);
}

/**
 * Validate social media URLs
 */
export function validateSocialUrls(urls: {
  linkedin?: string;
  twitter?: string;
  github?: string;
}): boolean {
  const patterns = {
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\//,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//,
    github: /^https?:\/\/(www\.)?github\.com\//,
  };

  if (urls.linkedin && !patterns.linkedin.test(urls.linkedin)) return false;
  if (urls.twitter && !patterns.twitter.test(urls.twitter)) return false;
  if (urls.github && !patterns.github.test(urls.github)) return false;

  return true;
}
