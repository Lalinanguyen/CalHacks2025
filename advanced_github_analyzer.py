#!/usr/bin/env python3
"""
Advanced GitHub Repository and Profile Analyzer
Enhanced version with detailed code analysis, security scanning, and visualization
"""

import os
import json
import time
import requests
import subprocess
import tempfile
import shutil
import re
import ast
import yaml
import toml
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any, Set
from dataclasses import dataclass, asdict
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import networkx as nx
from collections import Counter, defaultdict
import hashlib
import base64

# GitHub API configuration
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
if not GITHUB_TOKEN:
    print("⚠️  Please set GITHUB_TOKEN environment variable")
    print("   Get one from: https://github.com/settings/tokens")
    exit(1)

HEADERS = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoRadar-Advanced/1.0'
}

@dataclass
class SecurityVulnerability:
    """Security vulnerability details"""
    severity: str  # critical, high, medium, low
    type: str
    description: str
    file: str
    line: int
    cwe_id: Optional[str] = None
    fix_suggestion: Optional[str] = None

@dataclass
class CodeQualityIssue:
    """Code quality issue details"""
    type: str  # bug, code_smell, vulnerability
    severity: str
    message: str
    file: str
    line: int
    rule: str
    effort: str  # estimated time to fix

@dataclass
class DependencyInfo:
    """Dependency information with security details"""
    name: str
    version: str
    type: str  # direct, dev, transitive
    vulnerabilities: List[SecurityVulnerability]
    license: Optional[str] = None
    last_updated: Optional[str] = None
    maintainer: Optional[str] = None

@dataclass
class ArchitecturePattern:
    """Detected architecture patterns"""
    pattern: str  # mvc, microservices, monolith, etc.
    confidence: float
    evidence: List[str]
    files: List[str]

@dataclass
class DetailedRepositoryMetrics:
    """Comprehensive repository analysis with detailed metrics"""
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
    total_contributors: int
    
    # Quality metrics
    code_quality_score: float
    security_score: float
    maintainability_score: float
    reliability_score: float
    
    # ACID scores
    bugs: int
    vulnerabilities: int
    code_smells: int
    bugs_grade: str
    vulnerabilities_grade: str
    code_smells_grade: str
    
    # Detailed analysis
    security_vulnerabilities: List[SecurityVulnerability]
    code_quality_issues: List[CodeQualityIssue]
    dependencies: List[DependencyInfo]
    architecture_patterns: List[ArchitecturePattern]
    
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
    
    # Code structure
    file_structure: Dict[str, Any]
    complexity_metrics: Dict[str, float]
    test_coverage: Optional[float]
    
    # Performance metrics
    performance_metrics: Dict[str, Any]

