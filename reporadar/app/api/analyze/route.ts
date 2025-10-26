import { NextRequest, NextResponse } from 'next/server';
import { analyzeStartup, analyzeStartupWithRetry } from '@/agent/coordinator';
import { connectGitHubMCP } from '@/lib/mcp-clients/github-client';
import { connectMarketMCP } from '@/lib/mcp-clients/market-client';
import { connectFounderMCP } from '@/lib/mcp-clients/founder-client';

export const maxDuration = 60; // 60 seconds timeout for analysis

/**
 * Run a coordinated startup analysis based on JSON input and return the analysis result or a structured error.
 *
 * Expects the request body to be JSON with `repoUrl`, `founderName`, `productName`, and an optional `useRetry` (defaults to `true`).
 * - Validates presence of `repoUrl`, `founderName`, and `productName`; responds with 400 if any are missing.
 * - Validates that `repoUrl` contains `github.com`; responds with 400 if not a GitHub repository.
 * - When `useRetry` is true, invokes the coordinator path that performs retry logic; otherwise invokes the direct analysis path.
 *
 * @param req - Incoming Next.js request whose JSON body contains the analysis inputs
 * @returns On success, a JSON object with the analysis results and HTTP status 200. On client errors, a JSON object with `success: false` and an `error` message and HTTP status 400. On internal failures, a JSON object with `success: false`, an `error` message, and a `timestamp` with HTTP status 500.
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
 * Check connectivity to all MCP servers and return per-server results.
 *
 * @returns An object with `github`, `market`, and `founder` fields; each field is either the server's success status object (e.g., `status: 'connected'`, server name, timestamp) or an error object with `status: 'error'` and an `error` reason.
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
 * Verifies connectivity to a single MCP server by invoking the provided connection function.
 *
 * @param name - Identifier for the server being checked
 * @param connectFn - Function that attempts to establish a connection and resolves on success
 * @returns An object with connection `status` ("connected" or "disconnected"), the server `name`, an ISO `timestamp`, and, when disconnected, an `error` message describing the failure
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
 * Persists analysis results to a database (placeholder).
 *
 * Intended to store the analysis record including input metadata, per-section scores, overall score, recommendation, and raw analysis data. Currently this function is a no-op that logs a TODO and does not perform any persistence.
 *
 * @param results - Analysis payload expected to contain `input` (e.g., `repoUrl`, `founderName`, `productName`), `report` (e.g., `sections` with scores, `overallScore`, `recommendation`), and raw `data`
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