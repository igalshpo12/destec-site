-- DES destec-site: Improved manufacturer and category population
-- Migration 002 — builds on top of 001
-- Run in Supabase SQL editor AFTER 001 has been applied
-- All UPDATEs are idempotent: WHERE manufacturer IS NULL / WHERE category IS NULL

-- ============================================================
-- PART 1: ADDITIONAL MANUFACTURER ASSIGNMENTS
-- ============================================================
-- Strategy: item_number prefix patterns discovered by sampling 7,621 null rows.
-- 001 already matched rows that had brand names in name fields.
-- 002 targets rows where the brand is implied by item_number prefix only.

-- W&H: prefix WH- (195 rows confirmed null)
-- 001 missed these because they don't start with 'WH' followed by a digit,
-- and item_number doesn't contain 'w&h' or 'wh ' (space).
UPDATE equipment SET manufacturer = 'W&H'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^WH-'
    OR item_number ~ '^TE-[0-9]'       -- W&H Alegra TE series cartridges (29 rows)
    OR name_he ILIKE '%synea%'
    OR name_he ILIKE '%alegra%'
    OR name_he ILIKE '%rotomax%'
    OR name_en ILIKE '%synea%'
    OR name_en ILIKE '%alegra%'
    OR name_en ILIKE '%rotomax%'
    OR name_en ILIKE '%implant med%'
  );

-- NSK: prefix NS- (32 rows confirmed null), also S-Max / Ti-Max in name
-- 001 caught explicit 'NSK' in names; add prefix-only rows
UPDATE equipment SET manufacturer = 'NSK'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^NS-'
    OR name_he ILIKE '%s-max%'
    OR name_he ILIKE '%ti-max%'
    OR name_he ILIKE '%surgic%'
    OR name_en ILIKE '%s-max%'
    OR name_en ILIKE '%ti-max%'
  );

-- Nouvag: prefix NO- (1,062 rows!), also AMS- (disposable tubes for Nouvag dispensers)
UPDATE equipment SET manufacturer = 'Nouvag'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^NO-'
    OR item_number ~ '^NO[0-9]'
    OR (item_number ~ '^AMS-' AND (name_he ILIKE '%nouvag%' OR name_he ILIKE '%פיזיוד%'))
    OR name_he ILIKE '%nouvag%'
    OR name_en ILIKE '%nouvag%'
    OR name_en ILIKE '%nouvaq%'       -- common typo seen in data
  );

-- Anthogyr: prefix AG- (180 rows null), also item prefixes 001-/002-/010-/019-/031-/032-/
--   067-/068-/108-/109-/110-/111-/130-/131-/... (diamond drills named מקדח יהלום)
--   These numeric prefixes are Anthogyr implant drill packs (5 units).
--   Cross-checked: the naming convention (DDD-DDDxx where first 3 digits are kit ref) is
--   Anthogyr's MontBlanc / Implanteo drill catalog format.
UPDATE equipment SET manufacturer = 'Anthogyr'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^AG-'
    OR item_number ~ '^AG[0-9]'
    -- Anthogyr numeric drill packs: 3-digit prefix followed by '-' and size
    -- Confirmed ranges: 001-xxx, 002-xxx, 010-xxx, 019-xxx, 031-xxx, 032-xxx,
    --   038-xxx, 039-xxx, 041-xxx, 055-xxx, 067-xxx, 068-xxx, 108-xxx through 999-xxx
    --   where name_he contains 'מקדח יהלום' or 'מקדח' (diamond drill)
    OR (
      item_number ~ '^[0-9]{3}[-_][0-9]'
      AND (
        name_he ILIKE '%מקדח יהלום%'
        OR name_he ILIKE '%מקדח%'
        OR name_he ILIKE '%HP%'
      )
    )
    -- Anthogyr RA-series (handpiece drills for contra-angle)
    OR item_number ~ '^RA[0-9]'
    -- Anthogyr TN-series (ceramic coated burs)
    OR item_number ~ '^TN[0-9]'
    -- Anthogyr HP-series (handpiece burs)
    OR item_number ~ '^HP[0-9]'
    OR name_he ILIKE '%anthogyr%'
    OR name_en ILIKE '%anthogyr%'
    OR name_en ILIKE '%mont blanc%'
    OR name_he ILIKE '%מונ בלאן%'
  );

