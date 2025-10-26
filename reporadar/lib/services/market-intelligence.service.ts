import { RepositoryAnalysis } from './reporadar-analysis.service'

export interface MarketIntelligenceAnalysis {
  product: {
    name: string
    description: string
    category: string
    target_market: string
    business_model: string
    value_proposition: string
  }
  market_analysis: {
    market_size: {
      tam: number // Total Addressable Market
      sam: number // Serviceable Addressable Market
      som: number // Serviceable Obtainable Market
      growth_rate: number
      maturity: 'Early' | 'Growth' | 'Mature' | 'Declining'
    }
    market_trends: {
      key_trends: string[]
      emerging_opportunities: string[]
      market_drivers: string[]
      barriers_to_entry: string[]
    }
    competitive_landscape: {
      direct_competitors: Array<{
        name: string
        description: string
        market_share: number
        strengths: string[]
        weaknesses: string[]
        funding_status: string
      }>
      indirect_competitors: Array<{
        name: string
        description: string
        threat_level: 'Low' | 'Medium' | 'High'
      }>
      competitive_advantages: string[]
      moat_strength: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong'
    }
  }
  product_market_fit: {
    pmf_score: number // 0-100
    evidence: {
      user_growth: string
      engagement_metrics: string
      customer_feedback: string
      retention_indicators: string
    }
    pmf_stage: 'Pre-PMF' | 'Early PMF' | 'Strong PMF' | 'Post-PMF'
    pmf_risks: string[]
  }
  go_to_market: {
    gtm_strategy: {
      primary_channels: string[]
      customer_acquisition_strategy: string
      pricing_strategy: string
      sales_model: string
    }
    gtm_potential: {
      scalability_score: number // 0-100
      channel_efficiency: number // 0-100
      customer_lifetime_value: number
      customer_acquisition_cost: number
      ltv_cac_ratio: number
    }
    gtm_challenges: string[]
    gtm_recommendations: string[]
  }
  market_positioning: {
    positioning_statement: string
    differentiation_factors: string[]
    target_customer_segments: Array<{
      segment: string
      size: number
      pain_points: string[]
      willingness_to_pay: 'Low' | 'Medium' | 'High'
    }>
    pricing_positioning: 'Budget' | 'Value' | 'Premium' | 'Luxury'
    brand_positioning: string
  }
  investment_thesis: {
    investment_grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D'
    key_investment_drivers: string[]
    key_risks: string[]
    market_opportunity_score: number // 0-100
    competitive_position_score: number // 0-100
    execution_capability_score: number // 0-100
    overall_investment_score: number // 0-100
  }
  recommendations: {
    immediate_actions: string[]
    strategic_initiatives: string[]
    market_expansion_opportunities: string[]
    competitive_threats_to_monitor: string[]
  }
  summary: {
    key_insights: string[]
    market_outlook: 'Very Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Very Negative'
    investment_recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'
    confidence_score: number // 0-100
  }
}

