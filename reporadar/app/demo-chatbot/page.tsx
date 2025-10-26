"use client";

import React from "react";
import { MarketFitChatbot } from "@/components/chat/market-fit-chatbot";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock analysis data for demonstration
const mockAnalysisContext = {
  technical: {
    codeQuality: 85,
    commitActivity: "High",
    contributors: 12,
    languages: ["TypeScript", "Python", "Go"],
    testCoverage: 78,
    issues: { open: 15, closed: 142 },
  },
  market: {
    marketSize: "$50B Global Market",
    competitors: ["Competitor A", "Competitor B", "Competitor C"],
    trends: [
      "Increasing demand for AI-powered tools",
      "Shift to SaaS business models",
      "Growing enterprise adoption",
    ],
    opportunities: [
      "Underserved mid-market segment",
      "International expansion potential",
      "Platform integration possibilities",
    ],
    risks: [
      "High competition in core market",
      "Regulatory changes in AI space",
      "Customer acquisition costs",
    ],
  },
  founder: {
    experience: [
      "5 years as CTO at TechCorp",
      "3 years as Senior Engineer at StartupXYZ",
    ],
    previousCompanies: ["TechCorp", "StartupXYZ", "ConsultingFirm"],
    education: "MS Computer Science, Stanford University",
    expertise: ["Machine Learning", "Distributed Systems", "Product Management"],
    credibility: 82,
  },
  report: {
    overallScore: 83,
    investmentGrade: "B+",
    recommendation:
      "Promising investment opportunity with strong technical foundation and experienced team. Monitor competitive landscape closely.",
    keyTakeaways: [
      "Strong technical execution with high code quality",
      "Large addressable market with growth potential",
      "Experienced founder with relevant background",
      "Moderate competitive pressure requires differentiation",
    ],
    nextSteps: [
      "Conduct detailed competitive analysis",
      "Validate go-to-market strategy",
      "Review financial projections and unit economics",
      "Schedule follow-up due diligence meeting",
    ],
  },
};

export default function DemoChatbotPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Market Fit AI Assistant Demo</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <p className="text-muted-foreground">
            Try out the AI-powered chatbot that helps you understand startup market fit and investment potential.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analysis Summary */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sample Analysis</h2>

              <div className="space-y-4">
                {/* Overall Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Score</span>
                    <Badge variant="default" className="bg-green-600">
                      {mockAnalysisContext.report.overallScore}/100
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${mockAnalysisContext.report.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Investment Grade */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Investment Grade</span>
                  <Badge variant="outline" className="text-lg font-bold">
                    {mockAnalysisContext.report.investmentGrade}
                  </Badge>
                </div>

                {/* Scores Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2">Score Breakdown</h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Code Quality</span>
                    <span className="font-medium">{mockAnalysisContext.technical.codeQuality}/100</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Test Coverage</span>
                    <span className="font-medium">{mockAnalysisContext.technical.testCoverage}%</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Founder Credibility</span>
                    <span className="font-medium">{mockAnalysisContext.founder.credibility}/100</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2">Quick Stats</h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contributors</span>
                    <span className="font-medium">{mockAnalysisContext.technical.contributors}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Size</span>
                    <span className="font-medium">{mockAnalysisContext.market.marketSize}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Competitors</span>
                    <span className="font-medium">{mockAnalysisContext.market.competitors.length}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-3">Try asking about:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Market fit and opportunity size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Investment recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Technical quality assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Competitive landscape analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Risk factors and mitigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Founder background and credibility</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Chatbot Interface */}
          <div className="lg:col-span-2">
            <MarketFitChatbot
              analysisContext={mockAnalysisContext}
              className="h-[700px]"
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a demo using sample analysis data. In production, the chatbot
            would use real analysis results from your startup evaluations. The AI responses are currently
            generated using keyword-based logic but can be upgraded to use advanced LLM APIs like OpenAI
            or Anthropic for more sophisticated conversations.
          </p>
        </div>
      </div>
    </div>
  );
}
