-- DES destec-site: Category quality-improvement pass
-- Migration 003 — builds on top of 001 + 002
-- Run in Supabase SQL editor AFTER 002 has been applied
--
-- Context: after 002, all 9,691 rows have a manufacturer and a category.
-- This migration does NOT assign any NULL categories (there are none left).
-- Instead it RE-CATEGORISES rows that were assigned to a plausible but wrong
-- bucket by the broad catch-all rules in 001/002.
--
-- All UPDATEs are idempotent: each WHERE clause pins the exact current
-- (wrong) category so re-running is safe.
-- ============================================================


-- ============================================================
-- PART 1 — NSK: surgical instruments mis-filed as spare_parts
-- ============================================================
-- 002 assigned spare_parts as a catch-all for many NSK rows because they
-- contain keywords like 'ציר', 'לחצן', 'מיסב'. However a subset of NSK
-- items with prefixes CH-CO, CH-ST, CH-03 are manufactured surgical scissors
-- and knives (not handpiece parts), and DO-S prefix items are surgical
-- curettes, aspirators and perio instruments.
--
-- Affected: 20 CH-xx rows + 13 DO-Sxx rows = 33 rows

UPDATE equipment
SET    category = 'surgery'
WHERE  manufacturer = 'NSK'
  AND  category     = 'spare_parts'
  AND  (
         item_number ~ '^CH-CO'    -- surgical scissors/knives (CH-CO89..CH-CO216)
      OR item_number ~ '^CH-ST'    -- surgical scissors straight/curved (CH-ST2071..2074)
      OR item_number ~ '^CH-03'    -- microsurgical scissors (CH-03-147, CH-03-347...)
      OR (
           item_number ~ '^DO-S'
           AND (
                 name_en ILIKE '%surgical%'
              OR name_en ILIKE '%curette%'
              OR name_en ILIKE '%aspirator%'
              OR name_en ILIKE '%tunneling%'
              OR name_en ILIKE '%perio%'
              OR name_en ILIKE '%elevator%'
           )
         )
       );
-- Expected: ~33 rows updated


