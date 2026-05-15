import { Metadata } from 'next';
import ContactForm from '@/components/ui/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'צור קשר',
  description: 'צרו קשר עם DES — שירותי ציוד רפואי ודנטלי. טלפון 03-5081868, מסריק 23 בת ים.',
};

const INFO = [
  {
    icon: MapPin,
    label: 'כתובת',
    value: 'רחוב מסריק 23, בת ים',
    href: 'https://maps.google.com/?q=%D7%9E%D7%A1%D7%A8%D7%99%D7%A7+23+%D7%91%D7%AA+%D7%99%D7%9D',
    target: '_blank',
  },
  {
    icon: Phone,
    label: 'טלפון',
    value: '03-5081868',
    href: 'tel:0350818681',
    dir: 'ltr' as const,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'שלח הודעה',
    href: 'https://wa.me/972548818681',
    target: '_blank',
  },
  {
    icon: Mail,
    label: 'אימייל',
    value: 'info@destec.co.il',
    href: 'mailto:info@destec.co.il',
  },
  {
    icon: Clock,
    label: 'שעות פעילות',
    value: 'א–ה 08:00–17:00',
  },
];

export default function ContactPage() {
  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a2b4a] mb-2">צור קשר</h1>
        <p className="text-gray-500">
          נשמח לענות על כל שאלה — מוצרים, מחירים, תיקונים, ואיסוף ציוד
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact info — right column in RTL */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1a2b4a] rounded-2xl p-6 text-white">
            <div className="bg-white/10 rounded-full px-6 py-2 inline-flex mb-5">
              <span className="font-bold text-xl tracking-widest">DES</span>
            </div>
            <h2 className="font-semibold text-lg mb-4">פרטי התקשרות</h2>
            <ul className="space-y-4">
              {INFO.map(({ icon: Icon, label, value, href, target, dir }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-full p-2 flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#1e90ff]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={target}
                        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                        dir={dir}
                        className="text-white/90 text-sm hover:text-white transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white/90 text-sm">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Map embed placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.!2d34.74!3d32.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1siw!2sil!4v1"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="מיקום DES — מסריק 23 בת ים"
            />
          </div>
        </div>

        {/* Form — left/wider column */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
