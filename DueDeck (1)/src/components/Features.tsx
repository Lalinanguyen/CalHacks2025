import { GitBranch, Users, Target, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Repository Analysis',
    description: 'Comprehensive GitHub repository analysis with code quality metrics and health scoring.',
  },
  {
    icon: Users,
    title: 'Contributor Insights',
    description: 'Track top contributors with git history, commit consistency, and detailed activity patterns.',
  },
  {
    icon: Target,
    title: 'Market Reach Analysis',
    description: 'Understand project purpose, target market, and real-world adoption metrics.',
  },
  {
    icon: BarChart3,
    title: 'Market Sizing (TAM/SAM/SOM)',
    description: 'Calculate total addressable market, serviceable market, and obtainable market share.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Performance',
    description: 'Visualize deployment and revenue trends compared to market potential with detailed charts.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Assessment',
    description: 'Identify and evaluate potential risk variables with comprehensive risk scoring.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            Comprehensive GitHub Repository Intelligence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get complete due diligence on any GitHub repository with market analysis, contributor insights, and risk assessment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group"
              >
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                  <Icon className="text-orange-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