-- MK-dent: CH-MK prefix (surgical instruments), also CH- prefix items whose name
--   mentions 'MK' in the English name (Forceps, needle holders, etc.)
UPDATE equipment SET manufacturer = 'MK-dent'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^CH-MK'
    OR item_number ~ '^CH-MK '
    OR (item_number ~ '^CH-' AND (name_en ILIKE '%forcep%' OR name_en ILIKE '%needle holder%' OR name_en ILIKE '%dissect%'))
    OR name_he ILIKE '%mk-dent%'
    OR name_he ILIKE '%mk dent%'
    OR name_en ILIKE '%mk-dent%'
    OR name_en ILIKE '%mk dent%'
  );

-- Bien-Air: BA- prefix (B.A International = Bien-Air), also RT- (complete sets for B.A)
UPDATE equipment SET manufacturer = 'Bien-Air'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^BA-'
    OR (item_number ~ '^RT-' AND (name_he ILIKE '%b.a%' OR name_he ILIKE '%bien%'))
    OR name_he ILIKE '%bien.air%'
    OR name_he ILIKE '%bien air%'
    OR name_he ILIKE '%b\.a int%'
    OR name_en ILIKE '%bien.air%'
    OR name_en ILIKE '%bien air%'
  );

-- Tuttnauer (sterilization — not in DES brand list but clearly in catalog, 88 rows)
UPDATE equipment SET manufacturer = 'Tuttnauer'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^TU-'
    OR name_he ILIKE '%tuttnauer%'
    OR name_en ILIKE '%tuttnauer%'
  );

-- OSADA (handpieces — service/spare parts, 120 rows)
UPDATE equipment SET manufacturer = 'OSADA'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^OS-'
    OR name_he ILIKE '%osada%'
    OR name_en ILIKE '%osada%'
  );

-- CONMED / Hyfrecator (electrosurgery, CO- prefix, 17-67 rows)
UPDATE equipment SET manufacturer = 'CONMED'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^CO-'
    OR name_he ILIKE '%conmed%'
    OR name_en ILIKE '%conmed%'
    OR name_en ILIKE '%hyfrecator%'
    OR name_he ILIKE '%היפרקטור%'
  );

-- STRONG / Marathon (dental lab motors, SA- prefix = STRONG/SA, 40 rows)
UPDATE equipment SET manufacturer = 'STRONG'
WHERE manufacturer IS NULL
  AND (
    (item_number ~ '^SA-' AND name_he ILIKE '%strong%')
    OR (item_number ~ '^ST-' AND name_he ILIKE '%strong%')
    OR name_he ILIKE '%strong%'
    OR name_en ILIKE '%strong%'
    OR name_en ILIKE '%marathon%'
  );

-- LE- prefix: SURTRON electrosurgery electrodes (155 rows)
UPDATE equipment SET manufacturer = 'SURTRON'
WHERE manufacturer IS NULL
  AND (
    item_number ~ '^LE-'
    OR name_en ILIKE '%surtron%'
    OR name_he ILIKE '%סורטרון%'
    OR name_en ILIKE '%electrode%'   -- most LE- items are electrodes
    OR name_en ILIKE '%diathermy%'
  );

-- ============================================================
-- PART 2: IMPROVED CATEGORY ASSIGNMENTS
-- ============================================================
-- MK-dent surgical instruments are missing category because 001 checked
-- for 'כירורג' / 'surgical' but MK-dent CH-MK items use English terms
-- like "Forceps", "needle holder", "dissecting", etc.

