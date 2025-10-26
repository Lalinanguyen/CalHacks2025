# GitHub Analysis Pipeline for RepoRadar

A comprehensive GitHub repository and profile analysis system that extracts detailed metrics, security vulnerabilities, code quality issues, and generates professional visualizations similar to gitroll.

## 🚀 Features

### Profile Analysis
- **User Metrics**: Followers, following, public repos, contribution patterns
- **Skills Detection**: Categorized technical skills (Backend, Frontend, ML, DevOps, etc.)
- **Influence Scoring**: Social metrics and repository impact
- **Activity Patterns**: Contribution streaks, repository creation timeline

### Repository Analysis
- **Code Metrics**: Lines of code, file counts, language distribution
- **Quality Scores**: Code quality, security, maintainability, reliability
- **ACID Scoring**: Bugs, vulnerabilities, code smells with letter grades
- **Dependency Analysis**: Security vulnerabilities, license compliance
- **Architecture Detection**: MVC, microservices, monolith patterns
- **Framework Detection**: React, Vue, Angular, Django, Flask, etc.

### Security Analysis
- **Vulnerability Scanning**: SQL injection, XSS, path traversal, hardcoded secrets
- **Dependency Security**: Known vulnerabilities in package dependencies
- **Code Quality Issues**: Long functions, magic numbers, duplicate code
- **Security Scoring**: Comprehensive security assessment

### Visualizations
- **Radar Chart**: CURISMO-style profile overview
- **Skills Sunburst**: Categorized technical skills visualization
- **Repository Table**: ACID scores and metrics table
- **Contribution Calendar**: Activity heatmap
- **Language Distribution**: Pie chart of programming languages
- **Activity Timeline**: Repository creation over time
- **Dependency Network**: Graph of related dependencies
- **Security Dashboard**: Vulnerability severity breakdown
- **Quality Trends**: Code quality over time

## 📋 Prerequisites

### Required Tools
```bash
# Install system dependencies
brew install cloc  # For line counting
brew install git   # For repository cloning

# Or on Ubuntu/Debian
sudo apt-get install cloc git
```

### Python Dependencies
```bash
pip install -r requirements.txt
```

### GitHub API Token
1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a new token with `repo` and `user` scopes
3. Set the environment variable:
```bash
export GITHUB_TOKEN=your_token_here
```

## 🛠️ Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd CalHacks2025
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up GitHub token**:
```bash
export GITHUB_TOKEN=your_token_here
```

4. **Test the installation**:
```bash
python test_github_analysis.py octocat
```

## 📖 Usage

### Quick Start
```bash
# Run complete analysis pipeline
python test_github_analysis.py <username>

# Example
python test_github_analysis.py octocat
```

### Individual Components

#### Basic Analysis
```bash
python github_scraper.py <username>
```

#### Advanced Analysis
```bash
python advanced_github_analyzer.py <username>
```

#### Visualization Only
```bash
python github_visualizer.py <analysis_file.json>
```

## 📊 Output Files

### JSON Analysis Files
- `{username}_basic_analysis.json` - Profile and repository overview
- `{username}_advanced_analysis.json` - Detailed repository analysis

### Visualizations
- `visualizations/index.html` - Main dashboard
- `visualizations/radar_chart.html` - Profile radar chart
- `visualizations/skills_sunburst.html` - Skills visualization
- `visualizations/repositories_table.html` - Repository metrics table
- `visualizations/security_dashboard.html` - Security vulnerabilities
- `visualizations/quality_trends.html` - Quality trends over time

## 🔧 Configuration

### Rate Limiting
The system automatically handles GitHub API rate limiting:
- 5000 requests per hour for authenticated users
- Automatic retry with exponential backoff
- Rate limit status monitoring

### Analysis Depth
- **Basic**: Profile data, repository list, basic metrics
- **Advanced**: Code analysis, security scanning, dependency analysis
- **Visualization**: Charts, graphs, interactive dashboards

### Customization
Modify analysis parameters in the respective Python files:
- `github_scraper.py` - Basic analysis settings
- `advanced_github_analyzer.py` - Advanced analysis settings
- `github_visualizer.py` - Visualization settings

## 🏗️ Architecture

### Core Components

1. **GitHubScraper** (`github_scraper.py`)
   - Basic profile and repository data extraction
   - Skills detection and categorization
   - Profile scoring algorithms

2. **AdvancedGitHubAnalyzer** (`advanced_github_analyzer.py`)
   - Detailed code analysis
   - Security vulnerability scanning
   - Dependency analysis
   - Architecture pattern detection

3. **GitHubVisualizer** (`github_visualizer.py`)
   - Chart generation with Plotly
   - Interactive dashboards
   - Export to HTML

4. **Test Pipeline** (`test_github_analysis.py`)
   - Complete analysis workflow
   - Error handling and logging
   - Performance monitoring

### Data Flow
```
GitHub API → Basic Analysis → Advanced Analysis → Visualization → HTML Dashboard
```

## 🔍 Analysis Details

### Profile Metrics
- **Influence Score**: Based on stars, followers, forks
- **Contribution Score**: Repository count and activity
- **Uniqueness Score**: Technology diversity
- **Reliability Score**: Code quality consistency
- **Security Score**: Vulnerability assessment
- **Maintainability Score**: Code structure and documentation

### Repository Metrics
- **Code Quality**: Complexity, duplication, documentation
- **Security**: Vulnerabilities, dependency issues
- **Architecture**: Design patterns, structure
- **Dependencies**: Security, licensing, maintenance
- **Activity**: Commits, contributors, issues

### ACID Scoring
- **Bugs**: Code defects and logical errors
- **Vulnerabilities**: Security issues and risks
- **Code Smells**: Maintainability and readability issues
- **Grades**: A (excellent) to E (poor) scale

## 🚨 Security Considerations

### API Security
- GitHub token stored in environment variables
- No hardcoded credentials
- Rate limiting to prevent abuse

### Data Privacy
- Analysis data stored locally
- No data sent to external services
- GitHub data used only for analysis

### Vulnerability Scanning
- Static analysis only
- No code execution
- Safe pattern matching

## 🐛 Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   ```
   ❌ API rate limit exceeded or forbidden
   ```
   - Wait for rate limit reset
   - Use fewer repositories for analysis
   - Implement caching

2. **Repository Clone Failed**
   ```
   ⚠️  Failed to clone repository
   ```
   - Check repository accessibility
   - Verify Git installation
   - Check disk space

3. **Analysis Failed**
   ```
   ❌ Analysis failed: <error>
   ```
   - Check GitHub token permissions
   - Verify repository exists
   - Check network connectivity

### Debug Mode
Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Performance

### Optimization Tips
- Use `--depth 1` for git cloning
- Limit repository analysis to recent repos
- Cache API responses
- Use parallel processing for multiple repos

### Memory Usage
- ~100MB per repository analysis
- ~500MB for visualization generation
- Scales linearly with repository count

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time analysis updates
- [ ] Batch processing for multiple users
- [ ] Custom analysis rules
- [ ] Integration with CI/CD pipelines
- [ ] Machine learning-based scoring
- [ ] Team analysis and collaboration metrics

### Integration Points
- [ ] RepoRadar backend integration
- [ ] Database storage
- [ ] API endpoints
- [ ] Webhook processing
- [ ] Report generation

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the GitHub API documentation

---

**Note**: This is a development tool for RepoRadar. Ensure you have proper permissions and follow GitHub's terms of service when analyzing repositories.

