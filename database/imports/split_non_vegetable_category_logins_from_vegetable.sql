-- Split non-vegetable category galas away from the existing vegetable login.
--
-- Purpose:
--   Keep the existing mobile/username only for Vegetable.
--   Move Fruit, Banana, and Onion-Potato galas to separate pending placeholder
--   logins so the old vegetable number cannot access those categories.
--   Final rule: one real member mobile number must belong to one category only.
--
-- Run this on production only after checking the preview SELECT at the bottom.

SET NAMES utf8mb4;
SET @old_sql_mode := @@SESSION.sql_mode;
SET SESSION sql_mode = REPLACE(@@SESSION.sql_mode, 'ONLY_FULL_GROUP_BY', '');
SET @trader_role_id := (SELECT id FROM roles WHERE code = 'TRADER' LIMIT 1);

START TRANSACTION;

-- BHV-0270: keep 9370144640 for Vegetable; split Fruit and Onion-Potato.
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, created_at, updated_at)
SELECT @trader_role_id, 'PENDING-FRT-BHV0270', NULL, 'PENDING-F-BHV0270', 'not-for-login',
       CONCAT(u.full_name, ' - Fruit'), CONCAT(COALESCE(u.full_name_en, u.full_name), ' - Fruit'),
       u.preferred_language, 'pending', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
WHERE t.trader_code = 'BHV-0270'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'PENDING-FRT-BHV0270' OR mobile = 'PENDING-F-BHV0270');

INSERT INTO traders (
  user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id,
  business_category_id, alternate_mobile, address_line1, address_line2, village_city, taluka,
  district, state, pincode, gst_number, aadhaar_masked, aadhaar_hash, pan_masked, pan_hash,
  blood_group, licence_number, association_sequence_number, association_registration_number,
  bank_account_masked, ifsc_code, verification_status, verified_by, verified_at, rejection_reason,
  created_at, updated_at
)
SELECT nu.id, 'BHV-0270-FRT', t.business_name, t.business_name_en,
       CONCAT(COALESCE(t.market_registration_number, t.trader_code), '-FRT'),
       MIN(tg.gala_id), bc.id, t.alternate_mobile, t.address_line1, t.address_line2,
       t.village_city, t.taluka, t.district, t.state, t.pincode, t.gst_number,
       t.aadhaar_masked, t.aadhaar_hash, t.pan_masked, t.pan_hash, t.blood_group,
       t.licence_number, t.association_sequence_number, t.association_registration_number,
       t.bank_account_masked, t.ifsc_code, 'submitted', t.verified_by, t.verified_at,
       'Pending new category-wise mobile number', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
JOIN users nu ON nu.username = 'PENDING-FRT-BHV0270'
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
WHERE t.trader_code = 'BHV-0270'
  AND NOT EXISTS (SELECT 1 FROM traders WHERE trader_code = 'BHV-0270-FRT')
GROUP BY nu.id, t.id, bc.id;

UPDATE trader_galas tg
JOIN traders old_t ON old_t.id = tg.trader_id AND old_t.trader_code = 'BHV-0270'
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
JOIN traders new_t ON new_t.trader_code = 'BHV-0270-FRT'
SET tg.trader_id = new_t.id, tg.is_primary = TRUE, tg.updated_at = NOW();

INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, created_at, updated_at)
SELECT @trader_role_id, 'PENDING-ONI-BHV0270', NULL, 'PENDING-O-BHV0270', 'not-for-login',
       CONCAT(u.full_name, ' - Onion-Potato'), CONCAT(COALESCE(u.full_name_en, u.full_name), ' - Onion-Potato'),
       u.preferred_language, 'pending', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
WHERE t.trader_code = 'BHV-0270'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'PENDING-ONI-BHV0270' OR mobile = 'PENDING-O-BHV0270');