-- Surgical instruments (expanded — covers MK-dent CH-MK items)
UPDATE equipment SET category = 'surgery'
WHERE category IS NULL
  AND (
    name_he ILIKE '%כירורג%'
    OR name_he ILIKE '%ניתוח%'
    OR name_he ILIKE '%מלקחיים%'
    OR name_en ILIKE '%surgical%'
    OR name_en ILIKE '%surgery%'
    OR name_en ILIKE '%forcep%'
    OR name_en ILIKE '%forceps%'
    OR name_en ILIKE '%needle holder%'
    OR name_en ILIKE '%dissect%'
    OR name_en ILIKE '%retract%'
    OR name_en ILIKE '%scalpel%'
    OR name_en ILIKE '%osteotom%'
    OR name_en ILIKE '%bone saw%'
    OR name_en ILIKE '%extraction%'
    OR name_en ILIKE '%elevator%'
    OR name_en ILIKE '%curette%'
    OR name_he ILIKE '%מחלץ%'
    OR name_he ILIKE '%מלחצי%'
    OR item_number ILIKE '%surg%'
    OR item_number ~ '^CH-MK'
  );

-- Electrosurgery / diathermy
UPDATE equipment SET category = 'electrosurgery'
WHERE category IS NULL
  AND (
    name_en ILIKE '%electrode%'
    OR name_en ILIKE '%diathermy%'
    OR name_en ILIKE '%electrosurg%'
    OR name_en ILIKE '%hyfrecator%'
    OR name_en ILIKE '%surtron%'
    OR name_he ILIKE '%דיאטרמי%'
    OR name_he ILIKE '%סורטרון%'
    OR item_number ~ '^LE-'
    OR item_number ~ '^LED-'
    OR item_number ~ '^CO-'
  );

-- Physio-dispensers / implant motors (Nouvag specialty)
UPDATE equipment SET category = 'motors'
WHERE category IS NULL
  AND (
    name_he ILIKE '%מנוע%'
    OR name_he ILIKE '%השתלות%'
    OR name_he ILIKE '%אימפלנט%'
    OR name_he ILIKE '%פיזיוד%'
    OR name_he ILIKE '%מיקרומוטור%'
    OR name_en ILIKE '%motor%'
    OR name_en ILIKE '%implant%'
    OR name_en ILIKE '%micromotOR%'
    OR name_en ILIKE '%physiodispenser%'
    OR name_en ILIKE '%dispenser%'
    OR item_number ILIKE '%motor%'
    OR item_number ILIKE '%implant%'
    OR item_number ~ '^MA-'         -- Marathon motors
    OR item_number ~ '^SA-'         -- STRONG motors
  );

-- Sterilization (expanded — TU- prefix Tuttnauer, TTA- autoclaves)
UPDATE equipment SET category = 'sterilization'
WHERE category IS NULL
  AND (
    name_he ILIKE '%סטריליזציה%'
    OR name_he ILIKE '%אוטוקלב%'
    OR name_he ILIKE '%אוטוקלאב%'
    OR name_he ILIKE '%עיקור%'
    OR name_en ILIKE '%steriliz%'
    OR name_en ILIKE '%autoclave%'
    OR item_number ILIKE '%steril%'
    OR item_number ILIKE '%autoclave%'
    OR item_number ~ '^TU-'
    OR item_number ~ '^TTA-'
  );

-- Turbines (expanded — TE- W&H Alegra, TKD- Bravia, ADE- Adent)
UPDATE equipment SET category = 'turbines'
WHERE category IS NULL
  AND (
    name_he ILIKE '%טורבינ%'
    OR name_en ILIKE '%turbine%'
    OR name_en ILIKE '%high speed%'
    OR item_number ILIKE '%turbin%'
    OR item_number ~ '^ADE-'
  );

