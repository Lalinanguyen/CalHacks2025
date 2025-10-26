import { Zap, Shield, Users, Sparkles, TrendingUp, Award } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing-fast performance that keeps you ahead of the competition.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security ensures your data is always protected and safe.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team using powerful collaboration tools.',
  },
  {
    icon: Sparkles,
    title: 'Modern Interface',
    description: 'Intuitive design that makes complex tasks simple and enjoyable.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Analytics',
    description: 'Track your progress with comprehensive analytics and insights.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized by industry leaders for excellence and innovation.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed, all in one place. Discover the features that make us different.
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
