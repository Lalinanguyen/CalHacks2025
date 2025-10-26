import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AnalysisSection() {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    navigate('/analysis');
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-gray-900 mb-6">
            Transform any deal into an{' '}
            <span className="text-orange-600">investor-ready package</span> in 5 minutes
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            AI-powered due diligence with comprehensive analysis, risk assessment, and 
            intelligent insights. Make better investment decisions faster.
          </p>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-4">
              <input
                type="text"
                placeholder="https://example.com/deal-documentation"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
              <button 
                onClick={handleAnalyze}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Analyze Deal
              </button>
            </div>
            <p className="text-gray-500">
              Free tier includes 1 analysis. No credit card required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>5-minute analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>Investor-ready reports</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
