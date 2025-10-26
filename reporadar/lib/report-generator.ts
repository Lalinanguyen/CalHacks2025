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
 * Create a complete investment analysis report from the provided analysis data.
 *
 * @param data - The input AnalysisData containing technical, market, and founder analyses
 * @returns A GeneratedReport containing formatted technical, market, and founder sections, an overall score and investment grade, a recommendation, key takeaways, and next steps
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
 * Produces a ReportSection summarizing the technical analysis of a project.
 *
 * Uses the provided technical metrics to derive highlights, concerns, a numeric score, a one-line summary, and a details string describing languages, architecture, and documentation.
 *
 * @param technical - TechnicalAnalysis containing code quality, commit activity, contributor count, test coverage, languages, architecture, and documentation
 * @returns A ReportSection with fields: score, summary, highlights, concerns, and details
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
 * Create a ReportSection summarizing the provided market analysis.
 *
 * @param market - Market analysis data used to derive highlights, concerns, and a numeric market score
 * @returns A ReportSection containing the market score, a concise summary of market potential, arrays of highlights and concerns, and a details string with target audience and trend count.
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
 * Create a report section that summarizes a founder's credentials, experience, expertise, and credibility.
 *
 * @param founder - FounderAnalysis object whose credibility, experience, previousCompanies, expertise, and education are used to derive the section
 * @returns A ReportSection containing a numeric score (from founder.credibility), a one-line summary of credential strength, arrays of highlights and concerns, and a brief details string
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
 * Computes the overall investment score from the provided analysis data.
 *
 * @returns The overall score as an integer between 0 and 100 (rounded to the nearest whole number).
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
 * Compute a technical evaluation score from the provided technical metrics.
 *
 * Uses code quality, number of contributors, test coverage, and issue resolution to produce a weighted score between 0 and 100.
 *
 * @param technical - TechnicalAnalysis containing codeQuality, contributors, optional testCoverage, and issues used to derive the score
 * @returns An integer between 0 and 100 representing the technical score
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
 * Compute a market attractiveness score from market analysis data.
 *
 * The score is a weighted aggregate based on market size, number of opportunities,
 * number of risks, and competitor count.
 *
 * @param market - Market analysis used to derive contributions from `marketSize`, `opportunities`, `risks`, and `competitors`
 * @returns The final market score as an integer between 0 and 100 (higher indicates a stronger market)
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
 * Map a numeric score (0–100) to an investment grade.
 *
 * @param score - Overall numeric score expected in the range 0 to 100
 * @returns `'A+'` if score is >= 95, `'A'` if >= 85, `'B+'` if >= 80, `'B'` if >= 70, `'C+'` if >= 65, `'C'` if >= 60, `'D'` if >= 50, `'F'` otherwise
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
 * Produce a recommendation message based on the overall investment score.
 *
 * @param overallScore - Overall numeric score (0–100) used to determine recommendation tier
 * @returns A recommendation message corresponding to the score:
 * - `>= 85`: "Strong investment opportunity..." 
 * - `>= 70`: "Good investment opportunity..."
 * - `>= 55`: "Moderate investment opportunity..."
 * - `< 55`: "Weak investment opportunity..."
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
 * Produce concise takeaways summarizing the technical, market, and founder assessments.
 *
 * Constructs an array of short, human-readable takeaways derived from the provided
 * AnalysisData: a technical statement based on code quality, an optional market
 * opportunity summary, and a founder statement based on founder credibility.
 *
 * @param data - The analysis input containing `technical`, `market`, and `founder` sections
 * @returns An array of takeaway strings highlighting key points from each assessment area
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
 * Suggests actionable next steps for due diligence or improvement based on the analysis and overall score.
 *
 * @param data - AnalysisData used to determine technical and market conditions that influence suggested steps (e.g., test coverage and market risks)
 * @param overallScore - Aggregate score that drives tiered recommendations (thresholds: >=70 for active due diligence, otherwise improvement-focused)
 * @returns An array of recommended next steps as human-readable strings
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