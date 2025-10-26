# RepoRadar GitHub Analysis MCP Server

**MCP Server 1** in the RepoRadar Technical Due Diligence System

This MCP server provides comprehensive GitHub analysis tools for technical due diligence, integrating with GitHub API, static analysis tools, and providing detailed insights for VCs and technical evaluators.

## 🏗️ Architecture Overview

```
Claude as Central Agent → coordinates 3 MCP servers:
├── MCP Server 1: GitHub Analysis (THIS SERVER)
│   ├── Input: Repo URL
│   ├── Tools: GitHub API, cloc, tree-sitter, CodeRabbit API
│   └── Output: Technical diligence section
├── MCP Server 2: Market Intelligence
│   ├── Input: Product name, competitors
│   ├── Tools: Claude deep research
│   └── Output: Market analysis section
└── MCP Server 3: Founder Research
    ├── Input: Founder name/LinkedIn
    ├── Tools: Bright Data scraping
    └── Output: Founder profile section
```

## 🛠️ Available Tools

### 1. `analyze_author_profile`
**Purpose**: Complete GitHub profile analysis for due diligence
**Input**: GitHub repository URL + GitHub token
**Output**: Comprehensive author profile analysis

**Analyzes**:
- Author information (name, bio, location, company, followers)
- Repository portfolio (total repos, languages, commits, stars/forks)
- Skills assessment (primary languages, frameworks, tools, expertise level)
- Activity patterns (innovation score, consistency score, community engagement)
- Risk assessment (overall risk level, concerns, strengths)
- Recommendations (key insights and actionable recommendations)

### 2. `analyze_repository`
**Purpose**: Detailed repository-specific analysis with static analysis
**Input**: GitHub repository URL + GitHub token
**Output**: Comprehensive repository analysis

**Analyzes**:
- Repository metrics (stars, forks, size, language, dates)
- Code metrics (total lines, files, complexity score, maintainability index)
- Static analysis (bugs, vulnerabilities, code smells, security hotspots, technical debt)
- Dependencies (direct dependencies, security vulnerabilities, outdated packages)
- Architecture (patterns, complexity level, scalability score, performance indicators)
- Quality assessment (overall grade, code quality, security, maintainability, testability)
- Risks & concerns (critical issues, security risks, technical debt, scalability concerns)
- Recommendations (immediate actions, short-term improvements, long-term considerations)

### 3. `get_repository_languages`
**Purpose**: Get detailed language breakdown for a repository
**Input**: Owner, repo, GitHub token
**Output**: Language distribution with percentages

### 4. `get_repository_commits`
**Purpose**: Get commit history and patterns for a repository
**Input**: Owner, repo, GitHub token, optional since date
**Output**: Commit statistics and recent commits

### 5. `get_repository_issues`
**Purpose**: Get issues and pull requests for a repository
**Input**: Owner, repo, GitHub token, optional state filter
**Output**: Issue statistics and recent issues

### 6. `get_user_profile`
**Purpose**: Get basic GitHub user profile information
**Input**: Username, GitHub token
**Output**: Complete user profile data

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- GitHub Personal Access Token
- MCP SDK

### Installation
```bash
# Clone or navigate to the reporadar directory
cd reporadar

# Install MCP server dependencies
npm install @modelcontextprotocol/sdk @octokit/rest

# Install development dependencies
npm install -D typescript tsx @types/node

# Build the TypeScript version
npx tsc --project mcp-tsconfig.json
```

### Configuration
Create a `.env` file or set environment variables:
```env
GITHUB_TOKEN=your_github_personal_access_token
```

## 🔧 Usage

### Running the MCP Server

#### Option 1: Direct Node.js (JavaScript)
```bash
node mcp-server.js
```

#### Option 2: TypeScript Development
```bash
npx tsx src/mcp-server.ts
```

#### Option 3: Built TypeScript
```bash
npm run build
npm start
```

### Claude Desktop Configuration

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "reporadar-github-analysis": {
      "command": "node",
      "args": ["/path/to/reporadar/mcp-server.js"],
      "env": {
        "GITHUB_TOKEN": "your_github_token"
      }
    }
  }
}
```

### Example Usage in Claude

```
@analyze_author_profile github_url="https://github.com/user/repo" github_token="your_token"
```

```
@analyze_repository github_url="https://github.com/user/repo" github_token="your_token"
```

## 📊 Output Format

### Author Profile Analysis
```markdown
# GitHub Author Profile Analysis: John Doe (@johndoe)

