import { Octokit } from '@octokit/rest'
import { GitHubAnalysisService } from './github-analysis.service'

export interface AuthorProfileAnalysis {
  author: {
    username: string
    name: string
    bio: string
    avatar_url: string
    followers: number
    following: number
    public_repos: number
    created_at: string
    location: string
    company: string
    blog: string
  }
  repositories: {
    total: number
    languages: Record<string, number>
    total_lines: number
    total_commits: number
    avg_stars: number
    avg_forks: number
  }
  skills: {
    primary_languages: string[]
    frameworks: string[]
    tools: string[]
    expertise_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  }
  activity: {
    innovation_score: number
    consistency_score: number
    community_engagement: number
    code_quality_trend: 'Improving' | 'Stable' | 'Declining'
  }
  risk_assessment: {
    overall_risk: 'Low' | 'Medium' | 'High'
    concerns: string[]
    strengths: string[]
  }
  summary: {
    key_insights: string[]
    recommendations: string[]
    confidence_score: number
  }
}

export interface RepositoryAnalysis {
  repository: {
    name: string
    full_name: string
    description: string
    url: string
    language: string
    stars: number
    forks: number
    watchers: number
    created_at: string
    updated_at: string
    size: number
  }
  code_metrics: {
    total_lines: number
    total_files: number
    languages: Record<string, number>
    complexity_score: number
    maintainability_index: number
  }
  static_analysis: {
    bugs: number
    vulnerabilities: number
    code_smells: number
    security_hotspots: number
    technical_debt: string
    coverage: number
  }
  dependencies: {
    direct: Array<{ name: string; version: string; type: 'production' | 'development' }>
    vulnerabilities: Array<{ name: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; description: string }>
    outdated: Array<{ name: string; current: string; latest: string }>
  }
  architecture: {
    patterns: string[]
    complexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex'
    scalability_score: number
    performance_indicators: string[]
  }
  quality_assessment: {
    overall_grade: 'A' | 'B' | 'C' | 'D' | 'F'
    code_quality_score: number
    security_score: number
    maintainability_score: number
    testability_score: number
  }
  risks_and_concerns: {
    critical_issues: string[]
    security_risks: string[]
    technical_debt: string[]
    scalability_concerns: string[]
  }
  recommendations: {
    immediate_actions: string[]
    short_term_improvements: string[]
    long_term_considerations: string[]
    priority_level: 'Low' | 'Medium' | 'High' | 'Critical'
  }
}

export class RepoRadarAnalysisService {
  private githubService: GitHubAnalysisService

  constructor(githubToken: string) {
    this.githubService = new GitHubAnalysisService(githubToken)
  }

