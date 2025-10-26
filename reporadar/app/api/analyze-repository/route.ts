import { NextRequest, NextResponse } from 'next/server'
import { RepoRadarAnalysisService } from '@/lib/services/reporadar-analysis.service'

/**
 * API endpoint for detailed repository analysis with static analysis
 * POST /api/analyze-repository
 * Body: { githubUrl: string, token: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { githubUrl, token } = body

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
    if (!githubUrl.includes('github.com/') || !githubUrl.split('/').length >= 5) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      )
    }

    const analysisService = new RepoRadarAnalysisService(token)
    const result = await analysisService.analyzeRepository(githubUrl)

    return NextResponse.json({
      success: true,
      data: result,
      analyzedAt: new Date().toISOString(),
      analysisType: 'repository'
    })
  } catch (error) {
    console.error('Error in repository analysis API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze repository',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
