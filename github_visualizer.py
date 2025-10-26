#!/usr/bin/env python3
"""
GitHub Analysis Visualizer
Creates charts and diagrams similar to gitroll for RepoRadar
"""

import json
import os
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from typing import Dict, List, Any
import networkx as nx
from collections import Counter, defaultdict

class GitHubVisualizer:
    def __init__(self, analysis_data: Dict):
        self.data = analysis_data
        self.output_dir = "visualizations"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def create_radar_chart(self, profile_metrics: Dict) -> go.Figure:
        """Create radar chart similar to gitroll's CURISMO overview"""
        categories = ['Reliability', 'Security', 'Influence', 'Contribution', 'Uniqueness', 'Maintainability']
        
        # Get scores (convert to 0-5 scale if needed)
        scores = [
            profile_metrics.get('reliability_score', 0) / 20,  # Convert from 0-100 to 0-5
            profile_metrics.get('security_score', 0) / 20,
            profile_metrics.get('influence_score', 0),
            profile_metrics.get('contribution_score', 0),
            profile_metrics.get('uniqueness_score', 0),
            profile_metrics.get('maintainability_score', 0) / 20
        ]
        
        # Create average line (simulate industry average)
        average_scores = [3.0, 3.0, 2.5, 2.5, 3.0, 3.0]
        
        fig = go.Figure()
        
        # Add user scores
        fig.add_trace(go.Scatterpolar(
            r=scores,
            theta=categories,
            fill='toself',
            name='Score',
            line_color='rgb(32, 32, 32)',
            fillcolor='rgba(32, 32, 32, 0.3)'
        ))
        
        # Add average line
        fig.add_trace(go.Scatterpolar(
            r=average_scores,
            theta=categories,
            fill='toself',
            name='Average',
            line_color='rgb(128, 128, 128)',
            fillcolor='rgba(128, 128, 128, 0.1)'
        ))
        
        fig.update_layout(
            polar=dict(
                radialaxis=dict(
                    visible=True,
                    range=[0, 5]
                )),
            showlegend=True,
            title="CURISMO® Overview",
            title_x=0.5,
            font=dict(size=12)
        )
        
        return fig
    
    def create_skills_sunburst(self, skills_data: Dict) -> go.Figure:
        """Create skills sunburst chart"""
        # Flatten skills data for sunburst
        sunburst_data = []
        
        for category, skills in skills_data.items():
            if skills:
                for skill in skills:
                    sunburst_data.append({
                        'ids': f"{category}-{skill}",
                        'labels': skill,
                        'parents': category,
                        'values': 1
                    })
        
        if not sunburst_data:
            # Create empty chart
            fig = go.Figure()
            fig.add_trace(go.Sunburst(
                ids=[],
                labels=[],
                parents=[],
                values=[]
            ))
        else:
            df = pd.DataFrame(sunburst_data)
            
            fig = go.Figure(go.Sunburst(
                ids=df['ids'],
                labels=df['labels'],
                parents=df['parents'],
                values=df['values'],
                branchvalues="total",
                hovertemplate='<b>%{label}</b><br>Skills: %{value}<extra></extra>'
            ))
        
        fig.update_layout(
            title="Skills",
            title_x=0.5,
            font=dict(size=12)
        )
        
        return fig
    
    def create_repositories_table(self, repositories: List[Dict]) -> go.Figure:
        """Create repositories table with ACID scores"""
        if not repositories:
            return go.Figure()
        
        # Prepare data for table
        repo_names = []
        statuses = []
        languages = []
        lines = []
        stars = []
        updated = []
        bug_grades = []
        vuln_grades = []
        smell_grades = []
        
        for repo in repositories[:10]:  # Limit to 10 repos
            repo_names.append(repo.get('name', ''))
            statuses.append('Passed' if repo.get('code_quality_score', 0) > 70 else 'Failed')
            languages.append(repo.get('language', ''))
            lines.append(f"{repo.get('total_lines', 0):,}")
            stars.append(repo.get('stars', 0))
            updated.append(repo.get('updated_at', '')[:10])
            bug_grades.append(f"{repo.get('bugs_grade', 'A')} {repo.get('bugs', 0)}")
            vuln_grades.append(f"{repo.get('vulnerabilities_grade', 'A')} {repo.get('vulnerabilities', 0)}")
            smell_grades.append(f"{repo.get('code_smells_grade', 'A')} {repo.get('code_smells', 0)}")
        
        fig = go.Figure(data=[go.Table(
            header=dict(
                values=['Repository', 'Status', 'Language', 'Lines', 'Stars', 'Updated', 'Bugs', 'Vulns', 'Smells'],
                fill_color='paleturquoise',
                align='left'
            ),
            cells=dict(
                values=[repo_names, statuses, languages, lines, stars, updated, bug_grades, vuln_grades, smell_grades],
                fill_color='lavender',
                align='left'
            )
        )])
        
        fig.update_layout(
            title="Repositories",
            title_x=0.5
        )
        
        return fig
    
    def create_contribution_calendar(self, contributions: Dict) -> go.Figure:
        """Create contribution calendar heatmap"""
        # This would require actual contribution data
        # For now, create a mock calendar
        dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
        values = np.random.poisson(3, len(dates))
        
        fig = go.Figure(data=go.Heatmap(
            z=[values],
            x=dates,
            y=['Contributions'],
            colorscale='Greens',
            showscale=False
        ))
        
        fig.update_layout(
            title="Contribution Calendar",
            title_x=0.5,
            xaxis_title="Date",
            yaxis_title=""
        )
        
        return fig
    
    def create_language_distribution(self, languages: Dict) -> go.Figure:
        """Create language distribution pie chart"""
        if not languages:
            return go.Figure()
        
        labels = list(languages.keys())
        values = list(languages.values())
        
        fig = go.Figure(data=[go.Pie(
            labels=labels,
            values=values,
            hovertemplate='<b>%{label}</b><br>Lines: %{value:,}<br>Percentage: %{percent}<extra></extra>'
        )])
        
        fig.update_layout(
            title="Language Distribution",
            title_x=0.5
        )
        
        return fig
    
    def create_activity_timeline(self, repositories: List[Dict]) -> go.Figure:
        """Create activity timeline"""
        if not repositories:
            return go.Figure()
        
        # Group by month
        activity_data = defaultdict(int)
        for repo in repositories:
            created_date = pd.to_datetime(repo.get('created_at', ''))
            month = created_date.strftime('%Y-%m')
            activity_data[month] += 1
        
        months = sorted(activity_data.keys())
        counts = [activity_data[month] for month in months]
        
        fig = go.Figure(data=go.Scatter(
            x=months,
            y=counts,
            mode='lines+markers',
            line=dict(color='blue', width=2),
            marker=dict(size=8)
        ))
        
        fig.update_layout(
            title="Repository Creation Timeline",
            title_x=0.5,
            xaxis_title="Month",
            yaxis_title="Repositories Created"
        )
        
        return fig
    
    def create_dependency_network(self, dependencies: List[Dict]) -> go.Figure:
        """Create dependency network graph"""
        if not dependencies:
            return go.Figure()
        
        # Create network graph
        G = nx.Graph()
        
        # Add nodes and edges
        for dep in dependencies:
            G.add_node(dep.get('name', ''), type='dependency')
            # Add connections based on common frameworks
            for other_dep in dependencies:
                if dep != other_dep and self._are_related(dep, other_dep):
                    G.add_edge(dep.get('name', ''), other_dep.get('name', ''))
        
        # Get positions
        pos = nx.spring_layout(G, k=1, iterations=50)
        
        # Create edge trace
        edge_x = []
        edge_y = []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
        
        edge_trace = go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=0.5, color='#888'),
            hoverinfo='none',
            mode='lines'
        )
        
        # Create node trace
        node_x = []
        node_y = []
        node_text = []
        for node in G.nodes():
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)
            node_text.append(node)
        
        node_trace = go.Scatter(
            x=node_x, y=node_y,
            mode='markers+text',
            hoverinfo='text',
            text=node_text,
            textposition="middle center",
            marker=dict(
                size=20,
                color='lightblue',
                line=dict(width=2, color='darkblue')
            )
        )
        
        fig = go.Figure(data=[edge_trace, node_trace],
                       layout=go.Layout(
                           title='Dependency Network',
                           title_x=0.5,
                           showlegend=False,
                           hovermode='closest',
                           margin=dict(b=20,l=5,r=5,t=40),
                           annotations=[ dict(
                               text="Dependency relationships",
                               showarrow=False,
                               xref="paper", yref="paper",
                               x=0.005, y=-0.002,
                               xanchor='left', yanchor='bottom',
                               font=dict(color='#888', size=12)
                           )],
                           xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                           yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)
                       ))
        
        return fig
    
    def _are_related(self, dep1: Dict, dep2: Dict) -> bool:
        """Check if two dependencies are related"""
        name1 = dep1.get('name', '').lower()
        name2 = dep2.get('name', '').lower()
        
        # Check for common frameworks
        frameworks = ['react', 'vue', 'angular', 'express', 'django', 'flask', 'spring']
        
        for framework in frameworks:
            if framework in name1 and framework in name2:
                return True
        
        return False
    
    def create_security_dashboard(self, vulnerabilities: List[Dict]) -> go.Figure:
        """Create security vulnerabilities dashboard"""
        if not vulnerabilities:
            return go.Figure()
        
        # Count by severity
        severity_counts = Counter(vuln.get('severity', 'unknown') for vuln in vulnerabilities)
        
        fig = go.Figure(data=[go.Bar(
            x=list(severity_counts.keys()),
            y=list(severity_counts.values()),
            marker_color=['red', 'orange', 'yellow', 'green'][:len(severity_counts)]
        )])
        
        fig.update_layout(
            title="Security Vulnerabilities by Severity",
            title_x=0.5,
            xaxis_title="Severity",
            yaxis_title="Count"
        )
        
        return fig
    
    def create_quality_trends(self, repositories: List[Dict]) -> go.Figure:
        """Create code quality trends over time"""
        if not repositories:
            return go.Figure()
        
        # Sort by creation date
        sorted_repos = sorted(repositories, key=lambda x: x.get('created_at', ''))
        
        dates = []
        quality_scores = []
        security_scores = []
        
        for repo in sorted_repos:
            dates.append(pd.to_datetime(repo.get('created_at', '')).strftime('%Y-%m'))
            quality_scores.append(repo.get('code_quality_score', 0))
            security_scores.append(repo.get('security_score', 0))
        
        fig = make_subplots(
            rows=2, cols=1,
            subplot_titles=('Code Quality Score', 'Security Score'),
            vertical_spacing=0.1
        )
        
        fig.add_trace(
            go.Scatter(x=dates, y=quality_scores, name='Quality', line=dict(color='blue')),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Scatter(x=dates, y=security_scores, name='Security', line=dict(color='red')),
            row=2, col=1
        )
        
        fig.update_layout(
            title="Quality Trends Over Time",
            title_x=0.5,
            height=600
        )
        
        return fig
    
    def generate_all_visualizations(self):
        """Generate all visualizations"""
        print("🎨 Generating visualizations...")
        
        # Extract data
        profile_metrics = self.data.get('profile_metrics', {})
        repositories = self.data.get('repositories', [])
        skills = self.data.get('skills', {})
        vulnerabilities = self.data.get('vulnerabilities', [])
        
        # Generate charts
        charts = {
            'radar_chart': self.create_radar_chart(profile_metrics),
            'skills_sunburst': self.create_skills_sunburst(skills),
            'repositories_table': self.create_repositories_table(repositories),
            'contribution_calendar': self.create_contribution_calendar({}),
            'language_distribution': self.create_language_distribution({}),
            'activity_timeline': self.create_activity_timeline(repositories),
            'dependency_network': self.create_dependency_network([]),
            'security_dashboard': self.create_security_dashboard(vulnerabilities),
            'quality_trends': self.create_quality_trends(repositories)
        }
        
        # Save charts
        for name, fig in charts.items():
            file_path = os.path.join(self.output_dir, f"{name}.html")
            fig.write_html(file_path)
            print(f"✅ Saved {name}.html")
        
        # Create index page
        self.create_index_page(charts)
        
        print(f"🎉 All visualizations saved to {self.output_dir}/")
    
    def create_index_page(self, charts: Dict):
        """Create index page with all visualizations"""
        html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>GitHub Analysis Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .chart-container { margin: 20px 0; }
        iframe { width: 100%; height: 500px; border: none; }
        h1 { color: #333; }
        h2 { color: #666; }
    </style>
</head>
<body>
    <h1>GitHub Analysis Dashboard</h1>
    <p>Comprehensive analysis of GitHub repositories and profiles</p>
"""
        
        for name, fig in charts.items():
            title = name.replace('_', ' ').title()
            html_content += f"""
    <div class="chart-container">
        <h2>{title}</h2>
        <iframe src="{name}.html"></iframe>
    </div>
"""
        
        html_content += """
</body>
</html>
"""
        
        with open(os.path.join(self.output_dir, 'index.html'), 'w') as f:
            f.write(html_content)

def main():
    """Main function to test the visualizer"""
    if len(os.sys.argv) != 2:
        print("Usage: python github_visualizer.py <analysis_file.json>")
        print("Example: python github_visualizer.py octocat_analysis.json")
        exit(1)
    
    analysis_file = os.sys.argv[1]
    
    if not os.path.exists(analysis_file):
        print(f"❌ Analysis file not found: {analysis_file}")
        exit(1)
    
    print(f"📊 Loading analysis data from {analysis_file}")
    
    try:
        with open(analysis_file, 'r') as f:
            analysis_data = json.load(f)
        
        visualizer = GitHubVisualizer(analysis_data)
        visualizer.generate_all_visualizations()
        
    except Exception as e:
        print(f"❌ Visualization failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()

