# RepoRadar - AI-Powered Technical Due Diligence

RepoRadar provides comprehensive GitHub profile and repository analysis for VCs and technical due diligence. Built with Next.js, TypeScript, and GitHub API integration.

## 🎯 Core Functions

### 1. Author Profile Analysis
**Function**: `analyzeAuthorProfile(githubUrl)`
**Purpose**: Complete GitHub profile analysis for due diligence

**What it analyzes**:
- **Author Information**: Profile, bio, location, company, followers
- **Repository Portfolio**: Total repos, languages, commits, stars/forks
- **Skills Assessment**: Primary languages, frameworks, tools, expertise level
- **Activity Patterns**: Innovation score, consistency score, community engagement
- **Risk Assessment**: Overall risk level, concerns, strengths
- **Recommendations**: Key insights and actionable recommendations

**API Endpoint**: `POST /api/analyze-author-profile`

### 2. Repository Analysis
**Function**: `analyzeRepository(githubUrl)`
**Purpose**: Detailed repository-specific analysis with static analysis

**What it analyzes**:
- **Repository Metrics**: Stars, forks, size, language, creation/update dates
- **Code Metrics**: Total lines, files, complexity score, maintainability index
- **Static Analysis**: Bugs, vulnerabilities, code smells, security hotspots, technical debt
- **Dependencies**: Direct dependencies, security vulnerabilities, outdated packages
- **Architecture**: Patterns, complexity level, scalability score, performance indicators
- **Quality Assessment**: Overall grade, code quality, security, maintainability, testability
- **Risks & Concerns**: Critical issues, security risks, technical debt, scalability concerns
- **Recommendations**: Immediate actions, short-term improvements, long-term considerations

**API Endpoint**: `POST /api/analyze-repository`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- GitHub Personal Access Token
- Next.js 14+

### Installation
```bash
cd reporadar
npm install
```

### Environment Setup
Create `.env.local`:
```env
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Run Development Server
```bash
npm run dev
```

### Test the Functions
1. **Author Profile Analysis**: Visit `/reporadar-test`
2. **Repository Analysis**: Visit `/reporadar-test`
3. **GitHub OAuth**: Sign in with GitHub for token access

## 📊 Usage Examples

### Author Profile Analysis
```typescript
import { RepoRadarAnalysisService } from '@/lib/services/reporadar-analysis.service'

const service = new RepoRadarAnalysisService(githubToken)
const analysis = await service.analyzeAuthorProfile('https://github.com/user/repo')

console.log(analysis.author.username) // 'user'
console.log(analysis.skills.expertise_level) // 'Advanced'
console.log(analysis.risk_assessment.overall_risk) // 'Low'
```

### Repository Analysis
```typescript
const analysis = await service.analyzeRepository('https://github.com/user/repo')

console.log(analysis.static_analysis.bugs) // 5
console.log(analysis.quality_assessment.overall_grade) // 'B'
console.log(analysis.recommendations.immediate_actions) // ['Fix security vulnerabilities']
```

## 🔧 API Reference

### Author Profile Analysis
```http
POST /api/analyze-author-profile
Content-Type: application/json

{
  "githubUrl": "https://github.com/user/repo",
  "token": "github_personal_access_token"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "author": {
      "username": "user",
      "name": "User Name",
      "bio": "Software Developer",
      "followers": 150,
      "following": 200,
      "public_repos": 25
    },
    "repositories": {
      "total": 25,
      "languages": { "JavaScript": 15000, "TypeScript": 8000 },
      "total_lines": 23000,
      "total_commits": 500
    },
    "skills": {
      "primary_languages": ["JavaScript", "TypeScript", "Python"],
      "frameworks": ["React", "Node.js", "Django"],
      "expertise_level": "Advanced"
    },
    "activity": {
      "innovation_score": 75,
      "consistency_score": 80,
      "community_engagement": 70
    },
    "risk_assessment": {
      "overall_risk": "Low",
      "concerns": ["Limited public portfolio"],
      "strengths": ["High innovation score", "Consistent development activity"]
    },
    "summary": {
      "key_insights": ["Primary expertise in JavaScript, TypeScript"],
      "recommendations": ["Improve security practices"],
      "confidence_score": 85
    }
  },
  "analyzedAt": "2024-01-15T10:30:00Z",
  "analysisType": "author_profile"
}
```

### Repository Analysis
```http
POST /api/analyze-repository
Content-Type: application/json

