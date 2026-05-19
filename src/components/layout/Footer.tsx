'use client';
import Link from 'next/link';

const CATEGORIES = [
  { label: 'טורבינות',  slug: 'turbines'  },
  { label: 'זוויתנים',  slug: 'angles'    },
  { label: 'ידיתנים',   slug: 'handpieces'},
  { label: 'מקדחים',   slug: 'drills'    },
  { label: 'סקילרים',   slug: 'scalers'   },
  { label: 'מנועים',    slug: 'motors'    },
  { label: 'כלי ניתוח', slug: 'surgery'   },
];

const SERVICES = [
  { label: 'קטלוג מוצרים',      href: '/catalog'              },
  { label: 'צור קשר',            href: '/contact'              },
  { label: 'איסוף לתיקון',       href: '/contact?service=repair'},
  { label: 'אודות DES',          href: '/#about'               },
];

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      dir="rtl"
      style={{ background: '#070e1a' }}
      className="relative overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(30,144,255,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* Column 1: Brand */}
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/des_logo.png"
                alt="DES"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>

            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              יבואן מורשה ומפיץ רשמי של ציוד דנטלי ורפואי מהמותגים המובילים בעולם.
              ISO 9001 · רישיון אמ&quot;ר.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/972548818681"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#128c7e', color: '#fff' }}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>

            <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
              ע&quot;מ 310737085
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3
              className="text-xs font-bold tracking-[0.18em] uppercase mb-5"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              קטגוריות
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalog?category=${cat.slug}`}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3
              className="text-xs font-bold tracking-[0.18em] uppercase mb-5"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              שירותים
            </h3>
            <ul className="space-y-2.5">
              {SERVICES.map((svc) => (
                <li key={svc.href}>
                  <Link
                    href={svc.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cert mini-badges */}
            <div className="mt-6 space-y-2">
              {[
                { label: 'ISO 9001 מוסמך', color: '#1e90ff' },
                { label: 'רישיון אמ"ר', color: '#22c55e' },
                { label: 'יבואן מורשה', color: '#f59e0b' },
              ].map((cert) => (
                <div key={cert.label} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: cert.color }}
                  />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {cert.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3
              className="text-xs font-bold tracking-[0.18em] uppercase mb-5"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              פרטי קשר
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#1e90ff] mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  רח&apos; מסריק 23, בת ים
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#1e90ff] flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <a
                  href="tel:035081868"
                  className="text-sm transition-colors"
                  dir="ltr"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  03-5081868
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#1e90ff] flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <a
                  href="mailto:info@destec.co.il"
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  info@destec.co.il
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#25d366] flex-shrink-0">
                  <WhatsAppIcon />
                </span>
                <a
                  href="https://wa.me/972548818681"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#25d366'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  054-8818681
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            &copy; {new Date().getFullYear()} DES שירותי ציוד רפואי ודנטלי. כל הזכויות שמורות.
          </span>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <span dir="ltr">destec.co.il</span>
            <span>·</span>
            <span>ISO 9001</span>
            <span>·</span>
            <span>אמ&quot;ר מורשה</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