export class MarketIntelligenceService {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
  }

  /**
   * Analyze market intelligence based on GitHub repository analysis
   * @param repoAnalysis - Repository analysis from GitHub analysis service
   * @param additionalContext - Additional context about the product/company
   */
  async analyzeMarketIntelligence(
    repoAnalysis: RepositoryAnalysis,
    additionalContext?: {
      productName?: string
      companyName?: string
      founderNames?: string[]
      website?: string
      description?: string
    }
  ): Promise<MarketIntelligenceAnalysis> {
    try {
      if (!repoAnalysis) {
        throw new Error('Repository analysis is required')
      }
      
      // Extract product information from repository analysis
      const productInfo = this.extractProductInfo(repoAnalysis, additionalContext)
      
      // Analyze market size and trends
      const marketAnalysis = await this.analyzeMarketSizeAndTrends(productInfo)
      
      // Assess product-market fit
      const pmfAnalysis = await this.assessProductMarketFit(repoAnalysis, productInfo)
      
      // Evaluate go-to-market potential
      const gtmAnalysis = await this.evaluateGTMPotential(repoAnalysis, productInfo)
      
      // Analyze market positioning
      const positioningAnalysis = await this.analyzeMarketPositioning(productInfo, marketAnalysis)
      
      // Generate investment thesis
      const investmentThesis = this.generateInvestmentThesis(
        marketAnalysis,
        pmfAnalysis,
        gtmAnalysis,
        positioningAnalysis
      )
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(
        marketAnalysis,
        pmfAnalysis,
        gtmAnalysis,
        positioningAnalysis
      )
      
      // Create summary
      const summary = this.createSummary(
        investmentThesis,
        recommendations,
        repoAnalysis
      )

      return {
        product: productInfo,
        market_analysis: marketAnalysis,
        product_market_fit: pmfAnalysis,
        go_to_market: gtmAnalysis,
        market_positioning: positioningAnalysis,
        investment_thesis: investmentThesis,
        recommendations,
        summary
      }
    } catch (error) {
      console.error('Error in market intelligence analysis:', error)
      throw new Error(`Failed to analyze market intelligence: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private extractProductInfo(
    repoAnalysis: RepositoryAnalysis,
    additionalContext?: any
  ): any {
    const repo = repoAnalysis.repository
    const languages = Object.keys(repoAnalysis.code_metrics.languages)
    const architecture = repoAnalysis.architecture
    
    // Determine product category based on languages and patterns
    const category = this.categorizeProduct(languages, architecture.patterns, repo.description)
    
    // Extract business model from repository characteristics
    const businessModel = this.determineBusinessModel(repo, languages, architecture)
    
    // Determine target market
    const targetMarket = this.determineTargetMarket(category, businessModel, languages)
    
    // Extract value proposition
    const valueProposition = this.extractValueProposition(repo, category, businessModel)

    return {
      name: additionalContext?.productName || repo.name,
      description: additionalContext?.description || repo.description || 'No description available',
      category,
      target_market: targetMarket,
      business_model: businessModel,
      value_proposition: valueProposition
    }
  }

  private categorizeProduct(languages: string[], patterns: string[], description?: string): string {
    const desc = (description || '').toLowerCase()
    
    // AI/ML Products
    if (languages.includes('Python') && (desc.includes('ai') || desc.includes('ml') || desc.includes('machine learning'))) {
      return 'AI/ML Platform'
    }
    
    // Web Applications
    if (languages.includes('JavaScript') || languages.includes('TypeScript')) {
      if (desc.includes('ecommerce') || desc.includes('marketplace')) return 'E-commerce Platform'
      if (desc.includes('saas') || desc.includes('software as a service')) return 'SaaS Platform'
      if (desc.includes('social') || desc.includes('community')) return 'Social Platform'
      if (desc.includes('fintech') || desc.includes('financial')) return 'Fintech Platform'
      if (desc.includes('health') || desc.includes('medical')) return 'Healthtech Platform'
      return 'Web Application'
    }
    
    // Mobile Applications
    if (languages.includes('Swift') || languages.includes('Kotlin') || languages.includes('Dart')) {
      return 'Mobile Application'
    }
    
    // Developer Tools
    if (languages.includes('Go') || languages.includes('Rust') || languages.includes('C++')) {
      if (desc.includes('devops') || desc.includes('ci/cd')) return 'DevOps Tool'
      if (desc.includes('database') || desc.includes('db')) return 'Database Tool'
      if (desc.includes('api') || desc.includes('framework')) return 'Developer Framework'
      return 'Developer Tool'
    }
    
    // Blockchain/Crypto
    if (desc.includes('blockchain') || desc.includes('crypto') || desc.includes('web3')) {
      return 'Blockchain Platform'
    }
    
    return 'Software Platform'
  }

  private determineBusinessModel(repo: any, languages: string[], architecture: any): string {
    const stars = repo.stars
    const forks = repo.forks
    const isOpenSource = repo.description?.toLowerCase().includes('open source')
    
    // Open Source with Commercial Support
    if (isOpenSource && stars > 1000) {
      return 'Open Source + Commercial Support'
    }
    
    // SaaS Model
    if (languages.includes('JavaScript') || languages.includes('TypeScript')) {
      return 'SaaS Subscription'
    }
    
    // Enterprise Software
    if (languages.includes('Java') || languages.includes('C#')) {
      return 'Enterprise License'
    }
    
    // API/Platform
    if (architecture.patterns.includes('API') || architecture.patterns.includes('Microservices')) {
      return 'API/Platform Revenue'
    }
    
    // Freemium
    if (stars > 500 && forks > 100) {
      return 'Freemium'
    }
    
    return 'Subscription'
  }

  private determineTargetMarket(category: string, businessModel: string, languages: string[]): string {
    const marketMap: Record<string, string> = {
      'AI/ML Platform': 'Enterprise AI Teams',
      'SaaS Platform': 'SMBs and Enterprises',
      'E-commerce Platform': 'Online Retailers',
      'Fintech Platform': 'Financial Institutions',
      'Healthtech Platform': 'Healthcare Organizations',
      'Mobile Application': 'Consumer Mobile Users',
      'Developer Tool': 'Software Development Teams',
      'DevOps Tool': 'DevOps Engineers',
      'Database Tool': 'Database Administrators',
      'Blockchain Platform': 'Web3 Developers'
    }
    
    return marketMap[category] || 'Technology Professionals'
  }

  private extractValueProposition(repo: any, category: string, businessModel: string): string {
    const description = repo.description || ''
    const stars = repo.stars
    const forks = repo.forks
    
    // High engagement indicates strong value proposition
    if (stars > 1000 && forks > 100) {
      return `High-performance ${category.toLowerCase()} with strong community adoption (${stars} stars, ${forks} forks)`
    }
    
    // Growing project
    if (stars > 100) {
      return `Emerging ${category.toLowerCase()} with growing developer community`
    }
    
    // Early stage
    return `Innovative ${category.toLowerCase()} addressing specific market needs`
  }

  private async analyzeMarketSizeAndTrends(productInfo: any): Promise<any> {
    // This would integrate with market research APIs in production
    // For now, we'll use intelligent estimates based on category
    
    if (!productInfo || !productInfo.category) {
      throw new Error('Product information is required for market analysis')
    }
    
    const marketSizes: Record<string, { tam: number, sam: number, som: number, growth: number }> = {
      'AI/ML Platform': { tam: 200000000000, sam: 50000000000, som: 5000000000, growth: 25 },
      'SaaS Platform': { tam: 500000000000, sam: 100000000000, som: 10000000000, growth: 15 },
      'E-commerce Platform': { tam: 300000000000, sam: 75000000000, som: 7500000000, growth: 12 },
      'Fintech Platform': { tam: 150000000000, sam: 30000000000, som: 3000000000, growth: 20 },
      'Healthtech Platform': { tam: 100000000000, sam: 20000000000, som: 2000000000, growth: 18 },
      'Mobile Application': { tam: 400000000000, sam: 80000000000, som: 8000000000, growth: 10 },
      'Developer Tool': { tam: 50000000000, sam: 10000000000, som: 1000000000, growth: 22 },
      'DevOps Tool': { tam: 30000000000, sam: 6000000000, som: 600000000, growth: 20 },
      'Database Tool': { tam: 40000000000, sam: 8000000000, som: 800000000, growth: 15 },
      'Blockchain Platform': { tam: 80000000000, sam: 16000000000, som: 1600000000, growth: 30 }
    }
    
    const marketData = marketSizes[productInfo.category] || { tam: 100000000000, sam: 20000000000, som: 2000000000, growth: 15 }
    
    return {
      market_size: {
        tam: marketData.tam,
        sam: marketData.sam,
        som: marketData.som,
        growth_rate: marketData.growth,
        maturity: this.determineMarketMaturity(productInfo.category, marketData.growth)
      },
      market_trends: {
        key_trends: this.getMarketTrends(productInfo.category),
        emerging_opportunities: this.getEmergingOpportunities(productInfo.category),
        market_drivers: this.getMarketDrivers(productInfo.category),
        barriers_to_entry: this.getBarriersToEntry(productInfo.category)
      },
      competitive_landscape: await this.analyzeCompetitiveLandscape(productInfo)
    }
  }

  private determineMarketMaturity(category: string, growthRate: number): 'Early' | 'Growth' | 'Mature' | 'Declining' {
    if (growthRate > 20) return 'Early'
    if (growthRate > 10) return 'Growth'
    if (growthRate > 0) return 'Mature'
    return 'Declining'
  }

  private getMarketTrends(category: string): string[] {
    const trendsMap: Record<string, string[]> = {
      'AI/ML Platform': [
        'AI democratization and no-code ML tools',
        'Edge AI and real-time inference',
        'AI ethics and responsible AI practices',
        'Multimodal AI capabilities'
      ],
      'SaaS Platform': [
        'Vertical SaaS specialization',
        'API-first architecture',
        'AI integration in SaaS products',
        'Remote work collaboration tools'
      ],
      'Fintech Platform': [
        'Embedded finance and banking-as-a-service',
        'Real-time payments and instant settlements',
        'DeFi and traditional finance convergence',
        'Regulatory technology (RegTech)'
      ],
      'Developer Tool': [
        'Low-code/no-code development',
        'Cloud-native development',
        'AI-assisted coding',
        'Developer experience optimization'
      ]
    }
    
    return trendsMap[category] || [
      'Digital transformation acceleration',
      'Cloud-first architecture',
      'API economy growth',
      'Automation and efficiency focus'
    ]
  }

  private getEmergingOpportunities(category: string): string[] {
    const opportunitiesMap: Record<string, string[]> = {
      'AI/ML Platform': [
        'Industry-specific AI solutions',
        'AI-powered automation tools',
        'Real-time AI decision making',
        'AI for small businesses'
      ],
      'SaaS Platform': [
        'Industry vertical solutions',
        'Micro-SaaS opportunities',
        'AI-enhanced productivity tools',
        'Integration and workflow automation'
      ],
      'Fintech Platform': [
        'Embedded financial services',
        'Cross-border payment solutions',
        'Alternative lending platforms',
        'Financial wellness tools'
      ]
    }
    
    return opportunitiesMap[category] || [
      'Market consolidation opportunities',
      'Integration and partnership potential',
      'International expansion',
      'Adjacent market entry'
    ]
  }

  private getMarketDrivers(category: string): string[] {
    return [
      'Digital transformation acceleration',
      'Remote work adoption',
      'Cost optimization pressures',
      'Regulatory compliance requirements',
      'Customer experience expectations',
      'Data-driven decision making'
    ]
  }

  private getBarriersToEntry(category: string): string[] {
    const barriersMap: Record<string, string[]> = {
      'AI/ML Platform': [
        'High technical expertise requirements',
        'Data privacy and security concerns',
        'Regulatory compliance complexity',
        'Talent acquisition challenges'
      ],
      'Fintech Platform': [
        'Regulatory compliance burden',
        'Security and trust requirements',
        'Capital requirements',
        'Established player dominance'
      ],
      'Healthtech Platform': [
        'HIPAA compliance requirements',
        'Clinical validation needs',
        'Healthcare system integration',
        'Regulatory approval processes'
      ]
    }
    
    return barriersMap[category] || [
      'Customer acquisition costs',
      'Brand recognition requirements',
      'Technical complexity',
      'Capital requirements'
    ]
  }

  private async analyzeCompetitiveLandscape(productInfo: any): Promise<any> {
    // This would integrate with competitive intelligence APIs
    // For now, we'll provide intelligent estimates based on category
    
    const competitors = this.getCompetitorsByCategory(productInfo.category)
    
    return {
      direct_competitors: competitors.direct,
      indirect_competitors: competitors.indirect,
      competitive_advantages: this.identifyCompetitiveAdvantages(productInfo),
      moat_strength: this.assessMoatStrength(productInfo, competitors)
    }
  }

  private getCompetitorsByCategory(category: string): any {
    const competitorMap: Record<string, any> = {
      'AI/ML Platform': {
        direct: [
          { name: 'TensorFlow', description: 'Google\'s open-source ML framework', market_share: 25, strengths: ['Google backing', 'Large community'], weaknesses: ['Complexity', 'Steep learning curve'], funding_status: 'Google-funded' },
          { name: 'PyTorch', description: 'Facebook\'s ML framework', market_share: 20, strengths: ['Research-friendly', 'Dynamic graphs'], weaknesses: ['Production deployment', 'Mobile support'], funding_status: 'Meta-funded' }
        ],
        indirect: [
          { name: 'Hugging Face', description: 'AI model hub and platform', threat_level: 'High' as const },
          { name: 'OpenAI', description: 'AI research and API platform', threat_level: 'High' as const }
        ]
      },
      'SaaS Platform': {
        direct: [
          { name: 'Salesforce', description: 'CRM platform leader', market_share: 30, strengths: ['Market leader', 'Ecosystem'], weaknesses: ['Complexity', 'Cost'], funding_status: 'Public' },
          { name: 'HubSpot', description: 'Inbound marketing platform', market_share: 15, strengths: ['User-friendly', 'All-in-one'], weaknesses: ['Limited customization', 'Pricing'], funding_status: 'Public' }
        ],
        indirect: [
          { name: 'Microsoft Dynamics', description: 'Enterprise CRM', threat_level: 'Medium' as const },
          { name: 'Pipedrive', description: 'Sales-focused CRM', threat_level: 'Low' as const }
        ]
      }
    }
    
    return competitorMap[category] || {
      direct: [],
      indirect: []
    }
  }

  private identifyCompetitiveAdvantages(productInfo: any): string[] {
    const advantages: string[] = []
    
    // Technical advantages
    if (productInfo.category.includes('AI/ML')) {
      advantages.push('Advanced AI/ML capabilities')
    }
    
    if (productInfo.business_model.includes('Open Source')) {
      advantages.push('Open source community adoption')
    }
    
    // Market advantages
    advantages.push('Targeted market focus')
    advantages.push('Agile development approach')
    
    return advantages
  }

  private assessMoatStrength(productInfo: any, competitors: any): 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' {
    let moatScore = 0
    
    // Technical moat
    if (productInfo.category.includes('AI/ML')) moatScore += 2
    if (productInfo.business_model.includes('Open Source')) moatScore += 1
    
    // Market moat
    if (competitors.direct.length < 3) moatScore += 2
    if (productInfo.target_market.includes('Enterprise')) moatScore += 1
    
    if (moatScore >= 5) return 'Very Strong'
    if (moatScore >= 3) return 'Strong'
    if (moatScore >= 1) return 'Moderate'
    return 'Weak'
  }

  private async assessProductMarketFit(repoAnalysis: RepositoryAnalysis, productInfo: any): Promise<any> {
    const repo = repoAnalysis.repository
    const metrics = repoAnalysis.code_metrics
    
    // Calculate PMF score based on repository metrics
    let pmfScore = 0
    
    // Community engagement (stars, forks)
    if (repo.stars > 1000) pmfScore += 30
    else if (repo.stars > 100) pmfScore += 20
    else if (repo.stars > 10) pmfScore += 10
    
    if (repo.forks > 100) pmfScore += 20
    else if (repo.forks > 10) pmfScore += 10
    
    // Code quality and maintenance
    if (repoAnalysis.quality_assessment.overall_grade === 'A') pmfScore += 20
    else if (repoAnalysis.quality_assessment.overall_grade === 'B') pmfScore += 15
    else if (repoAnalysis.quality_assessment.overall_grade === 'C') pmfScore += 10
    
    // Activity and updates
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 30) pmfScore += 15
    else if (daysSinceUpdate < 90) pmfScore += 10
    else if (daysSinceUpdate < 180) pmfScore += 5
    
    // Repository size and complexity
    if (metrics.total_lines > 10000) pmfScore += 15
    else if (metrics.total_lines > 1000) pmfScore += 10
    
    pmfScore = Math.min(100, pmfScore)
    
    // Determine PMF stage
    let pmfStage: 'Pre-PMF' | 'Early PMF' | 'Strong PMF' | 'Post-PMF'
    if (pmfScore >= 80) pmfStage = 'Post-PMF'
    else if (pmfScore >= 60) pmfStage = 'Strong PMF'
    else if (pmfScore >= 40) pmfStage = 'Early PMF'
    else pmfStage = 'Pre-PMF'
    
    return {
      pmf_score: pmfScore,
      evidence: {
        user_growth: repo.stars > 100 ? `Strong community growth (${repo.stars} stars)` : 'Limited community growth',
        engagement_metrics: repo.forks > 10 ? `High engagement (${repo.forks} forks)` : 'Low engagement',
        customer_feedback: repo.open_issues > 0 ? `${repo.open_issues} open issues indicating active user feedback` : 'Limited user feedback',
        retention_indicators: daysSinceUpdate < 30 ? 'Active development and maintenance' : 'Inactive development'
      },
      pmf_stage: pmfStage,
      pmf_risks: this.identifyPMFRisks(pmfScore, repo, metrics)
    }
  }

  private identifyPMFRisks(pmfScore: number, repo: any, metrics: any): string[] {
    const risks: string[] = []
    
    if (pmfScore < 40) {
      risks.push('Low product-market fit evidence')
    }
    
    if (repo.stars < 10) {
      risks.push('Limited market adoption')
    }
    
    if (repo.forks < 5) {
      risks.push('Low community engagement')
    }
    
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate > 180) {
      risks.push('Inactive development')
    }
    
    if (metrics.total_lines < 1000) {
      risks.push('Limited product depth')
    }
    
    return risks
  }

  private async evaluateGTMPotential(repoAnalysis: RepositoryAnalysis, productInfo: any): Promise<any> {
    const repo = repoAnalysis.repository
    const quality = repoAnalysis.quality_assessment
    
    // Calculate scalability score
    let scalabilityScore = 0
    if (quality.overall_grade === 'A') scalabilityScore += 40
    else if (quality.overall_grade === 'B') scalabilityScore += 30
    else if (quality.overall_grade === 'C') scalabilityScore += 20
    
    if (repoAnalysis.architecture.scalability_score > 80) scalabilityScore += 30
    else if (repoAnalysis.architecture.scalability_score > 60) scalabilityScore += 20
    else if (repoAnalysis.architecture.scalability_score > 40) scalabilityScore += 10
    
    if (productInfo.business_model.includes('SaaS')) scalabilityScore += 20
    else if (productInfo.business_model.includes('API')) scalabilityScore += 15
    
    scalabilityScore = Math.min(100, scalabilityScore)
    
    // Calculate channel efficiency
    let channelEfficiency = 0
    if (productInfo.category.includes('Developer Tool')) channelEfficiency += 40
    if (productInfo.business_model.includes('Open Source')) channelEfficiency += 30
    if (repo.stars > 100) channelEfficiency += 20
    if (productInfo.target_market.includes('Enterprise')) channelEfficiency += 10
    
    channelEfficiency = Math.min(100, channelEfficiency)
    
    // Estimate LTV/CAC (simplified)
    const ltv = this.estimateLTV(productInfo)
    const cac = this.estimateCAC(productInfo)
    
    return {
      gtm_strategy: {
        primary_channels: this.getPrimaryChannels(productInfo),
        customer_acquisition_strategy: this.getAcquisitionStrategy(productInfo),
        pricing_strategy: this.getPricingStrategy(productInfo),
        sales_model: this.getSalesModel(productInfo)
      },
      gtm_potential: {
        scalability_score: scalabilityScore,
        channel_efficiency: channelEfficiency,
        customer_lifetime_value: ltv,
        customer_acquisition_cost: cac,
        ltv_cac_ratio: ltv / cac
      },
      gtm_challenges: this.identifyGTMChallenges(productInfo),
      gtm_recommendations: this.generateGTMRecommendations(productInfo, scalabilityScore, channelEfficiency)
    }
  }

  private estimateLTV(productInfo: any): number {
    const ltvMap: Record<string, number> = {
      'Enterprise License': 50000,
      'SaaS Subscription': 15000,
      'API/Platform Revenue': 25000,
      'Freemium': 5000,
      'Open Source + Commercial Support': 20000
    }
    
    return ltvMap[productInfo.business_model] || 10000
  }

  private estimateCAC(productInfo: any): number {
    const cacMap: Record<string, number> = {
      'Enterprise License': 5000,
      'SaaS Subscription': 2000,
      'API/Platform Revenue': 1500,
      'Freemium': 500,
      'Open Source + Commercial Support': 1000
    }
    
    return cacMap[productInfo.business_model] || 1500
  }

  private getPrimaryChannels(productInfo: any): string[] {
    const channels: string[] = []
    
    if (productInfo.business_model.includes('Open Source')) {
      channels.push('Developer communities', 'GitHub marketplace', 'Technical conferences')
    }
    
    if (productInfo.target_market.includes('Enterprise')) {
      channels.push('Direct sales', 'Partner channels', 'Industry events')
    }
    
    if (productInfo.category.includes('SaaS')) {
      channels.push('Content marketing', 'SEO', 'Paid advertising', 'Product-led growth')
    }
    
    return channels.length > 0 ? channels : ['Digital marketing', 'Content marketing', 'Community building']
  }

  private getAcquisitionStrategy(productInfo: any): string {
    if (productInfo.business_model.includes('Open Source')) {
      return 'Community-driven growth through developer adoption and contribution'
    }
    
    if (productInfo.target_market.includes('Enterprise')) {
      return 'Direct sales and relationship building with enterprise decision makers'
    }
    
    return 'Product-led growth with freemium model and viral mechanics'
  }

  private getPricingStrategy(productInfo: any): string {
    if (productInfo.business_model.includes('Enterprise')) {
      return 'Value-based pricing with enterprise features and support'
    }
    
    if (productInfo.business_model.includes('Freemium')) {
      return 'Freemium model with premium features and usage limits'
    }
    
    return 'Subscription-based pricing with tiered feature sets'
  }

  private getSalesModel(productInfo: any): string {
    if (productInfo.target_market.includes('Enterprise')) {
      return 'Direct sales with dedicated account managers'
    }
    
    if (productInfo.business_model.includes('Open Source')) {
      return 'Self-service with community support and commercial offerings'
    }
    
    return 'Self-service with automated onboarding and support'
  }

  private identifyGTMChallenges(productInfo: any): string[] {
    const challenges: string[] = []
    
    if (productInfo.target_market.includes('Enterprise')) {
      challenges.push('Long sales cycles')
      challenges.push('Complex procurement processes')
    }
    
    if (productInfo.category.includes('Developer Tool')) {
      challenges.push('High technical barrier to adoption')
      challenges.push('Competition from established players')
    }
    
    if (productInfo.business_model.includes('Open Source')) {
      challenges.push('Monetization complexity')
      challenges.push('Community management overhead')
    }
    
    return challenges
  }

  private generateGTMRecommendations(productInfo: any, scalabilityScore: number, channelEfficiency: number): string[] {
    const recommendations: string[] = []
    
    if (scalabilityScore < 60) {
      recommendations.push('Invest in infrastructure scalability')
      recommendations.push('Implement automated scaling mechanisms')
    }
    
    if (channelEfficiency < 60) {
      recommendations.push('Optimize customer acquisition channels')
      recommendations.push('Focus on high-converting marketing channels')
    }
    
    if (productInfo.target_market.includes('Enterprise')) {
      recommendations.push('Build enterprise sales team')
      recommendations.push('Develop enterprise-grade features')
    }
    
    return recommendations
  }

  private async analyzeMarketPositioning(productInfo: any, marketAnalysis: any): Promise<any> {
    return {
      positioning_statement: this.createPositioningStatement(productInfo, marketAnalysis),
      differentiation_factors: this.identifyDifferentiationFactors(productInfo),
      target_customer_segments: this.defineCustomerSegments(productInfo),
      pricing_positioning: this.determinePricingPositioning(productInfo),
      brand_positioning: this.createBrandPositioning(productInfo)
    }
  }

  private createPositioningStatement(productInfo: any, marketAnalysis: any): string {
    return `The only ${productInfo.category.toLowerCase()} that ${productInfo.value_proposition.toLowerCase()} for ${productInfo.target_market.toLowerCase()}`
  }

  private identifyDifferentiationFactors(productInfo: any): string[] {
    const factors: string[] = []
    
    if (productInfo.business_model.includes('Open Source')) {
      factors.push('Open source transparency and community')
    }
    
    if (productInfo.category.includes('AI/ML')) {
      factors.push('Advanced AI/ML capabilities')
    }
    
    factors.push('Targeted market focus')
    factors.push('Agile development approach')
    
    return factors
  }

  private defineCustomerSegments(productInfo: any): any[] {
    const segments = [
      {
        segment: 'Early Adopters',
        size: 1000,
        pain_points: ['Need cutting-edge solutions', 'Willing to try new technologies'],
        willingness_to_pay: 'High' as const
      },
      {
        segment: 'Mainstream Users',
        size: 10000,
        pain_points: ['Need reliable solutions', 'Cost-conscious'],
        willingness_to_pay: 'Medium' as const
      }
    ]
    
    if (productInfo.target_market.includes('Enterprise')) {
      segments.push({
        segment: 'Enterprise Customers',
        size: 100,
        pain_points: ['Need enterprise features', 'Compliance requirements'],
        willingness_to_pay: 'High' as const
      })
    }
    
    return segments
  }

  private determinePricingPositioning(productInfo: any): 'Budget' | 'Value' | 'Premium' | 'Luxury' {
    if (productInfo.target_market.includes('Enterprise')) return 'Premium'
    if (productInfo.business_model.includes('Open Source')) return 'Value'
    if (productInfo.category.includes('AI/ML')) return 'Premium'
    return 'Value'
  }

  private createBrandPositioning(productInfo: any): string {
    return `Innovative ${productInfo.category.toLowerCase()} company focused on ${productInfo.target_market.toLowerCase()}`
  }

  private generateInvestmentThesis(
    marketAnalysis: any,
    pmfAnalysis: any,
    gtmAnalysis: any,
    positioningAnalysis: any
  ): any {
    // Calculate scores
    const marketOpportunityScore = this.calculateMarketOpportunityScore(marketAnalysis)
    const competitivePositionScore = this.calculateCompetitivePositionScore(marketAnalysis, positioningAnalysis)
    const executionCapabilityScore = this.calculateExecutionCapabilityScore(pmfAnalysis, gtmAnalysis)
    
    const overallScore = Math.round(
      (marketOpportunityScore * 0.4) +
      (competitivePositionScore * 0.3) +
      (executionCapabilityScore * 0.3)
    )
    
    const investmentGrade = this.calculateInvestmentGrade(overallScore)
    
    return {
      investment_grade: investmentGrade,
      key_investment_drivers: this.identifyInvestmentDrivers(marketAnalysis, pmfAnalysis, gtmAnalysis),
      key_risks: this.identifyKeyRisks(marketAnalysis, pmfAnalysis, gtmAnalysis),
      market_opportunity_score: marketOpportunityScore,
      competitive_position_score: competitivePositionScore,
      execution_capability_score: executionCapabilityScore,
      overall_investment_score: overallScore
    }
  }

  private calculateMarketOpportunityScore(marketAnalysis: any): number {
    let score = 0
    
    // Market size
    if (marketAnalysis.market_size.tam > 100000000000) score += 30
    else if (marketAnalysis.market_size.tam > 10000000000) score += 20
    else if (marketAnalysis.market_size.tam > 1000000000) score += 10
    
    // Growth rate
    if (marketAnalysis.market_size.growth_rate > 20) score += 30
    else if (marketAnalysis.market_size.growth_rate > 10) score += 20
    else if (marketAnalysis.market_size.growth_rate > 5) score += 10
    
    // Market maturity
    if (marketAnalysis.market_size.maturity === 'Early') score += 20
    else if (marketAnalysis.market_size.maturity === 'Growth') score += 15
    else if (marketAnalysis.market_size.maturity === 'Mature') score += 10
    
    // Barriers to entry
    if (marketAnalysis.market_trends.barriers_to_entry.length > 3) score += 20
    else if (marketAnalysis.market_trends.barriers_to_entry.length > 1) score += 10
    
    return Math.min(100, score)
  }

  private calculateCompetitivePositionScore(marketAnalysis: any, positioningAnalysis: any): number {
    let score = 0
    
    // Competitive landscape
    if (marketAnalysis.competitive_landscape.direct_competitors.length < 3) score += 30
    else if (marketAnalysis.competitive_landscape.direct_competitors.length < 5) score += 20
    else score += 10
    
    // Moat strength
    if (marketAnalysis.competitive_landscape.moat_strength === 'Very Strong') score += 30
    else if (marketAnalysis.competitive_landscape.moat_strength === 'Strong') score += 20
    else if (marketAnalysis.competitive_landscape.moat_strength === 'Moderate') score += 10
    
    // Differentiation
    if (positioningAnalysis.differentiation_factors.length > 3) score += 20
    else if (positioningAnalysis.differentiation_factors.length > 1) score += 10
    
    // Pricing positioning
    if (positioningAnalysis.pricing_positioning === 'Premium') score += 20
    else if (positioningAnalysis.pricing_positioning === 'Value') score += 15
    else score += 10
    
    return Math.min(100, score)
  }

  private calculateExecutionCapabilityScore(pmfAnalysis: any, gtmAnalysis: any): number {
    let score = 0
    
    // Product-market fit
    score += pmfAnalysis.pmf_score * 0.4
    
    // GTM potential
    score += gtmAnalysis.gtm_potential.scalability_score * 0.3
    score += gtmAnalysis.gtm_potential.channel_efficiency * 0.3
    
    return Math.min(100, Math.round(score))
  }

  private calculateInvestmentGrade(overallScore: number): 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' {
    if (overallScore >= 95) return 'A+'
    if (overallScore >= 90) return 'A'
    if (overallScore >= 85) return 'A-'
    if (overallScore >= 80) return 'B+'
    if (overallScore >= 75) return 'B'
    if (overallScore >= 70) return 'B-'
    if (overallScore >= 65) return 'C+'
    if (overallScore >= 60) return 'C'
    if (overallScore >= 55) return 'C-'
    return 'D'
  }

  private identifyInvestmentDrivers(marketAnalysis: any, pmfAnalysis: any, gtmAnalysis: any): string[] {
    const drivers: string[] = []
    
    if (marketAnalysis.market_size.growth_rate > 15) {
      drivers.push('High-growth market opportunity')
    }
    
    if (pmfAnalysis.pmf_score > 70) {
      drivers.push('Strong product-market fit evidence')
    }
    
    if (gtmAnalysis.gtm_potential.scalability_score > 80) {
      drivers.push('High scalability potential')
    }
    
    if (marketAnalysis.competitive_landscape.moat_strength === 'Strong' || marketAnalysis.competitive_landscape.moat_strength === 'Very Strong') {
      drivers.push('Strong competitive moat')
    }
    
    return drivers
  }

  private identifyKeyRisks(marketAnalysis: any, pmfAnalysis: any, gtmAnalysis: any): string[] {
    const risks: string[] = []
    
    if (marketAnalysis.market_size.maturity === 'Declining') {
      risks.push('Market decline risk')
    }
    
    if (pmfAnalysis.pmf_score < 50) {
      risks.push('Weak product-market fit')
    }
    
    if (gtmAnalysis.gtm_potential.scalability_score < 60) {
      risks.push('Scalability limitations')
    }
    
    if (marketAnalysis.competitive_landscape.direct_competitors.length > 5) {
      risks.push('High competitive intensity')
    }
    
    return risks
  }

  private generateRecommendations(
    marketAnalysis: any,
    pmfAnalysis: any,
    gtmAnalysis: any,
    positioningAnalysis: any
  ): any {
    return {
      immediate_actions: this.generateImmediateActions(pmfAnalysis, gtmAnalysis),
      strategic_initiatives: this.generateStrategicInitiatives(marketAnalysis, positioningAnalysis),
      market_expansion_opportunities: this.generateExpansionOpportunities(marketAnalysis),
      competitive_threats_to_monitor: this.generateThreatsToMonitor(marketAnalysis)
    }
  }

  private generateImmediateActions(pmfAnalysis: any, gtmAnalysis: any): string[] {
    const actions: string[] = []
    
    if (pmfAnalysis.pmf_score < 60) {
      actions.push('Focus on product-market fit validation')
      actions.push('Conduct customer discovery interviews')
    }
    
    if (gtmAnalysis.gtm_potential.scalability_score < 70) {
      actions.push('Invest in infrastructure scalability')
      actions.push('Implement automated scaling')
    }
    
    return actions
  }

  private generateStrategicInitiatives(marketAnalysis: any, positioningAnalysis: any): string[] {
    const initiatives: string[] = []
    
    if (marketAnalysis.market_size.growth_rate > 20) {
      initiatives.push('Accelerate market penetration')
    }
    
    if (positioningAnalysis.differentiation_factors.length < 3) {
      initiatives.push('Strengthen competitive differentiation')
    }
    
    return initiatives
  }

  private generateExpansionOpportunities(marketAnalysis: any): string[] {
    return marketAnalysis.market_trends.emerging_opportunities
  }

  private generateThreatsToMonitor(marketAnalysis: any): string[] {
    return marketAnalysis.competitive_landscape.indirect_competitors
      .filter((comp: any) => comp.threat_level === 'High')
      .map((comp: any) => comp.name)
  }

  private createSummary(
    investmentThesis: any,
    recommendations: any,
    repoAnalysis: RepositoryAnalysis
  ): any {
    const keyInsights: string[] = []
    
    // Market insights
    if (investmentThesis.market_opportunity_score > 80) {
      keyInsights.push('Exceptional market opportunity with high growth potential')
    }
    
    // Competitive insights
    if (investmentThesis.competitive_position_score > 80) {
      keyInsights.push('Strong competitive positioning with defensible moat')
    }
    
    // Execution insights
    if (investmentThesis.execution_capability_score > 80) {
      keyInsights.push('Strong execution capability with proven product-market fit')
    }
    
    // Determine market outlook
    let marketOutlook: 'Very Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Very Negative'
    if (investmentThesis.overall_investment_score >= 85) marketOutlook = 'Very Positive'
    else if (investmentThesis.overall_investment_score >= 75) marketOutlook = 'Positive'
    else if (investmentThesis.overall_investment_score >= 60) marketOutlook = 'Neutral'
    else if (investmentThesis.overall_investment_score >= 45) marketOutlook = 'Negative'
    else marketOutlook = 'Very Negative'
    
    // Determine investment recommendation
    let investmentRecommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'
    if (investmentThesis.investment_grade.startsWith('A')) investmentRecommendation = 'Strong Buy'
    else if (investmentThesis.investment_grade.startsWith('B')) investmentRecommendation = 'Buy'
    else if (investmentThesis.investment_grade.startsWith('C')) investmentRecommendation = 'Hold'
    else investmentRecommendation = 'Sell'
    
    // Calculate confidence score
    const confidenceScore = Math.round(
      (investmentThesis.market_opportunity_score * 0.3) +
      (investmentThesis.competitive_position_score * 0.3) +
      (investmentThesis.execution_capability_score * 0.4)
    )
    
    return {
      key_insights: keyInsights,
      market_outlook: marketOutlook,
      investment_recommendation: investmentRecommendation,
      confidence_score: confidenceScore
    }
  }
}