INSERT INTO traders (
  user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id,
  business_category_id, alternate_mobile, address_line1, address_line2, village_city, taluka,
  district, state, pincode, gst_number, aadhaar_masked, aadhaar_hash, pan_masked, pan_hash,
  blood_group, licence_number, association_sequence_number, association_registration_number,
  bank_account_masked, ifsc_code, verification_status, verified_by, verified_at, rejection_reason,
  created_at, updated_at
)
SELECT nu.id, 'BHV-0270-ONI', t.business_name, t.business_name_en,
       CONCAT(COALESCE(t.market_registration_number, t.trader_code), '-ONI'),
       MIN(tg.gala_id), bc.id, t.alternate_mobile, t.address_line1, t.address_line2,
       t.village_city, t.taluka, t.district, t.state, t.pincode, t.gst_number,
       t.aadhaar_masked, t.aadhaar_hash, t.pan_masked, t.pan_hash, t.blood_group,
       t.licence_number, t.association_sequence_number, t.association_registration_number,
       t.bank_account_masked, t.ifsc_code, 'submitted', t.verified_by, t.verified_at,
       'Pending new category-wise mobile number', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
JOIN users nu ON nu.username = 'PENDING-ONI-BHV0270'
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Onion-Potato'
WHERE t.trader_code = 'BHV-0270'
  AND NOT EXISTS (SELECT 1 FROM traders WHERE trader_code = 'BHV-0270-ONI')
GROUP BY nu.id, t.id, bc.id;

UPDATE trader_galas tg
JOIN traders old_t ON old_t.id = tg.trader_id AND old_t.trader_code = 'BHV-0270'
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Onion-Potato'
JOIN traders new_t ON new_t.trader_code = 'BHV-0270-ONI'
SET tg.trader_id = new_t.id, tg.is_primary = TRUE, tg.updated_at = NOW();

-- BHV-0148: keep 9422316279 for Vegetable; split Fruit and Banana.
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, created_at, updated_at)
SELECT @trader_role_id, 'PENDING-FRT-BHV0148', NULL, 'PENDING-F-BHV0148', 'not-for-login',
       CONCAT(u.full_name, ' - Fruit'), CONCAT(COALESCE(u.full_name_en, u.full_name), ' - Fruit'),
       u.preferred_language, 'pending', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
WHERE t.trader_code = 'BHV-0148'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'PENDING-FRT-BHV0148' OR mobile = 'PENDING-F-BHV0148');

INSERT INTO traders (
  user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id,
  business_category_id, alternate_mobile, address_line1, address_line2, village_city, taluka,
  district, state, pincode, gst_number, aadhaar_masked, aadhaar_hash, pan_masked, pan_hash,
  blood_group, licence_number, association_sequence_number, association_registration_number,
  bank_account_masked, ifsc_code, verification_status, verified_by, verified_at, rejection_reason,
  created_at, updated_at
)
SELECT nu.id, 'BHV-0148-FRT', t.business_name, t.business_name_en,
       CONCAT(COALESCE(t.market_registration_number, t.trader_code), '-FRT'),
       MIN(tg.gala_id), bc.id, t.alternate_mobile, t.address_line1, t.address_line2,
       t.village_city, t.taluka, t.district, t.state, t.pincode, t.gst_number,
       t.aadhaar_masked, t.aadhaar_hash, t.pan_masked, t.pan_hash, t.blood_group,
       t.licence_number, t.association_sequence_number, t.association_registration_number,
       t.bank_account_masked, t.ifsc_code, 'submitted', t.verified_by, t.verified_at,
       'Pending new category-wise mobile number', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
JOIN users nu ON nu.username = 'PENDING-FRT-BHV0148'
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
WHERE t.trader_code = 'BHV-0148'
  AND NOT EXISTS (SELECT 1 FROM traders WHERE trader_code = 'BHV-0148-FRT')
GROUP BY nu.id, t.id, bc.id;