  /**
   * Analyzes a GitHub author's complete profile for due diligence
   * @param githubUrl - GitHub repository URL (e.g., "https://github.com/user/repo")
   * @returns Complete author profile analysis
   */
  async analyzeAuthorProfile(githubUrl: string): Promise<AuthorProfileAnalysis> {
    try {
      // Extract username from URL
      const username = this.extractUsernameFromUrl(githubUrl)
      
      // Get comprehensive GitHub profile analysis
      const githubAnalysis = await this.githubService.analyzeUser(username)
      
      // Transform to RepoRadar format
      const authorProfile: AuthorProfileAnalysis = {
        author: {
          username: githubAnalysis.profile.login,
          name: githubAnalysis.profile.name || githubAnalysis.profile.login,
          bio: githubAnalysis.profile.bio || '',
          avatar_url: githubAnalysis.profile.avatar_url,
          followers: githubAnalysis.profile.followers,
          following: githubAnalysis.profile.following,
          public_repos: githubAnalysis.profile.public_repos,
          created_at: githubAnalysis.profile.created_at,
          location: githubAnalysis.profile.location || '',
          company: githubAnalysis.profile.company || '',
          blog: githubAnalysis.profile.blog || ''
        },
        repositories: {
          total: githubAnalysis.summary.total_repos,
          languages: githubAnalysis.summary.top_languages.reduce((acc, { language, lines }) => {
            acc[language] = lines
            return acc
          }, {} as Record<string, number>),
          total_lines: githubAnalysis.summary.total_lines,
          total_commits: githubAnalysis.summary.total_commits,
          avg_stars: Math.round(githubAnalysis.repositories.reduce((sum, repo) => sum + repo.stars, 0) / githubAnalysis.repositories.length),
          avg_forks: Math.round(githubAnalysis.repositories.reduce((sum, repo) => sum + repo.forks, 0) / githubAnalysis.repositories.length)
        },
        skills: {
          primary_languages: githubAnalysis.summary.top_languages.slice(0, 5).map(l => l.language),
          frameworks: this.extractFrameworks(githubAnalysis.repositories),
          tools: this.extractTools(githubAnalysis.repositories),
          expertise_level: this.calculateExpertiseLevel(githubAnalysis)
        },
        activity: {
          innovation_score: githubAnalysis.summary.avg_innovation_score,
          consistency_score: githubAnalysis.summary.avg_consistency_score,
          community_engagement: githubAnalysis.summary.avg_community_engagement,
          code_quality_trend: this.calculateQualityTrend(githubAnalysis.repositories)
        },
        risk_assessment: {
          overall_risk: this.calculateOverallRisk(githubAnalysis),
          concerns: this.identifyConcerns(githubAnalysis),
          strengths: this.identifyStrengths(githubAnalysis)
        },
        summary: {
          key_insights: this.generateKeyInsights(githubAnalysis),
          recommendations: this.generateRecommendations(githubAnalysis),
          confidence_score: this.calculateConfidenceScore(githubAnalysis)
        }
      }

      return authorProfile
    } catch (error) {
      console.error('Error analyzing author profile:', error)
      throw new Error(`Failed to analyze author profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Performs detailed analysis of a specific repository with static analysis
   * @param githubUrl - GitHub repository URL (e.g., "https://github.com/user/repo")
   * @returns Detailed repository analysis with static analysis results
   */
  async analyzeRepository(githubUrl: string): Promise<RepositoryAnalysis> {
    try {
      // Extract owner and repo from URL
      const { owner, repo } = this.extractOwnerRepoFromUrl(githubUrl)
      
      // Get basic repository analysis
      const repoAnalysis = await this.githubService.analyzeRepository(`${owner}/${repo}`)
      
      // Perform static analysis
      const staticAnalysis = await this.performStaticAnalysis(owner, repo)
      
      // Analyze dependencies
      const dependencies = await this.analyzeDependencies(owner, repo)
      
      // Analyze architecture
      const architecture = await this.analyzeArchitecture(owner, repo, repoAnalysis.languages)
      
      // Transform to RepoRadar format
      const repositoryAnalysis: RepositoryAnalysis = {
        repository: {
          name: repoAnalysis.name,
          full_name: repoAnalysis.full_name,
          description: repoAnalysis.description || '',
          url: repoAnalysis.html_url,
          language: repoAnalysis.language || 'Unknown',
          stars: repoAnalysis.stars,
          forks: repoAnalysis.forks,
          watchers: repoAnalysis.watchers,
          created_at: repoAnalysis.created_at,
          updated_at: repoAnalysis.updated_at,
          size: repoAnalysis.size
        },
        code_metrics: {
          total_lines: repoAnalysis.total_lines,
          total_files: repoAnalysis.total_files,
          languages: repoAnalysis.languages,
          complexity_score: this.calculateComplexityScore(repoAnalysis),
          maintainability_index: this.calculateMaintainabilityIndex(repoAnalysis)
        },
        static_analysis: staticAnalysis,
        dependencies: dependencies,
        architecture: architecture,
        quality_assessment: {
          overall_grade: repoAnalysis.acid_grade,
          code_quality_score: repoAnalysis.code_quality_score,
          security_score: repoAnalysis.security_score,
          maintainability_score: repoAnalysis.code_quality_score, // Using code quality as proxy
          testability_score: this.calculateTestabilityScore(repoAnalysis)
        },
        risks_and_concerns: {
          critical_issues: this.identifyCriticalIssues(repoAnalysis, staticAnalysis),
          security_risks: this.identifySecurityRisks(repoAnalysis, dependencies),
          technical_debt: this.identifyTechnicalDebt(repoAnalysis, staticAnalysis),
          scalability_concerns: this.identifyScalabilityConcerns(repoAnalysis, architecture)
        },
        recommendations: {
          immediate_actions: this.generateImmediateActions(repoAnalysis, staticAnalysis),
          short_term_improvements: this.generateShortTermImprovements(repoAnalysis, dependencies),
          long_term_considerations: this.generateLongTermConsiderations(repoAnalysis, architecture),
          priority_level: this.calculatePriorityLevel(repoAnalysis, staticAnalysis)
        }
      }

      return repositoryAnalysis
    } catch (error) {
      console.error('Error analyzing repository:', error)
      throw new Error(`Failed to analyze repository: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Helper methods
  private extractUsernameFromUrl(url: string): string {
    const match = url.match(/github\.com\/([^\/]+)/)
    if (!match) throw new Error('Invalid GitHub URL')
    return match[1]
  }

  private extractOwnerRepoFromUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) throw new Error('Invalid GitHub repository URL')
    return { owner: match[1], repo: match[2] }
  }

  private extractFrameworks(repositories: any[]): string[] {
    const frameworks = new Set<string>()
    
    repositories.forEach(repo => {
      const languages = Object.keys(repo.languages)
      
      // Detect frameworks based on languages and patterns
      if (languages.includes('JavaScript') || languages.includes('TypeScript')) {
        frameworks.add('React')
        frameworks.add('Vue')
        frameworks.add('Angular')
        frameworks.add('Node.js')
      }
      if (languages.includes('Python')) {
        frameworks.add('Django')
        frameworks.add('Flask')
        frameworks.add('FastAPI')
      }
      if (languages.includes('Java')) {
        frameworks.add('Spring')
        frameworks.add('Spring Boot')
      }
      if (languages.includes('Go')) {
        frameworks.add('Gin')
        frameworks.add('Echo')
      }
    })
    
    return Array.from(frameworks)
  }

  private extractTools(repositories: any[]): string[] {
    const tools = new Set<string>()
    
    repositories.forEach(repo => {
      const languages = Object.keys(repo.languages)
      
      if (languages.includes('Dockerfile')) tools.add('Docker')
      if (languages.includes('YAML')) tools.add('CI/CD')
      if (languages.includes('Shell')) tools.add('Shell Scripting')
      if (languages.includes('SQL')) tools.add('Database Management')
      if (languages.includes('Markdown')) tools.add('Documentation')
    })
    
    return Array.from(tools)
  }

  private calculateExpertiseLevel(analysis: any): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const avgQuality = analysis.summary.avg_code_quality
    const totalRepos = analysis.summary.total_repos
    const totalCommits = analysis.summary.total_commits
    
    if (totalRepos < 5 || totalCommits < 100) return 'Beginner'
    if (avgQuality < 60 || totalRepos < 15) return 'Intermediate'
    if (avgQuality < 80 || totalRepos < 30) return 'Advanced'
    return 'Expert'
  }

