import { Navigation } from '@/components/landing/navigation'
import { RepoInputForm } from '@/components/dashboard/repo-input-form'
import { AnalysesTable } from '@/components/dashboard/analyses-table'

// Mock data for now - will be replaced with real data from database
const mockAnalyses = [
  {
    id: '1',
    repoName: 'facebook/react',
    repoUrl: 'https://github.com/facebook/react',
    status: 'complete' as const,
    codeQualityScore: 92,
    securityRating: 'High',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    repoName: 'vercel/next.js',
    repoUrl: 'https://github.com/vercel/next.js',
    status: 'analyzing' as const,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    repoName: 'tailwindlabs/tailwindcss',
    repoUrl: 'https://github.com/tailwindlabs/tailwindcss',
    status: 'complete' as const,
    codeQualityScore: 88,
    securityRating: 'Medium',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Analyze GitHub repositories and view your analysis history
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Repository Input Form */}
          <RepoInputForm />

          {/* Recent Analyses Table */}
          <AnalysesTable analyses={mockAnalyses} />
        </div>
      </div>
    </div>
  )
}
