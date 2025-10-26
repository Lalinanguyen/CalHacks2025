import { NextRequest, NextResponse } from 'next/server';
import { analyzeStartup, analyzeStartupWithRetry } from '@/agent/coordinator';
import { connectGitHubMCP } from '@/lib/mcp-clients/github-client';
import { connectMarketMCP } from '@/lib/mcp-clients/market-client';
import { connectFounderMCP } from '@/lib/mcp-clients/founder-client';

export const maxDuration = 60; // 60 seconds timeout for analysis

/**
 * POST /api/analyze
 *
 * Main API endpoint for startup analysis
 * Coordinates MCP servers and generates comprehensive reports
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { repoUrl, founderName, productName, useRetry = true } = body;

    // Validate required fields
    if (!repoUrl || !founderName || !productName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: repoUrl, founderName, and productName are required',
        },
        { status: 400 }
      );
    }

    // Validate repoUrl format
    if (!repoUrl.includes('github.com')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid repository URL. Only GitHub repositories are supported.',
        },
        { status: 400 }
      );
    }

    console.log('Starting analysis for:', { repoUrl, founderName, productName });

    // Run analysis with or without retry based on request
    let results;
    if (useRetry) {
      results = await analyzeStartupWithRetry({
        repoUrl,
        founderName,
        productName,
      });
    } else {
      results = await analyzeStartup(repoUrl, founderName, productName);
    }

    // TODO: Save results to database
    // await saveAnalysisToDatabase(results);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Analysis API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze
 *
 * Health check and status endpoint
 */
export async function GET(req: NextRequest) {
  try {
    // Check MCP server connectivity
    const serverStatus = await checkMCPServers();

    return NextResponse.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      mcpServers: serverStatus,
      version: '1.0.0',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Check connectivity to all MCP servers
 */
async function checkMCPServers() {
  const checks = await Promise.allSettled([
    checkServer('GitHub', connectGitHubMCP),
    checkServer('Market', connectMarketMCP),
    checkServer('Founder', connectFounderMCP),
  ]);

  return {
    github: checks[0].status === 'fulfilled' ? checks[0].value : { status: 'error', error: (checks[0] as PromiseRejectedResult).reason },
    market: checks[1].status === 'fulfilled' ? checks[1].value : { status: 'error', error: (checks[1] as PromiseRejectedResult).reason },
    founder: checks[2].status === 'fulfilled' ? checks[2].value : { status: 'error', error: (checks[2] as PromiseRejectedResult).reason },
  };
}

/**
 * Check individual server connectivity
 */
async function checkServer(name: string, connectFn: () => Promise<any>) {
  try {
    const client = await connectFn();
    return {
      status: 'connected',
      name,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'disconnected',
      name,
      error: error instanceof Error ? error.message : 'Connection failed',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Helper function to save analysis results to database
 * TODO: Implement database integration
 */
async function saveAnalysisToDatabase(results: any) {
  // This would integrate with Prisma to save results
  // Example:
  // await prisma.analysis.create({
  //   data: {
  //     repoUrl: results.input.repoUrl,
  //     founderName: results.input.founderName,
  //     productName: results.input.productName,
  //     technicalScore: results.report.sections.technical.score,
  //     marketScore: results.report.sections.market.score,
  //     founderScore: results.report.sections.founder.score,
  //     overallScore: results.report.overallScore,
  //     recommendation: results.report.recommendation,
  //     rawData: JSON.stringify(results.data),
  //     createdAt: new Date(),
  //   },
  // });

  console.log('TODO: Save analysis to database');
}
