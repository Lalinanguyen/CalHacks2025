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
            <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M2.69318 8.72727H0V0H2.8125C3.65909 0 4.38352 0.174716 4.9858 0.524148C5.58807 0.870739 6.04972 1.36932 6.37074 2.01989C6.69176 2.66761 6.85227 3.44318 6.85227 4.34659C6.85227 5.25568 6.69034 6.03835 6.36648 6.6946C6.04261 7.34801 5.57102 7.85085 4.9517 8.20312C4.33239 8.55256 3.57955 8.72727 2.69318 8.72727ZM1.05682 7.78977H2.625C3.34659 7.78977 3.9446 7.65057 4.41903 7.37216C4.89347 7.09375 5.24716 6.69744 5.48011 6.18324C5.71307 5.66903 5.82955 5.05682 5.82955 4.34659C5.82955 3.64205 5.71449 3.03551 5.48438 2.52699C5.25426 2.01562 4.91051 1.62358 4.45312 1.35085C3.99574 1.07528 3.42614 0.9375 2.74432 0.9375H1.05682V7.78977Z" fill="#FF8A24"/>
              <path d="M5.69318 8.72727H3V0H5.8125C6.65909 0 7.38352 0.174716 7.9858 0.524148C8.58807 0.870739 9.04972 1.36932 9.37074 2.01989C9.69176 2.66761 9.85227 3.44318 9.85227 4.34659C9.85227 5.25568 9.69034 6.03835 9.36648 6.6946C9.04261 7.34801 8.57102 7.85085 7.9517 8.20312C7.33239 8.55256 6.57955 8.72727 5.69318 8.72727ZM4.05682 7.78977H5.625C6.34659 7.78977 6.9446 7.65057 7.41903 7.37216C7.89347 7.09375 8.24716 6.69744 8.48011 6.18324C8.71307 5.66903 8.82955 5.05682 8.82955 4.34659C8.82955 3.64205 8.71449 3.03551 8.48438 2.52699C8.25426 2.01562 7.91051 1.62358 7.45312 1.35085C6.99574 1.07528 6.42614 0.9375 5.74432 0.9375H4.05682V7.78977Z" fill="#FF8A24"/>
            </svg>
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
