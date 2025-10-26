'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ReportData {
  reportId: string
  markdown: string
  sections: string[]
}

interface AnalysisData {
  repoName: string
  repoUrl: string
  codeQualityScore?: number
  securityRating?: string
  completedAt?: string
}

interface ReportViewerProps {
  report: ReportData
  analysis: AnalysisData
}

export function ReportViewer({ report, analysis }: ReportViewerProps) {
  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert('PDF download will be implemented')
  }

  const handleDownloadMarkdown = () => {
    const blob = new Blob([report.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${analysis.repoName.replace('/', '_')}_report.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{analysis.repoName}</CardTitle>
              <CardDescription className="mt-2">
                <a
                  href={analysis.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {analysis.repoUrl}
                </a>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadMarkdown}>
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Markdown
              </Button>
              <Button onClick={handleDownloadPDF}>
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {/* Code Quality Score */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Code Quality Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {analysis.codeQualityScore || 0}/100
              </div>
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analysis.codeQualityScore || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Security Rating */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Security Rating</div>
              <div className="mt-2">
                <Badge
                  className={
                    analysis.securityRating === 'High'
                      ? 'bg-green-500 text-white text-lg py-1 px-3'
                      : analysis.securityRating === 'Medium'
                      ? 'bg-yellow-500 text-white text-lg py-1 px-3'
                      : 'bg-red-500 text-white text-lg py-1 px-3'
                  }
                >
                  {analysis.securityRating || 'Unknown'}
                </Badge>
              </div>
            </div>

            {/* Completion Time */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Analysis Time</div>
              <div className="text-lg font-semibold text-purple-600">
                {analysis.completedAt
                  ? new Date(analysis.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'In Progress'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>
            Comprehensive technical analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{
                __html: report.markdown
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-3xl font-bold mb-4 mt-8">${line.slice(2)}</h1>`
                    } else if (line.startsWith('## ')) {
                      return `<h2 class="text-2xl font-semibold mb-3 mt-6">${line.slice(3)}</h2>`
                    } else if (line.startsWith('### ')) {
                      return `<h3 class="text-xl font-semibold mb-2 mt-4">${line.slice(4)}</h3>`
                    } else if (line.startsWith('- ')) {
                      return `<li class="ml-4">${line.slice(2)}</li>`
                    } else if (line.includes('**')) {
                      return `<p class="mb-2">${line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      )}</p>`
                    } else if (line.trim()) {
                      return `<p class="mb-2">${line}</p>`
                    }
                    return ''
                  })
                  .join(''),
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
