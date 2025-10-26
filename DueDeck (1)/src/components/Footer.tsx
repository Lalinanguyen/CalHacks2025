import Vector from '../imports/Vector';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8">
                <Vector />
              </div>
              <span className="text-gray-900">DueDeck</span>
            </div>
            <p className="text-gray-600 mb-4">
              Building the future, one innovation at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">API</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2025 DueDeck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
