'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GitHubAnalysisResult } from '@/lib/services/github-analysis.service'
import { GitHubVisualization } from '@/components/github-visualization'

export default function GitHubAnalysisTestPage() {
  const { data: session, status } = useSession()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GitHubAnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (!session?.user?.githubToken) {
      setError('GitHub token not available. Please sign in again.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/github-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          token: session.user.githubToken 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Debug info
  console.log('Session status:', status)
  console.log('Session data:', session)

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>GitHub Analysis Test</CardTitle>
            <CardDescription>
              Sign in with GitHub to analyze profiles and repositories
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => signIn('github', { callbackUrl: '/github-analysis-test' })}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHub Analysis Test</h1>
              <p className="text-gray-600">
                Analyze GitHub profiles and repositories with comprehensive insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src={session.user?.image || ''} 
                  alt={session.user?.name || ''}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">{session.user?.name}</span>
              </div>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analysis Input</CardTitle>
            <CardDescription>
              Enter a GitHub username to analyze their profile and repositories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="e.g., zhan4808"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || !username.trim()}
                >
                  {loading ? 'Analyzing...' : 'Analyze Profile'}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={`https://github.com/${result.profile.username}.png`} 
                    alt={result.profile.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="text-xl">{result.profile.name || result.profile.username}</div>
                    <div className="text-sm text-gray-600">@{result.profile.username}</div>
                  </div>
                </CardTitle>
                <CardDescription>{result.profile.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{result.profile.public_repos}</div>
                    <div className="text-sm text-gray-600">Repositories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{result.profile.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{result.profile.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{result.summary.total_lines.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Lines</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
                <TabsTrigger value="visualizations">Charts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Code Quality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {result.summary.avg_code_quality}/100
                      </div>
                      <Progress value={result.summary.avg_code_quality} className="mb-2" />
                      <p className="text-sm text-gray-600">Average across all repositories</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Security Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {result.summary.avg_security_score}/100
                      </div>
                      <Progress value={result.summary.avg_security_score} className="mb-2" />
                      <p className="text-sm text-gray-600">Average security rating</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Innovation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {result.summary.avg_innovation_score}/100
                      </div>
                      <Progress value={result.summary.avg_innovation_score} className="mb-2" />
                      <p className="text-sm text-gray-600">Based on commit message patterns</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Consistency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-indigo-600 mb-2">
                        {result.summary.avg_consistency_score}/100
                      </div>
                      <Progress value={result.summary.avg_consistency_score} className="mb-2" />
                      <p className="text-sm text-gray-600">Based on commit frequency patterns</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.summary.top_languages.map(({ language, lines }) => (
                        <Badge key={language} variant="secondary" className="text-sm">
                          {language}: {lines.toLocaleString()} lines
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="repositories" className="space-y-4">
                <div className="grid gap-4">
                  {result.repositories.map((repo) => (
                    <Card key={repo.full_name}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600"
                          >
                            {repo.full_name}
                          </a>
                          <div className="flex gap-2">
                            <Badge variant="outline">{repo.language}</Badge>
                            <Badge variant="outline">{repo.stars} stars</Badge>
                          </div>
                        </CardTitle>
                        <CardDescription>{repo.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-lg font-semibold">{repo.total_lines.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Lines of Code</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">{repo.total_files}</div>
                            <div className="text-sm text-gray-600">Files</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">{repo.total_commits}</div>
                            <div className="text-sm text-gray-600">Commits</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">{repo.open_issues}</div>
                            <div className="text-sm text-gray-600">Open Issues</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Code Quality</div>
                            <div className="flex items-center gap-2">
                              <Progress value={repo.code_quality_score} className="flex-1" />
                              <span className="text-sm font-medium">{repo.code_quality_score}/100</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Security</div>
                            <div className="flex items-center gap-2">
                              <Progress value={repo.security_score} className="flex-1" />
                              <span className="text-sm font-medium">{repo.security_score}/100</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Innovation</div>
                            <div className="flex items-center gap-2">
                              <Progress value={repo.innovation_score} className="flex-1" />
                              <span className="text-sm font-medium">{repo.innovation_score}/100</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Consistency</div>
                            <div className="flex items-center gap-2">
                              <Progress value={repo.consistency_score} className="flex-1" />
                              <span className="text-sm font-medium">{repo.consistency_score}/100</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-red-600">{repo.bugs}</div>
                            <div className="text-sm text-gray-600">Bugs</div>
                            <Badge className={getGradeColor(repo.bugs_grade)}>
                              {repo.bugs_grade}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-600">{repo.vulnerabilities}</div>
                            <div className="text-sm text-gray-600">Vulnerabilities</div>
                            <Badge className={getGradeColor(repo.vulnerabilities_grade)}>
                              {repo.vulnerabilities_grade}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-yellow-600">{repo.code_smells}</div>
                            <div className="text-sm text-gray-600">Code Smells</div>
                            <Badge className={getGradeColor(repo.code_smells_grade)}>
                              {repo.code_smells_grade}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Skills</CardTitle>
                    <CardDescription>Skills extracted from repository analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.summary.top_skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Architecture Patterns</CardTitle>
                    <CardDescription>Detected architectural patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.summary.top_architecture_patterns.map((pattern) => (
                        <Badge key={pattern} variant="outline">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Issues Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Bugs</span>
                          <Badge variant="destructive">{result.summary.total_bugs}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Vulnerabilities</span>
                          <Badge variant="destructive">{result.summary.total_vulnerabilities}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Code Smells</span>
                          <Badge variant="secondary">{result.summary.total_code_smells}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Repository Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Repositories</span>
                          <span className="font-semibold">{result.summary.total_repos}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Commits</span>
                          <span className="font-semibold">{result.summary.total_commits}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Lines</span>
                          <span className="font-semibold">{result.summary.total_lines.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Language Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.summary.top_languages.map(({ language, lines }) => (
                          <div key={language} className="flex justify-between items-center">
                            <span className="text-sm">{language}</span>
                            <span className="text-sm font-semibold">
                              {((lines / result.summary.total_lines) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="visualizations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Code Quality Radar</CardTitle>
                      <CardDescription>Overall quality metrics across different dimensions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GitHubVisualization data={result} type="radar" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Language Distribution</CardTitle>
                      <CardDescription>Programming languages used across repositories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GitHubVisualization data={result} type="languages" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quality Trends</CardTitle>
                      <CardDescription>Quality metrics across repositories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GitHubVisualization data={result} type="quality-trends" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Overview</CardTitle>
                      <CardDescription>Technical skills categorized by domain</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GitHubVisualization data={result} type="skills-sunburst" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}