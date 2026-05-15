#!/usr/bin/env node
/**
 * Generates one placeholder image per product category using Nano Banana 2
 * (gemini-3.1-flash-image-preview). Run once; images saved to public/images/categories/.
 *
 * Usage:
 *   GOOGLE_AI_API_KEY=your_key node scripts/generate-category-images.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images/categories');

const CATEGORIES = [
  {
    slug: 'turbines',
    prompt: 'Professional product photography of a dental high-speed turbine handpiece, polished chrome and stainless steel, precision engineering, clean white studio background, soft lighting, medical device quality, no text',
  },
  {
    slug: 'angles',
    prompt: 'Professional product photography of a dental contra-angle handpiece, polished stainless steel, precision instrument, clean white studio background, soft diffused lighting, medical device quality, no text',
  },
  {
    slug: 'handpieces',
    prompt: 'Professional product photography of a dental straight handpiece, brushed stainless steel, precision instrument, clean white studio background, soft studio lighting, medical quality, no text',
  },
  {
    slug: 'motors',
    prompt: 'Professional product photography of a dental implant motor micromotor device, compact electronic unit, brushed metal and white casing, clean white studio background, medical device quality, no text',
  },
  {
    slug: 'drills',
    prompt: 'Professional product photography of dental surgical drill burs, multiple precision carbide and diamond burs arranged neatly, clean white studio background, macro detail shot, medical quality, no text',
  },
  {
    slug: 'surgery',
    prompt: 'Professional product photography of dental surgical instruments, stainless steel forceps and elevators arranged on white background, sterile medical quality, soft studio lighting, no text',
  },
  {
    slug: 'electrosurgery',
    prompt: 'Professional product photography of a dental electrosurgery unit, compact electronic medical device with control panel, clean white and grey casing, white studio background, medical quality, no text',
  },
  {
    slug: 'sterilization',
    prompt: 'Professional product photography of a dental autoclave sterilization machine, compact stainless steel medical device, clean white studio background, clinical quality, no text',
  },
];

async function generate() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error('❌  Set GOOGLE_AI_API_KEY environment variable first');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  for (const cat of CATEGORIES) {
    const outPath = path.join(OUT_DIR, `${cat.slug}.jpg`);
    if (fs.existsSync(outPath)) {
      console.log(`⏭  ${cat.slug} already exists, skipping`);
      continue;
    }

    console.log(`🎨  Generating ${cat.slug}...`);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: cat.prompt,
        config: { responseModalities: ['IMAGE'] },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData?.mimeType?.startsWith('image/')
      );

      if (!part?.inlineData?.data) {
        console.warn(`⚠️  No image returned for ${cat.slug}`);
        continue;
      }

      const buffer = Buffer.from(part.inlineData.data, 'base64');
      fs.writeFileSync(outPath, buffer);
      console.log(`✅  Saved ${cat.slug}.jpg (${Math.round(buffer.length / 1024)}KB)`);

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.error(`❌  Failed ${cat.slug}:`, err.message);
    }
  }

  console.log('\n✅  Done. Images saved to public/images/categories/');
}

generate();
