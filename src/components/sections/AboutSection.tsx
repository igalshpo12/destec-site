import Link from 'next/link';
import { Users, Calendar, MapPin, Phone } from 'lucide-react';

export default function AboutSection() {
  return (
    <section dir="rtl" className="py-16 bg-[#1a2b4a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-start">
            <div className="bg-white/10 rounded-2xl p-8 inline-flex flex-col items-center justify-center mb-6 border border-white/20">
              <div className="bg-white rounded-full px-10 py-4 mb-3">
                <span className="text-[#1a2b4a] font-extrabold text-4xl tracking-widest">DES</span>
              </div>
              <p className="text-white/70 text-sm text-center">שירותי ציוד רפואי ודנטלי</p>
            </div>

            <div className="space-y-3 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1e90ff]" />
                <span>פועלים מאז 1998</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1e90ff]" />
                <span>רח&apos; מסריק 23, בת ים</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1e90ff]" />
                <a href="tel:0350818681" className="hover:text-white transition-colors" dir="ltr">03-5081868</a>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1e90ff]" />
                <span>ע&quot;מ 310737085</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              אודות DES
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              DES נוסדה ב-1998 על ידי מיכאל שפוליאנסקי ומתמחה ביבוא, שיווק ושירות של ציוד דנטלי ורפואי
              מהמותגים המובילים בעולם: NSK, W&amp;H, KaVo, MK-dent, Nouvag, Bien-Air, Anthogyr, Dentsply Sirona ו-JINME.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              החברה מחזיקה ברישיון אמ&quot;ר ממשרד הבריאות ומוסמכת ISO 9001 — ערובה לאיכות ואמינות בכל תהליך, מהייבוא
              ועד לאחריות וטיפול שוטף בציוד.
            </p>
            <p className="text-white/70 leading-relaxed mb-6">
              בין לקוחותינו: שירותי בריאות כללית, מכבי דנט, בית חולים איכילוב, Atidant, Lorian Medic ועוד.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1e90ff] hover:bg-[#0d7fe0] text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
