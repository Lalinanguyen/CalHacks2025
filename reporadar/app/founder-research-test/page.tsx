'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FounderAnalysisResult } from '@/lib/services/founder-research.service'

export default function FounderResearchTestPage() {
  const [founderName, setFounderName] = useState('Elad Moshe')
  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/in/elad-moshe-05a90413/')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<FounderAnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!founderName.trim()) {
      setError('Please enter a founder name')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Testing founder research analysis...')
      const response = await fetch('/api/founder-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          founderInfo: {
            name: founderName.trim(),
            linkedin_url: linkedinUrl.trim() || undefined,
            twitter_url: twitterUrl.trim() || undefined,
            github_url: githubUrl.trim() || undefined
          }
        }),
      })

      const data = await response.json()
      console.log('Founder Research Response:', data)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze founder profile')
      }

      setResult(data.data)
      console.log('Founder Research Analysis Result:', data.data)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
      console.error('Founder analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
      case 'A-': return 'bg-green-100 text-green-800'
      case 'B+':
      case 'B':
      case 'B-': return 'bg-blue-100 text-blue-800'
      case 'C+':
      case 'C':
      case 'C-': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Hire': return 'bg-green-100 text-green-800'
      case 'Hire': return 'bg-blue-100 text-blue-800'
      case 'Consider': return 'bg-yellow-100 text-yellow-800'
      case 'Pass': return 'bg-orange-100 text-orange-800'
      case 'Strong Pass': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Series B+': return 'bg-purple-100 text-purple-800'
      case 'Series A': return 'bg-blue-100 text-blue-800'
      case 'Seed': return 'bg-green-100 text-green-800'
      case 'Pre-Seed': return 'bg-yellow-100 text-yellow-800'
      case 'Not Ready': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Founder Research Analysis</h1>
          <p className="text-gray-600">Deep founder profile analysis using Bright Data scraping</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Founder Analysis Input</CardTitle>
            <CardDescription>Analyze founder profile using LinkedIn, Twitter, and GitHub data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Founder Name</label>
                  <Input
                    placeholder="Elad Moshe"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <Input
                    placeholder="https://www.linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter URL (Optional)</label>
                  <Input
                    placeholder="https://twitter.com/username"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL (Optional)</label>
                  <Input
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Analyzing Founder Profile...' : 'Analyze Founder Profile'}
              </Button>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              {result && result.profile.experience.length === 0 && result.profile.skills.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800">
                    ⚠️ <strong>Bright Data API Limitation:</strong> LinkedIn scraping is asynchronous and takes time to complete.
                    <br />• The scraping request has been submitted successfully
                    <br />• Results will be available later (typically 5-30 minutes)
                    <br />• For demo purposes, showing analysis with limited data
                    <br />• In production, implement polling or webhooks to get complete results
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="risks">Risks & Opportunities</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Founder Grade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getGradeColor(result.summary.founder_grade)}>
                      {result.summary.founder_grade}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Overall Score: {result.analysis.overall_founder_score}/100
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getRecommendationColor(result.summary.recommendation)}>
                      {result.summary.recommendation}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Confidence: {result.summary.confidence_score}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Investment Readiness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getStageColor(result.investment_readiness.stage)}>
                      {result.investment_readiness.stage}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Score: {result.investment_readiness.score}/100
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Experience Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.analysis.experience_score}/100
                    </div>
                    <Progress value={result.analysis.experience_score} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.summary.key_insights.map((insight, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Basic Information</h4>
                      <p><strong>Name:</strong> {result.profile.name}</p>
                      <p><strong>Headline:</strong> {result.profile.headline}</p>
                      <p><strong>Location:</strong> {result.profile.location}</p>
                      <p><strong>Summary:</strong> {result.profile.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Social Presence</h4>
                      <div className="space-y-1">
                        {result.profile.linkedin_url && (
                          <p><strong>LinkedIn:</strong> <a href={result.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.profile.linkedin_url}</a></p>
                        )}
                        {result.profile.twitter_url && (
                          <p><strong>Twitter:</strong> <a href={result.profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.profile.twitter_url}</a></p>
                        )}
                        {result.profile.github_url && (
                          <p><strong>GitHub:</strong> <a href={result.profile.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.profile.github_url}</a></p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.profile.experience.map((exp, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{exp.title}</p>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.duration}</p>
                            {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-sm mt-2 text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.profile.education.map((edu, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.school}</p>
                        {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
                        {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Experience Score</span>
                        <span className="text-sm text-gray-600">{result.analysis.experience_score}/100</span>
                      </div>
                      <Progress value={result.analysis.experience_score} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Credibility Score</span>
                        <span className="text-sm text-gray-600">{result.analysis.credibility_score}/100</span>
                      </div>
                      <Progress value={result.analysis.credibility_score} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Network Strength</span>
                        <span className="text-sm text-gray-600">{result.analysis.network_strength}/100</span>
                      </div>
                      <Progress value={result.analysis.network_strength} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Leadership Score</span>
                        <span className="text-sm text-gray-600">{result.analysis.leadership_score}/100</span>
                      </div>
                      <Progress value={result.analysis.leadership_score} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Technical Expertise</span>
                        <span className="text-sm text-gray-600">{result.analysis.technical_expertise}/100</span>
                      </div>
                      <Progress value={result.analysis.technical_expertise} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Business Acumen</span>
                        <span className="text-sm text-gray-600">{result.analysis.business_acumen}/100</span>
                      </div>
                      <Progress value={result.analysis.business_acumen} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Innovation Score</span>
                        <span className="text-sm text-gray-600">{result.analysis.innovation_score}/100</span>
                      </div>
                      <Progress value={result.analysis.innovation_score} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Communication Score</span>
                        <span className="text-sm text-gray-600">{result.analysis.communication_score}/100</span>
                      </div>
                      <Progress value={result.analysis.communication_score} className="mb-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.profile.connections?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">LinkedIn Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.profile.followers?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Twitter Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.profile.posts?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Social Posts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Low Risk Factors</h4>
                      <ul className="space-y-1">
                        {result.risk_assessment.lowRisk.map((risk, index) => (
                          <li key={index} className="text-sm">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-yellow-600">Medium Risk Factors</h4>
                      <ul className="space-y-1">
                        {result.risk_assessment.mediumRisk.map((risk, index) => (
                          <li key={index} className="text-sm">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-red-600">High Risk Factors</h4>
                      <ul className="space-y-1">
                        {result.risk_assessment.highRisk.map((risk, index) => (
                          <li key={index} className="text-sm">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Red Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.red_flags.map((flag, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Founder Analysis Data</CardTitle>
                  <CardDescription>Complete analysis data for debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}