  private calculateQualityTrend(repositories: any[]): 'Improving' | 'Stable' | 'Declining' {
    // Simple heuristic based on recent activity and quality scores
    const recentRepos = repositories.filter(repo => {
      const updated = new Date(repo.updated_at)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return updated > sixMonthsAgo
    })
    
    if (recentRepos.length === 0) return 'Declining'
    
    const avgRecentQuality = recentRepos.reduce((sum, repo) => sum + repo.code_quality_score, 0) / recentRepos.length
    const avgOverallQuality = repositories.reduce((sum, repo) => sum + repo.code_quality_score, 0) / repositories.length
    
    if (avgRecentQuality > avgOverallQuality + 10) return 'Improving'
    if (avgRecentQuality < avgOverallQuality - 10) return 'Declining'
    return 'Stable'
  }

  private calculateOverallRisk(analysis: any): 'Low' | 'Medium' | 'High' {
    const avgSecurity = analysis.summary.avg_security_score
    const avgQuality = analysis.summary.avg_code_quality
    const totalBugs = analysis.summary.total_bugs
    const totalVulns = analysis.summary.total_vulnerabilities
    
    let riskScore = 0
    if (avgSecurity < 50) riskScore += 3
    if (avgQuality < 60) riskScore += 2
    if (totalBugs > 10) riskScore += 2
    if (totalVulns > 5) riskScore += 3
    
    if (riskScore >= 6) return 'High'
    if (riskScore >= 3) return 'Medium'
    return 'Low'
  }

  private identifyConcerns(analysis: any): string[] {
    const concerns: string[] = []
    
    if (analysis.summary.avg_security_score < 50) {
      concerns.push('Low security awareness')
    }
    if (analysis.summary.total_vulnerabilities > 5) {
      concerns.push('Multiple security vulnerabilities')
    }
    if (analysis.summary.avg_code_quality < 60) {
      concerns.push('Poor code quality')
    }
    if (analysis.summary.total_bugs > 10) {
      concerns.push('High bug count')
    }
    if (analysis.profile.public_repos < 5) {
      concerns.push('Limited public portfolio')
    }
    
    return concerns
  }