class AdvancedGitHubAnalyzer:
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
    
    def analyze_repository_detailed(self, repo_data: Dict) -> DetailedRepositoryMetrics:
        """Perform comprehensive repository analysis with detailed metrics"""
        print(f"🔍 Deep analysis of repository: {repo_data['full_name']}")
        
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
            
            # Get releases
            releases = self._make_request(f"https://api.github.com/repos/{repo_data['full_name']}/releases")
            
            # Analyze code if repository was cloned
            code_metrics = self._analyze_code_metrics_advanced(repo_dir) if repo_dir else {}
            
            # Extract dependencies with security analysis
            dependencies = self._extract_dependencies_detailed(repo_dir) if repo_dir else []
            
            # Security analysis
            security_vulnerabilities = self._analyze_security_vulnerabilities(repo_dir) if repo_dir else []
            
            # Code quality analysis
            code_quality_issues = self._analyze_code_quality_issues(repo_dir) if repo_dir else []
            
            # Architecture pattern detection
            architecture_patterns = self._detect_architecture_patterns(repo_dir) if repo_dir else []
            
            # Calculate ACID scores
            acid_scores = self._calculate_acid_scores_detailed(code_metrics, security_vulnerabilities, code_quality_issues)
            
            # Extract technical frameworks
            frameworks = self._extract_frameworks_advanced(repo_dir) if repo_dir else []
            
            # Analyze file structure
            file_structure = self._analyze_file_structure(repo_dir) if repo_dir else {}
            
            # Calculate complexity metrics
            complexity_metrics = self._calculate_complexity_metrics(repo_dir) if repo_dir else {}
            
            # Test coverage analysis
            test_coverage = self._analyze_test_coverage(repo_dir) if repo_dir else None
            
            # Performance metrics
            performance_metrics = self._analyze_performance_metrics(repo_dir) if repo_dir else {}
            
            return DetailedRepositoryMetrics(
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
                total_contributors=len(contributors) if contributors else 0,
                code_quality_score=acid_scores.get('quality_score', 0),
                security_score=acid_scores.get('security_score', 0),
                maintainability_score=acid_scores.get('maintainability_score', 0),
                reliability_score=acid_scores.get('reliability_score', 0),
                bugs=acid_scores.get('bugs', 0),
                vulnerabilities=acid_scores.get('vulnerabilities', 0),
                code_smells=acid_scores.get('code_smells', 0),
                bugs_grade=acid_scores.get('bugs_grade', 'A'),
                vulnerabilities_grade=acid_scores.get('vulnerabilities_grade', 'A'),
                code_smells_grade=acid_scores.get('code_smells_grade', 'A'),
                security_vulnerabilities=security_vulnerabilities,
                code_quality_issues=code_quality_issues,
                dependencies=dependencies,
                architecture_patterns=architecture_patterns,
                contributors=contributors or [],
                top_contributors=(contributors or [])[:5],
                commit_frequency={},
                recent_activity=commits[:10] if commits else [],
                frameworks=frameworks,
                databases=[],
                cloud_services=[],
                ci_cd=[],
                testing_frameworks=[],
                file_structure=file_structure,
                complexity_metrics=complexity_metrics,
                test_coverage=test_coverage,
                performance_metrics=performance_metrics
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
    
    def _analyze_code_metrics_advanced(self, repo_dir: str) -> Dict:
        """Advanced code metrics analysis"""
        metrics = {
            'total_lines': 0,
            'total_files': 0,
            'languages': {},
            'complexity': 0,
            'duplication': 0,
            'comment_ratio': 0,
            'function_count': 0,
            'class_count': 0,
            'import_count': 0
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
                
                # Calculate comment ratio
                total_comments = cloc_data.get('SUM', {}).get('comment', 0)
                total_code = cloc_data.get('SUM', {}).get('code', 0)
                if total_code > 0:
                    metrics['comment_ratio'] = total_comments / total_code
            
            # Analyze Python files for additional metrics
            self._analyze_python_metrics(repo_dir, metrics)
            
            # Analyze JavaScript/TypeScript files
            self._analyze_js_metrics(repo_dir, metrics)
            
        except Exception as e:
            print(f"⚠️  Advanced code analysis failed: {e}")
        
        return metrics
    
    def _analyze_python_metrics(self, repo_dir: str, metrics: Dict):
        """Analyze Python-specific metrics"""
        python_files = []
        for root, dirs, files in os.walk(repo_dir):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for file in files:
                if file.endswith('.py'):
                    python_files.append(os.path.join(root, file))
        
        function_count = 0
        class_count = 0
        import_count = 0
        
        for file_path in python_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Parse AST
                tree = ast.parse(content)
                
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef):
                        function_count += 1
                    elif isinstance(node, ast.ClassDef):
                        class_count += 1
                    elif isinstance(node, (ast.Import, ast.ImportFrom)):
                        import_count += 1
                        
            except Exception as e:
                print(f"⚠️  Failed to analyze {file_path}: {e}")
        
        metrics['function_count'] = function_count
        metrics['class_count'] = class_count
        metrics['import_count'] = import_count
    
    def _analyze_js_metrics(self, repo_dir: str, metrics: Dict):
        """Analyze JavaScript/TypeScript-specific metrics"""
        js_files = []
        for root, dirs, files in os.walk(repo_dir):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for file in files:
                if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                    js_files.append(os.path.join(root, file))
        
        function_count = 0
        class_count = 0
        import_count = 0
        
        for file_path in js_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Simple regex-based analysis
                function_count += len(re.findall(r'function\s+\w+', content))
                function_count += len(re.findall(r'const\s+\w+\s*=\s*\(', content))
                function_count += len(re.findall(r'const\s+\w+\s*=\s*async\s*\(', content))
                
                class_count += len(re.findall(r'class\s+\w+', content))
                import_count += len(re.findall(r'import\s+.*from', content))
                import_count += len(re.findall(r'require\s*\(', content))
                
            except Exception as e:
                print(f"⚠️  Failed to analyze {file_path}: {e}")
        
        metrics['function_count'] += function_count
        metrics['class_count'] += class_count
        metrics['import_count'] += import_count
    
    def _extract_dependencies_detailed(self, repo_dir: str) -> List[DependencyInfo]:
        """Extract detailed dependency information with security analysis"""
        dependencies = []
        
        # Check for package.json
        package_json = os.path.join(repo_dir, 'package.json')
        if os.path.exists(package_json):
            try:
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    
                # Process dependencies
                for name, version in data.get('dependencies', {}).items():
                    dep = DependencyInfo(
                        name=name,
                        version=version,
                        type='direct',
                        vulnerabilities=self._check_dependency_vulnerabilities(name, version)
                    )
                    dependencies.append(dep)
                
                # Process dev dependencies
                for name, version in data.get('devDependencies', {}).items():
                    dep = DependencyInfo(
                        name=name,
                        version=version,
                        type='dev',
                        vulnerabilities=self._check_dependency_vulnerabilities(name, version)
                    )
                    dependencies.append(dep)
                    
            except Exception as e:
                print(f"⚠️  Failed to parse package.json: {e}")
        
        # Check for requirements.txt
        requirements_txt = os.path.join(repo_dir, 'requirements.txt')
        if os.path.exists(requirements_txt):
            try:
                with open(requirements_txt, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            parts = line.split('==')
                            name = parts[0]
                            version = parts[1] if len(parts) > 1 else 'latest'
                            
                            dep = DependencyInfo(
                                name=name,
                                version=version,
                                type='direct',
                                vulnerabilities=self._check_dependency_vulnerabilities(name, version)
                            )
                            dependencies.append(dep)
                            
            except Exception as e:
                print(f"⚠️  Failed to parse requirements.txt: {e}")
        
        return dependencies
    
    def _check_dependency_vulnerabilities(self, name: str, version: str) -> List[SecurityVulnerability]:
        """Check for known vulnerabilities in dependencies"""
        # This is a simplified implementation
        # In production, you'd use tools like npm audit, safety, etc.
        vulnerabilities = []
        
        # Mock vulnerability check
        if 'jquery' in name.lower() and version < '3.0.0':
            vulnerabilities.append(SecurityVulnerability(
                severity='high',
                type='XSS',
                description='jQuery XSS vulnerability',
                file='package.json',
                line=0,
                cwe_id='CWE-79'
            ))
        
        return vulnerabilities
    
    def _analyze_security_vulnerabilities(self, repo_dir: str) -> List[SecurityVulnerability]:
        """Analyze code for security vulnerabilities"""
        vulnerabilities = []
        
        # Check for common security issues
        security_patterns = {
            'sql_injection': [
                r'SELECT.*\+.*\$',
                r'INSERT.*\+.*\$',
                r'UPDATE.*\+.*\$',
                r'DELETE.*\+.*\$'
            ],
            'xss': [
                r'innerHTML\s*=',
                r'document\.write\s*\(',
                r'eval\s*\('
            ],
            'path_traversal': [
                r'\.\./',
                r'\.\.\\\\',
                r'%2e%2e%2f'
            ],
            'hardcoded_secrets': [
                r'password\s*=\s*["\'][^"\']+["\']',
                r'api_key\s*=\s*["\'][^"\']+["\']',
                r'secret\s*=\s*["\'][^"\']+["\']'
            ]
        }
        
        for root, dirs, files in os.walk(repo_dir):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for file in files:
                if file.endswith(('.py', '.js', '.ts', '.java', '.php', '.rb')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            lines = content.split('\n')
                            
                        for vuln_type, patterns in security_patterns.items():
                            for pattern in patterns:
                                matches = re.finditer(pattern, content, re.IGNORECASE)
                                for match in matches:
                                    line_num = content[:match.start()].count('\n') + 1
                                    vulnerabilities.append(SecurityVulnerability(
                                        severity='medium',
                                        type=vuln_type,
                                        description=f'Potential {vuln_type} vulnerability',
                                        file=file_path,
                                        line=line_num
                                    ))
                    except Exception as e:
                        print(f"⚠️  Failed to analyze {file_path}: {e}")
        
        return vulnerabilities
    
    def _analyze_code_quality_issues(self, repo_dir: str) -> List[CodeQualityIssue]:
        """Analyze code for quality issues"""
        issues = []
        
        # Check for common code quality issues
        quality_patterns = {
            'long_function': r'def\s+\w+\([^)]*\):\s*\n(?:[^\n]*\n){50,}',
            'long_parameter_list': r'def\s+\w+\([^)]*,[^)]*,[^)]*,[^)]*,[^)]*,[^)]*\):',
            'duplicate_code': r'def\s+(\w+)\([^)]*\):.*?def\s+\1\([^)]*\):',
            'magic_numbers': r'\b(?:[0-9]{3,}|[0-9]+\.[0-9]+)\b',
            'empty_catch': r'except[^:]*:\s*\n\s*pass',
            'todo_comments': r'#\s*TODO|#\s*FIXME|#\s*HACK'
        }
        
        for root, dirs, files in os.walk(repo_dir):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for file in files:
                if file.endswith(('.py', '.js', '.ts', '.java', '.php', '.rb')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        for issue_type, pattern in quality_patterns.items():
                            matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                            for match in matches:
                                line_num = content[:match.start()].count('\n') + 1
                                issues.append(CodeQualityIssue(
                                    type='code_smell',
                                    severity='minor',
                                    message=f'Potential {issue_type} issue',
                                    file=file_path,
                                    line=line_num,
                                    rule=issue_type,
                                    effort='5min'
                                ))
                    except Exception as e:
                        print(f"⚠️  Failed to analyze {file_path}: {e}")
        
        return issues
    
    def _detect_architecture_patterns(self, repo_dir: str) -> List[ArchitecturePattern]:
        """Detect architecture patterns in the codebase"""
        patterns = []
        
        # Check for MVC pattern
        mvc_evidence = []
        mvc_files = []
        if os.path.exists(os.path.join(repo_dir, 'models')) or os.path.exists(os.path.join(repo_dir, 'views')) or os.path.exists(os.path.join(repo_dir, 'controllers')):
            mvc_evidence.append('MVC directory structure detected')
            mvc_files.extend(['models/', 'views/', 'controllers/'])
        
        if mvc_evidence:
            patterns.append(ArchitecturePattern(
                pattern='MVC',
                confidence=0.8,
                evidence=mvc_evidence,
                files=mvc_files
            ))
        
        # Check for microservices pattern
        microservices_evidence = []
        microservices_files = []
        if os.path.exists(os.path.join(repo_dir, 'services')) or os.path.exists(os.path.join(repo_dir, 'microservices')):
            microservices_evidence.append('Microservices directory structure detected')
            microservices_files.extend(['services/', 'microservices/'])
        
        if microservices_evidence:
            patterns.append(ArchitecturePattern(
                pattern='Microservices',
                confidence=0.7,
                evidence=microservices_evidence,
                files=microservices_files
            ))
        
        return patterns
    
    def _calculate_acid_scores_detailed(self, code_metrics: Dict, vulnerabilities: List[SecurityVulnerability], quality_issues: List[CodeQualityIssue]) -> Dict:
        """Calculate detailed ACID scores"""
        total_lines = code_metrics.get('total_lines', 0)
        total_files = code_metrics.get('total_files', 0)
        
        # Count issues by severity
        bugs = len([issue for issue in quality_issues if issue.type == 'bug'])
        code_smells = len([issue for issue in quality_issues if issue.type == 'code_smell'])
        vulnerabilities_count = len(vulnerabilities)
        
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
        vulnerabilities_grade = get_grade(vulnerabilities_count, total_files)
        code_smells_grade = get_grade(code_smells, total_files)
        
        # Calculate quality scores
        quality_score = max(0, 100 - (bugs * 5) - (vulnerabilities_count * 20) - (code_smells * 0.1))
        security_score = max(0, 100 - (vulnerabilities_count * 30))
        maintainability_score = max(0, 100 - (code_smells * 0.2))
        reliability_score = max(0, 100 - (bugs * 10))
        
        return {
            'bugs': bugs,
            'vulnerabilities': vulnerabilities_count,
            'code_smells': code_smells,
            'bugs_grade': bugs_grade,
            'vulnerabilities_grade': vulnerabilities_grade,
            'code_smells_grade': code_smells_grade,
            'quality_score': quality_score,
            'security_score': security_score,
            'maintainability_score': maintainability_score,
            'reliability_score': reliability_score
        }
    
    def _extract_frameworks_advanced(self, repo_dir: str) -> List[str]:
        """Advanced framework detection"""
        frameworks = []
        
        # Check for framework indicators
        framework_indicators = {
            'react': ['package.json', 'src/App.js', 'src/App.tsx', 'jsx'],
            'nextjs': ['next.config.js', 'pages/', 'app/', 'next.config.mjs'],
            'vue': ['vue.config.js', 'src/App.vue', 'vue'],
            'angular': ['angular.json', 'src/app/', 'angular'],
            'express': ['app.js', 'server.js', 'index.js', 'express'],
            'django': ['manage.py', 'settings.py', 'django'],
            'flask': ['app.py', 'requirements.txt', 'flask'],
            'spring': ['pom.xml', 'build.gradle', 'spring'],
            'rails': ['Gemfile', 'config/application.rb', 'rails'],
            'laravel': ['artisan', 'composer.json', 'laravel'],
            'fastapi': ['main.py', 'requirements.txt', 'fastapi'],
            'tensorflow': ['requirements.txt', 'tensorflow'],
            'pytorch': ['requirements.txt', 'pytorch'],
            'pandas': ['requirements.txt', 'pandas'],
            'numpy': ['requirements.txt', 'numpy'],
            'selenium': ['requirements.txt', 'selenium'],
            'pytest': ['requirements.txt', 'pytest'],
            'jest': ['package.json', 'jest'],
            'cypress': ['package.json', 'cypress'],
            'docker': ['Dockerfile', 'docker-compose.yml'],
            'kubernetes': ['k8s/', 'kubernetes/', 'deployment.yaml'],
            'terraform': ['*.tf', 'terraform'],
            'ansible': ['playbook.yml', 'ansible']
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
                    # Check for specific file or directory
                    if os.path.exists(os.path.join(repo_dir, indicator)):
                        frameworks.append(framework)
                        break
        
        return list(set(frameworks))
    
    def _analyze_file_structure(self, repo_dir: str) -> Dict[str, Any]:
        """Analyze file structure and organization"""
        structure = {
            'directories': [],
            'files_by_extension': {},
            'depth': 0,
            'organization_score': 0
        }
        
        max_depth = 0
        file_extensions = {}
        
        for root, dirs, files in os.walk(repo_dir):
            # Skip hidden directories
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            depth = root.replace(repo_dir, '').count(os.sep)
            max_depth = max(max_depth, depth)
            
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext:
                    file_extensions[ext] = file_extensions.get(ext, 0) + 1
        
        structure['depth'] = max_depth
        structure['files_by_extension'] = file_extensions
        
        # Calculate organization score based on common patterns
        organization_indicators = 0
        if os.path.exists(os.path.join(repo_dir, 'src')):
            organization_indicators += 1
        if os.path.exists(os.path.join(repo_dir, 'tests')):
            organization_indicators += 1
        if os.path.exists(os.path.join(repo_dir, 'docs')):
            organization_indicators += 1
        if os.path.exists(os.path.join(repo_dir, 'config')):
            organization_indicators += 1
        
        structure['organization_score'] = min(100, organization_indicators * 25)
        
        return structure
    
    def _calculate_complexity_metrics(self, repo_dir: str) -> Dict[str, float]:
        """Calculate code complexity metrics"""
        metrics = {
            'cyclomatic_complexity': 0,
            'cognitive_complexity': 0,
            'maintainability_index': 0
        }
        
        # Simplified complexity calculation
        total_functions = 0
        total_conditionals = 0
        total_loops = 0
        
        for root, dirs, files in os.walk(repo_dir):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for file in files:
                if file.endswith(('.py', '.js', '.ts', '.java', '.php', '.rb')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        # Count functions
                        total_functions += len(re.findall(r'def\s+\w+', content))
                        total_functions += len(re.findall(r'function\s+\w+', content))
                        
                        # Count conditionals
                        total_conditionals += len(re.findall(r'if\s+', content))
                        total_conditionals += len(re.findall(r'elif\s+', content))
                        total_conditionals += len(re.findall(r'case\s+', content))
                        
                        # Count loops
                        total_loops += len(re.findall(r'for\s+', content))
                        total_loops += len(re.findall(r'while\s+', content))
                        
                    except Exception as e:
                        print(f"⚠️  Failed to analyze {file_path}: {e}")
        
        # Calculate cyclomatic complexity
        if total_functions > 0:
            metrics['cyclomatic_complexity'] = (total_conditionals + total_loops + total_functions) / total_functions
        
        # Calculate maintainability index (simplified)
        metrics['maintainability_index'] = max(0, 100 - (metrics['cyclomatic_complexity'] * 10))
        
        return metrics
    
    def _analyze_test_coverage(self, repo_dir: str) -> Optional[float]:
        """Analyze test coverage"""
        # This would require running test coverage tools
        # For now, return None
        return None
    
    def _analyze_performance_metrics(self, repo_dir: str) -> Dict[str, Any]:
        """Analyze performance-related metrics"""
        metrics = {
            'bundle_size': 0,
            'load_time': 0,
            'performance_score': 0
        }
        
        # Check for performance-related files
        if os.path.exists(os.path.join(repo_dir, 'package.json')):
            try:
                with open(os.path.join(repo_dir, 'package.json'), 'r') as f:
                    data = json.load(f)
                    
                # Check for performance optimizations
                scripts = data.get('scripts', {})
                if 'build' in scripts:
                    metrics['performance_score'] += 20
                if 'optimize' in scripts:
                    metrics['performance_score'] += 20
                if 'minify' in scripts:
                    metrics['performance_score'] += 20
                    
            except Exception as e:
                print(f"⚠️  Failed to analyze package.json: {e}")
        
        return metrics

def main():
    """Main function to test the advanced analyzer"""
    if len(os.sys.argv) != 2:
        print("Usage: python advanced_github_analyzer.py <username>")
        print("Example: python advanced_github_analyzer.py octocat")
        exit(1)
    
    username = os.sys.argv[1]
    
    print(f"🚀 Starting advanced analysis of {username}")
    print("=" * 60)
    
    analyzer = AdvancedGitHubAnalyzer()
    
    try:
        # Get user profile
        profile_data = analyzer.get_user_profile(username)
        if not profile_data:
            raise Exception(f"Failed to fetch profile for {username}")
        
        # Analyze first repository in detail
        if profile_data['repositories']:
            repo = profile_data['repositories'][0]
            print(f"🔍 Analyzing repository: {repo['full_name']}")
            
            detailed_metrics = analyzer.analyze_repository_detailed(repo)
            
            # Save results
            output_file = f"{username}_detailed_analysis.json"
            with open(output_file, 'w') as f:
                json.dump(asdict(detailed_metrics), f, indent=2, default=str)
            
            print(f"\n✅ Detailed analysis complete! Results saved to {output_file}")
            
            # Print summary
            print(f"\n📊 Detailed Analysis Summary:")
            print(f"   Repository: {detailed_metrics.full_name}")
            print(f"   Total lines: {detailed_metrics.total_lines:,}")
            print(f"   Total files: {detailed_metrics.total_files:,}")
            print(f"   Languages: {', '.join(detailed_metrics.languages.keys())}")
            print(f"   Frameworks: {', '.join(detailed_metrics.frameworks)}")
            
            print(f"\n🎯 Quality Scores:")
            print(f"   Code Quality: {detailed_metrics.code_quality_score:.1f}/100")
            print(f"   Security: {detailed_metrics.security_score:.1f}/100")
            print(f"   Maintainability: {detailed_metrics.maintainability_score:.1f}/100")
            print(f"   Reliability: {detailed_metrics.reliability_score:.1f}/100")
            
            print(f"\n🔍 ACID Scores:")
            print(f"   Bugs: {detailed_metrics.bugs_grade} ({detailed_metrics.bugs})")
            print(f"   Vulnerabilities: {detailed_metrics.vulnerabilities_grade} ({detailed_metrics.vulnerabilities})")
            print(f"   Code Smells: {detailed_metrics.code_smells_grade} ({detailed_metrics.code_smells})")
            
            print(f"\n🛡️  Security Issues:")
            for vuln in detailed_metrics.security_vulnerabilities[:5]:
                print(f"   {vuln.severity.upper()}: {vuln.type} in {vuln.file}:{vuln.line}")
            
            print(f"\n📦 Dependencies:")
            for dep in detailed_metrics.dependencies[:5]:
                vuln_count = len(dep.vulnerabilities)
                print(f"   {dep.name}@{dep.version} ({dep.type}) - {vuln_count} vulnerabilities")
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()

