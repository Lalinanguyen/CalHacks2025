import { NextRequest, NextResponse } from 'next/server'
import { RepoRadarAnalysisService } from '@/lib/services/reporadar-analysis.service'

/**
 * API endpoint for analyzing a GitHub author's complete profile
 * POST /api/analyze-author-profile
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
    if (!githubUrl.includes('github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    const analysisService = new RepoRadarAnalysisService(token)
    const result = await analysisService.analyzeAuthorProfile(githubUrl)

    return NextResponse.json({
      success: true,
      data: result,
      analyzedAt: new Date().toISOString(),
      analysisType: 'author_profile'
    })
  } catch (error) {
    console.error('Error in author profile analysis API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze author profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