UPDATE trader_galas tg
JOIN traders old_t ON old_t.id = tg.trader_id AND old_t.trader_code = 'BHV-0148'
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
JOIN traders new_t ON new_t.trader_code = 'BHV-0148-FRT'
SET tg.trader_id = new_t.id, tg.is_primary = TRUE, tg.updated_at = NOW();

INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, created_at, updated_at)
SELECT @trader_role_id, 'PENDING-BAN-BHV0148', NULL, 'PENDING-B-BHV0148', 'not-for-login',
       CONCAT(u.full_name, ' - Banana'), CONCAT(COALESCE(u.full_name_en, u.full_name), ' - Banana'),
       u.preferred_language, 'pending', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
WHERE t.trader_code = 'BHV-0148'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'PENDING-BAN-BHV0148' OR mobile = 'PENDING-B-BHV0148');

INSERT INTO traders (
  user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id,
  business_category_id, alternate_mobile, address_line1, address_line2, village_city, taluka,
  district, state, pincode, gst_number, aadhaar_masked, aadhaar_hash, pan_masked, pan_hash,
  blood_group, licence_number, association_sequence_number, association_registration_number,
  bank_account_masked, ifsc_code, verification_status, verified_by, verified_at, rejection_reason,
  created_at, updated_at
)
SELECT nu.id, 'BHV-0148-BAN', t.business_name, t.business_name_en,
       CONCAT(COALESCE(t.market_registration_number, t.trader_code), '-BAN'),
       MIN(tg.gala_id), bc.id, t.alternate_mobile, t.address_line1, t.address_line2,
       t.village_city, t.taluka, t.district, t.state, t.pincode, t.gst_number,
       t.aadhaar_masked, t.aadhaar_hash, t.pan_masked, t.pan_hash, t.blood_group,
       t.licence_number, t.association_sequence_number, t.association_registration_number,
       t.bank_account_masked, t.ifsc_code, 'submitted', t.verified_by, t.verified_at,
       'Pending new category-wise mobile number', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
JOIN users nu ON nu.username = 'PENDING-BAN-BHV0148'
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Banana'
WHERE t.trader_code = 'BHV-0148'
  AND NOT EXISTS (SELECT 1 FROM traders WHERE trader_code = 'BHV-0148-BAN')
GROUP BY nu.id, t.id, bc.id;

UPDATE trader_galas tg
JOIN traders old_t ON old_t.id = tg.trader_id AND old_t.trader_code = 'BHV-0148'
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Banana'
JOIN traders new_t ON new_t.trader_code = 'BHV-0148-BAN'
SET tg.trader_id = new_t.id, tg.is_primary = TRUE, tg.updated_at = NOW();

-- BHV-0075: keep 9822111120 for Vegetable; split Fruit.
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, created_at, updated_at)
SELECT @trader_role_id, 'PENDING-FRT-BHV0075', NULL, 'PENDING-F-BHV0075', 'not-for-login',
       CONCAT(u.full_name, ' - Fruit'), CONCAT(COALESCE(u.full_name_en, u.full_name), ' - Fruit'),
       u.preferred_language, 'pending', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
WHERE t.trader_code = 'BHV-0075'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'PENDING-FRT-BHV0075' OR mobile = 'PENDING-F-BHV0075');

INSERT INTO traders (
  user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id,
  business_category_id, alternate_mobile, address_line1, address_line2, village_city, taluka,
  district, state, pincode, gst_number, aadhaar_masked, aadhaar_hash, pan_masked, pan_hash,
  blood_group, licence_number, association_sequence_number, association_registration_number,
  bank_account_masked, ifsc_code, verification_status, verified_by, verified_at, rejection_reason,
  created_at, updated_at
)
SELECT nu.id, 'BHV-0075-FRT', t.business_name, t.business_name_en,
       CONCAT(COALESCE(t.market_registration_number, t.trader_code), '-FRT'),
       MIN(tg.gala_id), bc.id, t.alternate_mobile, t.address_line1, t.address_line2,
       t.village_city, t.taluka, t.district, t.state, t.pincode, t.gst_number,
       t.aadhaar_masked, t.aadhaar_hash, t.pan_masked, t.pan_hash, t.blood_group,
       t.licence_number, t.association_sequence_number, t.association_registration_number,
       t.bank_account_masked, t.ifsc_code, 'submitted', t.verified_by, t.verified_at,
       'Pending new category-wise mobile number', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