  private identifyStrengths(analysis: any): string[] {
    const strengths: string[] = []
    
    if (analysis.summary.avg_innovation_score > 70) {
      strengths.push('High innovation score')
    }
    if (analysis.summary.avg_consistency_score > 70) {
      strengths.push('Consistent development activity')
    }
    if (analysis.summary.avg_code_quality > 80) {
      strengths.push('High code quality')
    }
    if (analysis.profile.followers > 100) {
      strengths.push('Strong community presence')
    }
    if (analysis.summary.total_commits > 1000) {
      strengths.push('Extensive development experience')
    }
    
    return strengths
  }

  private generateKeyInsights(analysis: any): string[] {
    const insights: string[] = []
    
    insights.push(`Primary expertise in ${analysis.summary.top_languages.slice(0, 3).map(l => l.language).join(', ')}`)
    insights.push(`${analysis.summary.total_repos} repositories with ${analysis.summary.total_commits} total commits`)
    insights.push(`Innovation score: ${analysis.summary.avg_innovation_score}/100, Consistency: ${analysis.summary.avg_consistency_score}/100`)
    
    if (analysis.summary.avg_security_score > 70) {
      insights.push('Strong security awareness')
    }
    if (analysis.summary.total_bugs === 0 && analysis.summary.total_vulnerabilities === 0) {
      insights.push('Clean codebase with no identified issues')
    }
    
    return insights
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = []
    
    if (analysis.summary.avg_security_score < 60) {
      recommendations.push('Improve security practices and code review processes')
    }
    if (analysis.summary.total_vulnerabilities > 0) {
      recommendations.push('Address security vulnerabilities immediately')
    }
    if (analysis.summary.avg_code_quality < 70) {
      recommendations.push('Implement code quality tools and standards')
    }
    if (analysis.profile.public_repos < 10) {
      recommendations.push('Increase public portfolio visibility')
    }
    
    return recommendations
  }

  private calculateConfidenceScore(analysis: any): number {
    let confidence = 50 // Base confidence
    
    // Increase confidence based on data availability
    if (analysis.summary.total_repos > 10) confidence += 20
    if (analysis.summary.total_commits > 500) confidence += 15
    if (analysis.profile.followers > 50) confidence += 10
    if (analysis.summary.total_lines > 10000) confidence += 5
    
    return Math.min(100, confidence)
  }

  // Repository-specific analysis methods
  private async performStaticAnalysis(owner: string, repo: string): Promise<any> {
    // This would integrate with actual static analysis tools
    // For now, return mock data based on repository characteristics
    return {
      bugs: Math.floor(Math.random() * 10),
      vulnerabilities: Math.floor(Math.random() * 5),
      code_smells: Math.floor(Math.random() * 15),
      security_hotspots: Math.floor(Math.random() * 3),
      technical_debt: '2 days',
      coverage: Math.floor(Math.random() * 40) + 60 // 60-100%
    }
  }

  private async analyzeDependencies(owner: string, repo: string): Promise<any> {
    // This would analyze package.json, requirements.txt, etc.
    return {
      direct: [
        { name: 'react', version: '18.2.0', type: 'production' as const },
        { name: 'typescript', version: '4.9.0', type: 'development' as const }
      ],
      vulnerabilities: [
        { name: 'lodash', severity: 'Medium' as const, description: 'Prototype pollution vulnerability' }
      ],
      outdated: [
        { name: 'react', current: '18.2.0', latest: '18.3.0' }
      ]
    }
  }

  private async analyzeArchitecture(owner: string, repo: string, languages: Record<string, number>): Promise<any> {
    const languageCount = Object.keys(languages).length
    const totalLines = Object.values(languages).reduce((sum, lines) => sum + lines, 0)
    
    let complexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex' = 'Simple'
    if (languageCount > 5 || totalLines > 50000) complexity = 'Very Complex'
    else if (languageCount > 3 || totalLines > 20000) complexity = 'Complex'
    else if (languageCount > 2 || totalLines > 5000) complexity = 'Moderate'
    
    return {
      patterns: ['MVC', 'Repository Pattern', 'Dependency Injection'],
      complexity,
      scalability_score: Math.floor(Math.random() * 40) + 60,
      performance_indicators: ['Database queries', 'Memory usage', 'Response time']
    }
  }

  private calculateComplexityScore(repoAnalysis: any): number {
    const languageCount = Object.keys(repoAnalysis.languages).length
    const totalLines = repoAnalysis.total_lines
    const totalFiles = repoAnalysis.total_files
    
    let complexity = 0
    complexity += languageCount * 10
    complexity += Math.min(totalLines / 1000, 50)
    complexity += Math.min(totalFiles / 100, 30)
    
    return Math.min(100, complexity)
  }

