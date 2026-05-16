import Link from 'next/link';

export default function FeaturedSystems() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16"
      style={{ background: '#f7f8fa' }}
      aria-label="מערכות מובחרות"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-10">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
          style={{ color: '#1e90ff' }}
        >
          מערכות מובחרות
        </p>
        <h2
          className="font-black"
          style={{ color: '#1a2b4a', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          טכנולוגיה מוכחת
        </h2>
      </div>

      {/* Two-panel grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* SURTRON panel */}
          <div
            className="relative overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              borderRadius: '16px',
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: '3px', background: '#1e90ff', borderRadius: '16px 16px 0 0' }} />

            <div className="p-8">
              {/* Tag pill */}
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6"
                style={{ background: '#1a2b4a', color: '#ffffff', letterSpacing: '0.06em' }}
              >
                Electrosurgery Unit
              </span>

              {/* Heading */}
              <h3
                className="font-black mb-1"
                style={{ color: '#1a2b4a', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: 1.05 }}
              >
                SURTRON
              </h3>

              {/* Subtitle */}
              <p className="font-semibold mb-4" style={{ color: '#1e90ff', fontSize: '1rem' }}>
                מכשיר אלקטרוכירורגיה
              </p>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#4a5568', maxWidth: '380px' }}>
                מכשיר SURTRON לאלקטרוכירורגיה מאפשר עבודה מדויקת ברקמות רכות
              </p>

              {/* Spec row */}
              <div
                className="text-sm font-medium px-4 py-2.5 rounded-lg mb-6 inline-block"
                style={{ background: '#f0f7ff', color: '#1a2b4a', border: '1px solid #dbeafe' }}
              >
                ביפולרי / מונופולרי · הגנות דיגיטליות
              </div>

              <div className="block" />

              <Link
                href="/catalog?category=surgery"
                className="inline-flex items-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#1a2b4a', color: '#fff' }}
              >
                ציוד כירורגי
                <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
              </Link>
            </div>
          </div>

          {/* Nouvag panel */}
          <div
            className="relative overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              borderRadius: '16px',
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: '3px', background: '#1e90ff', borderRadius: '16px 16px 0 0' }} />

            <div className="p-8">
              {/* Tag pill */}
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6"
                style={{ background: '#1e90ff', color: '#ffffff', letterSpacing: '0.06em' }}
              >
                Switzerland
              </span>

              {/* Heading */}
              <h3
                className="font-black mb-1"
                style={{ color: '#1a2b4a', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: 1.05 }}
              >
                Nouvag
              </h3>

              {/* Subtitle */}
              <p className="font-semibold mb-4" style={{ color: '#1e90ff', fontSize: '1rem' }}>
                מנועי כירורגיה
              </p>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#4a5568', maxWidth: '380px' }}>
                מנועי Nouvag מביאים דיוק לכירורגים
              </p>

              {/* Spec row */}
              <div
                className="text-sm font-medium px-4 py-2.5 rounded-lg mb-6 inline-block"
                style={{ background: '#f0f7ff', color: '#1a2b4a', border: '1px solid #dbeafe' }}
              >
                ביפולרי / מונופולרי · Bone surgery
              </div>

              <div className="block" />

              <Link
                href="/catalog?manufacturer=Nouvag"
                className="inline-flex items-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#1e90ff', color: '#fff' }}
              >
                מנועי Nouvag
                <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
