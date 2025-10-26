import https from 'https'

export interface FounderProfile {
  name: string
  linkedin_url?: string
  twitter_url?: string
  github_url?: string
  email?: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description?: string
    location?: string
  }>
  education: Array<{
    degree: string
    school: string
    year?: string
    field?: string
  }>
  skills: string[]
  certifications: string[]
  languages: string[]
  interests: string[]
  connections?: number
  followers?: number
  posts?: Array<{
    content: string
    date: string
    engagement?: number
  }>
  achievements: string[]
  publications: string[]
  speaking_engagements: string[]
  awards: string[]
  volunteer_experience: string[]
  recommendations: Array<{
    text: string
    author: string
    relationship: string
  }>
}

export interface FounderAnalysisResult {
  profile: FounderProfile
  analysis: {
    experience_score: number // 0-100
    credibility_score: number // 0-100
    network_strength: number // 0-100
    leadership_score: number // 0-100
    technical_expertise: number // 0-100
    business_acumen: number // 0-100
    innovation_score: number // 0-100
    communication_score: number // 0-100
    overall_founder_score: number // 0-100
  }
  strengths: string[]
  weaknesses: string[]
  red_flags: string[]
  opportunities: string[]
  recommendations: string[]
  risk_assessment: {
    low_risk: string[]
    medium_risk: string[]
    high_risk: string[]
  }
  investment_readiness: {
    stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B+' | 'Not Ready'
    score: number // 0-100
    factors: string[]
  }
  summary: {
    key_insights: string[]
    founder_grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D'
    recommendation: 'Strong Hire' | 'Hire' | 'Consider' | 'Pass' | 'Strong Pass'
    confidence_score: number // 0-100
  }
}

export class FounderResearchService {
  private brightDataApiKey: string
  private linkedinDatasetId: string = 'gd_l1viktl72bvl7bjuj0'
  private twitterDatasetId: string = 'gd_lwxkxvnf1cynvib9co'

  constructor(apiKey?: string) {
    this.brightDataApiKey = apiKey || process.env.BRIGHTDATA_API_KEY || ''
    if (!this.brightDataApiKey) {
      throw new Error('Bright Data API key is required')
    }
  }

