import { NextRequest, NextResponse } from 'next/server'
import { MarketIntelligenceService } from '@/lib/services/market-intelligence.service'
import { RepoRadarAnalysisService } from '@/lib/services/reporadar-analysis.service'

/**
 * API endpoint for market intelligence analysis
 * POST /api/market-analysis
 * Body: { githubUrl: string, token: string, additionalContext?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { githubUrl, token, additionalContext } = body

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      )
    }

    // Validate GitHub URL format
    if (!githubUrl.includes('github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    // First, get the repository analysis
    const reporadarService = new RepoRadarAnalysisService(token)
    const repoAnalysis = await reporadarService.analyzeRepository(githubUrl)

    // Then, perform market intelligence analysis
    const marketService = new MarketIntelligenceService()
    const marketAnalysis = await marketService.analyzeMarketIntelligence(
      repoAnalysis,
      additionalContext
    )

    return NextResponse.json({
      success: true,
      data: {
        repository_analysis: repoAnalysis,
        market_intelligence: marketAnalysis
      },
      analyzedAt: new Date().toISOString(),
      analysisType: 'market_intelligence'
    })
  } catch (error) {
    console.error('Error in market intelligence analysis API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze market intelligence',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
