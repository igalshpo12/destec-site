'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MessageCircle, Wrench, Menu, X } from 'lucide-react';
import { NAV_CATEGORIES } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,14,26,0.97)' : '#070e1a',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.07), 0 8px 24px rgba(0,0,0,0.3)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 transition-colors rounded-lg"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <form action="/catalog" method="get" className="relative">
            <input
              type="search"
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="חיפוש מוצרים..."
              dir="rtl"
              className="w-full rounded-lg py-2 pr-4 pl-9 text-sm transition-all duration-200"
              style={{
                background: searchFocused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
                border: searchFocused ? '1px solid rgba(30,144,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 transition-colors"
              aria-label="חפש"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Logo — center */}
        <div className="flex-1 flex justify-center">
          <Link href="/" aria-label="DES - דף הבית" className="flex items-center gap-3 group">
            <div
              className="rounded-lg px-4 py-1.5 flex items-center justify-center transition-all duration-200 group-hover:bg-[#1e90ff]"
              style={{ background: '#1a2b4a', border: '1px solid rgba(30,144,255,0.3)' }}
            >
              <span
                className="font-black tracking-[0.15em]"
                style={{ color: '#fff', fontSize: '1.1rem' }}
              >
                DES
              </span>
            </div>
            <div className="hidden sm:block">
              <div
                className="text-xs font-medium leading-tight"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                שירותי ציוד
              </div>
              <div
                className="text-xs font-medium leading-tight"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                רפואי ודנטלי
              </div>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* WhatsApp */}
          <a
            href="https://wa.me/972548818681"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="p-2 rounded-lg transition-all duration-150"
            style={{ color: '#25d366' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(37,211,102,0.1)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '';
            }}
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Repair pickup CTA */}
          <Link
            href="/contact?service=repair"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-150 whitespace-nowrap"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(30,144,255,0.15)';
              el.style.color = '#fff';
              el.style.borderColor = 'rgba(30,144,255,0.4)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.08)';
              el.style.color = 'rgba(255,255,255,0.7)';
              el.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
            <span>איסוף לתיקון</span>
          </Link>
        </div>
      </div>

      {/* Category nav bar */}
      <nav
        className="hidden lg:block"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        aria-label="קטגוריות"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-center overflow-x-auto">
            {NAV_CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/catalog?category=${cat.slug}`}
                  className="block text-sm px-4 py-3 whitespace-nowrap transition-all duration-150 relative group"
                  style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = 'rgba(255,255,255,0.55)';
                  }}
                >
                  {cat.label}
                  {/* Underline indicator */}
                  <span
                    className="absolute bottom-0 right-0 left-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ background: '#1e90ff' }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden"
          style={{ background: '#070e1a', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Mobile search */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <form action="/catalog" method="get" className="relative">
              <input
                type="search"
                name="q"
                placeholder="חיפוש מוצרים..."
                dir="rtl"
                className="w-full rounded-lg py-2 pr-4 pl-9 text-sm"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </form>
          </div>
          <ul className="py-1">
            {NAV_CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/catalog?category=${cat.slug}`}
                  className="block px-4 py-3 text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact?service=repair"
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold"
                style={{ color: '#1e90ff' }}
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
