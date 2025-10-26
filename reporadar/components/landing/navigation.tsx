'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl text-gray-900">DueDeck</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              How It Works
            </Link>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
