import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'
import { Octokit } from '@octokit/rest'
import { GitHubAnalysisService } from './lib/services/github-analysis.service.js'
import { RepoRadarAnalysisService } from './lib/services/reporadar-analysis.service.js'

// MCP Server for GitHub Analysis (RepoRadar MCP Server 1)
class GitHubAnalysisMCPServer {
  private server: Server
  private githubService: GitHubAnalysisService | null = null
  private reporadarService: RepoRadarAnalysisService | null = null

  constructor() {
    this.server = new Server(
      {
        name: 'reporadar-github-analysis',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.setupToolHandlers()
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_author_profile',
            description: 'Analyze a GitHub author\'s complete profile for technical due diligence. Provides comprehensive insights about the developer\'s skills, activity patterns, risk assessment, and recommendations.',
            inputSchema: {
              type: 'object',
              properties: {
                github_url: {
                  type: 'string',
                  description: 'GitHub repository URL (e.g., "https://github.com/user/repo") - will extract the author from the URL',
                },
                github_token: {
                  type: 'string',
                  description: 'GitHub Personal Access Token for API access',
                },
              },
              required: ['github_url', 'github_token'],
            },
          },
          {
            name: 'analyze_repository',
            description: 'Perform detailed analysis of a specific GitHub repository with static analysis. Includes code metrics, dependencies, architecture patterns, quality assessment, and security analysis.',
            inputSchema: {
              type: 'object',
              properties: {
                github_url: {
                  type: 'string',
                  description: 'GitHub repository URL (e.g., "https://github.com/user/repo")',
                },
                github_token: {
                  type: 'string',
                  description: 'GitHub Personal Access Token for API access',
                },
              },
              required: ['github_url', 'github_token'],
            },
          },
          {
            name: 'get_repository_languages',
            description: 'Get detailed language breakdown for a repository using GitHub API',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                github_token: {
                  type: 'string',
                  description: 'GitHub Personal Access Token for API access',
                },
              },
              required: ['owner', 'repo', 'github_token'],
            },
          },
          {
            name: 'get_repository_commits',
            description: 'Get commit history and patterns for a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                github_token: {
                  type: 'string',
                  description: 'GitHub Personal Access Token for API access',
                },
                since: {
                  type: 'string',
                  description: 'Only commits after this date (ISO 8601 format)',
                },
              },
              required: ['owner', 'repo', 'github_token'],
            },
          },
          {
            name: 'get_repository_issues',
            description: 'Get issues and pull requests for a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                github_token: {
                  type: 'string',
                  description: 'GitHub Personal Access Token for API access',
                },
                state: {
                  type: 'string',
                  description: 'Issue state: open, closed, or all',
                  enum: ['open', 'closed', 'all'],
                },
              },
              required: ['owner', 'repo', 'github_token'],
            },
          },
          {
            name: 'get_user_profile',
            description: 'Get basic GitHub user profile information',
            inputSchema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'GitHub username',
                },
                github_token: {
                  type: 'string',
                  description: 'GitHub Personal Access Token for API access',
                },
              },
              required: ['username', 'github_token'],
            },
          },
        ] as Tool[],
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'analyze_author_profile':
            return await this.handleAnalyzeAuthorProfile(args as any)

          case 'analyze_repository':
            return await this.handleAnalyzeRepository(args as any)

          case 'get_repository_languages':
            return await this.handleGetRepositoryLanguages(args as any)

          case 'get_repository_commits':
            return await this.handleGetRepositoryCommits(args as any)

          case 'get_repository_issues':
            return await this.handleGetRepositoryIssues(args as any)

          case 'get_user_profile':
            return await this.handleGetUserProfile(args as any)

          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        }
      }
    })
  }

  private async handleAnalyzeAuthorProfile(args: {
    github_url: string
    github_token: string
  }) {
    const { github_url, github_token } = args

    // Initialize services
    if (!this.reporadarService) {
      this.reporadarService = new RepoRadarAnalysisService(github_token)
    }

    // Perform analysis
    const analysis = await this.reporadarService.analyzeAuthorProfile(github_url)

    return {
      content: [
        {
          type: 'text',
          text: `# GitHub Author Profile Analysis: ${analysis.author.name} (@${analysis.author.username})

## Author Information
- **Name**: ${analysis.author.name}
- **Username**: @${analysis.author.username}
- **Bio**: ${analysis.author.bio || 'No bio available'}
- **Location**: ${analysis.author.location || 'Not specified'}
- **Company**: ${analysis.author.company || 'Not specified'}
- **Followers**: ${analysis.author.followers}
- **Following**: ${analysis.author.following}
- **Public Repositories**: ${analysis.author.public_repos}
- **Joined GitHub**: ${new Date(analysis.author.created_at).toLocaleDateString()}

## Repository Portfolio
- **Total Repositories**: ${analysis.repositories.total}
- **Total Lines of Code**: ${analysis.repositories.total_lines.toLocaleString()}
- **Total Commits**: ${analysis.repositories.total_commits.toLocaleString()}
- **Average Stars per Repo**: ${analysis.repositories.avg_stars}
- **Average Forks per Repo**: ${analysis.repositories.avg_forks}

## Skills & Expertise
- **Primary Languages**: ${analysis.skills.primary_languages.join(', ')}
- **Frameworks**: ${analysis.skills.frameworks.join(', ')}
- **Tools**: ${analysis.skills.tools.join(', ')}
- **Expertise Level**: ${analysis.skills.expertise_level}

## Activity Analysis
- **Innovation Score**: ${analysis.activity.innovation_score}/100 (based on commit message patterns)
- **Consistency Score**: ${analysis.activity.consistency_score}/100 (based on commit frequency patterns)
- **Community Engagement**: ${analysis.activity.community_engagement}/100
- **Code Quality Trend**: ${analysis.activity.code_quality_trend}

## Risk Assessment
- **Overall Risk Level**: ${analysis.risk_assessment.overall_risk}
- **Confidence Score**: ${analysis.summary.confidence_score}%

### Concerns
${analysis.risk_assessment.concerns.map(concern => `- ${concern}`).join('\n')}

### Strengths
${analysis.risk_assessment.strengths.map(strength => `- ${strength}`).join('\n')}

## Key Insights
${analysis.summary.key_insights.map(insight => `- ${insight}`).join('\n')}

## Recommendations
${analysis.summary.recommendations.map(rec => `- ${rec}`).join('\n')}

---
*Analysis completed at ${new Date().toISOString()}*`,
        },
      ],
    }
  }

  private async handleAnalyzeRepository(args: {
    github_url: string
    github_token: string
  }) {
    const { github_url, github_token } = args

    // Initialize services
    if (!this.reporadarService) {
      this.reporadarService = new RepoRadarAnalysisService(github_token)
    }

    // Perform analysis
    const analysis = await this.reporadarService.analyzeRepository(github_url)

    return {
      content: [
        {
          type: 'text',
          text: `# Repository Analysis: ${analysis.repository.name}

## Repository Information
- **Name**: ${analysis.repository.name}
- **Full Name**: ${analysis.repository.full_name}
- **Description**: ${analysis.repository.description || 'No description'}
- **Primary Language**: ${analysis.repository.language}
- **Stars**: ${analysis.repository.stars}
- **Forks**: ${analysis.repository.forks}
- **Watchers**: ${analysis.repository.watchers}
- **Size**: ${analysis.repository.size.toLocaleString()} KB
- **Created**: ${new Date(analysis.repository.created_at).toLocaleDateString()}
- **Last Updated**: ${new Date(analysis.repository.updated_at).toLocaleDateString()}

## Code Metrics
- **Total Lines of Code**: ${analysis.code_metrics.total_lines.toLocaleString()}
- **Total Files**: ${analysis.code_metrics.total_files}
- **Complexity Score**: ${analysis.code_metrics.complexity_score}/100
- **Maintainability Index**: ${Math.round(analysis.code_metrics.maintainability_index)}/100

## Static Analysis Results
- **Bugs**: ${analysis.static_analysis.bugs}
- **Vulnerabilities**: ${analysis.static_analysis.vulnerabilities}
- **Code Smells**: ${analysis.static_analysis.code_smells}
- **Security Hotspots**: ${analysis.static_analysis.security_hotspots}
- **Technical Debt**: ${analysis.static_analysis.technical_debt}
- **Test Coverage**: ${analysis.static_analysis.coverage}%

## Dependencies Analysis
- **Direct Dependencies**: ${analysis.dependencies.direct.length}
- **Security Vulnerabilities**: ${analysis.dependencies.vulnerabilities.length}
- **Outdated Packages**: ${analysis.dependencies.outdated.length}

### Vulnerabilities
${analysis.dependencies.vulnerabilities.map(vuln => `- **${vuln.name}** (${vuln.severity}): ${vuln.description}`).join('\n')}

### Outdated Dependencies
${analysis.dependencies.outdated.map(dep => `- **${dep.name}**: ${dep.current} → ${dep.latest}`).join('\n')}

## Architecture Analysis
- **Detected Patterns**: ${analysis.architecture.patterns.join(', ')}
- **Complexity Level**: ${analysis.architecture.complexity}
- **Scalability Score**: ${analysis.architecture.scalability_score}/100
- **Performance Indicators**: ${analysis.architecture.performance_indicators.join(', ')}

## Quality Assessment
- **Overall Grade**: ${analysis.quality_assessment.overall_grade}
- **Code Quality Score**: ${analysis.quality_assessment.code_quality_score}/100
- **Security Score**: ${analysis.quality_assessment.security_score}/100
- **Maintainability Score**: ${analysis.quality_assessment.maintainability_score}/100
- **Testability Score**: ${analysis.quality_assessment.testability_score}/100

## Risks & Concerns

### Critical Issues
${analysis.risks_and_concerns.critical_issues.map(issue => `- ${issue}`).join('\n')}

### Security Risks
${analysis.risks_and_concerns.security_risks.map(risk => `- ${risk}`).join('\n')}

### Technical Debt
${analysis.risks_and_concerns.technical_debt.map(debt => `- ${debt}`).join('\n')}

### Scalability Concerns
${analysis.risks_and_concerns.scalability_concerns.map(concern => `- ${concern}`).join('\n')}

## Recommendations

### Immediate Actions (Priority: ${analysis.recommendations.priority_level})
${analysis.recommendations.immediate_actions.map(action => `- ${action}`).join('\n')}

### Short-term Improvements
${analysis.recommendations.short_term_improvements.map(improvement => `- ${improvement}`).join('\n')}

### Long-term Considerations
${analysis.recommendations.long_term_considerations.map(consideration => `- ${consideration}`).join('\n')}

---
*Analysis completed at ${new Date().toISOString()}*`,
        },
      ],
    }
  }

  private async handleGetRepositoryLanguages(args: {
    owner: string
    repo: string
    github_token: string
  }) {
    const { owner, repo, github_token } = args

    const octokit = new Octokit({ auth: github_token })
    const { data: languages } = await octokit.repos.listLanguages({ owner, repo })

    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
    const languageBreakdown = Object.entries(languages)
      .map(([lang, bytes]) => ({
        language: lang,
        bytes,
        percentage: ((bytes / totalBytes) * 100).toFixed(1)
      }))
      .sort((a, b) => b.bytes - a.bytes)

    return {
      content: [
        {
          type: 'text',
          text: `# Language Breakdown for ${owner}/${repo}

## Summary
- **Total Languages**: ${Object.keys(languages).length}
- **Total Bytes**: ${totalBytes.toLocaleString()}

## Language Distribution
${languageBreakdown.map(lang => `- **${lang.language}**: ${lang.bytes.toLocaleString()} bytes (${lang.percentage}%)`).join('\n')}

---
*Data retrieved at ${new Date().toISOString()}*`,
        },
      ],
    }
  }

  private async handleGetRepositoryCommits(args: {
    owner: string
    repo: string
    github_token: string
    since?: string
  }) {
    const { owner, repo, github_token, since } = args

    const octokit = new Octokit({ auth: github_token })
    
    const commits = await octokit.paginate(octokit.repos.listCommits, {
      owner,
      repo,
      since,
      per_page: 100
    })

    const commitStats = {
      total: commits.length,
      authors: new Set(commits.map(c => c.author?.login || 'Unknown')).size,
      avgCommitsPerDay: commits.length / 30, // Rough estimate
      recentCommits: commits.slice(0, 10)
    }

    return {
      content: [
        {
          type: 'text',
          text: `# Commit Analysis for ${owner}/${repo}

## Statistics
- **Total Commits**: ${commitStats.total}
- **Unique Authors**: ${commitStats.authors}
- **Average Commits per Day**: ${commitStats.avgCommitsPerDay.toFixed(1)}

## Recent Commits
${commitStats.recentCommits.map(commit => 
  `- **${commit.commit.message.split('\n')[0]}** by ${commit.author?.login || 'Unknown'} (${new Date(commit.commit.author?.date || '').toLocaleDateString()})`
).join('\n')}

---
*Data retrieved at ${new Date().toISOString()}*`,
        },
      ],
    }
  }

  private async handleGetRepositoryIssues(args: {
    owner: string
    repo: string
    github_token: string
    state?: string
  }) {
    const { owner, repo, github_token, state = 'all' } = args

    const octokit = new Octokit({ auth: github_token })
    
    const issues = await octokit.paginate(octokit.issues.listForRepo, {
      owner,
      repo,
      state: state as 'open' | 'closed' | 'all',
      per_page: 100
    })

    const issueStats = {
      total: issues.length,
      open: issues.filter(i => i.state === 'open').length,
      closed: issues.filter(i => i.state === 'closed').length,
      pullRequests: issues.filter(i => i.pull_request).length,
      regularIssues: issues.filter(i => !i.pull_request).length
    }

    return {
      content: [
        {
          type: 'text',
          text: `# Issues & Pull Requests for ${owner}/${repo}

## Statistics
- **Total Issues/PRs**: ${issueStats.total}
- **Open**: ${issueStats.open}
- **Closed**: ${issueStats.closed}
- **Pull Requests**: ${issueStats.pullRequests}
- **Regular Issues**: ${issueStats.regularIssues}

## Recent Issues
${issues.slice(0, 10).map(issue => 
  `- **${issue.title}** (${issue.state}) - ${issue.user?.login} - ${new Date(issue.created_at).toLocaleDateString()}`
).join('\n')}

---
*Data retrieved at ${new Date().toISOString()}*`,
        },
      ],
    }
  }

  private async handleGetUserProfile(args: {
    username: string
    github_token: string
  }) {
    const { username, github_token } = args

    const octokit = new Octokit({ auth: github_token })
    const { data: user } = await octokit.users.getByUsername({ username })

    return {
      content: [
        {
          type: 'text',
          text: `# GitHub Profile: ${user.name || user.login}

## Basic Information
- **Username**: @${user.login}
- **Name**: ${user.name || 'Not specified'}
- **Bio**: ${user.bio || 'No bio available'}
- **Location**: ${user.location || 'Not specified'}
- **Company**: ${user.company || 'Not specified'}
- **Website**: ${user.blog || 'Not specified'}
- **Twitter**: ${user.twitter_username ? `@${user.twitter_username}` : 'Not specified'}

## Statistics
- **Public Repositories**: ${user.public_repos}
- **Public Gists**: ${user.public_gists}
- **Followers**: ${user.followers}
- **Following**: ${user.following}
- **Account Created**: ${new Date(user.created_at).toLocaleDateString()}
- **Last Updated**: ${new Date(user.updated_at).toLocaleDateString()}

## Account Status
- **Account Type**: ${user.type}
- **Site Admin**: ${user.site_admin ? 'Yes' : 'No'}
- **Hireable**: ${user.hireable ? 'Yes' : 'No'}

---
*Data retrieved at ${new Date().toISOString()}*`,
        },
      ],
    }
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('RepoRadar GitHub Analysis MCP Server running on stdio')
  }
}

// Start the server
const server = new GitHubAnalysisMCPServer()
server.run().catch(console.error)
