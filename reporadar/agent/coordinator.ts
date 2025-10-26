import { connectGitHubMCP } from '@/lib/mcp-clients/github-client';
import { connectMarketMCP } from '@/lib/mcp-clients/market-client';
import { connectFounderMCP } from '@/lib/mcp-clients/founder-client';
import { generateReport } from '@/lib/report-generator';

export interface AnalysisInput {
  repoUrl: string;
  founderName: string;
  productName: string;
}

export interface TechnicalAnalysis {
  codeQuality: number;
  commitActivity: string;
  contributors: number;
  languages: string[];
  architecture: string;
  testCoverage?: number;
  documentation: string;
  issues: {
    open: number;
    closed: number;
  };
}

export interface MarketAnalysis {
  marketSize: string;
  competitors: string[];
  trends: string[];
  opportunities: string[];
  risks: string[];
  targetAudience: string;
}

export interface FounderAnalysis {
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
}

export interface AnalysisData {
  technical: TechnicalAnalysis;
  market: MarketAnalysis;
  founder: FounderAnalysis;
}

/**
 * Central orchestration agent that coordinates MCP servers
 * for comprehensive startup analysis
 */
export async function analyzeStartup(
  repoUrl: string,
  founderName: string,
  productName: string
): Promise<any> {
  try {
    // Initialize MCP clients
    const [githubClient, marketClient, founderClient] = await Promise.all([
      connectGitHubMCP(),
      connectMarketMCP(),
      connectFounderMCP(),
    ]);

    // Step 1: Parallel MCP server calls for maximum efficiency
    console.log('Starting parallel analysis across MCP servers...');

    const [technical, market, founder] = await Promise.all([
      githubClient.analyze(repoUrl),
      marketClient.research(productName),
      founderClient.profile(founderName),
    ]);

    console.log('Analysis complete from all MCP servers');

    // Step 2: Synthesize into final report
    const analysisData: AnalysisData = {
      technical: technical as TechnicalAnalysis,
      market: market as MarketAnalysis,
      founder: founder as FounderAnalysis,
    };

    const report = generateReport(analysisData);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      input: {
        repoUrl,
        founderName,
        productName,
      },
      data: analysisData,
      report,
    };
  } catch (error) {
    console.error('Error in analyzeStartup:', error);
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyze a startup with retry logic for robustness
 */
export async function analyzeStartupWithRetry(
  input: AnalysisInput,
  maxRetries: number = 3
): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Analysis attempt ${attempt}/${maxRetries}`);
      return await analyzeStartup(
        input.repoUrl,
        input.founderName,
        input.productName
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Analysis failed after ${maxRetries} attempts: ${lastError?.message}`);
}
