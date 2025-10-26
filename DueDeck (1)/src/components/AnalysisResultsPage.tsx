import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, FileText, DollarSign, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnalysisResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-gray-900">Deal Analysis Report</h1>
                <p className="text-gray-600">Generated on October 26, 2025</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Share2 size={20} />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Download size={20} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Score */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-8 mb-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="mb-2">Overall Deal Score</h2>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-6xl">7.8</span>
                <span className="text-2xl opacity-80">/10</span>
              </div>
              <p className="text-orange-100">
                This deal shows strong potential with moderate risk factors. 
                Financial projections are solid, but some operational concerns require attention.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-orange-100 mb-1">Financial Health</p>
                <p className="text-2xl">8.5/10</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-orange-100 mb-1">Market Position</p>
                <p className="text-2xl">7.2/10</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-orange-100 mb-1">Risk Level</p>
                <p className="text-2xl">Medium</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-orange-100 mb-1">Confidence</p>
                <p className="text-2xl">High</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-4">Executive Summary</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              The target company demonstrates strong financial performance with consistent revenue 
              growth of 28% YoY and healthy EBITDA margins of 22%. The business operates in a growing 
              market with favorable tailwinds and has established a defensible competitive position.
            </p>
            <p>
              Key strengths include a diversified customer base, recurring revenue model, and experienced 
              management team. Primary concerns center around customer concentration in the top 3 accounts 
              (45% of revenue) and pending litigation that could impact operations.
            </p>
            <p>
              The valuation appears reasonable at 8.5x EBITDA, within industry norms. We recommend 
              proceeding with negotiations while conducting deeper due diligence on customer relationships 
              and legal matters.
            </p>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-6">Risk Assessment</h2>
          <div className="space-y-4">
            {/* High Risk */}
            <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-900">Customer Concentration Risk</h3>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">High</span>
                </div>
                <p className="text-gray-600 mb-2">
                  Top 3 customers represent 45% of total revenue. Loss of any major customer would 
                  significantly impact financial performance.
                </p>
                <p className="text-gray-700">
                  <strong>Recommendation:</strong> Review customer contracts, assess switching costs, 
                  and evaluate customer satisfaction scores.
                </p>
              </div>
            </div>

            {/* Medium Risk */}
            <div className="flex gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-900">Pending Litigation</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">Medium</span>
                </div>
                <p className="text-gray-600 mb-2">
                  Two ongoing legal disputes with potential liability up to $2.3M. Outcomes uncertain 
                  but management expects favorable resolution.
                </p>
                <p className="text-gray-700">
                  <strong>Recommendation:</strong> Engage legal counsel for detailed review and consider 
                  escrow provisions in deal structure.
                </p>
              </div>
            </div>

            {/* Low Risk */}
            <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-900">Regulatory Compliance</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Low</span>
                </div>
                <p className="text-gray-600 mb-2">
                  Company maintains strong compliance records with all required certifications current. 
                  No regulatory violations in the past 5 years.
                </p>
                <p className="text-gray-700">
                  <strong>Recommendation:</strong> Standard compliance verification during final due diligence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Analysis */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-gray-900 mb-6">Key Financial Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600">Annual Revenue</p>
                    <p className="text-gray-900">$18.5M</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={20} />
                  <span>28%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600">EBITDA</p>
                    <p className="text-gray-900">$4.1M</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={20} />
                  <span>22%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600">Gross Margin</p>
                    <p className="text-gray-900">68%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={20} />
                  <span>3%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600">Cash Runway</p>
                    <p className="text-gray-900">24 months</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <span>Stable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Valuation */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-gray-900 mb-6">Valuation Analysis</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">Asking Price</p>
                <p className="text-gray-900 text-2xl">$35.0M</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue Multiple</span>
                  <span className="text-gray-900">1.9x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">EBITDA Multiple</span>
                  <span className="text-gray-900">8.5x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Industry Average</span>
                  <span className="text-gray-600">7.5x - 9.5x</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle2 size={20} />
                  <span>Within Market Range</span>
                </div>
                <p className="text-gray-600">
                  Valuation is reasonable given growth rate and market position. 
                  Premium justified by recurring revenue model and customer retention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Analyzed */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-6">Documents Analyzed</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <FileText className="text-orange-600" size={24} />
              <div>
                <p className="text-gray-900">Financial Statements</p>
                <p className="text-gray-500">12 documents</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <FileText className="text-orange-600" size={24} />
              <div>
                <p className="text-gray-900">Legal Contracts</p>
                <p className="text-gray-500">8 documents</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <FileText className="text-orange-600" size={24} />
              <div>
                <p className="text-gray-900">Market Research</p>
                <p className="text-gray-500">5 documents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-6">Next Steps & Recommendations</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Conduct Customer Reference Calls</h3>
                <p className="text-gray-600">
                  Interview top 5 customers to assess satisfaction, contract terms, and likelihood of renewal. 
                  Focus on understanding value proposition and switching costs.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Legal Due Diligence</h3>
                <p className="text-gray-600">
                  Engage external counsel to review pending litigation and provide detailed risk assessment. 
                  Consider deal structure adjustments to mitigate exposure.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Quality of Earnings Review</h3>
                <p className="text-gray-600">
                  Commission independent QoE analysis to validate financial statements and identify 
                  any accounting adjustments or non-recurring items.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Management Presentations</h3>
                <p className="text-gray-600">
                  Schedule detailed sessions with CEO, CFO, and key department heads to understand 
                  strategy, operations, and growth plans.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8 pb-8">
          <Link to="/" className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            New Analysis
          </Link>
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Schedule Review Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
