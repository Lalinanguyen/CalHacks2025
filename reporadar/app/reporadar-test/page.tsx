'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthorProfileAnalysis, RepositoryAnalysis } from '@/lib/services/reporadar-analysis.service'

export default function RepoRadarTestPage() {
  const { data: session } = useSession()
  const [githubUrl, setGithubUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authorProfile, setAuthorProfile] = useState<AuthorProfileAnalysis | null>(null)
  const [repositoryAnalysis, setRepositoryAnalysis] = useState<RepositoryAnalysis | null>(null)

  const handleAnalyzeAuthor = async () => {
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

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze author profile')
      }

      setAuthorProfile(data.data)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
      console.error('Author analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeRepository = async () => {
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

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze repository')
      }

      setRepositoryAnalysis(data.data)
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RepoRadar Analysis</h1>
          <p className="text-gray-600">Comprehensive GitHub profile and repository analysis for due diligence</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Analysis Input</CardTitle>
            <CardDescription>Enter a GitHub URL to analyze the author's profile or specific repository</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAnalyzeAuthor} 
                disabled={loading}
                variant="outline"
              >
                Analyze Author Profile
              </Button>
              <Button 
                onClick={handleAnalyzeRepository} 
                disabled={loading}
              >
                Analyze Repository
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {(authorProfile || repositoryAnalysis) && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="author" disabled={!authorProfile}>Author Profile</TabsTrigger>
              <TabsTrigger value="repository" disabled={!repositoryAnalysis}>Repository</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {authorProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Author Profile Analysis</CardTitle>
                    <CardDescription>Complete GitHub profile analysis for due diligence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{authorProfile.author.followers}</div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{authorProfile.repositories.total}</div>
                        <div className="text-sm text-gray-600">Repositories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{authorProfile.activity.innovation_score}</div>
                        <div className="text-sm text-gray-600">Innovation Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{authorProfile.activity.consistency_score}</div>
                        <div className="text-sm text-gray-600">Consistency Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Risk Assessment</h4>
                        <Badge className={getRiskColor(authorProfile.risk_assessment.overall_risk)}>
                          {authorProfile.risk_assessment.overall_risk} Risk
                        </Badge>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Confidence: {authorProfile.summary.confidence_score}%</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expertise Level</h4>
                        <Badge variant="secondary">{authorProfile.skills.expertise_level}</Badge>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Primary: {authorProfile.skills.primary_languages.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {repositoryAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Repository Analysis</CardTitle>
                    <CardDescription>Detailed repository analysis with static analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{repositoryAnalysis.repository.stars}</div>
                        <div className="text-sm text-gray-600">Stars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{repositoryAnalysis.repository.forks}</div>
                        <div className="text-sm text-gray-600">Forks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{repositoryAnalysis.static_analysis.bugs}</div>
                        <div className="text-sm text-gray-600">Bugs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{repositoryAnalysis.static_analysis.vulnerabilities}</div>
                        <div className="text-sm text-gray-600">Vulnerabilities</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Quality Assessment</h4>
                        <Badge className={getGradeColor(repositoryAnalysis.quality_assessment.overall_grade)}>
                          Grade: {repositoryAnalysis.quality_assessment.overall_grade}
                        </Badge>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Code Quality: {repositoryAnalysis.quality_assessment.code_quality_score}/100</p>
                          <p className="text-sm text-gray-600">Security: {repositoryAnalysis.quality_assessment.security_score}/100</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Architecture</h4>
                        <Badge variant="outline">{repositoryAnalysis.architecture.complexity}</Badge>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Scalability: {repositoryAnalysis.architecture.scalability_score}/100</p>
                          <p className="text-sm text-gray-600">Patterns: {repositoryAnalysis.architecture.patterns.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="author" className="space-y-4">
              {authorProfile && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Author Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>Name:</strong> {authorProfile.author.name}</p>
                          <p><strong>Username:</strong> @{authorProfile.author.username}</p>
                          <p><strong>Bio:</strong> {authorProfile.author.bio || 'No bio available'}</p>
                          <p><strong>Location:</strong> {authorProfile.author.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <p><strong>Company:</strong> {authorProfile.author.company || 'Not specified'}</p>
                          <p><strong>Blog:</strong> {authorProfile.author.blog || 'Not specified'}</p>
                          <p><strong>Joined:</strong> {new Date(authorProfile.author.created_at).toLocaleDateString()}</p>
                          <p><strong>Public Repos:</strong> {authorProfile.author.public_repos}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Primary Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {authorProfile.skills.primary_languages.map(lang => (
                              <Badge key={lang} variant="secondary">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Frameworks</h4>
                          <div className="flex flex-wrap gap-2">
                            {authorProfile.skills.frameworks.map(framework => (
                              <Badge key={framework} variant="outline">{framework}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Tools</h4>
                          <div className="flex flex-wrap gap-2">
                            {authorProfile.skills.tools.map(tool => (
                              <Badge key={tool} variant="outline">{tool}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">Concerns</h4>
                          <ul className="text-sm space-y-1">
                            {authorProfile.risk_assessment.concerns.map((concern, index) => (
                              <li key={index} className="text-red-700">• {concern}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            {authorProfile.risk_assessment.strengths.map((strength, index) => (
                              <li key={index} className="text-green-700">• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recommendations</h4>
                        <ul className="text-sm space-y-1">
                          {authorProfile.summary.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="repository" className="space-y-4">
              {repositoryAnalysis && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Repository Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {repositoryAnalysis.repository.name}</p>
                        <p><strong>Description:</strong> {repositoryAnalysis.repository.description}</p>
                        <p><strong>Language:</strong> {repositoryAnalysis.repository.language}</p>
                        <p><strong>Size:</strong> {repositoryAnalysis.repository.size.toLocaleString()} KB</p>
                        <p><strong>Created:</strong> {new Date(repositoryAnalysis.repository.created_at).toLocaleDateString()}</p>
                        <p><strong>Updated:</strong> {new Date(repositoryAnalysis.repository.updated_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Code Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold">{repositoryAnalysis.code_metrics.total_lines.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Lines</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{repositoryAnalysis.code_metrics.total_files}</div>
                          <div className="text-sm text-gray-600">Total Files</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{repositoryAnalysis.code_metrics.complexity_score}</div>
                          <div className="text-sm text-gray-600">Complexity Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{Math.round(repositoryAnalysis.code_metrics.maintainability_index)}</div>
                          <div className="text-sm text-gray-600">Maintainability</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Static Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{repositoryAnalysis.static_analysis.bugs}</div>
                          <div className="text-sm text-gray-600">Bugs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{repositoryAnalysis.static_analysis.vulnerabilities}</div>
                          <div className="text-sm text-gray-600">Vulnerabilities</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{repositoryAnalysis.static_analysis.code_smells}</div>
                          <div className="text-sm text-gray-600">Code Smells</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p><strong>Technical Debt:</strong> {repositoryAnalysis.static_analysis.technical_debt}</p>
                        <p><strong>Test Coverage:</strong> {repositoryAnalysis.static_analysis.coverage}%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Direct Dependencies</h4>
                          <div className="space-y-1">
                            {repositoryAnalysis.dependencies.direct.map((dep, index) => (
                              <div key={index} className="text-sm">
                                <Badge variant={dep.type === 'production' ? 'default' : 'secondary'}>
                                  {dep.name}@{dep.version}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        {repositoryAnalysis.dependencies.vulnerabilities.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-red-600">Security Vulnerabilities</h4>
                            <div className="space-y-1">
                              {repositoryAnalysis.dependencies.vulnerabilities.map((vuln, index) => (
                                <div key={index} className="text-sm">
                                  <Badge className={getRiskColor(vuln.severity)}>
                                    {vuln.name}: {vuln.severity}
                                  </Badge>
                                  <p className="text-gray-600">{vuln.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risks & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">Critical Issues</h4>
                          <ul className="text-sm space-y-1">
                            {repositoryAnalysis.risks_and_concerns.critical_issues.map((issue, index) => (
                              <li key={index} className="text-red-700">• {issue}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-orange-600">Security Risks</h4>
                          <ul className="text-sm space-y-1">
                            {repositoryAnalysis.risks_and_concerns.security_risks.map((risk, index) => (
                              <li key={index} className="text-orange-700">• {risk}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Immediate Actions</h4>
                          <ul className="text-sm space-y-1">
                            {repositoryAnalysis.recommendations.immediate_actions.map((action, index) => (
                              <li key={index} className="text-gray-700">• {action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
