import { NextRequest, NextResponse } from 'next/server'
import { FounderResearchService } from '@/lib/services/founder-research.service'

/**
 * API endpoint for founder research analysis
 * POST /api/founder-research
 * Body: { founderInfo: { name: string, linkedin_url?: string, twitter_url?: string, github_url?: string } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { founderInfo } = body

    if (!founderInfo || !founderInfo.name) {
      return NextResponse.json(
        { error: 'Founder information with name is required' },
        { status: 400 }
      )
    }

    // Validate URLs if provided
    if (founderInfo.linkedin_url && !founderInfo.linkedin_url.includes('linkedin.com/in/')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL format' },
        { status: 400 }
      )
    }

    if (founderInfo.twitter_url && !founderInfo.twitter_url.includes('twitter.com/') && !founderInfo.twitter_url.includes('x.com/')) {
      return NextResponse.json(
        { error: 'Invalid Twitter URL format' },
        { status: 400 }
      )
    }

    if (founderInfo.github_url && !founderInfo.github_url.includes('github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    // Initialize founder research service with Bright Data API key
    const founderService = new FounderResearchService()

    // Perform founder analysis
    const analysisResult = await founderService.analyzeFounderProfile(founderInfo)

    return NextResponse.json({
      success: true,
      data: analysisResult,
      analyzedAt: new Date().toISOString(),
      analysisType: 'founder_research'
    })
  } catch (error) {
    console.error('Error in founder research analysis API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze founder profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}