#!/usr/bin/env python3
"""
Test GitHub Analysis Pipeline
Demonstrates the complete analysis workflow for RepoRadar
"""

import os
import sys
import json
import time
from datetime import datetime
from github_scraper import GitHubScraper
from advanced_github_analyzer import AdvancedGitHubAnalyzer
from github_visualizer import GitHubVisualizer

def test_basic_analysis(username: str):
    """Test basic GitHub analysis"""
    print(f"🔍 Testing basic analysis for {username}")
    print("=" * 50)
    
    scraper = GitHubScraper()
    
    try:
        # Analyze user profile
        profile_metrics = scraper.analyze_user_profile(username)
        
        # Save results
        output_file = f"{username}_basic_analysis.json"
        with open(output_file, 'w') as f:
            json.dump(profile_metrics, f, indent=2, default=str)
        
        print(f"✅ Basic analysis complete! Results saved to {output_file}")
        
        # Print summary
        print(f"\n📊 Basic Analysis Summary:")
        print(f"   Username: {profile_metrics.username}")
        print(f"   Name: {profile_metrics.name}")
        print(f"   Bio: {profile_metrics.bio}")
        print(f"   Location: {profile_metrics.location}")
        print(f"   Company: {profile_metrics.company}")
        print(f"   Public repos: {profile_metrics.public_repos}")
        print(f"   Followers: {profile_metrics.followers}")
        print(f"   Following: {profile_metrics.following}")
        print(f"   Repositories analyzed: {len(profile_metrics.repositories)}")
        print(f"   Total stars received: {profile_metrics.total_stars_received}")
        print(f"   Total forks received: {profile_metrics.total_forks_received}")
        
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
        
        return profile_metrics
        
    except Exception as e:
        print(f"❌ Basic analysis failed: {e}")
        return None

def test_advanced_analysis(username: str):
    """Test advanced GitHub analysis"""
    print(f"\n🔍 Testing advanced analysis for {username}")
    print("=" * 50)
    
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
            output_file = f"{username}_advanced_analysis.json"
            with open(output_file, 'w') as f:
                json.dump(detailed_metrics, f, indent=2, default=str)
            
            print(f"✅ Advanced analysis complete! Results saved to {output_file}")
            
            # Print summary
            print(f"\n📊 Advanced Analysis Summary:")
            print(f"   Repository: {detailed_metrics.full_name}")
            print(f"   Description: {detailed_metrics.description}")
            print(f"   Language: {detailed_metrics.language}")
            print(f"   Total lines: {detailed_metrics.total_lines:,}")
            print(f"   Total files: {detailed_metrics.total_files:,}")
            print(f"   Total commits: {detailed_metrics.total_commits:,}")
            print(f"   Total contributors: {detailed_metrics.total_contributors}")
            print(f"   Stars: {detailed_metrics.stars:,}")
            print(f"   Forks: {detailed_metrics.forks:,}")
            print(f"   Open issues: {detailed_metrics.open_issues}")
            
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
                if vuln.description:
                    print(f"      {vuln.description}")
            
            print(f"\n📦 Dependencies:")
            for dep in detailed_metrics.dependencies[:5]:
                vuln_count = len(dep.vulnerabilities)
                print(f"   {dep.name}@{dep.version} ({dep.type}) - {vuln_count} vulnerabilities")
            
            print(f"\n🏗️  Architecture Patterns:")
            for pattern in detailed_metrics.architecture_patterns:
                print(f"   {pattern.pattern} (confidence: {pattern.confidence:.2f})")
                for evidence in pattern.evidence:
                    print(f"      - {evidence}")
            
            print(f"\n🛠️  Frameworks:")
            print(f"   {', '.join(detailed_metrics.frameworks)}")
            
            print(f"\n📁 File Structure:")
            print(f"   Organization score: {detailed_metrics.file_structure.get('organization_score', 0)}/100")
            print(f"   Max depth: {detailed_metrics.file_structure.get('depth', 0)}")
            print(f"   Files by extension: {detailed_metrics.file_structure.get('files_by_extension', {})}")
            
            print(f"\n🧮 Complexity Metrics:")
            for metric, value in detailed_metrics.complexity_metrics.items():
                print(f"   {metric}: {value:.2f}")
            
            return detailed_metrics
        else:
            print("❌ No repositories found for analysis")
            return None
            
    except Exception as e:
        print(f"❌ Advanced analysis failed: {e}")
        return None

def test_visualization(analysis_data: dict, username: str):
    """Test visualization generation"""
    print(f"\n🎨 Testing visualization generation for {username}")
    print("=" * 50)
    
    try:
        # Prepare data for visualization
        viz_data = {
            'profile_metrics': {
                'reliability_score': analysis_data.get('reliability_score', 0),
                'security_score': analysis_data.get('security_score', 0),
                'influence_score': analysis_data.get('influence_score', 0),
                'contribution_score': analysis_data.get('contribution_score', 0),
                'uniqueness_score': analysis_data.get('uniqueness_score', 0),
                'maintainability_score': analysis_data.get('maintainability_score', 0)
            },
            'repositories': [analysis_data] if analysis_data else [],
            'skills': analysis_data.get('skills', {}),
            'vulnerabilities': analysis_data.get('security_vulnerabilities', [])
        }
        
        visualizer = GitHubVisualizer(viz_data)
        visualizer.generate_all_visualizations()
        
        print("✅ Visualizations generated successfully!")
        print("   Open visualizations/index.html in your browser to view results")
        
    except Exception as e:
        print(f"❌ Visualization failed: {e}")

def run_complete_analysis(username: str):
    """Run complete analysis pipeline"""
    print(f"🚀 Starting complete GitHub analysis for {username}")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    start_time = time.time()
    
    # Step 1: Basic analysis
    print("\n📊 Step 1: Basic Profile Analysis")
    basic_results = test_basic_analysis(username)
    
    if not basic_results:
        print("❌ Basic analysis failed, stopping pipeline")
        return
    
    # Step 2: Advanced analysis
    print("\n🔍 Step 2: Advanced Repository Analysis")
    advanced_results = test_advanced_analysis(username)
    
    if not advanced_results:
        print("❌ Advanced analysis failed, stopping pipeline")
        return
    
    # Step 3: Visualization
    print("\n🎨 Step 3: Visualization Generation")
    test_visualization(advanced_results, username)
    
    # Summary
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"\n🎉 Complete analysis finished!")
    print(f"⏱️  Total time: {duration:.2f} seconds")
    print(f"📁 Output files:")
    print(f"   - {username}_basic_analysis.json")
    print(f"   - {username}_advanced_analysis.json")
    print(f"   - visualizations/index.html")
    print(f"   - visualizations/*.html (individual charts)")
    
    print(f"\n🔗 Next steps:")
    print(f"   1. Open visualizations/index.html to view results")
    print(f"   2. Review JSON files for detailed data")
    print(f"   3. Integrate analysis logic into RepoRadar backend")

def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python test_github_analysis.py <username>")
        print("Example: python test_github_analysis.py octocat")
        print("\nMake sure to set GITHUB_TOKEN environment variable:")
        print("export GITHUB_TOKEN=your_token_here")
        exit(1)
    
    username = sys.argv[1]
    
    # Check for GitHub token
    if not os.getenv('GITHUB_TOKEN'):
        print("❌ GITHUB_TOKEN environment variable not set")
        print("Get a token from: https://github.com/settings/tokens")
        print("Then run: export GITHUB_TOKEN=your_token_here")
        exit(1)
    
    # Run complete analysis
    run_complete_analysis(username)

if __name__ == "__main__":
    main()

