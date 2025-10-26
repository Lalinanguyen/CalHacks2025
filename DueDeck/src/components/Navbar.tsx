import Vector from '../imports/Vector';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8">
              <Vector />
            </div>
            <span className="text-gray-900">DueDeck</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-600 hover:text-orange-600 transition-colors">
              Home
            </a>
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-orange-600 transition-colors">
              Contact
            </a>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#home" className="block text-gray-600 hover:text-orange-600 transition-colors">
              Home
            </a>
            <a href="#features" className="block text-gray-600 hover:text-orange-600 transition-colors">
              Features
            </a>
            <a href="#about" className="block text-gray-600 hover:text-orange-600 transition-colors">
              About
            </a>
            <a href="#contact" className="block text-gray-600 hover:text-orange-600 transition-colors">
              Contact
            </a>
            <button className="w-full bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
