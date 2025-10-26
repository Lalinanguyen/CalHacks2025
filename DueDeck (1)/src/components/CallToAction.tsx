import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-white mb-6">
          Ready to Get Started
        </h2>
        <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have transformed their business with our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
            Start Free Trial <ArrowRight size={20} />
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}
