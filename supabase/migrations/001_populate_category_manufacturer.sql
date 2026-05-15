-- DES destec-site: Populate manufacturer and category on equipment table
-- Run this in Supabase SQL editor
-- Uses ALTER ... ADD COLUMN IF NOT EXISTS for idempotency

-- 1. Ensure columns exist
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Populate manufacturer (match item_number ILIKE or name_he/name_en ILIKE)
--    Order matters: more specific patterns first

UPDATE equipment SET manufacturer = 'Bien-Air'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%bien%air%'
    OR item_number ILIKE '%bienair%'
    OR name_he    ILIKE '%bien%air%'
    OR name_en    ILIKE '%bien%air%'
    OR name_en    ILIKE '%bienair%'
  );

UPDATE equipment SET manufacturer = 'Dentsply Sirona'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%dentsply%'
    OR item_number ILIKE '%sirona%'
    OR name_he    ILIKE '%dentsply%'
    OR name_he    ILIKE '%sirona%'
    OR name_en    ILIKE '%dentsply%'
    OR name_en    ILIKE '%sirona%'
  );

UPDATE equipment SET manufacturer = 'Anthogyr'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%anthogyr%'
    OR name_he    ILIKE '%anthogyr%'
    OR name_en    ILIKE '%anthogyr%'
  );

UPDATE equipment SET manufacturer = 'Nouvag'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%nouvag%'
    OR name_he    ILIKE '%nouvag%'
    OR name_en    ILIKE '%nouvag%'
  );

UPDATE equipment SET manufacturer = 'MK-dent'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%mk-dent%'
    OR item_number ILIKE '%mkdent%'
    OR item_number ILIKE '%mk dent%'
    OR item_number ILIKE '%mk_%'
    OR name_he    ILIKE '%mk-dent%'
    OR name_he    ILIKE '%mk dent%'
    OR name_en    ILIKE '%mk-dent%'
    OR name_en    ILIKE '%mkdent%'
    OR name_en    ILIKE '%mk dent%'
  );

UPDATE equipment SET manufacturer = 'JINME'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%jinme%'
    OR name_he    ILIKE '%jinme%'
    OR name_en    ILIKE '%jinme%'
  );

UPDATE equipment SET manufacturer = 'KaVo'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%kavo%'
    OR name_he    ILIKE '%kavo%'
    OR name_en    ILIKE '%kavo%'
  );

UPDATE equipment SET manufacturer = 'W&H'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%w&h%'
    OR item_number ILIKE '%w_h%'
    OR item_number ILIKE '%wh %'
    OR item_number ~ '^WH[0-9]'
    OR name_he    ILIKE '%w&h%'
    OR name_he    ILIKE '%w&amp;h%'
    OR name_en    ILIKE '%w&h%'
    OR name_en    ILIKE '%w_h%'
  );

UPDATE equipment SET manufacturer = 'NSK'
WHERE manufacturer IS NULL
  AND (
    item_number ILIKE '%nsk%'
    OR item_number ILIKE 'S-MAX%'
    OR item_number ILIKE 'Ti-Max%'
    OR item_number ILIKE 'Surgic%'
    OR name_he    ILIKE '%nsk%'
    OR name_en    ILIKE '%nsk%'
    OR name_en    ILIKE '%S-Max%'
    OR name_en    ILIKE '%Ti-Max%'
    OR name_en    ILIKE '%Surgic%'
  );

-- 3. Populate category (match name_he / name_en / item_number)
--    Priority order: most specific first

-- Sterilization
UPDATE equipment SET category = 'sterilization'
WHERE category IS NULL
  AND (
    name_he ILIKE '%סטריליזציה%'
    OR name_he ILIKE '%אוטוקלב%'
    OR name_he ILIKE '%עיקור%'
    OR name_en ILIKE '%steriliz%'
    OR name_en ILIKE '%autoclave%'
    OR item_number ILIKE '%steril%'
    OR item_number ILIKE '%autoclave%'
  );

-- Surgery (before motors to avoid overlap with implant motors)
UPDATE equipment SET category = 'surgery'
WHERE category IS NULL
  AND (
    name_he ILIKE '%כירורג%'
    OR name_he ILIKE '%ניתוח%'
    OR name_en ILIKE '%surgical%'
    OR name_en ILIKE '%surgery%'
    OR item_number ILIKE '%surg%'
  );

-- Implant motors (motors / implant)
UPDATE equipment SET category = 'motors'
WHERE category IS NULL
  AND (
    name_he ILIKE '%מנוע%'
    OR name_he ILIKE '%השתלות%'
    OR name_he ILIKE '%אימפלנט%'
    OR name_en ILIKE '%motor%'
    OR name_en ILIKE '%implant%'
    OR item_number ILIKE '%motor%'
    OR item_number ILIKE '%implant%'
  );

-- Scalers / ultrasonic
UPDATE equipment SET category = 'scalers'
WHERE category IS NULL
  AND (
    name_he ILIKE '%סקילר%'
    OR name_he ILIKE '%אולטרסוניק%'
    OR name_en ILIKE '%scaler%'
    OR name_en ILIKE '%ultrasonic%'
    OR item_number ILIKE '%scaler%'
    OR item_number ILIKE '%ultra%'
  );

-- Prophylaxis
UPDATE equipment SET category = 'prophylaxis'
WHERE category IS NULL
  AND (
    name_he ILIKE '%פרופילקטיקה%'
    OR name_he ILIKE '%פוליש%'
    OR name_en ILIKE '%prophy%'
    OR name_en ILIKE '%polish%'
    OR item_number ILIKE '%prophy%'
  );

-- Restorative
UPDATE equipment SET category = 'restorative'
WHERE category IS NULL
  AND (
    name_he ILIKE '%שיקום%'
    OR name_he ILIKE '%קומפוזיט%'
    OR name_en ILIKE '%restor%'
    OR name_en ILIKE '%composite%'
    OR item_number ILIKE '%restor%'
    OR item_number ILIKE '%compos%'
  );

-- Turbines
UPDATE equipment SET category = 'turbines'
WHERE category IS NULL
  AND (
    name_he ILIKE '%טורבינ%'
    OR name_en ILIKE '%turbine%'
    OR item_number ILIKE '%turbin%'
  );

-- Drills
UPDATE equipment SET category = 'drills'
WHERE category IS NULL
  AND (
    name_he ILIKE '%מקדח%'
    OR name_he ILIKE '%מקדחה%'
    OR name_en ILIKE '%drill%'
    OR item_number ILIKE '%drill%'
  );

-- Angles (contra-angles)
UPDATE equipment SET category = 'angles'
WHERE category IS NULL
  AND (
    name_he ILIKE '%זוויתנ%'
    OR name_he ILIKE '%זווית%'
    OR name_en ILIKE '%angle%'
    OR name_en ILIKE '%contra%angle%'
    OR item_number ILIKE '%angle%'
    OR item_number ILIKE '%contrang%'
  );

-- Handpieces (after angles/turbines)
UPDATE equipment SET category = 'handpieces'
WHERE category IS NULL
  AND (
    name_he ILIKE '%ידיתנ%'
    OR name_he ILIKE '%ידית%'
    OR name_en ILIKE '%handpiece%'
    OR name_en ILIKE '%hand piece%'
    OR item_number ILIKE '%handp%'
  );

-- 4. Report result
SELECT
  manufacturer,
  COUNT(*) AS total,
  COUNT(CASE WHEN category IS NOT NULL THEN 1 END) AS categorized
FROM equipment
GROUP BY manufacturer
ORDER BY total DESC;