-- ============================================================
-- PART 2 — NSK: complete contra-angles mis-filed as spare_parts
-- ============================================================
-- 002 put many NS-Cxxxx items into spare_parts via the 'לחצן'/'ציר'/'מיסב'
-- catch-all. In fact most NS-C/Z/X/SG/E/Y rows are complete NSK S-Max /
-- Ti-Max / Z-Max contra-angle and endo-angle handpieces, not internal parts.
-- Rule: it is an angle when name_he contains 'זויתן' AND does NOT mention
-- a sub-component word (ראש, לחצן, טבעת, ציר, מיסב, דיסקית, חיבור, כיסוי,
-- קפיץ, נורת, תושבת, אף, קרטרידג', מוליך, גוף ל).
--
-- Affected: ~29 rows

UPDATE equipment
SET    category = 'angles'
WHERE  manufacturer = 'NSK'
  AND  category     = 'spare_parts'
  AND  name_he      ILIKE '%זויתן%'
  AND  name_he      NOT ILIKE '%ראש%'
  AND  name_he      NOT ILIKE '%לחצן%'
  AND  name_he      NOT ILIKE '%טבעת%'
  AND  name_he      NOT ILIKE '%ציר%'
  AND  name_he      NOT ILIKE '%מיסב%'
  AND  name_he      NOT ILIKE '%דיסקית%'
  AND  name_he      NOT ILIKE '%חיבור%'
  AND  name_he      NOT ILIKE '%כיסוי%'
  AND  name_he      NOT ILIKE '%קפיץ%'
  AND  name_he      NOT ILIKE '%נורת%'
  AND  name_he      NOT ILIKE '%תושבת%'
  AND  name_he      NOT ILIKE '%קרטרידג%'
  AND  name_he      NOT ILIKE '%מוליך%'
  AND  name_he      NOT ILIKE '%גוף ל%'
  AND  name_he      NOT ILIKE '%סט 3%';
-- Expected: ~29 rows updated


-- ============================================================
-- PART 3 — Nouvag: surgical/OtoDrill burrs mis-filed as motors
-- ============================================================
-- 002 assigned the motors category to all Nouvag rows by prefix NO-.
-- Nouvag NO-164x..NO-165x are diamond & carbide burrs for the OtoDrill,
-- and NO-174x..NO-175x are spinal burrs for spinal surgery — both belong
-- in drills, not motors.
--
-- Affected: ~56 rows

UPDATE equipment
SET    category = 'drills'
WHERE  manufacturer = 'Nouvag'
  AND  category     = 'motors'
  AND  (
         name_en ILIKE '%diamond burr%'
      OR name_en ILIKE '%carbide burr%'
      OR name_en ILIKE '%spinal burr%'
      OR (name_en ILIKE '%cranial perforator drill%' AND name_en ILIKE '%disposable%')
       );
-- Expected: ~56 rows updated


-- ============================================================
-- PART 4 — Nouvag: single-use tubes mis-filed as motors
-- ============================================================
-- Disposable irrigation/suction tubing sets (AMS-641x, OM-32.Fxxxx, NO-29063,
-- NO-4076, NO-5134, NO-5167) are consumables, not motors.
--
-- Affected: ~9 rows

UPDATE equipment
SET    category = 'consumables'
WHERE  manufacturer = 'Nouvag'
  AND  category     = 'motors'
  AND  (
         name_en ILIKE '%silicone tubing%'
      OR name_en ILIKE '%silicone tube%'
      OR name_en ILIKE '%suction tube%'
      OR name_en ILIKE '%pump tube%'
      OR name_he  ILIKE '%צינורית חד פעמי%'
      OR name_he  ILIKE '%צינורות חד פעמי%'
      OR (name_en ILIKE '%tube%' AND name_en ILIKE '%cutting%')
       );
-- Expected: ~9 rows updated


-- ============================================================
-- PART 5 — KaVo: complete contra-angles mis-filed as spare_parts
-- ============================================================
-- 002 sent many KA- prefix rows to spare_parts via the קרטרידג'/ציר/מיסב
-- catch-all. Rows whose name_he is simply 'זויתן KAVO <model>' with no
-- sub-component qualifier are complete angles.
-- KA-D30916 / KA-PF2 / KA-PF3 are prophylaxis units — they belong in
-- a new 'prophylaxis' category (see Part 6).
--
-- Affected: ~22 rows

UPDATE equipment
SET    category = 'angles'
WHERE  manufacturer = 'KaVo'
  AND  category     = 'spare_parts'
  AND  item_number  ~ '^KA-'
  AND  name_he      ILIKE '%זויתן%'
  AND  name_he      NOT ILIKE '%ראש%'
  AND  name_he      NOT ILIKE '%חיבור מהיר%'
  AND  name_he      NOT ILIKE '%שרוול%'
  AND  name_he      NOT ILIKE '%ציר%'
  AND  name_he      NOT ILIKE '%קרטרידג%'
  AND  name_he      NOT ILIKE '%מכסה%'
  AND  name_he      NOT ILIKE '%לחצן%'
  AND  name_he      NOT ILIKE '%גלגל%'
  AND  name_he      NOT ILIKE '%HeadGear%';
-- Expected: ~22 rows updated


-- ============================================================
-- PART 6 — KaVo: prophylaxis units mis-filed as spare_parts
-- ============================================================
-- KA-D30916 (KAVO ProPHYjet), KA-PF2 (Prophyflex 2), KA-PF3 (Prophyflex 3)
-- and item 155 (cleaning service charge) are prophylaxis-category items.
-- item 155 has no manufacturer — handled generically below.
--
-- Affected: 3 KaVo rows

UPDATE equipment
SET    category = 'prophylaxis'
WHERE  manufacturer = 'KaVo'
  AND  category     = 'spare_parts'
  AND  (
         name_he ILIKE '%פרופיג%'
      OR item_number IN ('KA-D30916', 'KA-PF2', 'KA-PF3')
       );
-- Expected: ~3 rows updated


-- ============================================================
-- PART 7 — W&H: complete contra-angles mis-filed as spare_parts
-- ============================================================
-- W&H WH-999A, WH-975AE, WH-985AE, WH-EB62, WH-WD58, WH-WE56T, WH-WK-56LT
-- are complete contra-angle handpieces. The remaining ~44 W&H rows in
-- spare_parts that mention 'זויתן' are internal heads, buttons, cartridges,
-- gear adaptors, light guides — genuine spare parts — so they stay.
--
-- Affected: ~7 rows

UPDATE equipment
SET    category = 'angles'
WHERE  manufacturer = 'W&H'
  AND  category     = 'spare_parts'
  AND  name_he      ILIKE '%זויתן%'
  AND  name_he      NOT ILIKE '%ראש%'
  AND  name_he      NOT ILIKE '%לחצן%'
  AND  name_he      NOT ILIKE '%ציר%'
  AND  name_he      NOT ILIKE '%קרטרידג%'
  AND  name_he      NOT ILIKE '%סט ל%'
  AND  name_he      NOT ILIKE '%אדפטור%'
  AND  name_he      NOT ILIKE '%גלגלי שיניים%'
  AND  name_he      NOT ILIKE '%טבעת%'
  AND  name_he      NOT ILIKE '%שגם%'
  AND  name_he      NOT ILIKE '%קפיץ%'
  AND  name_he      NOT ILIKE '%מוליך%'
  AND  name_he      NOT ILIKE '%החלפת%'
  AND  name_he      NOT ILIKE '%לד ל%'
  AND  name_he      NOT ILIKE '%דימנו%';
-- Expected: ~7 rows updated


-- ============================================================
-- PART 8 — W&H: piezo surgery tips mis-filed as spare_parts
-- ============================================================
-- WH-07022500 and WH-B6 are W&H Piezo Surgery tips — belong in surgery.
--
-- Affected: 2 rows

UPDATE equipment
SET    category = 'surgery'
WHERE  manufacturer = 'W&H'
  AND  category     = 'spare_parts'
  AND  (
         item_number = 'WH-B6'
      OR item_number = 'WH-07022500'
      OR name_en     ILIKE '%piezo surgery tip%'
       );
-- Expected: 2 rows updated


-- ============================================================
-- PART 9 — Bien-Air: complete angles mis-filed as spare_parts
-- ============================================================
-- BA-CA (20:1), BA-CA11 (1:1), BA-CA11L, BA-100 (1:1 Ultimate),
-- BA-250LT, BA-PS20LED are complete Bien-Air contra-angles.
-- BA-CH (CHIROPRO unit) belongs in motors.
-- BA-1600631 (pedal for CHIROPRO) stays as spare_parts (accessory).
-- BOD-61085, TE-2666 (cartridges) stay as spare_parts.
--
-- Affected: ~6 angles + 1 motor

UPDATE equipment
SET    category = 'angles'
WHERE  manufacturer = 'Bien-Air'
  AND  category     = 'spare_parts'
  AND  name_he      ILIKE '%זויתן%'
  AND  name_he      NOT ILIKE '%גוף%'
  AND  name_he      NOT ILIKE '%לחצן%'
  AND  name_he      NOT ILIKE '%קרטרידג%'
  AND  name_he      NOT ILIKE '%פדל%';
-- Expected: ~6 rows updated

UPDATE equipment
SET    category = 'motors'
WHERE  manufacturer = 'Bien-Air'
  AND  category     = 'spare_parts'
  AND  (
         item_number = 'BA-CH'
      OR name_en     ILIKE '%chiropro%'
       )
  AND  name_he NOT ILIKE '%פדל%';   -- pedal stays as spare_parts
-- Expected: 1 row updated


-- ============================================================
-- PART 10 — JINME: complete angles mis-filed as spare_parts
-- ============================================================
-- JI-CA11L, JI-CA142EWL, JI-CA142IWL, JI-CA15L are complete JINME angles.
-- JI-CA15LM (small-head variant with 'ראש קטן'), JI-HCAM2 (empty head),
-- JI-CHCA11LED, JI-CHCA11M1 are heads/sub-assemblies — stay as spare_parts.
-- JI-BE15L (pair of bearings), JI-BC11M2 (push button), JI-200182 (push
-- button), JI-310403 (push button), JI-313056 (connector) stay as spare_parts.
--
-- Affected: ~4 rows

UPDATE equipment
SET    category = 'angles'
WHERE  manufacturer = 'JINME'
  AND  category     = 'spare_parts'
  AND  name_he      ILIKE '%זויתן%'
  AND  name_he      NOT ILIKE '%לחצן%'
  AND  name_he      NOT ILIKE '%מייסב%'
  AND  name_he      NOT ILIKE '%ראש%';
-- Expected: ~4 rows updated


-- ============================================================
-- PART 11 — Dentsply Sirona: complete angles/handpieces mis-filed as spare_parts
-- ============================================================
-- SI-A200L (זויתן 1:5 SIRONA A200L), SI-A40L (זויתן 1:1), SI-C200L (זויתן 1:5)
-- and SI-31050 (מברגת Dentsply Sirona X-Smart IQ) are complete handpieces.
-- BOD-, MK-, RT-, SC-, SP- prefix rows are spare parts / third-party spares —
-- they stay.
--
-- Affected: ~4 rows (angles) + 1 row (endo motor)

UPDATE equipment
SET    category = 'angles'
WHERE  manufacturer = 'Dentsply Sirona'
  AND  category     = 'spare_parts'
  AND  item_number  ~ '^SI-'
  AND  name_he      ILIKE '%זויתן%'
  AND  name_he      NOT ILIKE '%ציר%'
  AND  name_he      NOT ILIKE '%לחצן%';
-- Expected: ~3 rows updated (SI-A200L, SI-A40L, SI-C200L)

UPDATE equipment
SET    category = 'motors'
WHERE  manufacturer = 'Dentsply Sirona'
  AND  category     = 'spare_parts'
  AND  item_number  = 'SI-31050';   -- X-Smart IQ endodontic motor
-- Expected: 1 row updated


-- ============================================================
-- PART 12 — Broad safety net: re-check motors for mis-filed service items
-- ============================================================
-- NSK physio-dispenser accessory tubes (AMS-6446, IM-IT0013-01, OM-32.F0134)
-- currently sit in motors because 002 matched 'dispenser' in name. They are
-- single-use consumable irrigation tubes.
--
-- Affected: ~3 rows

UPDATE equipment
SET    category = 'consumables'
WHERE  manufacturer = 'NSK'
  AND  category     = 'motors'
  AND  (
         name_he ILIKE '%צינורית חד פעמית%'
      OR name_he ILIKE '%צינורות חד פעמי%'
      OR name_en ILIKE '%disposable tube%'
      OR name_en ILIKE '%disposable%tubing%'
       );
-- Expected: ~3 rows updated


-- ============================================================
-- PART 13 — Null-manufacturer: service/admin rows clean-up
-- ============================================================
-- Rows with no manufacturer and purely Hebrew service descriptions (repair
-- calls, monthly subscriptions, "no-fix" records, quote headers) were
-- caught by the spare_parts catch-all in 002. A new 'services' category
-- is cleaner for reporting.  All numeric item_numbers 1–999 that contain
-- service keywords are included.
--
-- Affected: ~54 rows

UPDATE equipment
SET    category = 'services'
WHERE  manufacturer IS NULL
  AND  category     = 'spare_parts'
  AND  (
         name_he ILIKE '%תיקון%'
      OR name_he ILIKE '%ביקור טכנאי%'
      OR name_he ILIKE '%פירוק%'
      OR name_he ILIKE '%ניקוי%'
      OR name_he ILIKE '%כיול%'
      OR name_he ILIKE '%מנוי חודשי%'
      OR name_he ILIKE '%הצעת מחיר%'
      OR name_he ILIKE '%תעודת משלוח%'
      OR name_he ILIKE '%ללא תיקון%'
      OR name_he ILIKE '%התיקון לא מאושר%'
      OR name_he ILIKE '%תיקון באחריות%'
      OR name_he ILIKE '%השכרת%'
       );
-- Expected: ~54 rows updated


-- ============================================================
-- PART 14 — Null-manufacturer: DO- surgical instruments
-- ============================================================
-- 281 null-manufacturer rows with DO- prefix contain surgical/dental
-- instruments (curettes, elevators, pliers, sinus lift sets, scrapers,
-- etc.) by various third-party brands.  Currently filed as spare_parts,
-- they belong in surgery.
--
-- Affected: ~281 rows

UPDATE equipment
SET    category = 'surgery'
WHERE  manufacturer IS NULL
  AND  category     = 'spare_parts'
  AND  item_number  ~ '^DO-'
  AND  (
         name_en ILIKE '%surgical%'
      OR name_en ILIKE '%curette%'
      OR name_en ILIKE '%aspirator%'
      OR name_en ILIKE '%elevator%'
      OR name_en ILIKE '%plier%'
      OR name_en ILIKE '%forcep%'
      OR name_en ILIKE '%retract%'
      OR name_en ILIKE '%perio%'
      OR name_en ILIKE '%sinus%'
      OR name_en ILIKE '%scaler%'
      OR name_en ILIKE '%plugger%'
      OR name_en ILIKE '%burnisher%'
      OR name_en ILIKE '%probe%'
      OR name_en ILIKE '%bone%'
      OR name_en ILIKE '%cassette%'
      OR name_en ILIKE '%holder%'
      OR name_en ILIKE '%scraper%'
      OR name_en ILIKE '%implant%'
      OR name_he  ILIKE '%כירורג%'
      OR name_he  ILIKE '%פריו%'
      OR name_he  ILIKE '%ניתוח%'
       );
-- Expected: ~250–280 rows updated (some DO- rows without surgical terms stay)


-- ============================================================
-- SUMMARY
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

-- Category distribution after migration 003
SELECT
  category,
  COUNT(*) AS total
FROM equipment
GROUP BY category
ORDER BY total DESC;