## Author Information
- Name: John Doe
- Username: @johndoe
- Bio: Full-stack developer
- Location: San Francisco, CA
- Company: Tech Corp
- Followers: 150
- Following: 200
- Public Repositories: 25
- Joined GitHub: 1/15/2020

## Repository Portfolio
- Total Repositories: 25
- Total Lines of Code: 50,000
- Total Commits: 1,200
- Average Stars per Repo: 5
- Average Forks per Repo: 2

## Skills & Expertise
- Primary Languages: JavaScript, TypeScript, Python
- Frameworks: React, Node.js, Django
- Tools: Docker, CI/CD, Shell Scripting
- Expertise Level: Advanced

## Activity Analysis
- Innovation Score: 75/100
- Consistency Score: 80/100
- Community Engagement: 70/100
- Code Quality Trend: Improving

## Risk Assessment
- Overall Risk Level: Low
- Confidence Score: 85%

### Concerns
- Limited public portfolio

### Strengths
- High innovation score
- Consistent development activity

## Key Insights
- Primary expertise in JavaScript, TypeScript, Python
- 25 repositories with 1,200 total commits
- Innovation score: 75/100, Consistency: 80/100

## Recommendations
- Improve security practices and code review processes
- Increase public portfolio visibility
```

### Repository Analysis
```markdown
# Repository Analysis: awesome-project

## Repository Information
- Name: awesome-project
- Full Name: user/awesome-project
- Description: An awesome project for developers
- Primary Language: TypeScript
- Stars: 50
- Forks: 10
- Watchers: 25
- Size: 1,500 KB
- Created: 1/15/2023
- Last Updated: 12/1/2024

## Code Metrics
- Total Lines of Code: 5,000
- Total Files: 150
- Complexity Score: 65/100
- Maintainability Index: 75/100

## Static Analysis Results
- Bugs: 3
- Vulnerabilities: 1
- Code Smells: 8
- Security Hotspots: 2
- Technical Debt: 2 days
- Test Coverage: 85%

## Dependencies Analysis
- Direct Dependencies: 15
- Security Vulnerabilities: 1
- Outdated Packages: 3

### Vulnerabilities
- lodash (Medium): Prototype pollution vulnerability

### Outdated Dependencies
- react: 18.2.0 → 18.3.0

## Architecture Analysis
- Detected Patterns: MVC, Repository Pattern
- Complexity Level: Moderate
- Scalability Score: 75/100
- Performance Indicators: Database queries, Memory usage

## Quality Assessment
- Overall Grade: B
- Code Quality Score: 75/100
- Security Score: 80/100
- Maintainability Score: 70/100
- Testability Score: 85/100

## Risks & Concerns

### Critical Issues
- Multiple security vulnerabilities detected

### Security Risks
- lodash: Prototype pollution vulnerability

### Technical Debt
- High number of code smells

### Scalability Concerns
- Large codebase may have scalability challenges

## Recommendations

### Immediate Actions (Priority: High)
- Fix security vulnerabilities immediately
- Address critical bugs

### Short-term Improvements
- Update outdated dependencies
- Improve code quality through refactoring
- Add comprehensive test coverage

### Long-term Considerations
- Implement monitoring and observability
- Plan for horizontal scaling
- Establish code review processes
```

## 🔒 Security & Privacy

- **GitHub Token**: Required for API access, not stored
- **Rate Limiting**: Respects GitHub API rate limits
- **Data Privacy**: No data stored, analysis performed in real-time
- **Token Security**: Tokens only used for API calls

## 🚀 Future Enhancements

### Phase 1: Core Tools ✅
- [x] Author profile analysis
- [x] Repository analysis
- [x] Basic GitHub API tools
- [x] Risk assessment
- [x] Recommendations engine

### Phase 2: Advanced Analysis
- [ ] Real static analysis integration (SonarQube, Snyk)
- [ ] Dependency vulnerability scanning
- [ ] Code coverage analysis
- [ ] Performance metrics
- [ ] Architecture pattern detection

### Phase 3: Enterprise Features
- [ ] Team analysis
- [ ] Historical tracking
- [ ] Custom scoring models
- [ ] PDF report generation
- [ ] Multi-tenant support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the tool examples

---

**RepoRadar GitHub Analysis MCP Server** - Making technical due diligence faster, more accurate, and more comprehensive.
