import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-[#1a2b4a] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="bg-white/10 rounded-full px-6 py-2 inline-flex items-center justify-center mb-4">
              <span className="font-bold text-2xl tracking-widest">DES</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              שירותי ציוד רפואי ודנטלי — יבואן מורשה של ציוד דנטלי ורפואי מהמותגים המובילים בעולם.
            </p>
            <p className="text-white/50 text-xs mt-2">ע&quot;מ 310737085</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">ניווט מהיר</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">דף הבית</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">קטלוג מוצרים</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">צור קשר</Link></li>
              <li><Link href="/contact?service=repair" className="hover:text-white transition-colors">איסוף מכשיר לתיקון</Link></li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-semibold mb-4 text-white">הסמכות ורישיונות</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                ISO 9001 מוסמך (ARS)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                רישיון אמ&quot;ר — משרד הבריאות
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                יבואן מורשה
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">יצירת קשר</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-[#1e90ff]" />
                <span>רח&apos; מסריק 23, בת ים</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#1e90ff]" />
                <a href="tel:0350818681" className="hover:text-white transition-colors" dir="ltr">03-5081868</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#1e90ff]" />
                <a href="mailto:info@destec.co.il" className="hover:text-white transition-colors">info@destec.co.il</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 flex-shrink-0 text-green-400" />
                <a
                  href="https://wa.me/97235081868"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <span>&copy; {new Date().getFullYear()} DES שירותי ציוד רפואי ודנטלי. כל הזכויות שמורות.</span>
          <span dir="ltr">destec.co.il</span>
        </div>
      </div>
    </footer>
  );
}
