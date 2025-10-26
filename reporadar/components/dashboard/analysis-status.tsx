'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface AnalysisStep {
  name: string
  status: 'pending' | 'running' | 'complete' | 'failed'
  progress: number
}

interface AnalysisStatusProps {
  status: 'queued' | 'analyzing' | 'generating' | 'complete' | 'failed'
  steps: AnalysisStep[]
  repoName: string
}

export function AnalysisStatus({ status, steps, repoName }: AnalysisStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500'
      case 'running':
        return 'bg-blue-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-500">Complete</Badge>
      case 'analyzing':
        return <Badge className="bg-blue-500">Analyzing</Badge>
      case 'generating':
        return <Badge className="bg-purple-500">Generating</Badge>
      case 'queued':
        return <Badge className="bg-gray-500">Queued</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const completedSteps = steps.filter((s) => s.status === 'complete').length
  const totalProgress = (completedSteps / steps.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analysis Progress</CardTitle>
            <CardDescription>{repoName}</CardDescription>
          </div>
          {getStatusBadge(status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-gray-600">
              {completedSteps} / {steps.length} steps
            </span>
          </div>
          <Progress value={totalProgress} className="h-3" />
        </div>

        {/* Individual Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Step Indicator */}
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(
                  step.status
                )}`}
              >
                {step.status === 'running' && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                )}
              </div>

              {/* Step Name and Progress */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{step.name}</span>
                  <span className="text-xs text-gray-600">
                    {step.status === 'complete'
                      ? '✓'
                      : step.status === 'running'
                      ? `${step.progress}%`
                      : step.status === 'failed'
                      ? '✗'
                      : ''}
                  </span>
                </div>
                {step.status === 'running' && (
                  <Progress value={step.progress} className="h-1" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status Message */}
        {status === 'complete' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✓ Analysis complete! View your comprehensive report below.
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              ✗ Analysis failed. Please try again or contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
