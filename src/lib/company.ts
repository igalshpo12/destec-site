// Single source of truth for DES company details.
// The digital business card (/card) and the vCard endpoint read from here;
// older components still carry inline copies and can migrate over time.

export const COMPANY = {
  nameHe: 'DES — שירותי ציוד רפואי ודנטלי',
  nameEn: 'DES Medical & Dental Equipment Services',
  shortName: 'DES',
  tagline: 'יבואן מורשה ומעבדת שירות לציוד דנטלי ורפואי — משנת 1998',
  since: 1998,

  addressHe: 'רחוב מסריק 23, בת ים',
  city: 'בת ים',
  wazeUrl:
    'https://waze.com/ul?q=' +
    encodeURIComponent('מסריק 23 בת ים') +
    '&navigate=yes',
  mapsUrl: 'https://maps.google.com/?q=%D7%9E%D7%A1%D7%A8%D7%99%D7%A7+23+%D7%91%D7%AA+%D7%99%D7%9D',

  landline: '03-5081868',
  landlineHref: 'tel:035081868',
  landlineE164: '+97235081868',
  mobile: '054-8818681',
  mobileHref: 'tel:0548818681',
  mobileE164: '+972548818681',
  whatsappUrl: 'https://wa.me/972548818681',

  email: 'info@destec.co.il',
  website: 'https://destec.co.il',
  cardPath: '/card',

  hoursHe: 'א׳–ה׳ 08:00–17:00',
  instagramUrl: 'https://www.instagram.com/des_medical_and_dental/',
  googleReviewUrl: 'https://g.page/r/CTW-lItmLXp7EAE/review',

  businessId: '310737085', // ע"מ
  iso: 'ISO 9001 · ARS #260225019743',
  amarLicense: 'רישיון אמ״ר — יבואן מורשה',
} as const;

/** WhatsApp link with a prefilled Hebrew message. */
export function whatsappLink(text: string): string {
  return `${COMPANY.whatsappUrl}?text=${encodeURIComponent(text)}`;
}
