'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/landing/navigation'
import { AnalysisStatus } from '@/components/dashboard/analysis-status'
import { ReportViewer } from '@/components/results/report-viewer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Analysis {
  id: string
  repoUrl: string
  repoName: string
  status: 'queued' | 'analyzing' | 'generating' | 'complete' | 'failed'
  codeQualityScore?: number
  securityRating?: string
  createdAt: string
  completedAt?: string
  reportUrl?: string
  steps: Array<{
    name: string
    status: 'pending' | 'running' | 'complete' | 'failed'
    progress: number
  }>
}

interface Report {
  reportId: string
  markdown: string
  sections: string[]
}

export default function ResultsPage() {
  const params = useParams()
  const id = params.id as string

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analysis/${id}`)
        if (!response.ok) throw new Error('Failed to fetch analysis')

        const data = await response.json()
        setAnalysis(data)

        // If analysis is complete, fetch the report
        if (data.status === 'complete' && data.reportUrl) {
          const reportResponse = await fetch(data.reportUrl)
          if (reportResponse.ok) {
            const reportData = await reportResponse.json()
            setReport(reportData.report)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()

    // Poll for updates every 5 seconds if analysis is in progress
    const interval = setInterval(() => {
      if (analysis && analysis.status !== 'complete' && analysis.status !== 'failed') {
        fetchAnalysis()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [id, analysis])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading analysis...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested analysis could not be found.'}</p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
            <p className="text-gray-600">Repository: {analysis.repoName}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Analysis Status */}
          <AnalysisStatus
            status={analysis.status}
            steps={analysis.steps}
            repoName={analysis.repoName}
          />

          {/* Report Viewer (only shown when complete) */}
          {analysis.status === 'complete' && report && (
            <ReportViewer
              report={report}
              analysis={{
                repoName: analysis.repoName,
                repoUrl: analysis.repoUrl,
                codeQualityScore: analysis.codeQualityScore,
                securityRating: analysis.securityRating,
                completedAt: analysis.completedAt,
              }}
            />
          )}

          {/* In Progress Message */}
          {analysis.status !== 'complete' && analysis.status !== 'failed' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="animate-pulse mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Analysis in Progress
              </h3>
              <p className="text-blue-700">
                This page will automatically update when the analysis is complete.
                You can safely close this tab and come back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
