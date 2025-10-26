'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketIntelligenceAnalysis } from '@/lib/services/market-intelligence.service'

export default function MarketIntelligenceTestPage() {
  const { data: session } = useSession()
  const [githubUrl, setGithubUrl] = useState('https://github.com/zhan4808/GRDB.swift')
  const [productName, setProductName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    repository_analysis: any
    market_intelligence: MarketIntelligenceAnalysis
  } | null>(null)

  const handleAnalyze = async () => {
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
    setResult(null)

    try {
      console.log('Testing market intelligence analysis...')
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          githubUrl: githubUrl.trim(), 
          token: session.user.githubToken,
          additionalContext: {
            productName: productName.trim() || undefined,
            companyName: companyName.trim() || undefined,
            description: description.trim() || undefined
          }
        }),
      })

      const data = await response.json()
      console.log('Market Intelligence Response:', data)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze market intelligence')
      }

      setResult(data.data)
      console.log('Market Intelligence Analysis Result:', data.data)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
      console.error('Market analysis error:', err)
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

  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'Very Positive': return 'bg-green-100 text-green-800'
      case 'Positive': return 'bg-blue-100 text-blue-800'
      case 'Neutral': return 'bg-yellow-100 text-yellow-800'
      case 'Negative': return 'bg-orange-100 text-orange-800'
      case 'Very Negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'bg-green-100 text-green-800'
      case 'Buy': return 'bg-blue-100 text-blue-800'
      case 'Hold': return 'bg-yellow-100 text-yellow-800'
      case 'Sell': return 'bg-orange-100 text-orange-800'
      case 'Strong Sell': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Intelligence Analysis</h1>
          <p className="text-gray-600">Deep VC-level market research and competitive analysis</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Market Analysis Input</CardTitle>
            <CardDescription>Analyze market intelligence based on GitHub repository</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub Repository URL</label>
                  <Input
                    placeholder="https://github.com/user/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name (Optional)</label>
                  <Input
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name (Optional)</label>
                  <Input
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <Input
                    placeholder="Product Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Analyzing Market Intelligence...' : 'Analyze Market Intelligence'}
              </Button>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
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
              <TabsTrigger value="market">Market Analysis</TabsTrigger>
              <TabsTrigger value="pmf">Product-Market Fit</TabsTrigger>
              <TabsTrigger value="gtm">Go-to-Market</TabsTrigger>
              <TabsTrigger value="investment">Investment Thesis</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Investment Grade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getGradeColor(result.market_intelligence.investment_thesis.investment_grade)}>
                      {result.market_intelligence.investment_thesis.investment_grade}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Overall Score: {result.market_intelligence.investment_thesis.overall_investment_score}/100
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Outlook</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getOutlookColor(result.market_intelligence.summary.market_outlook)}>
                      {result.market_intelligence.summary.market_outlook}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Opportunity: {result.market_intelligence.investment_thesis.market_opportunity_score}/100
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getRecommendationColor(result.market_intelligence.summary.investment_recommendation)}>
                      {result.market_intelligence.summary.investment_recommendation}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Confidence: {result.market_intelligence.summary.confidence_score}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">PMF Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.market_intelligence.product_market_fit.pmf_score}/100
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {result.market_intelligence.product_market_fit.pmf_stage}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Name:</strong> {result.market_intelligence.product.name}</p>
                      <p><strong>Category:</strong> {result.market_intelligence.product.category}</p>
                      <p><strong>Target Market:</strong> {result.market_intelligence.product.target_market}</p>
                    </div>
                    <div>
                      <p><strong>Business Model:</strong> {result.market_intelligence.product.business_model}</p>
                      <p><strong>Value Proposition:</strong> {result.market_intelligence.product.value_proposition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Investment Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.market_intelligence.investment_thesis.key_investment_drivers.map((driver, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        {driver}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.market_intelligence.investment_thesis.key_risks.map((risk, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Size Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${(result.market_intelligence.market_analysis.market_size.tam / 1000000000).toFixed(1)}B
                      </div>
                      <div className="text-sm text-gray-600">TAM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${(result.market_intelligence.market_analysis.market_size.sam / 1000000000).toFixed(1)}B
                      </div>
                      <div className="text-sm text-gray-600">SAM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ${(result.market_intelligence.market_analysis.market_size.som / 1000000000).toFixed(1)}B
                      </div>
                      <div className="text-sm text-gray-600">SOM</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p><strong>Growth Rate:</strong> {result.market_intelligence.market_analysis.market_size.growth_rate}%</p>
                    <p><strong>Market Maturity:</strong> {result.market_intelligence.market_analysis.market_size.maturity}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competitive Landscape</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Direct Competitors</h4>
                      {result.market_intelligence.market_analysis.competitive_landscape.direct_competitors.map((competitor, index) => (
                        <div key={index} className="border rounded-lg p-3 mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{competitor.name}</p>
                              <p className="text-sm text-gray-600">{competitor.description}</p>
                              <p className="text-sm">Market Share: {competitor.market_share}%</p>
                            </div>
                            <Badge variant="outline">{competitor.funding_status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Competitive Advantages</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.market_analysis.competitive_landscape.competitive_advantages.map((advantage, index) => (
                          <li key={index} className="text-sm">• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Moat Strength</h4>
                      <Badge variant="outline">{result.market_intelligence.market_analysis.competitive_landscape.moat_strength}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Trends</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.market_analysis.market_trends.key_trends.map((trend, index) => (
                          <li key={index} className="text-sm">• {trend}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Emerging Opportunities</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.market_analysis.market_trends.emerging_opportunities.map((opportunity, index) => (
                          <li key={index} className="text-sm">• {opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pmf" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product-Market Fit Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {result.market_intelligence.product_market_fit.pmf_score}/100
                      </div>
                      <Badge variant="outline" className="text-lg">
                        {result.market_intelligence.product_market_fit.pmf_stage}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">PMF Evidence</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">User Growth:</p>
                          <p className="text-sm text-gray-600">{result.market_intelligence.product_market_fit.evidence.user_growth}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Engagement Metrics:</p>
                          <p className="text-sm text-gray-600">{result.market_intelligence.product_market_fit.evidence.engagement_metrics}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Customer Feedback:</p>
                          <p className="text-sm text-gray-600">{result.market_intelligence.product_market_fit.evidence.customer_feedback}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Retention Indicators:</p>
                          <p className="text-sm text-gray-600">{result.market_intelligence.product_market_fit.evidence.retention_indicators}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">PMF Risks</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.product_market_fit.pmf_risks.map((risk, index) => (
                          <li key={index} className="text-sm text-red-600">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gtm" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Go-to-Market Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Primary Channels</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.market_intelligence.go_to_market.gtm_strategy.primary_channels.map((channel, index) => (
                          <Badge key={index} variant="secondary">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Customer Acquisition Strategy</h4>
                      <p className="text-sm text-gray-600">{result.market_intelligence.go_to_market.gtm_strategy.customer_acquisition_strategy}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                      <p className="text-sm text-gray-600">{result.market_intelligence.go_to_market.gtm_strategy.pricing_strategy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GTM Potential Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Scalability Score</span>
                        <span className="text-sm text-gray-600">{result.market_intelligence.go_to_market.gtm_potential.scalability_score}/100</span>
                      </div>
                      <Progress value={result.market_intelligence.go_to_market.gtm_potential.scalability_score} className="mb-4" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Channel Efficiency</span>
                        <span className="text-sm text-gray-600">{result.market_intelligence.go_to_market.gtm_potential.channel_efficiency}/100</span>
                      </div>
                      <Progress value={result.market_intelligence.go_to_market.gtm_potential.channel_efficiency} className="mb-4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${result.market_intelligence.go_to_market.gtm_potential.customer_lifetime_value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">LTV</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        ${result.market_intelligence.go_to_market.gtm_potential.customer_acquisition_cost.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">CAC</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {result.market_intelligence.go_to_market.gtm_potential.ltv_cac_ratio.toFixed(1)}x
                      </div>
                      <div className="text-sm text-gray-600">LTV/CAC</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GTM Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.market_intelligence.go_to_market.gtm_recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">• {rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Thesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.market_intelligence.investment_thesis.market_opportunity_score}/100
                      </div>
                      <div className="text-sm text-gray-600">Market Opportunity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.market_intelligence.investment_thesis.competitive_position_score}/100
                      </div>
                      <div className="text-sm text-gray-600">Competitive Position</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.market_intelligence.investment_thesis.execution_capability_score}/100
                      </div>
                      <div className="text-sm text-gray-600">Execution Capability</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {result.market_intelligence.investment_thesis.overall_investment_score}/100
                    </div>
                    <Badge className={getGradeColor(result.market_intelligence.investment_thesis.investment_grade)}>
                      Grade: {result.market_intelligence.investment_thesis.investment_grade}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Positioning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Positioning Statement</h4>
                      <p className="text-sm text-gray-600">{result.market_intelligence.market_positioning.positioning_statement}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Differentiation Factors</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.market_positioning.differentiation_factors.map((factor, index) => (
                          <li key={index} className="text-sm">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Pricing Positioning</h4>
                      <Badge variant="outline">{result.market_intelligence.market_positioning.pricing_positioning}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Immediate Actions</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.recommendations.immediate_actions.map((action, index) => (
                          <li key={index} className="text-sm text-red-600">• {action}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Strategic Initiatives</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.recommendations.strategic_initiatives.map((initiative, index) => (
                          <li key={index} className="text-sm text-blue-600">• {initiative}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Market Expansion Opportunities</h4>
                      <ul className="space-y-1">
                        {result.market_intelligence.recommendations.market_expansion_opportunities.map((opportunity, index) => (
                          <li key={index} className="text-sm text-green-600">• {opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Market Intelligence Data</CardTitle>
                  <CardDescription>Complete analysis data for debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                    {JSON.stringify(result.market_intelligence, null, 2)}
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