JOIN users nu ON nu.username = 'PENDING-FRT-BHV0075'
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
WHERE t.trader_code = 'BHV-0075'
  AND NOT EXISTS (SELECT 1 FROM traders WHERE trader_code = 'BHV-0075-FRT')
GROUP BY nu.id, t.id, bc.id;

UPDATE trader_galas tg
JOIN traders old_t ON old_t.id = tg.trader_id AND old_t.trader_code = 'BHV-0075'
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
JOIN traders new_t ON new_t.trader_code = 'BHV-0075-FRT'
SET tg.trader_id = new_t.id, tg.is_primary = TRUE, tg.updated_at = NOW();

-- BHV-0271: keep 9822273752 for Vegetable; split Fruit.
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, created_at, updated_at)
SELECT @trader_role_id, 'PENDING-FRT-BHV0271', NULL, 'PENDING-F-BHV0271', 'not-for-login',
       CONCAT(u.full_name, ' - Fruit'), CONCAT(COALESCE(u.full_name_en, u.full_name), ' - Fruit'),
       u.preferred_language, 'pending', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
WHERE t.trader_code = 'BHV-0271'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'PENDING-FRT-BHV0271' OR mobile = 'PENDING-F-BHV0271');

INSERT INTO traders (
  user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id,
  business_category_id, alternate_mobile, address_line1, address_line2, village_city, taluka,
  district, state, pincode, gst_number, aadhaar_masked, aadhaar_hash, pan_masked, pan_hash,
  blood_group, licence_number, association_sequence_number, association_registration_number,
  bank_account_masked, ifsc_code, verification_status, verified_by, verified_at, rejection_reason,
  created_at, updated_at
)
SELECT nu.id, 'BHV-0271-FRT', t.business_name, t.business_name_en,
       CONCAT(COALESCE(t.market_registration_number, t.trader_code), '-FRT'),
       MIN(tg.gala_id), bc.id, t.alternate_mobile, t.address_line1, t.address_line2,
       t.village_city, t.taluka, t.district, t.state, t.pincode, t.gst_number,
       t.aadhaar_masked, t.aadhaar_hash, t.pan_masked, t.pan_hash, t.blood_group,
       t.licence_number, t.association_sequence_number, t.association_registration_number,
       t.bank_account_masked, t.ifsc_code, 'submitted', t.verified_by, t.verified_at,
       'Pending new category-wise mobile number', NOW(), NOW()
FROM traders t
JOIN users u ON u.id = t.user_id
JOIN users nu ON nu.username = 'PENDING-FRT-BHV0271'
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
WHERE t.trader_code = 'BHV-0271'
  AND NOT EXISTS (SELECT 1 FROM traders WHERE trader_code = 'BHV-0271-FRT')
GROUP BY nu.id, t.id, bc.id;

UPDATE trader_galas tg
JOIN traders old_t ON old_t.id = tg.trader_id AND old_t.trader_code = 'BHV-0271'
JOIN business_categories bc ON bc.id = tg.business_category_id AND bc.name_en = 'Fruit'
JOIN traders new_t ON new_t.trader_code = 'BHV-0271-FRT'
SET tg.trader_id = new_t.id, tg.is_primary = TRUE, tg.updated_at = NOW();

