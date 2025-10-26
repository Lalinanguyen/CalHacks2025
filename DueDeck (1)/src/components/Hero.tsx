import { ArrowRight } from 'lucide-react';
import { DocumentSwapAnimation } from './DocumentSwapAnimation';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-white to-orange-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-gray-900 mb-6">
              Due Diligence Transformed
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Experience cutting-edge solutions designed to transform your business. 
              Our platform delivers excellence with a modern approach that puts your needs first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/product">
                <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  Get Started <ArrowRight size={20} />
                </button>
              </Link>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Document Animation */}
          <div className="flex-1 flex justify-center">
            <DocumentSwapAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
