import { COMPANY } from '@/lib/company';

// vCard 3.0 — best cross-device compatibility (iOS Contacts + Android).
// Served as an attachment so tapping "שמירת איש קשר" opens the add-contact sheet.

function buildVCard(): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${COMPANY.nameHe}`,
    `N;CHARSET=UTF-8:${COMPANY.shortName};;;;`,
    `ORG;CHARSET=UTF-8:${COMPANY.nameHe}`,
    `TEL;TYPE=WORK,VOICE:${COMPANY.landlineE164}`,
    `TEL;TYPE=CELL:${COMPANY.mobileE164}`,
    `EMAIL;TYPE=WORK:${COMPANY.email}`,
    `ADR;CHARSET=UTF-8;TYPE=WORK:;;${COMPANY.addressHe};;;;ישראל`,
    `URL:${COMPANY.website}`,
    `PHOTO;VALUE=URI:${COMPANY.website}/des_logo.png`,
    `NOTE;CHARSET=UTF-8:${COMPANY.tagline}`,
    'END:VCARD',
  ];
  // vCard requires CRLF line endings
  return lines.join('\r\n') + '\r\n';
}

export async function GET() {
  return new Response(buildVCard(), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="des-contact.vcf"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
