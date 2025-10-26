import { Code, Shield, TrendingUp } from 'lucide-react'

export function Features() {
  const features = [
    {
      title: 'Code Quality Analysis',
      description:
        'Deep dive into code architecture, design patterns, and technical debt with actionable insights from CodeRabbit AI.',
      icon: Code,
    },
    {
      title: 'Security & Vulnerability Scanning',
      description:
        'Comprehensive security analysis identifying vulnerabilities, deprecated APIs, and potential risks in your codebase.',
      icon: Shield,
    },
    {
      title: 'Repository Intelligence',
      description:
        'Automated data collection on commits, contributors, dependencies, and ecosystem health using autonomous AI agents.',
      icon: TrendingUp,
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Investment Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional-grade insights in minutes, not days
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group"
              >
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                  <Icon className="text-orange-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
