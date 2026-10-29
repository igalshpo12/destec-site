/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headless Chromium renders the order-confirmation PDF (src/lib/server/orderPdf.ts); it must
  // not be bundled.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  images: {
    remotePatterns: [
      // Re-hosted Konimbo product photos (Supabase Storage)
      { protocol: 'https', hostname: 'likaubaiqrojlwqzoepp.supabase.co', pathname: '/storage/v1/object/public/**' },
      // Konimbo CDN (legacy showcase images)
      { protocol: 'https', hostname: 'd3m9l0v76dty0.cloudfront.net', pathname: '/**' },
    ],
  },
};

export default nextConfig;