{
  "githubUrl": "https://github.com/user/repo",
  "token": "github_personal_access_token"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "repository": {
      "name": "repo",
      "full_name": "user/repo",
      "description": "A sample repository",
      "stars": 50,
      "forks": 10,
      "language": "TypeScript"
    },
    "code_metrics": {
      "total_lines": 5000,
      "total_files": 150,
      "complexity_score": 65,
      "maintainability_index": 75
    },
    "static_analysis": {
      "bugs": 3,
      "vulnerabilities": 1,
      "code_smells": 8,
      "security_hotspots": 2,
      "technical_debt": "2 days",
      "coverage": 85
    },
    "dependencies": {
      "direct": [
        { "name": "react", "version": "18.2.0", "type": "production" }
      ],
      "vulnerabilities": [
        { "name": "lodash", "severity": "Medium", "description": "Prototype pollution" }
      ],
      "outdated": [
        { "name": "react", "current": "18.2.0", "latest": "18.3.0" }
      ]
    },
    "architecture": {
      "patterns": ["MVC", "Repository Pattern"],
      "complexity": "Moderate",
      "scalability_score": 75,
      "performance_indicators": ["Database queries", "Memory usage"]
    },
    "quality_assessment": {
      "overall_grade": "B",
      "code_quality_score": 75,
      "security_score": 80,
      "maintainability_score": 70,
      "testability_score": 85
    },
    "risks_and_concerns": {
      "critical_issues": ["Multiple security vulnerabilities detected"],
      "security_risks": ["lodash: Prototype pollution vulnerability"],
      "technical_debt": ["High number of code smells"],
      "scalability_concerns": ["Large codebase may have scalability challenges"]
    },
    "recommendations": {
      "immediate_actions": ["Fix security vulnerabilities immediately"],
      "short_term_improvements": ["Update outdated dependencies"],
      "long_term_considerations": ["Implement monitoring and observability"],
      "priority_level": "High"
    }
  },
  "analyzedAt": "2024-01-15T10:30:00Z",
  "analysisType": "repository"
}
```

## 🏗️ Architecture

### Services
- **`RepoRadarAnalysisService`**: Main analysis orchestrator
- **`GitHubAnalysisService`**: GitHub API integration and basic analysis
- **Static Analysis**: Integration points for SonarQube, ESLint, etc.

### Data Flow
1. **Input**: GitHub URL + GitHub Token
2. **Extraction**: Parse URL, extract username/repo
3. **Analysis**: GitHub API calls + static analysis
4. **Processing**: Calculate scores, identify patterns
5. **Output**: Structured analysis results

### Scoring System
- **Innovation Score**: Based on commit message patterns
- **Consistency Score**: Based on commit frequency patterns
- **Code Quality Score**: Based on repository health indicators
- **Security Score**: Based on language choices and repository age
- **Risk Assessment**: Overall risk level (Low/Medium/High)

## 🔒 Security & Privacy

- **GitHub OAuth**: Secure token-based authentication
- **Rate Limiting**: Respects GitHub API rate limits
- **Data Privacy**: No data stored, analysis performed in real-time
- **Token Security**: Tokens only used for API calls, not stored

## 🚀 Production Deployment

### Environment Variables
```env
GITHUB_ID=production_github_oauth_app_id
GITHUB_SECRET=production_github_oauth_app_secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production_nextauth_secret
```

### Static Analysis Integration
For production, integrate with:
- **SonarQube**: Code quality analysis
- **Snyk**: Security vulnerability scanning
- **CodeClimate**: Code quality metrics
- **ESLint**: JavaScript/TypeScript analysis

### Scaling Considerations
- **Caching**: Cache analysis results for repeated requests
- **Queue System**: Use BullMQ + Redis for background analysis
- **Database**: Store analysis results for historical tracking
- **CDN**: Serve static assets via CDN

## 📈 Future Enhancements

### Phase 1: Core Features ✅
- [x] GitHub profile analysis
- [x] Repository analysis
- [x] Basic static analysis
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
- [ ] API rate limiting
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
- Review the API examples

---

**RepoRadar** - Making technical due diligence faster, more accurate, and more comprehensive.
