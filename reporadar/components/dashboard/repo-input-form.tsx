'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function RepoInputForm() {
  const [repoUrl, setRepoUrl] = useState('')
  const [founderName, setFounderName] = useState('')
  const [productName, setProductName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const validateGitHubUrl = (url: string) => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/
    return githubPattern.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!repoUrl) {
      setError('Please enter a GitHub repository URL')
      return
    }

    if (!validateGitHubUrl(repoUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)')
      return
    }

    if (!founderName) {
      setError('Please enter the founder name')
      return
    }

    if (!productName) {
      setError('Please enter the product name')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, founderName, productName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start analysis')
      }

      const data = await response.json()

      // Redirect to the analysis page - use the ID from the response
      // The API returns the full analysis object, so we need to generate or use an ID
      const analysisId = data.report?.reportId || 'latest'
      router.push(`/results/${analysisId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze New Repository</CardTitle>
        <CardDescription>
          Enter a GitHub repository URL to start a comprehensive analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository URL *
            </label>
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isSubmitting}
              className={error && !repoUrl ? 'border-red-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founder Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., John Doe"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              disabled={isSubmitting}
              className={error && !founderName ? 'border-red-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., MyStartup"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={isSubmitting}
              className={error && !productName ? 'border-red-500' : ''}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700">
            {isSubmitting ? 'Starting Analysis...' : 'Start Analysis'}
          </Button>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">What we'll analyze:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Code quality and architecture patterns</li>
              <li>Security vulnerabilities and risks</li>
              <li>Contributor activity and community health</li>
              <li>Dependencies and technical debt</li>
              <li>Repository metrics and trends</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
