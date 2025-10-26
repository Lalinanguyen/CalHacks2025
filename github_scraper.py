#export GITHUB_TOKEN=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

#!/usr/bin/env python3
"""
Comprehensive GitHub Repository and Profile Scraper
Extracts detailed analysis data similar to gitroll for RepoRadar
"""

import os
import json
import time
import requests
import subprocess
import tempfile
import shutil
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from pathlib import Path
import re
import ast
import yaml
import toml

# GitHub API configuration
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
if not GITHUB_TOKEN:
    print("⚠️  Please set GITHUB_TOKEN environment variable")
    print("   Get one from: https://github.com/settings/tokens")
    exit(1)

HEADERS = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoRadar-Scraper/1.0'
}

@dataclass
class RepositoryMetrics:
    """Comprehensive repository analysis metrics"""
    # Basic info
    name: str
    full_name: str
    description: str
    url: str
    html_url: str
    language: str
    languages: Dict[str, int]
    
    # Stats
    stars: int
    forks: int
    watchers: int
    size: int
    open_issues: int
    
    # Dates
    created_at: str
    updated_at: str
    pushed_at: str
    
    # Code metrics
    total_lines: int
    total_files: int
    total_commits: int
    
    # Quality metrics
    code_quality_score: float
    security_score: float
    maintainability_score: float
    
    # ACID scores
    bugs: int
    vulnerabilities: int
    code_smells: int
    bugs_grade: str
    vulnerabilities_grade: str
    code_smells_grade: str
    
    # Dependencies
    dependencies: List[str]
    dev_dependencies: List[str]
    
    # Contributors
    contributors: List[Dict[str, Any]]
    top_contributors: List[Dict[str, Any]]
    
    # Activity
    commit_frequency: Dict[str, int]
    recent_activity: List[Dict[str, Any]]
    
    # Technical details
    frameworks: List[str]
    databases: List[str]
    cloud_services: List[str]
    ci_cd: List[str]
    testing_frameworks: List[str]

@dataclass
class ProfileMetrics:
    """Comprehensive user profile analysis"""
    # Basic info
    username: str
    name: str
    bio: str
    company: str
    location: str
    email: str
    blog: str
    twitter_username: str
    
    # Stats
    public_repos: int
    public_gists: int
    followers: int
    following: int
    
    # Dates
    created_at: str
    updated_at: str
    
    # Activity metrics
    total_contributions: int
    contribution_streak: int
    longest_streak: int
    contribution_calendar: Dict[str, int]
    
    # Repository analysis
    repositories: List[RepositoryMetrics]
    total_stars_received: int
    total_forks_received: int
    
    # Skills analysis
    skills: Dict[str, List[str]]
    primary_languages: List[Tuple[str, int]]
    expertise_areas: List[str]
    
    # Social metrics
    influence_score: float
    contribution_score: float
    uniqueness_score: float
    reliability_score: float
    security_score: float
    maintainability_score: float

class GitHubScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.rate_limit_remaining = 5000
        self.rate_limit_reset = 0
        
    def _check_rate_limit(self):
        """Check and handle GitHub API rate limiting"""
        if self.rate_limit_remaining < 10:
            reset_time = self.rate_limit_reset - int(time.time())
            if reset_time > 0:
                print(f"⏳ Rate limit reached. Waiting {reset_time} seconds...")
                time.sleep(reset_time + 1)
        
    def _make_request(self, url: str, params: Dict = None) -> Dict:
        """Make authenticated request to GitHub API"""
        self._check_rate_limit()
        
        try:
            response = self.session.get(url, params=params)
            
            # Update rate limit info
            self.rate_limit_remaining = int(response.headers.get('X-RateLimit-Remaining', 0))
            self.rate_limit_reset = int(response.headers.get('X-RateLimit-Reset', 0))
            
            if response.status_code == 404:
                return None
            elif response.status_code == 403:
                print("❌ API rate limit exceeded or forbidden")
                return None
            elif response.status_code != 200:
                print(f"❌ API error: {response.status_code}")
                return None
                
            return response.json()
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return None
    
    def get_user_profile(self, username: str) -> Optional[Dict]:
        """Get comprehensive user profile data"""
        print(f"🔍 Fetching profile for {username}...")
        
        # Basic profile
        profile = self._make_request(f"https://api.github.com/users/{username}")
        if not profile:
            return None
            
        # Get all repositories
        repos = self._get_all_repositories(username)
        
        # Get contribution data
        contributions = self._get_contribution_data(username)
        
        # Get organizations
        orgs = self._make_request(f"https://api.github.com/users/{username}/orgs")
        
        # Get starred repositories
        starred = self._make_request(f"https://api.github.com/users/{username}/starred")
        
        # Get followers and following
        followers = self._make_request(f"https://api.github.com/users/{username}/followers")
        following = self._make_request(f"https://api.github.com/users/{username}/following")
        
        return {
            'profile': profile,
            'repositories': repos,
            'contributions': contributions,
            'organizations': orgs or [],
            'starred': starred or [],
            'followers': followers or [],
            'following': following or []
        }
    
    def _get_all_repositories(self, username: str) -> List[Dict]:
        """Get all repositories for a user"""
        repos = []
        page = 1
        per_page = 100
        
        while True:
            url = f"https://api.github.com/users/{username}/repos"
            params = {
                'page': page,
                'per_page': per_page,
                'sort': 'updated',
                'type': 'all'
            }
            
            response = self._make_request(url, params)
            if not response or len(response) == 0:
                break
                
            repos.extend(response)
            page += 1
            
            if len(response) < per_page:
                break
                
        return repos
    
    def _get_contribution_data(self, username: str) -> Dict:
        """Get contribution calendar and statistics"""
        # This would require scraping the contribution graph
        # For now, return mock data
        return {
            'total_contributions': 0,
            'current_streak': 0,
            'longest_streak': 0,
            'contribution_calendar': {}
        }
    
    def analyze_repository(self, repo_data: Dict) -> RepositoryMetrics:
        """Perform comprehensive repository analysis"""
        print(f"📊 Analyzing repository: {repo_data['full_name']}")
        
        # Clone repository for detailed analysis
        repo_dir = self._clone_repository(repo_data['clone_url'])
        
        try:
            # Get detailed repository data
            detailed_repo = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}")
            
            # Get languages
            languages = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}/languages")
            
            # Get contributors
            contributors = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}/contributors")
            
            # Get commits
            commits = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}/commits")
            
            # Get issues
            issues = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}/issues")
            
            # Get pull requests
            pulls = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}/pulls")
            
            # Analyze code if repository was cloned
            code_metrics = self._analyze_code_metrics(repo_dir) if repo_dir else {}
            
            # Extract dependencies
            dependencies = self._extract_dependencies(repo_dir) if repo_dir else {}
            
            # Calculate ACID scores
            acid_scores = self._calculate_acid_scores(code_metrics)
            
            # Extract technical frameworks
            frameworks = self._extract_frameworks(repo_dir) if repo_dir else []
            
            return RepositoryMetrics(
                name=repo_data['name'],
                full_name=repo_data['full_name'],
                description=repo_data.get('description', ''),
                url=repo_data['url'],
                html_url=repo_data['html_url'],
                language=repo_data.get('language', ''),
                languages=languages or {},
                stars=repo_data['stargazers_count'],
                forks=repo_data['forks_count'],
                watchers=repo_data['watchers_count'],
                size=repo_data['size'],
                open_issues=repo_data['open_issues_count'],
                created_at=repo_data['created_at'],
                updated_at=repo_data['updated_at'],
                pushed_at=repo_data['pushed_at'],
                total_lines=code_metrics.get('total_lines', 0),
                total_files=code_metrics.get('total_files', 0),
                total_commits=len(commits) if commits else 0,
                code_quality_score=acid_scores.get('quality_score', 0),
                security_score=acid_scores.get('security_score', 0),
                maintainability_score=acid_scores.get('maintainability_score', 0),
                bugs=acid_scores.get('bugs', 0),
                vulnerabilities=acid_scores.get('vulnerabilities', 0),
                code_smells=acid_scores.get('code_smells', 0),
                bugs_grade=acid_scores.get('bugs_grade', 'A'),
                vulnerabilities_grade=acid_scores.get('vulnerabilities_grade', 'A'),
                code_smells_grade=acid_scores.get('code_smells_grade', 'A'),
                dependencies=dependencies.get('dependencies', []),
                dev_dependencies=dependencies.get('dev_dependencies', []),
                contributors=contributors or [],
                top_contributors=(contributors or [])[:5],
                commit_frequency={},
                recent_activity=commits[:10] if commits else [],
                frameworks=frameworks,
                databases=[],
                cloud_services=[],
                ci_cd=[],
                testing_frameworks=[]
            )
            
        finally:
            # Clean up cloned repository
            if repo_dir and os.path.exists(repo_dir):
                shutil.rmtree(repo_dir)
    
    def _clone_repository(self, clone_url: str) -> Optional[str]:
        """Clone repository to temporary directory"""
        try:
            temp_dir = tempfile.mkdtemp()
            subprocess.run(['git', 'clone', '--depth', '1', clone_url, temp_dir], 
                         check=True, capture_output=True)
            return temp_dir
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Failed to clone repository: {e}")
            return None
    
    def _analyze_code_metrics(self, repo_dir: str) -> Dict:
        """Analyze code metrics using cloc and other tools"""
        metrics = {
            'total_lines': 0,
            'total_files': 0,
            'languages': {},
            'complexity': 0,
            'duplication': 0
        }
        
        try:
            # Use cloc for line counting
            result = subprocess.run(['cloc', repo_dir, '--json'], 
                                  capture_output=True, text=True, cwd=repo_dir)
            if result.returncode == 0:
                cloc_data = json.loads(result.stdout)
                metrics['total_lines'] = cloc_data.get('SUM', {}).get('code', 0)
                metrics['total_files'] = cloc_data.get('SUM', {}).get('nFiles', 0)
                metrics['languages'] = {k: v['code'] for k, v in cloc_data.items() 
                                      if k != 'SUM' and k != 'header'}
            
            # Count files
            file_count = 0
            for root, dirs, files in os.walk(repo_dir):
                # Skip hidden directories
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                file_count += len(files)
            metrics['total_files'] = file_count
            
        except Exception as e:
            print(f"⚠️  Code analysis failed: {e}")
        
        return metrics
    
    def _extract_dependencies(self, repo_dir: str) -> Dict:
        """Extract dependencies from package files"""
        dependencies = {'dependencies': [], 'dev_dependencies': []}
        
        # Check for package.json
        package_json = os.path.join(repo_dir, 'package.json')
        if os.path.exists(package_json):
            try:
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    dependencies['dependencies'] = list(data.get('dependencies', {}).keys())
                    dependencies['dev_dependencies'] = list(data.get('devDependencies', {}).keys())
            except Exception as e:
                print(f"⚠️  Failed to parse package.json: {e}")
        
        # Check for requirements.txt
        requirements_txt = os.path.join(repo_dir, 'requirements.txt')
        if os.path.exists(requirements_txt):
            try:
                with open(requirements_txt, 'r') as f:
                    deps = [line.strip().split('==')[0] for line in f 
                           if line.strip() and not line.startswith('#')]
                    dependencies['dependencies'].extend(deps)
            except Exception as e:
                print(f"⚠️  Failed to parse requirements.txt: {e}")
        
        # Check for Pipfile
        pipfile = os.path.join(repo_dir, 'Pipfile')
        if os.path.exists(pipfile):
            try:
                with open(pipfile, 'r') as f:
                    data = toml.load(f)
                    deps = list(data.get('packages', {}).keys())
                    dev_deps = list(data.get('dev-packages', {}).keys())
                    dependencies['dependencies'].extend(deps)
                    dependencies['dev_dependencies'].extend(dev_deps)
            except Exception as e:
                print(f"⚠️  Failed to parse Pipfile: {e}")
        
        return dependencies
    
    def _calculate_acid_scores(self, code_metrics: Dict) -> Dict:
        """Calculate ACID scores (bugs, vulnerabilities, code smells)"""
        # This is a simplified implementation
        # In production, you'd use tools like SonarQube, CodeClimate, etc.
        
        total_lines = code_metrics.get('total_lines', 0)
        total_files = code_metrics.get('total_files', 0)
        
        # Simulate bug detection based on code complexity
        bugs = max(0, int(total_lines / 1000) - 2)  # Rough estimate
        vulnerabilities = max(0, int(total_lines / 5000))  # Very rough estimate
        code_smells = max(0, int(total_lines / 200))  # Rough estimate
        
        # Grade calculation
        def get_grade(count: int, total: int) -> str:
            if total == 0:
                return 'A'
            ratio = count / total
            if ratio < 0.01:
                return 'A'
            elif ratio < 0.05:
                return 'B'
            elif ratio < 0.1:
                return 'C'
            elif ratio < 0.2:
                return 'D'
            else:
                return 'E'
        
        bugs_grade = get_grade(bugs, total_files)
        vulnerabilities_grade = get_grade(vulnerabilities, total_files)
        code_smells_grade = get_grade(code_smells, total_files)
        
        # Calculate quality scores
        quality_score = max(0, 100 - (bugs * 5) - (vulnerabilities * 20) - (code_smells * 0.1))
        security_score = max(0, 100 - (vulnerabilities * 30))
        maintainability_score = max(0, 100 - (code_smells * 0.2))
        
        return {
            'bugs': bugs,
            'vulnerabilities': vulnerabilities,
            'code_smells': code_smells,
            'bugs_grade': bugs_grade,
            'vulnerabilities_grade': vulnerabilities_grade,
            'code_smells_grade': code_smells_grade,
            'quality_score': quality_score,
            'security_score': security_score,
            'maintainability_score': maintainability_score
        }
    
    def _extract_frameworks(self, repo_dir: str) -> List[str]:
        """Extract frameworks and technologies used"""
        frameworks = []
        
        # Check for framework indicators
        framework_indicators = {
            'react': ['package.json', 'src/App.js', 'src/App.tsx'],
            'nextjs': ['next.config.js', 'pages/', 'app/'],
            'vue': ['vue.config.js', 'src/App.vue'],
            'angular': ['angular.json', 'src/app/'],
            'express': ['app.js', 'server.js', 'index.js'],
            'django': ['manage.py', 'settings.py'],
            'flask': ['app.py', 'requirements.txt'],
            'spring': ['pom.xml', 'build.gradle'],
            'rails': ['Gemfile', 'config/application.rb'],
            'laravel': ['artisan', 'composer.json'],
            'fastapi': ['main.py', 'requirements.txt'],
            'tensorflow': ['requirements.txt', '*.py'],
            'pytorch': ['requirements.txt', '*.py'],
            'pandas': ['requirements.txt', '*.py'],
            'numpy': ['requirements.txt', '*.py']
        }
        
        for framework, indicators in framework_indicators.items():
            for indicator in indicators:
                if '*' in indicator:
                    # Check for file pattern
                    pattern = indicator.replace('*', '')
                    for root, dirs, files in os.walk(repo_dir):
                        if any(pattern in f for f in files):
                            frameworks.append(framework)
                            break
                else:
                    # Check for specific file
                    if os.path.exists(os.path.join(repo_dir, indicator)):
                        frameworks.append(framework)
                        break
        
        return list(set(frameworks))
    
    def analyze_user_profile(self, username: str) -> ProfileMetrics:
        """Perform comprehensive user profile analysis"""
        print(f"🔍 Analyzing user profile: {username}")
        
        # Get all profile data
        profile_data = self.get_user_profile(username)
        if not profile_data:
            raise Exception(f"Failed to fetch profile for {username}")
        
        profile = profile_data['profile']
        repositories = profile_data['repositories']
        
        # Analyze each repository
        analyzed_repos = []
        for repo in repositories[:10]:  # Limit to first 10 repos for testing
            try:
                repo_metrics = self.analyze_repository(repo)
                analyzed_repos.append(repo_metrics)
            except Exception as e:
                print(f"⚠️  Failed to analyze {repo['name']}: {e}")
        
        # Calculate profile metrics
        total_stars = sum(repo.stars for repo in analyzed_repos)
        total_forks = sum(repo.forks for repo in analyzed_repos)
        
        # Extract skills
        skills = self._extract_skills_from_repos(analyzed_repos)
        
        # Calculate scores
        scores = self._calculate_profile_scores(profile, analyzed_repos)
        
        return ProfileMetrics(
            username=profile['login'],
            name=profile.get('name', ''),
            bio=profile.get('bio', ''),
            company=profile.get('company', ''),
            location=profile.get('location', ''),
            email=profile.get('email', ''),
            blog=profile.get('blog', ''),
            twitter_username=profile.get('twitter_username', ''),
            public_repos=profile['public_repos'],
            public_gists=profile['public_gists'],
            followers=profile['followers'],
            following=profile['following'],
            created_at=profile['created_at'],
            updated_at=profile['updated_at'],
            total_contributions=0,  # Would need scraping
            contribution_streak=0,
            longest_streak=0,
            contribution_calendar={},
            repositories=analyzed_repos,
            total_stars_received=total_stars,
            total_forks_received=total_forks,
            skills=skills,
            primary_languages=[],
            expertise_areas=[],
            influence_score=scores['influence'],
            contribution_score=scores['contribution'],
            uniqueness_score=scores['uniqueness'],
            reliability_score=scores['reliability'],
            security_score=scores['security'],
            maintainability_score=scores['maintainability']
        )
    
    def _extract_skills_from_repos(self, repos: List[RepositoryMetrics]) -> Dict[str, List[str]]:
        """Extract and categorize skills from repositories"""
        skills = {
            'Backend': [],
            'Frontend': [],
            'Machine Learning': [],
            'DevOps': [],
            'Mobile App': [],
            'Location-based Services': []
        }
        
        skill_mapping = {
            'Backend': ['express', 'django', 'flask', 'spring', 'rails', 'laravel', 'fastapi', 'node', 'python', 'java', 'go', 'rust', 'php', 'ruby'],
            'Frontend': ['react', 'vue', 'angular', 'nextjs', 'javascript', 'typescript', 'html', 'css', 'sass', 'less'],
            'Machine Learning': ['tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'keras', 'opencv', 'matplotlib', 'seaborn'],
            'DevOps': ['docker', 'kubernetes', 'jenkins', 'github-actions', 'gitlab-ci', 'terraform', 'ansible', 'aws', 'azure', 'gcp'],
            'Mobile App': ['react-native', 'flutter', 'ionic', 'cordova', 'xamarin', 'swift', 'kotlin', 'android', 'ios'],
            'Location-based Services': ['google-maps', 'mapbox', 'leaflet', 'geolocation', 'gps', 'gis']
        }
        
        for repo in repos:
            # Check languages
            for lang, lines in repo.languages.items():
                for category, techs in skill_mapping.items():
                    if lang.lower() in [t.lower() for t in techs]:
                        if lang not in skills[category]:
                            skills[category].append(lang)
            
            # Check frameworks
            for framework in repo.frameworks:
                for category, techs in skill_mapping.items():
                    if framework.lower() in [t.lower() for t in techs]:
                        if framework not in skills[category]:
                            skills[category].append(framework)
        
        return skills
    
    def _calculate_profile_scores(self, profile: Dict, repos: List[RepositoryMetrics]) -> Dict:
        """Calculate profile scores similar to gitroll"""
        # Simplified scoring algorithm
        total_stars = sum(repo.stars for repo in repos)
        total_forks = sum(repo.forks for repo in repos)
        total_repos = len(repos)
        
        # Influence score (based on stars, followers, forks)
        influence = min(5.0, (total_stars * 0.1 + profile['followers'] * 0.05 + total_forks * 0.2) / 10)
        
        # Contribution score (based on repository count and activity)
        contribution = min(5.0, (total_repos * 0.5 + profile['public_repos'] * 0.1) / 10)
        
        # Uniqueness score (based on diverse technologies)
        unique_techs = set()
        for repo in repos:
            unique_techs.update(repo.languages.keys())
            unique_techs.update(repo.frameworks)
        uniqueness = min(5.0, len(unique_techs) / 5)
        
        # Reliability score (based on code quality)
        avg_quality = sum(repo.code_quality_score for repo in repos) / len(repos) if repos else 0
        reliability = avg_quality / 20  # Convert to 0-5 scale
        
        # Security score (based on vulnerabilities)
        avg_security = sum(repo.security_score for repo in repos) / len(repos) if repos else 0
        security = avg_security / 20  # Convert to 0-5 scale
        
        # Maintainability score (based on code smells and structure)
        avg_maintainability = sum(repo.maintainability_score for repo in repos) / len(repos) if repos else 0
        maintainability = avg_maintainability / 20  # Convert to 0-5 scale
        
        return {
            'influence': round(influence, 2),
            'contribution': round(contribution, 2),
            'uniqueness': round(uniqueness, 2),
            'reliability': round(reliability, 2),
            'security': round(security, 2),
            'maintainability': round(maintainability, 2)
        }

def main():
    """Main function to test the scraper"""
    if len(os.sys.argv) != 2:
        print("Usage: python github_scraper.py <username>")
        print("Example: python github_scraper.py octocat")
        exit(1)
    
    username = os.sys.argv[1]
    
    print(f"🚀 Starting comprehensive analysis of {username}")
    print("=" * 60)
    
    scraper = GitHubScraper()
    
    try:
        # Analyze user profile
        profile_metrics = scraper.analyze_user_profile(username)
        
        # Save results
        output_file = f"{username}_analysis.json"
        with open(output_file, 'w') as f:
            json.dump(asdict(profile_metrics), f, indent=2, default=str)
        
        print(f"\n✅ Analysis complete! Results saved to {output_file}")
        
        # Print summary
        print(f"\n📊 Summary for {username}:")
        print(f"   Repositories analyzed: {len(profile_metrics.repositories)}")
        print(f"   Total stars received: {profile_metrics.total_stars_received}")
        print(f"   Total forks received: {profile_metrics.total_forks_received}")
        print(f"   Followers: {profile_metrics.followers}")
        print(f"   Following: {profile_metrics.following}")
        
        print(f"\n🎯 Profile Scores:")
        print(f"   Influence: {profile_metrics.influence_score}/5.0")
        print(f"   Contribution: {profile_metrics.contribution_score}/5.0")
        print(f"   Uniqueness: {profile_metrics.uniqueness_score}/5.0")
        print(f"   Reliability: {profile_metrics.reliability_score}/5.0")
        print(f"   Security: {profile_metrics.security_score}/5.0")
        print(f"   Maintainability: {profile_metrics.maintainability_score}/5.0")
        
        print(f"\n🛠️  Skills detected:")
        for category, skills in profile_metrics.skills.items():
            if skills:
                print(f"   {category}: {', '.join(skills[:5])}")
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()