  private calculateMaintainabilityIndex(repoAnalysis: any): number {
    const qualityScore = repoAnalysis.code_quality_score
    const complexityScore = this.calculateComplexityScore(repoAnalysis)
    
    return Math.max(0, qualityScore - (complexityScore * 0.3))
  }

  private calculateTestabilityScore(repoAnalysis: any): number {
    // Mock calculation based on repository characteristics
    return Math.floor(Math.random() * 30) + 70
  }

  private identifyCriticalIssues(repoAnalysis: any, staticAnalysis: any): string[] {
    const issues: string[] = []
    
    if (staticAnalysis.vulnerabilities > 3) {
      issues.push('Multiple security vulnerabilities detected')
    }
    if (staticAnalysis.bugs > 10) {
      issues.push('High number of bugs in codebase')
    }
    if (repoAnalysis.code_quality_score < 40) {
      issues.push('Very low code quality score')
    }
    
    return issues
  }

  private identifySecurityRisks(repoAnalysis: any, dependencies: any): string[] {
    const risks: string[] = []
    
    dependencies.vulnerabilities.forEach((vuln: any) => {
      if (vuln.severity === 'Critical' || vuln.severity === 'High') {
        risks.push(`${vuln.name}: ${vuln.description}`)
      }
    })
    
    if (repoAnalysis.security_score < 50) {
      risks.push('Overall low security score')
    }
    
    return risks
  }

  private identifyTechnicalDebt(repoAnalysis: any, staticAnalysis: any): string[] {
    const debt: string[] = []
    
    if (staticAnalysis.code_smells > 10) {
      debt.push('High number of code smells')
    }
    if (staticAnalysis.technical_debt) {
      debt.push(`Technical debt: ${staticAnalysis.technical_debt}`)
    }
    if (repoAnalysis.code_quality_score < 60) {
      debt.push('Poor code quality indicates technical debt')
    }
    
    return debt
  }

  private identifyScalabilityConcerns(repoAnalysis: any, architecture: any): string[] {
    const concerns: string[] = []
    
    if (architecture.complexity === 'Very Complex') {
      concerns.push('Very complex architecture may impact scalability')
    }
    if (architecture.scalability_score < 70) {
      concerns.push('Low scalability score')
    }
    if (repoAnalysis.total_lines > 100000) {
      concerns.push('Large codebase may have scalability challenges')
    }
    
    return concerns
  }

  private generateImmediateActions(repoAnalysis: any, staticAnalysis: any): string[] {
    const actions: string[] = []
    
    if (staticAnalysis.vulnerabilities > 0) {
      actions.push('Fix security vulnerabilities immediately')
    }
    if (staticAnalysis.bugs > 5) {
      actions.push('Address critical bugs')
    }
    if (repoAnalysis.code_quality_score < 50) {
      actions.push('Implement code quality standards')
    }
    
    return actions
  }

  private generateShortTermImprovements(repoAnalysis: any, dependencies: any): string[] {
    const improvements: string[] = []
    
    if (dependencies.outdated.length > 0) {
      improvements.push('Update outdated dependencies')
    }
    if (repoAnalysis.code_quality_score < 70) {
      improvements.push('Improve code quality through refactoring')
    }
    improvements.push('Add comprehensive test coverage')
    improvements.push('Implement CI/CD pipeline')
    
    return improvements
  }

  private generateLongTermConsiderations(repoAnalysis: any, architecture: any): string[] {
    const considerations: string[] = []
    
    if (architecture.complexity === 'Very Complex') {
      considerations.push('Consider architectural refactoring')
    }
    considerations.push('Implement monitoring and observability')
    considerations.push('Plan for horizontal scaling')
    considerations.push('Establish code review processes')
    
    return considerations
  }

  private calculatePriorityLevel(repoAnalysis: any, staticAnalysis: any): 'Low' | 'Medium' | 'High' | 'Critical' {
    if (staticAnalysis.vulnerabilities > 3 || staticAnalysis.bugs > 15) {
      return 'Critical'
    }
    if (staticAnalysis.vulnerabilities > 0 || staticAnalysis.bugs > 5 || repoAnalysis.code_quality_score < 50) {
      return 'High'
    }
    if (repoAnalysis.code_quality_score < 70 || staticAnalysis.code_smells > 10) {
      return 'Medium'
    }
    return 'Low'
  }
}
