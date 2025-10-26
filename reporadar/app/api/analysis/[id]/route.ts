import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // In a real app, fetch from database
    // const analysis = await prisma.analysis.findUnique({ where: { id } })

    // Mock data for now
    const mockAnalysis = {
      id,
      repoUrl: 'https://github.com/example/repo',
      repoName: 'example/repo',
      status: 'complete',
      codeQualityScore: 87,
      securityRating: 'High',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      reportUrl: `/api/reports/${id}`,
      steps: [
        { name: 'Repository Scraping', status: 'complete', progress: 100 },
        { name: 'Code Quality Analysis', status: 'complete', progress: 100 },
        { name: 'Security Scanning', status: 'complete', progress: 100 },
        { name: 'Indexing Data', status: 'complete', progress: 100 },
        { name: 'Generating Report', status: 'complete', progress: 100 },
      ],
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}