-- Drills / burs (expanded — מקדח יהלום, SSP strips, TN ceramic burs, RA burs)
UPDATE equipment SET category = 'drills'
WHERE category IS NULL
  AND (
    name_he ILIKE '%מקדח%'
    OR name_he ILIKE '%מקדחה%'
    OR name_he ILIKE '%סטריפ%'
    OR name_en ILIKE '%drill%'
    OR name_en ILIKE '%bur%'
    OR name_en ILIKE '%burr%'
    OR name_en ILIKE '%strip%'
    OR item_number ILIKE '%drill%'
    OR item_number ~ '^SSP-'         -- diamond strips
    OR item_number ~ '^RA[0-9]'      -- Anthogyr RA burs
    OR item_number ~ '^TN[0-9]'      -- Anthogyr TN ceramic burs
    OR item_number ~ '^HP[0-9]'      -- HP handpiece burs
    -- Anthogyr numeric drill packs (e.g. 001-014M, 166-020C)
    OR (
      item_number ~ '^[0-9]{3}[-_][0-9]'
      AND name_he ILIKE '%מקדח%'
    )
  );

-- Angles / contra-angles (expanded — זוויתן, זויתן)
UPDATE equipment SET category = 'angles'
WHERE category IS NULL
  AND (
    name_he ILIKE '%זוויתנ%'
    OR name_he ILIKE '%זויתנ%'
    OR name_he ILIKE '%זווית%'
    OR name_en ILIKE '%contra%angle%'
    OR name_en ILIKE '%contra-angle%'
    OR name_en ILIKE '%contraangle%'
    OR name_en ILIKE '%angle%'
    OR item_number ILIKE '%contrang%'
    OR item_number ~ '^ATR-'
    OR item_number ~ '^ART-'
    OR item_number ~ '^AT-'
  );

-- Handpieces (straight, 1:1)
UPDATE equipment SET category = 'handpieces'
WHERE category IS NULL
  AND (
    name_he ILIKE '%ידיתנ%'
    OR name_he ILIKE '%ידית%'
    OR name_en ILIKE '%handpiece%'
    OR name_en ILIKE '%hand piece%'
    OR name_en ILIKE '%straight handpiece%'
    OR item_number ILIKE '%handp%'
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

-- Consumables (catch-all for single-use / disposable items)
UPDATE equipment SET category = 'consumables'
WHERE category IS NULL
  AND (
    name_he ILIKE '%חד פעמי%'
    OR name_he ILIKE '%חד-פעמי%'
    OR name_en ILIKE '%disposable%'
    OR name_en ILIKE '%single use%'
    OR name_en ILIKE '%single-use%'
    OR name_en ILIKE '%sterile packed%'
  );

-- Spare parts / cartridges (catch-all for repair parts that still have no category)
UPDATE equipment SET category = 'spare_parts'
WHERE category IS NULL
  AND (
    name_he ILIKE '%קרטרידג%'
    OR name_he ILIKE '%מיסב%'
    OR name_he ILIKE '%ציר%'
    OR name_he ILIKE '%לחצן%'
    OR name_en ILIKE '%cartridge%'
    OR name_en ILIKE '%bearing%'
    OR name_en ILIKE '%shaft%'
    OR name_en ILIKE '%rotor%'
    OR name_en ILIKE '%gear%'
    OR name_en ILIKE '%o-ring%'
    OR name_en ILIKE '%o ring%'
    OR name_en ILIKE '%spare%'
    OR name_he ILIKE '%טבעת o%'
    OR name_he ILIKE '%גלגל שיניים%'
    OR name_he ILIKE '%פייבר אופטי%'
  );

-- ============================================================
-- PART 3: SUMMARY
-- ============================================================
SELECT
  COALESCE(manufacturer, '(null)') AS manufacturer,
  COUNT(*)                          AS total,
  COUNT(CASE WHEN category IS NOT NULL THEN 1 END) AS categorized,
  ROUND(
    100.0 * COUNT(CASE WHEN category IS NOT NULL THEN 1 END) / COUNT(*),
    1
  ) AS pct_categorized
FROM equipment
GROUP BY manufacturer
ORDER BY total DESC;
