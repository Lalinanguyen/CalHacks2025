import type { AnalysisData, TechnicalAnalysis, MarketAnalysis, FounderAnalysis } from '@/agent/coordinator';

export interface ReportSection {
  score: number;
  summary: string;
  highlights: string[];
  concerns: string[];
  details: string;
}

export interface GeneratedReport {
  sections: {
    technical: ReportSection;
    market: ReportSection;
    founder: ReportSection;
  };
  overallScore: number;
  recommendation: string;
  investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  keyTakeaways: string[];
  nextSteps: string[];
}

/**
 * Generate comprehensive report from analysis data
 */
export function generateReport(data: AnalysisData): GeneratedReport {
  const technicalSection = formatTechnical(data.technical);
  const marketSection = formatMarket(data.market);
  const founderSection = formatFounder(data.founder);

  const overallScore = calculateScore(data);
  const investmentGrade = calculateGrade(overallScore);

  return {
    sections: {
      technical: technicalSection,
      market: marketSection,
      founder: founderSection,
    },
    overallScore,
    recommendation: generateRecommendation(data, overallScore),
    investmentGrade,
    keyTakeaways: generateKeyTakeaways(data),
    nextSteps: generateNextSteps(data, overallScore),
  };
}

/**
 * Format technical analysis into report section
 */
function formatTechnical(technical: TechnicalAnalysis): ReportSection {
  const highlights: string[] = [];
  const concerns: string[] = [];

  // Analyze code quality
  if (technical.codeQuality >= 80) {
    highlights.push(`Excellent code quality (${technical.codeQuality}/100)`);
  } else if (technical.codeQuality >= 60) {
    highlights.push(`Good code quality (${technical.codeQuality}/100)`);
  } else {
    concerns.push(`Code quality needs improvement (${technical.codeQuality}/100)`);
  }

  // Analyze commit activity
  if (technical.commitActivity.toLowerCase().includes('high')) {
    highlights.push('Active development with frequent commits');
  } else if (technical.commitActivity.toLowerCase().includes('low')) {
    concerns.push('Low commit activity may indicate stalled development');
  }

  // Analyze contributors
  if (technical.contributors >= 5) {
    highlights.push(`Strong team of ${technical.contributors} contributors`);
  } else if (technical.contributors <= 1) {
    concerns.push('Single contributor - bus factor risk');
  }

  // Analyze test coverage
  if (technical.testCoverage !== undefined) {
    if (technical.testCoverage >= 70) {
      highlights.push(`Good test coverage (${technical.testCoverage}%)`);
    } else {
      concerns.push(`Low test coverage (${technical.testCoverage}%)`);
    }
  }

  // Calculate technical score
  const score = calculateTechnicalScore(technical);

  return {
    score,
    summary: `Technical analysis reveals a ${score >= 75 ? 'strong' : score >= 50 ? 'moderate' : 'weak'} technical foundation`,
    highlights,
    concerns,
    details: `Repository uses ${technical.languages.join(', ')} with ${technical.architecture}. ${technical.documentation}`,
  };
}

/**
 * Format market analysis into report section
 */
function formatMarket(market: MarketAnalysis): ReportSection {
  const highlights: string[] = [];
  const concerns: string[] = [];

  // Analyze market size
  highlights.push(`Market size: ${market.marketSize}`);

  // Analyze opportunities
  if (market.opportunities.length > 0) {
    highlights.push(`${market.opportunities.length} key opportunities identified`);
    highlights.push(...market.opportunities.slice(0, 2));
  }

  // Analyze risks
  if (market.risks.length > 0) {
    concerns.push(`${market.risks.length} potential risks identified`);
    concerns.push(...market.risks.slice(0, 2));
  }

  // Analyze competition
  if (market.competitors.length > 5) {
    concerns.push(`Crowded market with ${market.competitors.length} known competitors`);
  } else if (market.competitors.length === 0) {
    concerns.push('No identified competitors - may indicate unproven market');
  }

  const score = calculateMarketScore(market);

  return {
    score,
    summary: `Market presents ${score >= 75 ? 'strong' : score >= 50 ? 'moderate' : 'limited'} potential`,
    highlights,
    concerns,
    details: `Target audience: ${market.targetAudience}. ${market.trends.length} key trends identified.`,
  };
}

/**
 * Format founder analysis into report section
 */
function formatFounder(founder: FounderAnalysis): ReportSection {
  const highlights: string[] = [];
  const concerns: string[] = [];

  // Analyze experience
  if (founder.experience.length >= 3) {
    highlights.push(`${founder.experience.length} relevant experiences`);
  }

  // Analyze previous companies
  if (founder.previousCompanies.length > 0) {
    highlights.push(`Experience at ${founder.previousCompanies.length} companies`);
  }

  // Analyze expertise
  if (founder.expertise.length >= 3) {
    highlights.push(`Diverse expertise in ${founder.expertise.slice(0, 3).join(', ')}`);
  }

  // Analyze credibility
  if (founder.credibility >= 80) {
    highlights.push(`High credibility score (${founder.credibility}/100)`);
  } else if (founder.credibility < 50) {
    concerns.push(`Low credibility score (${founder.credibility}/100)`);
  }

  const score = founder.credibility;

  return {
    score,
    summary: `Founder demonstrates ${score >= 75 ? 'strong' : score >= 50 ? 'moderate' : 'limited'} credentials`,
    highlights,
    concerns,
    details: `${founder.education}. ${founder.experience.length} relevant experiences.`,
  };
}