-- Keep each original vegetable trader pointed at Vegetable.
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
JOIN business_categories bc ON bc.id = tg.business_category_id
SET tg.is_primary = FALSE, t.updated_at = NOW()
WHERE t.trader_code IN ('BHV-0270', 'BHV-0148', 'BHV-0075', 'BHV-0271')
  AND bc.name_en = 'Vegetable';

UPDATE trader_galas tg
JOIN (
  SELECT tg2.trader_id, MIN(tg2.id) AS primary_trader_gala_id
  FROM trader_galas tg2
  JOIN business_categories bc2 ON bc2.id = tg2.business_category_id
  JOIN traders t2 ON t2.id = tg2.trader_id
  WHERE t2.trader_code IN ('BHV-0270', 'BHV-0148', 'BHV-0075', 'BHV-0271')
    AND bc2.name_en = 'Vegetable'
  GROUP BY tg2.trader_id
) chosen ON chosen.primary_trader_gala_id = tg.id
SET tg.is_primary = TRUE, tg.updated_at = NOW();

UPDATE traders t
JOIN (
  SELECT tg3.trader_id, MIN(tg3.gala_id) AS primary_gala_id, MIN(bc3.id) AS category_id
  FROM trader_galas tg3
  JOIN business_categories bc3 ON bc3.id = tg3.business_category_id
  JOIN traders t3 ON t3.id = tg3.trader_id
  WHERE t3.trader_code IN ('BHV-0270', 'BHV-0148', 'BHV-0075', 'BHV-0271')
    AND bc3.name_en = 'Vegetable'
  GROUP BY tg3.trader_id
) vegetable ON vegetable.trader_id = t.id
SET t.gala_id = vegetable.primary_gala_id,
    t.business_category_id = vegetable.category_id,
    t.updated_at = NOW();

DELETE us
FROM user_sessions us
JOIN users u ON u.id = us.user_id
WHERE u.username IN (
  'PENDING-FRT-BHV0270', 'PENDING-ONI-BHV0270', 'PENDING-FRT-BHV0148',
  'PENDING-BAN-BHV0148', 'PENDING-FRT-BHV0075', 'PENDING-FRT-BHV0271'
);

COMMIT;

SET SESSION sql_mode = @old_sql_mode;

-- Verification: old numbers should now show Vegetable only.
SELECT u.mobile, u.username, t.trader_code, bc.name_en AS category,
       GROUP_CONCAT(mg.gala_number ORDER BY mg.gala_number SEPARATOR ', ') AS galas,
       u.status AS user_status, t.verification_status
FROM users u
JOIN traders t ON t.user_id = u.id
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id
JOIN market_galas mg ON mg.id = tg.gala_id
WHERE t.trader_code IN (
  'BHV-0270', 'BHV-0270-FRT', 'BHV-0270-ONI',
  'BHV-0148', 'BHV-0148-FRT', 'BHV-0148-BAN',
  'BHV-0075', 'BHV-0075-FRT',
  'BHV-0271', 'BHV-0271-FRT'
)
GROUP BY u.mobile, u.username, t.trader_code, bc.name_en, u.status, t.verification_status
ORDER BY t.trader_code, category;

-- Final duplicate check: this should return zero rows.
-- If any row appears here, that real mobile number is still attached to more
-- than one category and needs another category-wise split.
SELECT u.mobile,
       GROUP_CONCAT(DISTINCT bc.name_en ORDER BY bc.name_en SEPARATOR ', ') AS categories,
       GROUP_CONCAT(DISTINCT t.trader_code ORDER BY t.trader_code SEPARATOR ', ') AS trader_codes
FROM users u
JOIN traders t ON t.user_id = u.id
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN business_categories bc ON bc.id = tg.business_category_id
WHERE bc.name_en IN ('Banana', 'Fruit', 'Vegetable', 'Onion-Potato')
  AND u.mobile REGEXP '^[0-9]{10}$'
GROUP BY u.mobile
HAVING COUNT(DISTINCT bc.name_en) > 1
ORDER BY u.mobile;
