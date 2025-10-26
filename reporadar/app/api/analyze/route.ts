import { NextRequest, NextResponse } from 'next/server'
import { orchestrateAnalysis } from '@/lib/services/mcp.service'
import { analyzeCodeQuality } from '@/lib/services/coderabbit.service'
import { scrapeRepoContext } from '@/lib/services/brightdata.service'
import { deployDataFetchers } from '@/lib/services/fetchai.service'
import { indexRepository } from '@/lib/services/elastic.service'
import { generateReport } from '@/lib/services/sierra.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repoUrl } = body

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      )
    }

    // Validate GitHub URL
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/
    if (!githubPattern.test(repoUrl)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      )
    }

    // Extract repo name from URL
    const repoName = repoUrl.split('/').slice(-2).join('/')

    // Start the orchestration workflow
    const orchestration = await orchestrateAnalysis(repoUrl)

    // In a real app, this would be done asynchronously in the background
    // For now, we'll simulate the workflow

    // 1. Scrape repository context
    const repoContext = await scrapeRepoContext(repoUrl)

    // 2. Analyze code quality
    const codeQuality = await analyzeCodeQuality(repoUrl)

    // 3. Deploy data fetchers
    const dataFetchers = await deployDataFetchers(repoUrl)

    // 4. Index repository data
    const indexed = await indexRepository({
      name: repoName,
      url: repoUrl,
      context: repoContext,
      quality: codeQuality,
      data: dataFetchers,
    })

    // 5. Generate report
    const report = await generateReport({
      repoName,
      repoUrl,
      qualityScore: codeQuality.qualityScore,
      vulnerabilities: codeQuality.vulnerabilities,
      context: repoContext,
      indexed: indexed,
    })

    // Create a mock analysis ID
    const analysisId = `analysis_${Date.now()}`

    // In a real app, save to database here
    // await prisma.analysis.create({ ... })

    return NextResponse.json({
      analysisId,
      jobId: orchestration.jobId,
      status: 'queued',
      repoName,
      message: 'Analysis started successfully',
    })
  } catch (error) {
    console.error('Error starting analysis:', error)
    return NextResponse.json(
      { error: 'Failed to start analysis' },
      { status: 500 }
    )
  }
}