  /**
   * Analyze founder profile using Bright Data scraping
   * @param founderInfo - Founder name and social media URLs
   */
  async analyzeFounderProfile(founderInfo: {
    name: string
    linkedin_url?: string
    twitter_url?: string
    github_url?: string
  }): Promise<FounderAnalysisResult> {
    try {
      console.log(`🔍 Analyzing founder profile: ${founderInfo.name}`)

      // Step 1: Scrape LinkedIn profile
      let linkedinData: any = null
      if (founderInfo.linkedin_url) {
        linkedinData = await this.scrapeLinkedInProfile(founderInfo.linkedin_url)
      }

      // Step 2: Scrape Twitter profile
      let twitterData: any = null
      if (founderInfo.twitter_url) {
        twitterData = await this.scrapeTwitterProfile(founderInfo.twitter_url)
      }

      // Step 3: Analyze GitHub profile (if available)
      let githubData: any = null
      if (founderInfo.github_url) {
        githubData = await this.analyzeGitHubProfile(founderInfo.github_url)
      }

      // Step 4: Combine and analyze all data
      const profile = this.combineProfileData(founderInfo, linkedinData, twitterData, githubData)
      const analysis = this.performFounderAnalysis(profile)

      return {
        profile,
        analysis,
        strengths: this.identifyStrengths(profile, analysis),
        weaknesses: this.identifyWeaknesses(profile, analysis),
        red_flags: this.identifyRedFlags(profile, analysis),
        opportunities: this.identifyOpportunities(profile, analysis),
        recommendations: this.generateRecommendations(profile, analysis),
        risk_assessment: this.assessRisks(profile, analysis),
        investment_readiness: this.assessInvestmentReadiness(profile, analysis),
        summary: this.createSummary(profile, analysis)
      }
    } catch (error) {
      console.error('Error in founder profile analysis:', error)
      throw new Error(`Failed to analyze founder profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Scrape LinkedIn profile using Bright Data
   */
  private async scrapeLinkedInProfile(linkedinUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        input: [{ url: linkedinUrl }]
      })

      const options = {
        hostname: "api.brightdata.com",
        path: `/datasets/v3/scrape?dataset_id=${this.linkedinDatasetId}&notify=false&include_errors=true`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.brightDataApiKey}`,
          "Content-Type": "application/json",
        },
      }

      const req = https.request(options, (res) => {
        let responseData = ""

        res.on("data", (chunk) => {
          responseData += chunk
        })

        res.on("end", async () => {
          try {
            const result = JSON.parse(responseData)
            console.log('✅ LinkedIn scraping request submitted')
            
            // Check if we got a snapshot ID (async response)
            if (result.snapshot_id) {
              console.log(`📊 Snapshot ID: ${result.snapshot_id}`)
              console.log('⏳ Bright Data scraping is asynchronous - this will take time')
              
              // For now, return empty data since we can't wait for async completion
              // In production, you'd implement polling or webhooks
              resolve({
                message: 'Scraping in progress',
                snapshot_id: result.snapshot_id,
                data: [] // Empty data for now
              })
            } else {
              // Direct response (unlikely for LinkedIn scraping)
              console.log('✅ LinkedIn profile scraped successfully')
              resolve(result)
            }
          } catch (error) {
            console.error('❌ Error parsing LinkedIn response:', error)
            reject(error)
          }
        })
      })

      req.on("error", (error) => {
        console.error('❌ LinkedIn scraping error:', error)
        reject(error)
      })

      req.write(data)
      req.end()
    })
  }

  /**
   * Scrape Twitter profile using Bright Data
   */
  private async scrapeTwitterProfile(twitterUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        input: [{ url: twitterUrl }]
      })

      const options = {
        hostname: "api.brightdata.com",
        path: `/datasets/v3/scrape?dataset_id=${this.twitterDatasetId}&notify=false&include_errors=true`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.brightDataApiKey}`,
          "Content-Type": "application/json",
        },
      }

      const req = https.request(options, (res) => {
        let responseData = ""

        res.on("data", (chunk) => {
          responseData += chunk
        })

        res.on("end", () => {
          try {
            const result = JSON.parse(responseData)
            console.log('✅ Twitter profile scraped successfully')
            resolve(result)
          } catch (error) {
            console.error('❌ Error parsing Twitter response:', error)
            reject(error)
          }
        })
      })

      req.on("error", (error) => {
        console.error('❌ Twitter scraping error:', error)
        reject(error)
      })

      req.write(data)
      req.end()
    })
  }

  /**
   * Analyze GitHub profile using GitHub API
   */
  private async analyzeGitHubProfile(githubUrl: string): Promise<any> {
    // Extract username from GitHub URL
    const username = githubUrl.split('/').pop()
    if (!username) {
      throw new Error('Invalid GitHub URL')
    }

    try {
      // Use GitHub API to get user data
      const response = await fetch(`https://api.github.com/users/${username}`)
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const userData = await response.json()
      console.log('✅ GitHub profile analyzed successfully')
      return userData
    } catch (error) {
      console.error('❌ GitHub analysis error:', error)
      return null
    }
  }

  /**
   * Combine data from all sources into a unified profile
   */
  private combineProfileData(
    founderInfo: any,
    linkedinData: any,
    twitterData: any,
    githubData: any
  ): FounderProfile {
    // Extract LinkedIn data - handle different possible response structures
    let linkedinProfile = {}
    
    if (linkedinData?.data?.[0]) {
      linkedinProfile = linkedinData.data[0]
    } else if (linkedinData?.results?.[0]) {
      linkedinProfile = linkedinData.results[0]
    } else if (linkedinData?.data) {
      linkedinProfile = linkedinData.data
    } else if (linkedinData) {
      linkedinProfile = linkedinData
    }
    
    console.log('Extracted LinkedIn profile:', JSON.stringify(linkedinProfile, null, 2))
    
    return {
      name: linkedinProfile.name || founderInfo.name,
      linkedin_url: founderInfo.linkedin_url,
      twitter_url: founderInfo.twitter_url,
      github_url: founderInfo.github_url,
      headline: linkedinProfile.position || linkedinProfile.headline || linkedinProfile.title || '',
      summary: linkedinProfile.summary || linkedinProfile.about || '',
      location: linkedinProfile.city || linkedinProfile.location || '',
      experience: this.extractExperience(linkedinProfile),
      education: this.extractEducation(linkedinProfile),
      skills: this.extractSkills(linkedinProfile),
      certifications: this.extractCertifications(linkedinProfile),
      languages: this.extractLanguages(linkedinProfile),
      interests: this.extractInterests(linkedinProfile),
      connections: linkedinProfile.connections || linkedinProfile.connections_count || 0,
      followers: twitterData?.followers_count || twitterData?.followers || 0,
      posts: this.extractPosts(linkedinProfile, twitterData),
      achievements: this.extractAchievements(linkedinProfile),
      publications: this.extractPublications(linkedinProfile),
      speaking_engagements: this.extractSpeakingEngagements(linkedinProfile),
      awards: this.extractAwards(linkedinProfile),
      volunteer_experience: this.extractVolunteerExperience(linkedinProfile),
      recommendations: this.extractRecommendations(linkedinProfile)
    }
  }

  /**
   * Extract work experience from LinkedIn data
   */
  private extractExperience(linkedinData: any): Array<{
    title: string
    company: string
    duration: string
    description?: string
    location?: string
  }> {
    // Bright Data returns experience array directly
    const experienceData = linkedinData?.experience || []
    
    if (!Array.isArray(experienceData)) return []
    
    return experienceData.map((exp: any) => ({
      title: exp.title || '',
      company: exp.company || '',
      duration: exp.duration || `${exp.start_date || ''} - ${exp.end_date || ''}`,
      description: exp.description || exp.description_html || '',
      location: exp.location || ''
    }))
  }

  /**
   * Extract education from LinkedIn data
   */
  private extractEducation(linkedinData: any): Array<{
    degree: string
    school: string
    year?: string
    field?: string
  }> {
    const educationData = linkedinData?.education || []
    
    if (!Array.isArray(educationData)) return []
    
    return educationData.map((edu: any) => ({
      degree: edu.degree || '',
      school: edu.title || edu.school || '',
      year: edu.start_year || edu.year || '',
      field: edu.field || ''
    }))
  }

  /**
   * Extract skills from LinkedIn data
   */
  private extractSkills(linkedinData: any): string[] {
    // Try different possible field names for skills
    const skillsData = linkedinData?.skills || 
                      linkedinData?.endorsements || 
                      linkedinData?.competencies || 
                      linkedinData?.expertise || 
                      []
    
    if (!Array.isArray(skillsData)) return []
    
    return skillsData.map((skill: any) => 
      typeof skill === 'string' ? skill : (skill.name || skill.skill || skill.title || '')
    ).filter(Boolean)
  }

  /**
   * Extract certifications from LinkedIn data
   */
  private extractCertifications(linkedinData: any): string[] {
    if (!linkedinData?.certifications) return []
    
    return linkedinData.certifications.map((cert: any) => 
      typeof cert === 'string' ? cert : cert.name || ''
    ).filter(Boolean)
  }

  /**
   * Extract languages from LinkedIn data
   */
  private extractLanguages(linkedinData: any): string[] {
    const languagesData = linkedinData?.languages || []
    
    if (!Array.isArray(languagesData)) return []
    
    return languagesData.map((lang: any) => 
      typeof lang === 'string' ? lang : (lang.title || lang.language || '')
    ).filter(Boolean)
  }

  /**
   * Extract interests from LinkedIn data
   */
  private extractInterests(linkedinData: any): string[] {
    if (!linkedinData?.interests) return []
    
    return linkedinData.interests.map((interest: any) => 
      typeof interest === 'string' ? interest : interest.name || ''
    ).filter(Boolean)
  }

  /**
   * Extract posts from LinkedIn and Twitter data
   */
  private extractPosts(linkedinData: any, twitterData: any): Array<{
    content: string
    date: string
    engagement?: number
  }> {
    const posts: Array<{ content: string; date: string; engagement?: number }> = []
    
    // LinkedIn posts
    if (linkedinData?.posts) {
      linkedinData.posts.forEach((post: any) => {
        posts.push({
          content: post.content || '',
          date: post.date || '',
          engagement: post.engagement || 0
        })
      })
    }
    
    // Twitter posts
    if (twitterData?.tweets) {
      twitterData.tweets.forEach((tweet: any) => {
        posts.push({
          content: tweet.text || '',
          date: tweet.created_at || '',
          engagement: tweet.public_metrics?.like_count || 0
        })
      })
    }
    
    return posts
  }

  /**
   * Extract achievements from LinkedIn data
   */
  private extractAchievements(linkedinData: any): string[] {
    if (!linkedinData?.achievements) return []
    
    return linkedinData.achievements.map((achievement: any) => 
      typeof achievement === 'string' ? achievement : achievement.title || ''
    ).filter(Boolean)
  }

  /**
   * Extract publications from LinkedIn data
   */
  private extractPublications(linkedinData: any): string[] {
    if (!linkedinData?.publications) return []
    
    return linkedinData.publications.map((pub: any) => 
      typeof pub === 'string' ? pub : pub.title || ''
    ).filter(Boolean)
  }

  /**
   * Extract speaking engagements from LinkedIn data
   */
  private extractSpeakingEngagements(linkedinData: any): string[] {
    if (!linkedinData?.speaking_engagements) return []
    
    return linkedinData.speaking_engagements.map((speaking: any) => 
      typeof speaking === 'string' ? speaking : speaking.title || ''
    ).filter(Boolean)
  }

  /**
   * Extract awards from LinkedIn data
   */
  private extractAwards(linkedinData: any): string[] {
    const awardsData = linkedinData?.honors_and_awards || linkedinData?.awards || []
    
    if (!Array.isArray(awardsData)) return []
    
    return awardsData.map((award: any) => 
      typeof award === 'string' ? award : (award.title || award.name || '')
    ).filter(Boolean)
  }

  /**
   * Extract volunteer experience from LinkedIn data
   */
  private extractVolunteerExperience(linkedinData: any): Array<{
    title: string
    organization: string
    duration: string
    description?: string
  }> {
    const volunteerData = linkedinData?.volunteer_experience || []
    
    if (!Array.isArray(volunteerData)) return []
    
    return volunteerData.map((vol: any) => ({
      title: vol.title || '',
      organization: vol.subtitle || vol.organization || '',
      duration: vol.duration || vol.duration_short || '',
      description: vol.info || vol.description || ''
    }))
  }

  /**
   * Extract recommendations from LinkedIn data
   */
  private extractRecommendations(linkedinData: any): Array<{
    text: string
    author: string
    relationship: string
  }> {
    if (!linkedinData?.recommendations) return []
    
    return linkedinData.recommendations.map((rec: any) => ({
      text: rec.text || '',
      author: rec.author || '',
      relationship: rec.relationship || ''
    }))
  }

  /**
   * Perform comprehensive founder analysis
   */
  private performFounderAnalysis(profile: FounderProfile): any {
    // Check if we have meaningful data
    const hasData = profile.experience.length > 0 || 
                   profile.skills.length > 0 || 
                   profile.education.length > 0 ||
                   profile.headline ||
                   profile.summary

    if (!hasData) {
      console.log('⚠️ No meaningful profile data found - using fallback analysis')
      return {
        experience_score: 0,
        credibility_score: 0,
        network_strength: 10, // Small score for having LinkedIn URL
        leadership_score: 0,
        technical_expertise: 0,
        business_acumen: 0,
        innovation_score: 0,
        communication_score: 10, // Small score for having LinkedIn URL
        overall_founder_score: 2
      }
    }

    return {
      experience_score: this.calculateExperienceScore(profile),
      credibility_score: this.calculateCredibilityScore(profile),
      network_strength: this.calculateNetworkStrength(profile),
      leadership_score: this.calculateLeadershipScore(profile),
      technical_expertise: this.calculateTechnicalExpertise(profile),
      business_acumen: this.calculateBusinessAcumen(profile),
      innovation_score: this.calculateInnovationScore(profile),
      communication_score: this.calculateCommunicationScore(profile),
      overall_founder_score: 0 // Will be calculated after all individual scores
    }
  }

  /**
   * Calculate experience score based on work history
   */
  private calculateExperienceScore(profile: FounderProfile): number {
    let score = 0
    
    // Years of experience (max 40 points)
    const totalYears = this.calculateTotalYears(profile.experience)
    score += Math.min(totalYears * 4, 40)
    
    // Number of companies (max 20 points)
    score += Math.min(profile.experience.length * 5, 20)
    
    // Leadership roles (max 20 points)
    const leadershipRoles = profile.experience.filter(exp => 
      exp.title.toLowerCase().includes('lead') ||
      exp.title.toLowerCase().includes('manager') ||
      exp.title.toLowerCase().includes('director') ||
      exp.title.toLowerCase().includes('vp') ||
      exp.title.toLowerCase().includes('ceo') ||
      exp.title.toLowerCase().includes('cto') ||
      exp.title.toLowerCase().includes('founder')
    ).length
    score += Math.min(leadershipRoles * 10, 20)
    
    // Notable companies (max 20 points)
    const notableCompanies = ['google', 'microsoft', 'apple', 'amazon', 'facebook', 'meta', 'netflix', 'uber', 'airbnb']
    const hasNotableCompany = profile.experience.some(exp => 
      notableCompanies.some(notable => exp.company.toLowerCase().includes(notable))
    )
    if (hasNotableCompany) score += 20
    
    return Math.min(score, 100)
  }

  /**
   * Calculate credibility score based on achievements and recommendations
   */
  private calculateCredibilityScore(profile: FounderProfile): number {
    let score = 0
    
    // Achievements (max 30 points)
    score += Math.min(profile.achievements.length * 5, 30)
    
    // Publications (max 20 points)
    score += Math.min(profile.publications.length * 5, 20)
    
    // Speaking engagements (max 20 points)
    score += Math.min(profile.speaking_engagements.length * 5, 20)
    
    // Awards (max 15 points)
    score += Math.min(profile.awards.length * 5, 15)
    
    // Recommendations (max 15 points)
    score += Math.min(profile.recommendations.length * 3, 15)
    
    return Math.min(score, 100)
  }

  /**
   * Calculate network strength based on connections and social presence
   */
  private calculateNetworkStrength(profile: FounderProfile): number {
    let score = 0
    
    // LinkedIn connections (max 40 points)
    if (profile.connections) {
      if (profile.connections > 10000) score += 40
      else if (profile.connections > 5000) score += 30
      else if (profile.connections > 1000) score += 20
      else if (profile.connections > 500) score += 10
    }
    
    // Twitter followers (max 30 points)
    if (profile.followers) {
      if (profile.followers > 100000) score += 30
      else if (profile.followers > 10000) score += 20
      else if (profile.followers > 1000) score += 10
    }
    
    // Social media presence (max 30 points)
    let socialPresence = 0
    if (profile.linkedin_url) socialPresence += 10
    if (profile.twitter_url) socialPresence += 10
    if (profile.github_url) socialPresence += 10
    score += socialPresence
    
    return Math.min(score, 100)
  }

  /**
   * Calculate leadership score based on leadership roles and team management
   */
  private calculateLeadershipScore(profile: FounderProfile): number {
    let score = 0
    
    // Leadership roles (max 50 points)
    const leadershipRoles = profile.experience.filter(exp => 
      exp.title.toLowerCase().includes('lead') ||
      exp.title.toLowerCase().includes('manager') ||
      exp.title.toLowerCase().includes('director') ||
      exp.title.toLowerCase().includes('vp') ||
      exp.title.toLowerCase().includes('ceo') ||
      exp.title.toLowerCase().includes('cto') ||
      exp.title.toLowerCase().includes('founder')
    )
    score += Math.min(leadershipRoles.length * 15, 50)
    
    // Team size indicators (max 30 points)
    const teamSizeKeywords = ['team', 'department', 'division', 'group']
    const hasTeamManagement = profile.experience.some(exp => 
      teamSizeKeywords.some(keyword => exp.description?.toLowerCase().includes(keyword))
    )
    if (hasTeamManagement) score += 30
    
    // Management skills (max 20 points)
    const managementSkills = ['leadership', 'management', 'team building', 'mentoring', 'coaching']
    const hasManagementSkills = profile.skills.some(skill => 
      managementSkills.some(ms => skill.toLowerCase().includes(ms))
    )
    if (hasManagementSkills) score += 20
    
    return Math.min(score, 100)
  }

  /**
   * Calculate technical expertise score
   */
  private calculateTechnicalExpertise(profile: FounderProfile): number {
    let score = 0
    
    // Technical skills (max 60 points)
    const technicalSkills = [
      'programming', 'software', 'development', 'engineering', 'coding',
      'python', 'javascript', 'java', 'c++', 'react', 'node', 'aws', 'azure',
      'machine learning', 'ai', 'data science', 'blockchain', 'mobile'
    ]
    
    const technicalSkillCount = profile.skills.filter(skill => 
      technicalSkills.some(ts => skill.toLowerCase().includes(ts))
    ).length
    
    score += Math.min(technicalSkillCount * 10, 60)
    
    // Technical roles (max 40 points)
    const technicalRoles = profile.experience.filter(exp => 
      exp.title.toLowerCase().includes('engineer') ||
      exp.title.toLowerCase().includes('developer') ||
      exp.title.toLowerCase().includes('architect') ||
      exp.title.toLowerCase().includes('scientist') ||
      exp.title.toLowerCase().includes('cto')
    )
    score += Math.min(technicalRoles.length * 10, 40)
    
    return Math.min(score, 100)
  }

  /**
   * Calculate business acumen score
   */
  private calculateBusinessAcumen(profile: FounderProfile): number {
    let score = 0
    
    // Business skills (max 50 points)
    const businessSkills = [
      'business', 'strategy', 'marketing', 'sales', 'finance', 'operations',
      'product management', 'growth', 'analytics', 'revenue', 'pricing'
    ]
    
    const businessSkillCount = profile.skills.filter(skill => 
      businessSkills.some(bs => skill.toLowerCase().includes(bs))
    ).length
    
    score += Math.min(businessSkillCount * 10, 50)
    
    // Business roles (max 30 points)
    const businessRoles = profile.experience.filter(exp => 
      exp.title.toLowerCase().includes('manager') ||
      exp.title.toLowerCase().includes('director') ||
      exp.title.toLowerCase().includes('vp') ||
      exp.title.toLowerCase().includes('ceo') ||
      exp.title.toLowerCase().includes('founder') ||
      exp.title.toLowerCase().includes('business')
    )
    score += Math.min(businessRoles.length * 8, 30)
    
    // Education in business (max 20 points)
    const businessEducation = profile.education.filter(edu => 
      edu.degree.toLowerCase().includes('mba') ||
      edu.degree.toLowerCase().includes('business') ||
      edu.field?.toLowerCase().includes('business')
    )
    score += Math.min(businessEducation.length * 10, 20)
    
    return Math.min(score, 100)
  }

  /**
   * Calculate innovation score based on patents, publications, and innovative projects
   */
  private calculateInnovationScore(profile: FounderProfile): number {
    let score = 0
    
    // Publications (max 30 points)
    score += Math.min(profile.publications.length * 8, 30)
    
    // Patents (max 25 points)
    const patents = profile.achievements.filter(achievement => 
      achievement.toLowerCase().includes('patent')
    )
    score += Math.min(patents.length * 12, 25)
    
    // Innovation keywords (max 25 points)
    const innovationKeywords = ['innovation', 'invention', 'disruptive', 'breakthrough', 'novel', 'cutting-edge']
    const hasInnovationKeywords = profile.experience.some(exp => 
      innovationKeywords.some(keyword => exp.description?.toLowerCase().includes(keyword))
    )
    if (hasInnovationKeywords) score += 25
    
    // Startup experience (max 20 points)
    const startupExperience = profile.experience.filter(exp => 
      exp.title.toLowerCase().includes('founder') ||
      exp.title.toLowerCase().includes('startup') ||
      exp.company.toLowerCase().includes('startup')
    )
    score += Math.min(startupExperience.length * 10, 20)
    
    return Math.min(score, 100)
  }

  /**
   * Calculate communication score based on speaking engagements and social presence
   */
  private calculateCommunicationScore(profile: FounderProfile): number {
    let score = 0
    
    // Speaking engagements (max 40 points)
    score += Math.min(profile.speaking_engagements.length * 10, 40)
    
    // Social media presence (max 30 points)
    let socialPresence = 0
    if (profile.linkedin_url) socialPresence += 10
    if (profile.twitter_url) socialPresence += 10
    if (profile.github_url) socialPresence += 10
    score += socialPresence
    
    // Communication skills (max 30 points)
    const communicationSkills = [
      'communication', 'presentation', 'public speaking', 'writing',
      'storytelling', 'influence', 'persuasion'
    ]
    
    const communicationSkillCount = profile.skills.filter(skill => 
      communicationSkills.some(cs => skill.toLowerCase().includes(cs))
    ).length
    
    score += Math.min(communicationSkillCount * 10, 30)
    
    return Math.min(score, 100)
  }

  /**
   * Calculate total years of experience
   */
  private calculateTotalYears(experience: Array<{ duration: string }>): number {
    let totalYears = 0
    
    experience.forEach(exp => {
      const duration = exp.duration.toLowerCase()
      
      // Extract years from duration strings like "2 years", "1 year", "6 months"
      const yearMatch = duration.match(/(\d+)\s*year/)
      const monthMatch = duration.match(/(\d+)\s*month/)
      
      if (yearMatch) {
        totalYears += parseInt(yearMatch[1])
      } else if (monthMatch) {
        totalYears += parseInt(monthMatch[1]) / 12
      }
    })
    
    return Math.round(totalYears)
  }

  /**
   * Identify founder strengths
   */
  private identifyStrengths(profile: FounderProfile, analysis: any): string[] {
    const strengths: string[] = []
    
    if (analysis.experience_score > 80) {
      strengths.push('Strong professional experience with notable companies')
    }
    
    if (analysis.leadership_score > 80) {
      strengths.push('Proven leadership and team management experience')
    }
    
    if (analysis.technical_expertise > 80) {
      strengths.push('Strong technical background and expertise')
    }
    
    if (analysis.business_acumen > 80) {
      strengths.push('Solid business acumen and strategic thinking')
    }
    
    if (analysis.network_strength > 80) {
      strengths.push('Strong professional network and social presence')
    }
    
    if (profile.achievements.length > 5) {
      strengths.push('Track record of significant achievements')
    }
    
    if (profile.publications.length > 0) {
      strengths.push('Thought leadership through publications')
    }
    
    return strengths
  }

  /**
   * Identify founder weaknesses
   */
  private identifyWeaknesses(profile: FounderProfile, analysis: any): string[] {
    const weaknesses: string[] = []
    
    if (analysis.experience_score < 50) {
      weaknesses.push('Limited professional experience')
    }
    
    if (analysis.leadership_score < 50) {
      weaknesses.push('Limited leadership experience')
    }
    
    if (analysis.technical_expertise < 50) {
      weaknesses.push('Limited technical expertise')
    }
    
    if (analysis.business_acumen < 50) {
      weaknesses.push('Limited business experience')
    }
    
    if (analysis.network_strength < 50) {
      weaknesses.push('Limited professional network')
    }
    
    if (profile.experience.length < 3) {
      weaknesses.push('Limited work history')
    }
    
    if (profile.education.length === 0) {
      weaknesses.push('No formal education information available')
    }
    
    return weaknesses
  }

  /**
   * Identify red flags
   */
  private identifyRedFlags(profile: FounderProfile, analysis: any): string[] {
    const redFlags: string[] = []
    
    if (analysis.experience_score < 30) {
      redFlags.push('Very limited professional experience')
    }
    
    if (analysis.credibility_score < 30) {
      redFlags.push('Low credibility indicators')
    }
    
    if (profile.experience.length === 0) {
      redFlags.push('No work experience information')
    }
    
    if (profile.skills.length < 5) {
      redFlags.push('Very limited skill set')
    }
    
    // Check for gaps in employment
    const hasEmploymentGaps = this.checkEmploymentGaps(profile.experience)
    if (hasEmploymentGaps) {
      redFlags.push('Potential employment gaps')
    }
    
    return redFlags
  }

  /**
   * Check for employment gaps
   */
  private checkEmploymentGaps(experience: Array<{ duration: string }>): boolean {
    // This is a simplified check - in production, you'd parse dates more carefully
    return experience.some(exp => 
      exp.duration.toLowerCase().includes('gap') ||
      exp.duration.toLowerCase().includes('unemployed')
    )
  }

  /**
   * Identify opportunities
   */
  private identifyOpportunities(profile: FounderProfile, analysis: any): string[] {
    const opportunities: string[] = []
    
    if (analysis.technical_expertise > 70 && analysis.business_acumen < 50) {
      opportunities.push('Strong technical background - consider business development')
    }
    
    if (analysis.business_acumen > 70 && analysis.technical_expertise < 50) {
      opportunities.push('Strong business skills - consider technical upskilling')
    }
    
    if (analysis.network_strength < 50) {
      opportunities.push('Opportunity to expand professional network')
    }
    
    if (profile.publications.length === 0 && analysis.technical_expertise > 70) {
      opportunities.push('Consider publishing technical content for thought leadership')
    }
    
    if (profile.speaking_engagements.length === 0) {
      opportunities.push('Consider speaking at industry events')
    }
    
    return opportunities
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(profile: FounderProfile, analysis: any): string[] {
    const recommendations: string[] = []
    
    if (analysis.experience_score < 70) {
      recommendations.push('Gain more diverse professional experience')
    }
    
    if (analysis.leadership_score < 70) {
      recommendations.push('Seek leadership opportunities and team management roles')
    }
    
    if (analysis.network_strength < 70) {
      recommendations.push('Actively build professional network through industry events')
    }
    
    if (analysis.communication_score < 70) {
      recommendations.push('Improve communication skills through public speaking')
    }
    
    if (profile.skills.length < 10) {
      recommendations.push('Develop additional skills relevant to target industry')
    }
    
    return recommendations
  }

  /**
   * Assess risks
   */
  private assessRisks(profile: FounderProfile, analysis: any): any {
    const lowRisk: string[] = []
    const mediumRisk: string[] = []
    const highRisk: string[] = []
    
    // Low risk factors
    if (analysis.experience_score > 80) lowRisk.push('Strong professional experience')
    if (analysis.credibility_score > 80) lowRisk.push('High credibility indicators')
    if (profile.achievements.length > 5) lowRisk.push('Track record of achievements')
    
    // Medium risk factors
    if (analysis.experience_score < 70 && analysis.experience_score > 50) {
      mediumRisk.push('Moderate experience level')
    }
    if (analysis.network_strength < 70 && analysis.network_strength > 50) {
      mediumRisk.push('Moderate network strength')
    }
    
    // High risk factors
    if (analysis.experience_score < 50) highRisk.push('Limited experience')
    if (analysis.credibility_score < 50) highRisk.push('Low credibility')
    if (profile.experience.length < 2) highRisk.push('Very limited work history')
    
    return { lowRisk, mediumRisk, highRisk }
  }

  /**
   * Assess investment readiness
   */
  private assessInvestmentReadiness(profile: FounderProfile, analysis: any): any {
    let stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B+' | 'Not Ready'
    let score = 0
    const factors: string[] = []
    
    // Calculate readiness score
    score += analysis.experience_score * 0.25
    score += analysis.leadership_score * 0.25
    score += analysis.business_acumen * 0.25
    score += analysis.network_strength * 0.25
    
    // Determine stage based on score
    if (score >= 85) {
      stage = 'Series B+'
      factors.push('Ready for advanced funding rounds')
    } else if (score >= 75) {
      stage = 'Series A'
      factors.push('Ready for Series A funding')
    } else if (score >= 65) {
      stage = 'Seed'
      factors.push('Ready for seed funding')
    } else if (score >= 50) {
      stage = 'Pre-Seed'
      factors.push('Ready for pre-seed funding')
    } else {
      stage = 'Not Ready'
      factors.push('Needs more experience before seeking funding')
    }
    
    return { stage, score: Math.round(score), factors }
  }

  /**
   * Create summary
   */
  private createSummary(profile: FounderProfile, analysis: any): any {
    // Calculate overall founder score
    const overallScore = Math.round(
      (analysis.experience_score * 0.2) +
      (analysis.credibility_score * 0.15) +
      (analysis.network_strength * 0.15) +
      (analysis.leadership_score * 0.2) +
      (analysis.technical_expertise * 0.1) +
      (analysis.business_acumen * 0.1) +
      (analysis.innovation_score * 0.05) +
      (analysis.communication_score * 0.05)
    )
    
    // Update the analysis with overall score
    analysis.overall_founder_score = overallScore
    
    // Determine founder grade
    let founderGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D'
    if (overallScore >= 95) founderGrade = 'A+'
    else if (overallScore >= 90) founderGrade = 'A'
    else if (overallScore >= 85) founderGrade = 'A-'
    else if (overallScore >= 80) founderGrade = 'B+'
    else if (overallScore >= 75) founderGrade = 'B'
    else if (overallScore >= 70) founderGrade = 'B-'
    else if (overallScore >= 65) founderGrade = 'C+'
    else if (overallScore >= 60) founderGrade = 'C'
    else if (overallScore >= 55) founderGrade = 'C-'
    else founderGrade = 'D'
    
    // Determine recommendation
    let recommendation: 'Strong Hire' | 'Hire' | 'Consider' | 'Pass' | 'Strong Pass'
    if (overallScore >= 85) recommendation = 'Strong Hire'
    else if (overallScore >= 75) recommendation = 'Hire'
    else if (overallScore >= 65) recommendation = 'Consider'
    else if (overallScore >= 50) recommendation = 'Pass'
    else recommendation = 'Strong Pass'
    
    // Generate key insights
    const keyInsights: string[] = []
    
    if (analysis.experience_score > 80) {
      keyInsights.push('Exceptional professional experience')
    }
    
    if (analysis.leadership_score > 80) {
      keyInsights.push('Strong leadership capabilities')
    }
    
    if (analysis.technical_expertise > 80) {
      keyInsights.push('Deep technical expertise')
    }
    
    if (analysis.business_acumen > 80) {
      keyInsights.push('Strong business acumen')
    }
    
    if (profile.achievements.length > 5) {
      keyInsights.push('Proven track record of achievements')
    }
    
    // Calculate confidence score
    const confidenceScore = Math.round(
      (profile.experience.length > 0 ? 20 : 0) +
      (profile.skills.length > 5 ? 20 : 0) +
      (profile.education.length > 0 ? 20 : 0) +
      (profile.achievements.length > 0 ? 20 : 0) +
      (profile.recommendations.length > 0 ? 20 : 0)
    )
    
    return {
      key_insights: keyInsights,
      founder_grade: founderGrade,
      recommendation,
      confidence_score: confidenceScore
    }
  }
}