/**
 * Calculate overall score from all analysis data
 */
function calculateScore(data: AnalysisData): number {
  const technicalScore = calculateTechnicalScore(data.technical);
  const marketScore = calculateMarketScore(data.market);
  const founderScore = data.founder.credibility;

  // Weighted average: 40% technical, 35% market, 25% founder
  return Math.round(
    technicalScore * 0.4 +
    marketScore * 0.35 +
    founderScore * 0.25
  );
}

/**
 * Calculate technical score
 */
function calculateTechnicalScore(technical: TechnicalAnalysis): number {
  let score = 0;

  // Code quality (0-40 points)
  score += (technical.codeQuality / 100) * 40;

  // Contributors (0-20 points)
  score += Math.min(technical.contributors * 4, 20);

  // Test coverage (0-20 points)
  if (technical.testCoverage !== undefined) {
    score += (technical.testCoverage / 100) * 20;
  } else {
    score += 5; // Default if no test coverage data
  }

  // Issue resolution rate (0-20 points)
  const totalIssues = technical.issues.open + technical.issues.closed;
  if (totalIssues > 0) {
    const resolutionRate = technical.issues.closed / totalIssues;
    score += resolutionRate * 20;
  } else {
    score += 10; // Default if no issues
  }

  return Math.round(Math.min(score, 100));
}

/**
 * Calculate market score
 */
function calculateMarketScore(market: MarketAnalysis): number {
  let score = 40; // Base score

  // Market size (0-30 points)
  if (market.marketSize.toLowerCase().includes('billion')) {
    score += 30;
  } else if (market.marketSize.toLowerCase().includes('million')) {
    score += 20;
  } else {
    score += 10;
  }

  // Opportunities vs Risks (0-30 points)
  const opportunityScore = Math.min(market.opportunities.length * 7.5, 20);
  const riskPenalty = Math.min(market.risks.length * 2.5, 10);
  score += opportunityScore - riskPenalty;

  // Competition (0-20 points)
  if (market.competitors.length === 0) {
    score += 5; // Unproven market
  } else if (market.competitors.length <= 3) {
    score += 20; // Good opportunity
  } else if (market.competitors.length <= 6) {
    score += 15; // Moderate competition
  } else {
    score += 10; // High competition
  }

  return Math.round(Math.min(score, 100));
}

/**
 * Calculate investment grade
 */
function calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

/**
 * Generate overall recommendation
 */
function generateRecommendation(data: AnalysisData, overallScore: number): string {
  if (overallScore >= 85) {
    return 'Strong investment opportunity. This startup demonstrates excellent potential across technical, market, and founder dimensions. Recommended for immediate consideration.';
  } else if (overallScore >= 70) {
    return 'Good investment opportunity. The startup shows solid fundamentals with some areas for improvement. Recommended for further due diligence.';
  } else if (overallScore >= 55) {
    return 'Moderate investment opportunity. While there are promising aspects, significant concerns exist. Recommend close monitoring and conditional consideration.';
  } else {
    return 'Weak investment opportunity. Multiple red flags identified across key dimensions. Not recommended at this time without substantial improvements.';
  }
}

/**
 * Generate key takeaways
 */
function generateKeyTakeaways(data: AnalysisData): string[] {
  const takeaways: string[] = [];

  // Technical takeaway
  if (data.technical.codeQuality >= 80) {
    takeaways.push('Strong technical foundation with high code quality');
  } else {
    takeaways.push('Technical implementation needs improvement');
  }

  // Market takeaway
  if (data.market.opportunities.length >= 3) {
    takeaways.push(`${data.market.opportunities.length} significant market opportunities identified`);
  }

  // Founder takeaway
  if (data.founder.credibility >= 75) {
    takeaways.push('Experienced founder with strong credentials');
  } else {
    takeaways.push('Founder expertise could be strengthened');
  }

  return takeaways;
}

/**
 * Generate next steps based on analysis
 */
function generateNextSteps(data: AnalysisData, overallScore: number): string[] {
  const steps: string[] = [];

  if (overallScore >= 70) {
    steps.push('Schedule founder interview');
    steps.push('Request detailed financial projections');
    steps.push('Conduct customer reference calls');
  } else {
    steps.push('Request improvement plan for identified concerns');
    steps.push('Re-evaluate after 3-6 months of development');
  }

  if (data.technical.testCoverage && data.technical.testCoverage < 70) {
    steps.push('Recommend increasing test coverage to 70%+');
  }

  if (data.market.risks.length > 3) {
    steps.push('Develop risk mitigation strategies');
  }

  return steps;
}
