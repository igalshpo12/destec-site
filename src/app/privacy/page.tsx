import { Metadata } from 'next';
import CookieSettingsButton from '@/components/analytics/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות ועוגיות',
  description:
    'מדיניות הפרטיות והעוגיות של DES — destec.co.il. איזה מידע נאסף, שימוש בעוגיות, כלי ניתוח ופרסום, וזכויותיכם לפי חוק הגנת הפרטיות.',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold mt-10 mb-3" style={{ color: '#1a2b4a' }}>
      {children}
    </h2>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ color: '#0d1929' }}>
        מדיניות פרטיות ועוגיות
      </h1>
      <p className="text-gray-500 mb-8">עודכן ביולי 2026</p>

      <p className="text-gray-700 leading-relaxed">
        חברת <strong>DES — שירותי ציוד רפואי ודנטלי</strong> (&quot;החברה&quot;) מכבדת את פרטיות
        המשתמשים באתר <span dir="ltr">destec.co.il</span> (&quot;האתר&quot;). מדיניות זו מסבירה
        איזה מידע נאסף, כיצד נעשה בו שימוש, ואת השימוש בעוגיות (Cookies), בהתאם ל
        <strong>חוק הגנת הפרטיות, התשמ&quot;א–1981</strong> ולתקנות מכוחו.
      </p>

      <H2>איזה מידע אנו אוספים</H2>
      <ul className="list-disc pr-6 space-y-2 text-gray-700 leading-relaxed">
        <li>
          <strong>מידע שנמסר ביוזמתכם</strong> — בעת פנייה דרך טופס יצירת קשר, טלפון, דוא&quot;ל
          או וואטסאפ: שם, מספר טלפון, כתובת דוא&quot;ל ותוכן הפנייה.
        </li>
        <li>
          <strong>מידע טכני ושימוש</strong> — נאסף באמצעות כלי ניתוח (בכפוף להסכמתכם): כתובת
          IP מקוצרת, סוג דפדפן ומכשיר, דפים שנצפו ומקור ההגעה לאתר.
        </li>
      </ul>

      <H2>עוגיות (Cookies)</H2>
      <p className="text-gray-700 leading-relaxed">
        עוגייה היא קובץ טקסט קטן הנשמר בדפדפן. באתר נעשה שימוש בסוגי העוגיות הבאים:
      </p>
      <ul className="list-disc pr-6 space-y-2 text-gray-700 leading-relaxed mt-3">
        <li>
          <strong>עוגיות חיוניות</strong> — נחוצות לתפעול האתר ולשמירת בחירת ההסכמה שלכם. אינן
          דורשות הסכמה.
        </li>
        <li>
          <strong>עוגיות ניתוח ופרסום</strong> — <span dir="ltr">Google Analytics 4</span> ו
          <span dir="ltr">Meta Pixel</span>, לצורך מדידת שימוש ושיפור השירות. וכן שמירת מקור
          ההגעה (פרמטרי <span dir="ltr">UTM</span>) לשיוך פניות. עוגיות אלו נטענות{' '}
          <strong>רק לאחר קבלת הסכמתכם</strong>.
        </li>
      </ul>

      <H2>הסכמה ומשיכת הסכמה</H2>
      <p className="text-gray-700 leading-relaxed">
        בכניסה הראשונה לאתר מוצג באנר הסכמה המאפשר לאשר או לדחות עוגיות ניתוח ופרסום. עד
        לקבלת הסכמה לא נטענים כלי צד שלישי ולא נשמרות עוגיות פרסום. ניתן לשנות או לבטל את
        הבחירה בכל עת:
      </p>
      <p className="mt-3">
        <CookieSettingsButton className="inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1a2b4a] hover:bg-[#1e90ff] transition-colors" />
      </p>

      <H2>שיתוף מידע עם צדדים שלישיים</H2>
      <p className="text-gray-700 leading-relaxed">
        איננו מוכרים מידע אישי. מידע טכני עשוי להיות מעובד על ידי ספקי הכלים{' '}
        <span dir="ltr">Google</span> ו-<span dir="ltr">Meta</span> בהתאם למדיניות הפרטיות שלהם,
        וזאת רק לאחר הסכמתכם. מידע שנמסר בפנייה משמש לצורך מענה וקשר עסקי בלבד.
      </p>

      <H2>אבטחה ושמירת מידע</H2>
      <p className="text-gray-700 leading-relaxed">
        אנו נוקטים באמצעים סבירים לאבטחת המידע. מידע שנמסר בפניות נשמר למשך הזמן הנדרש לצורך
        הטיפול והקשר העסקי, ובכפוף לחובות שבדין.
      </p>

      <H2>זכויותיכם</H2>
      <p className="text-gray-700 leading-relaxed">
        על פי חוק הגנת הפרטיות, עומדת לכם הזכות לעיין במידע שנאסף עליכם, לבקש את תיקונו או
        מחיקתו. לבקשות בנושא פרטיות ניתן לפנות אלינו בדוא&quot;ל{' '}
        <a href="mailto:info@destec.co.il" className="underline text-[#1a2b4a] hover:text-[#1e90ff]">
          info@destec.co.il
        </a>
        .
      </p>

      <H2>עדכונים למדיניות</H2>
      <p className="text-gray-700 leading-relaxed">
        מדיניות זו עשויה להתעדכן מעת לעת. המועד המעודכן מופיע בראש העמוד.
      </p>
    </div>
  );
}
