'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function Hero() {
  const [repoUrl, setRepoUrl] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!repoUrl) return

    // Basic GitHub URL validation
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/
    if (!githubPattern.test(repoUrl)) {
      alert('Please enter a valid GitHub repository URL')
      return
    }

    setIsValidating(true)

    // Redirect to dashboard with the repo URL
    const encodedUrl = encodeURIComponent(repoUrl)
    router.push(`/dashboard?repo=${encodedUrl}`)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-5xl text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Transform any GitHub repo into an{' '}
          <span className="text-blue-600">investor-ready package</span> in 5 minutes
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          AI-powered repository analysis with code quality insights, security scanning, and comprehensive intelligence.
          Make better technical decisions faster.
        </p>

        {/* GitHub URL Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              className="flex-1 h-14 text-lg"
              disabled={isValidating}
            />
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!repoUrl || isValidating}
              className="h-14 px-8 text-lg"
            >
              {isValidating ? 'Validating...' : 'Analyze Repository'}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Free tier includes 1 analysis. No credit card required.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>5-minute analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Investor-ready reports</span>
          </div>
        </div>
      </div>
    </section>
  )
}
