'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { DocumentSwapAnimation } from './document-swap-animation'
import { Check } from 'lucide-react'

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
    <section className="bg-gradient-to-br from-white to-orange-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform any GitHub repo into an{' '}
              <span className="text-orange-600">investor-ready package</span> in 5 minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              AI-powered repository analysis with code quality insights, security scanning, and comprehensive intelligence.
              Make better technical decisions faster.
            </p>

            {/* GitHub URL Input */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
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
                  className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700"
                >
                  {isValidating ? 'Validating...' : 'Analyze Repository'}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Free tier includes 1 analysis. No credit card required.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                <span>5-minute analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                <span>Investor-ready reports</span>
              </div>
            </div>
          </div>

          {/* Document Animation */}
          <div className="flex-1 flex justify-center">
            <DocumentSwapAnimation />
          </div>
        </div>
      </div>
    </section>
  )
}
