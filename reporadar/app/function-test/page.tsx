'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthorProfileAnalysis, RepositoryAnalysis } from '@/lib/services/reporadar-analysis.service'

export default function FunctionTestPage() {
  const { data: session } = useSession()
  const [githubUrl, setGithubUrl] = useState('https://github.com/zhan4808/GRDB.swift')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authorProfile, setAuthorProfile] = useState<AuthorProfileAnalysis | null>(null)
  const [repositoryAnalysis, setRepositoryAnalysis] = useState<RepositoryAnalysis | null>(null)

  const handleTestAuthorProfile = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL')
      return
    }

    if (!session?.user?.githubToken) {
      setError('GitHub token not available. Please sign in again.')
      return
    }

    setLoading(true)
    setError('')
    setAuthorProfile(null)

    try {
      console.log('Testing analyzeAuthorProfile function...')
      const response = await fetch('/api/analyze-author-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          githubUrl: githubUrl.trim(), 
          token: session.user.githubToken 
        }),
      })

      const data = await response.json()
      console.log('Author Profile Response:', data)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze author profile')
      }

      setAuthorProfile(data.data)
      console.log('Author Profile Analysis Result:', data.data)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
      console.error('Author analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTestRepository = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub repository URL')
      return
    }

    if (!session?.user?.githubToken) {
      setError('GitHub token not available. Please sign in again.')
      return
    }

    setLoading(true)
    setError('')
    setRepositoryAnalysis(null)

    try {
      console.log('Testing analyzeRepository function...')
      const response = await fetch('/api/analyze-repository', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          githubUrl: githubUrl.trim(), 
          token: session.user.githubToken 
        }),
      })

      const data = await response.json()
      console.log('Repository Analysis Response:', data)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze repository')
      }

      setRepositoryAnalysis(data.data)
      console.log('Repository Analysis Result:', data.data)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
      console.error('Repository analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-orange-100 text-orange-800'
      case 'F': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RepoRadar Function Testing</h1>
          <p className="text-gray-600">Test the analyzeAuthorProfile and analyzeRepository functions before MCP conversion</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Function Testing Input</CardTitle>
            <CardDescription>Test both functions with the same GitHub URL to compare outputs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={handleTestAuthorProfile} 
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? 'Testing...' : 'Test analyzeAuthorProfile()'}
                </Button>
                <Button 
                  onClick={handleTestRepository} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Testing...' : 'Test analyzeRepository()'}
                </Button>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Author Profile Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">analyzeAuthorProfile() Results</CardTitle>
              <CardDescription>Complete GitHub profile analysis for due diligence</CardDescription>
            </CardHeader>
            <CardContent>
              {authorProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{authorProfile.author.followers}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{authorProfile.repositories.total}</div>
                      <div className="text-sm text-gray-600">Repositories</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Author Info:</h4>
                    <p className="text-sm"><strong>Name:</strong> {authorProfile.author.name}</p>
                    <p className="text-sm"><strong>Username:</strong> @{authorProfile.author.username}</p>
                    <p className="text-sm"><strong>Bio:</strong> {authorProfile.author.bio || 'No bio'}</p>
                    <p className="text-sm"><strong>Location:</strong> {authorProfile.author.location || 'Not specified'}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {authorProfile.skills.primary_languages.slice(0, 3).map(lang => (
                        <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                    <p className="text-sm"><strong>Expertise:</strong> {authorProfile.skills.expertise_level}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Activity Scores:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{authorProfile.activity.innovation_score}</div>
                        <div className="text-xs text-gray-600">Innovation</div>
                      </div>
                      <div className="text-center p-2 bg-indigo-50 rounded">
                        <div className="text-lg font-bold text-indigo-600">{authorProfile.activity.consistency_score}</div>
                        <div className="text-xs text-gray-600">Consistency</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Risk Assessment:</h4>
                    <Badge className={getRiskColor(authorProfile.risk_assessment.overall_risk)}>
                      {authorProfile.risk_assessment.overall_risk} Risk
                    </Badge>
                    <p className="text-sm"><strong>Confidence:</strong> {authorProfile.summary.confidence_score}%</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Insights:</h4>
                    <ul className="text-sm space-y-1">
                      {authorProfile.summary.key_insights.slice(0, 2).map((insight, index) => (
                        <li key={index} className="text-gray-700">• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Concerns:</h4>
                    <ul className="text-sm space-y-1">
                      {authorProfile.risk_assessment.concerns.slice(0, 2).map((concern, index) => (
                        <li key={index} className="text-red-700">• {concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Click "Test analyzeAuthorProfile()" to see results
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repository Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">analyzeRepository() Results</CardTitle>
              <CardDescription>Detailed repository analysis with static analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {repositoryAnalysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{repositoryAnalysis.repository.stars}</div>
                      <div className="text-sm text-gray-600">Stars</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{repositoryAnalysis.repository.forks}</div>
                      <div className="text-sm text-gray-600">Forks</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Repository Info:</h4>
                    <p className="text-sm"><strong>Name:</strong> {repositoryAnalysis.repository.name}</p>
                    <p className="text-sm"><strong>Description:</strong> {repositoryAnalysis.repository.description || 'No description'}</p>
                    <p className="text-sm"><strong>Language:</strong> {repositoryAnalysis.repository.language}</p>
                    <p className="text-sm"><strong>Size:</strong> {repositoryAnalysis.repository.size.toLocaleString()} KB</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Code Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-bold">{repositoryAnalysis.code_metrics.total_lines.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Lines</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-bold">{repositoryAnalysis.code_metrics.total_files}</div>
                        <div className="text-xs text-gray-600">Files</div>
                      </div>
                    </div>
                    <p className="text-sm"><strong>Complexity:</strong> {repositoryAnalysis.code_metrics.complexity_score}/100</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Static Analysis:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="text-lg font-bold text-red-600">{repositoryAnalysis.static_analysis.bugs}</div>
                        <div className="text-xs text-gray-600">Bugs</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="text-lg font-bold text-orange-600">{repositoryAnalysis.static_analysis.vulnerabilities}</div>
                        <div className="text-xs text-gray-600">Vulns</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{repositoryAnalysis.static_analysis.code_smells}</div>
                        <div className="text-xs text-gray-600">Smells</div>
                      </div>
                    </div>
                    <p className="text-sm"><strong>Coverage:</strong> {repositoryAnalysis.static_analysis.coverage}%</p>
                    <p className="text-sm"><strong>Tech Debt:</strong> {repositoryAnalysis.static_analysis.technical_debt}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Quality Assessment:</h4>
                    <Badge className={getGradeColor(repositoryAnalysis.quality_assessment.overall_grade)}>
                      Grade: {repositoryAnalysis.quality_assessment.overall_grade}
                    </Badge>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm"><strong>Code Quality:</strong> {repositoryAnalysis.quality_assessment.code_quality_score}/100</p>
                      <p className="text-sm"><strong>Security:</strong> {repositoryAnalysis.quality_assessment.security_score}/100</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Architecture:</h4>
                    <p className="text-sm"><strong>Complexity:</strong> {repositoryAnalysis.architecture.complexity}</p>
                    <p className="text-sm"><strong>Scalability:</strong> {repositoryAnalysis.architecture.scalability_score}/100</p>
                    <div className="flex flex-wrap gap-1">
                      {repositoryAnalysis.architecture.patterns.slice(0, 2).map(pattern => (
                        <Badge key={pattern} variant="outline" className="text-xs">{pattern}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Dependencies:</h4>
                    <p className="text-sm"><strong>Direct:</strong> {repositoryAnalysis.dependencies.direct.length}</p>
                    <p className="text-sm"><strong>Vulnerabilities:</strong> {repositoryAnalysis.dependencies.vulnerabilities.length}</p>
                    <p className="text-sm"><strong>Outdated:</strong> {repositoryAnalysis.dependencies.outdated.length}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Priority Level:</h4>
                    <Badge className={getRiskColor(repositoryAnalysis.recommendations.priority_level)}>
                      {repositoryAnalysis.recommendations.priority_level} Priority
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Immediate Actions:</h4>
                    <ul className="text-sm space-y-1">
                      {repositoryAnalysis.recommendations.immediate_actions.slice(0, 2).map((action, index) => (
                        <li key={index} className="text-red-700">• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Click "Test analyzeRepository()" to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Raw JSON Output */}
        {(authorProfile || repositoryAnalysis) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Raw JSON Output (for debugging)</CardTitle>
              <CardDescription>Check console for full JSON responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="author" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="author" disabled={!authorProfile}>Author Profile JSON</TabsTrigger>
                  <TabsTrigger value="repository" disabled={!repositoryAnalysis}>Repository JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="author">
                  {authorProfile && (
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                      {JSON.stringify(authorProfile, null, 2)}
                    </pre>
                  )}
                </TabsContent>
                
                <TabsContent value="repository">
                  {repositoryAnalysis && (
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                      {JSON.stringify(repositoryAnalysis, null, 2)}
                    </pre>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}