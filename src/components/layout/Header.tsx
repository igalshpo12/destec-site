'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, MessageCircle, Wrench, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_CATEGORIES = [
  { label: 'טורבינות, זוויתנים וידיתנים', href: '/catalog?category=turbines' },
  { label: 'כירורגיה והשתלות', href: '/catalog?category=surgery' },
  { label: 'סטריליזציה ותחזוקה', href: '/catalog?category=sterilization' },
  { label: 'שיקום הפה', href: '/catalog?category=restorative' },
  { label: 'פרופילקטיקה', href: '/catalog?category=prophylaxis' },
  { label: 'מנועים', href: '/catalog?category=motors' },
  { label: 'מקדחים', href: '/catalog?category=drills' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      dir="rtl"
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        scrolled && 'shadow-md'
      )}
    >
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-[#1a2b4a]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search — right side in RTL */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <form
            action="/catalog"
            method="get"
            className="relative"
          >
            <input
              type="search"
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="&#x2F00;&#x200F;&#x5D7;&#x5D9;&#x5E4;&#x5D5;&#x5E9;&#x20;&#x5DE;&#x5D5;&#x5E6;&#x5E8;&#x5D9;&#x5DD;..."
              dir="rtl"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pr-4 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:border-transparent placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e90ff]"
              aria-label="חפש"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Logo — center */}
        <div className="flex-1 flex justify-center">
          <Link href="/" aria-label="DES - דף הבית">
            <div className="flex items-center gap-2">
              <div className="bg-[#1a2b4a] rounded-full px-6 py-2 flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-widest">DES</span>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs text-gray-500 leading-tight">שירותי ציוד</div>
                <div className="text-xs text-gray-500 leading-tight">רפואי ודנטלי</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Actions — left side in RTL */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* WhatsApp */}
          <a
            href="https://wa.me/97235081868"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="p-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Repair pickup CTA */}
          <Link
            href="/contact?service=repair"
            className="hidden md:flex items-center gap-1.5 bg-[#1a2b4a] hover:bg-[#243d6b] text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
            <span>איסוף מכשיר לתיקון</span>
          </Link>

          {/* Cart */}
          <button
            className="relative p-2 text-gray-600 hover:text-[#1a2b4a] transition-colors"
            aria-label="עגלת קניות"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category nav bar */}
      <nav
        className="hidden lg:block border-t border-gray-100 bg-[#1a2b4a]"
        aria-label="קטגוריות"
      >
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-0 overflow-x-auto">
            {NAV_CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="block text-white/85 hover:text-white hover:bg-white/10 text-sm font-medium px-4 py-3 transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form action="/catalog" method="get" className="relative">
              <input
                type="search"
                name="q"
                placeholder="חיפוש מוצרים..."
                dir="rtl"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pr-4 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff]"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>
          <ul className="py-2">
            {NAV_CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#1a2b4a] text-sm font-medium border-b border-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact?service=repair"
                className="flex items-center gap-2 px-4 py-3 text-[#1a2b4a] font-medium text-sm"
                onClick={() => setMenuOpen(false)}
              >
                <Wrench className="w-4 h-4" />
                <span>איסוף מכשיר לתיקון</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
