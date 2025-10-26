'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Analysis {
  id: string
  repoName: string
  repoUrl: string
  status: 'queued' | 'analyzing' | 'generating' | 'complete' | 'failed'
  codeQualityScore?: number
  securityRating?: string
  createdAt: string
  completedAt?: string
}

interface AnalysesTableProps {
  analyses: Analysis[]
}

export function AnalysesTable({ analyses }: AnalysesTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-500">Complete</Badge>
      case 'analyzing':
        return <Badge className="bg-orange-500">Analyzing</Badge>
      case 'generating':
        return <Badge className="bg-orange-600">Generating</Badge>
      case 'queued':
        return <Badge className="bg-gray-500">Queued</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Your repository analysis history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by analyzing your first repository above.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
        <CardDescription>Your repository analysis history</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quality Score</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyses.map((analysis) => (
              <TableRow key={analysis.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{analysis.repoName}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {analysis.repoUrl}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(analysis.status)}</TableCell>
                <TableCell>
                  {analysis.codeQualityScore !== undefined ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analysis.codeQualityScore}/100</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            analysis.codeQualityScore >= 80
                              ? 'bg-green-500'
                              : analysis.codeQualityScore >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.codeQualityScore}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {analysis.securityRating ? (
                    <Badge
                      variant="outline"
                      className={
                        analysis.securityRating === 'High'
                          ? 'border-green-500 text-green-700'
                          : analysis.securityRating === 'Medium'
                          ? 'border-yellow-500 text-yellow-700'
                          : 'border-red-500 text-red-700'
                      }
                    >
                      {analysis.securityRating}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(analysis.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {analysis.status === 'complete' ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/results/${analysis.id}`}>View Report</Link>
                    </Button>
                  ) : analysis.status === 'failed' ? (
                    <Button variant="outline" size="sm" disabled>
                      Failed
                    </Button>
                  ) : (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/results/${analysis.id}`}>View Progress</Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
