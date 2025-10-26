import { NextRequest, NextResponse } from 'next/server'
import { GitHubAnalysisService } from '@/lib/services/github-analysis.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, token } = body

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      )
    }

    const analysisService = new GitHubAnalysisService(token)
    const result = await analysisService.analyzeUser(username)

    return NextResponse.json({
      success: true,
      data: result,
      analyzedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in GitHub analysis API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze GitHub profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
