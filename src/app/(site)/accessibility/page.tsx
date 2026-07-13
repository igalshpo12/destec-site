import { Metadata } from 'next';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description:
    'הצהרת הנגישות של DES — שירותי ציוד רפואי ודנטלי. האתר עומד בתקן הישראלי ת"י 5568 (WCAG 2.1 AA). דרכי פנייה בנושאי נגישות.',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold mt-10 mb-3" style={{ color: '#1a2b4a' }}>
      {children}
    </h2>
  );
}

export default function AccessibilityStatementPage() {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ color: '#0d1929' }}>
        הצהרת נגישות
      </h1>
      <p className="text-gray-500 mb-8">עודכן ביוני 2026</p>

      <p className="text-gray-700 leading-relaxed">
        חברת <strong>DES — שירותי ציוד רפואי ודנטלי</strong> רואה חשיבות רבה במתן שירות שוויוני
        ונגיש לכלל לקוחותיה, לרבות אנשים עם מוגבלות. אנו פועלים להנגשת אתר האינטרנט שלנו
        (destec.co.il) ולהבטיח שכל אדם יוכל לגלוש בו בנוחות, בעצמאות ובכבוד.
      </p>

      <H2>רמת הנגישות באתר</H2>
      <p className="text-gray-700 leading-relaxed">
        האתר הונגש בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג–2013,
        ובהתאם להוראות התקן הישראלי <strong>ת&quot;י 5568</strong> המבוסס על הנחיות{' '}
        <span dir="ltr">WCAG 2.1</span> של ארגון <span dir="ltr">W3C</span> ברמת התאמה{' '}
        <strong>AA</strong>.
      </p>

      <H2>מה הונגש באתר</H2>
      <ul className="list-disc pr-6 space-y-2 text-gray-700 leading-relaxed">
        <li>מבנה דפים סמנטי, היררכיית כותרות ברורה וטקסט חלופי לתמונות.</li>
        <li>ניווט מלא באמצעות מקלדת וקישור &quot;דלג לתוכן הראשי&quot;.</li>
        <li>ניגודיות צבעים תקינה וטקסט הניתן להגדלה.</li>
        <li>תאימות לקוראי מסך וטכנולוגיות מסייעות.</li>
        <li>
          תפריט נגישות ייעודי (לחצן הנגישות בפינת המסך) המאפשר התאמה אישית: הגדלת/הקטנת טקסט,
          ניגודיות גבוהה, גווני אפור, ספיה, היפוך צבעים, גופן קריא, הדגשת קישורים וכותרות,
          עצירת אנימציות, סמן גדול והבלטת מיקוד.
        </li>
      </ul>

      <H2>החרגות ומגבלות ידועות</H2>
      <p className="text-gray-700 leading-relaxed">
        אנו ממשיכים לשפר את נגישות האתר באופן שוטף. ייתכן שחלקים מסוימים, ובכללם רכיבי צד-שלישי
        (כגון מפת Google, צפיית 360° במוצרים ותכנים מוטמעים), טרם הונגשו במלואם. אנו פועלים
        לתיקון הליקויים בהקדם. אם נתקלתם בתוכן שאינו נגיש, נשמח שתעדכנו אותנו ונטפל בכך.
      </p>

      <H2>פנייה בנושאי נגישות</H2>
      <p className="text-gray-700 leading-relaxed mb-4">
        נתקלתם בבעיה או שיש לכם הצעה לשיפור הנגישות? נשמח לקבל את פנייתכם ונשתדל להגיב בהקדם האפשרי.
        ניתן לפנות אלינו בכל אחת מהדרכים הבאות:
      </p>
      <div className="rounded-2xl p-6 space-y-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-3">
            <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#1e90ff' }} />
            <a href="tel:035081868" dir="ltr" className="hover:text-[#1e90ff]">03-5081868</a>
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#25d366' }} />
            <a href="https://wa.me/972548818681" target="_blank" rel="noopener noreferrer" className="hover:text-[#1e90ff]">
              WhatsApp · 054-8818681
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#1e90ff' }} />
            <a href="mailto:info@destec.co.il" className="hover:text-[#1e90ff]">info@destec.co.il</a>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#1e90ff' }} />
            <span>רחוב מסריק 23, בת ים</span>
          </li>
        </ul>
      </div>

      <p className="text-gray-400 text-sm mt-10">
        הצהרה זו נכתבה בהתאם להמלצות התקן ת&quot;י 5568 ותקנות שוויון זכויות לאנשים עם מוגבלות
        (התאמות נגישות לשירות), התשע&quot;ג–2013.
      </p>
    </div>
  );
}
