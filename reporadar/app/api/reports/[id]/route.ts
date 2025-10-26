import { NextRequest, NextResponse } from 'next/server'
import { generateReport } from '@/lib/services/sierra.service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // In a real app, fetch from database
    // const analysis = await prisma.analysis.findUnique({ where: { id } })

    // Generate mock report
    const report = await generateReport({
      repoName: 'example/repo',
      repoUrl: 'https://github.com/example/repo',
      qualityScore: 87,
      vulnerabilities: [
        {
          severity: 'medium' as const,
          type: 'SQL Injection',
          description: 'Potential SQL injection vulnerability',
        },
      ],
    })

    return NextResponse.json({
      id,
      report,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
