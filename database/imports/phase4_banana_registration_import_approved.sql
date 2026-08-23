-- Phase 4 import: Banana member registrations from bilingual PDF preview
-- IMPORTANT: Run only after taking DB + uploads backup and verifying preview/login sheets.
-- Missing-phone rows are intentionally excluded. This script imports and approves Banana registrations.
-- Existing users/traders are not downgraded; duplicate mobiles only receive linked gala/shop records when possible.
SET NAMES utf8mb4;
START TRANSACTION;
SET @trader_role_id := (SELECT id FROM roles WHERE code = 'TRADER' LIMIT 1);
SET @admin_user_id := (SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id WHERE r.code IN ('MAIN_ADMIN','SUPER_ADMIN','ADMIN') AND u.status IN ('active','pending') ORDER BY FIELD(r.code, 'MAIN_ADMIN', 'SUPER_ADMIN', 'ADMIN'), u.id LIMIT 1);
INSERT INTO business_categories (name_en, name_mr, status)
SELECT 'Banana', 'केळी', 'active'
WHERE NOT EXISTS (SELECT 1 FROM business_categories WHERE name_en IN ('Banana', 'Banana Section') OR name_mr IN ('केळी', 'केळी विभाग'));
SET @banana_category_id := (SELECT id FROM business_categories WHERE name_en IN ('Banana', 'Banana Section') OR name_mr IN ('केळी', 'केळी विभाग') ORDER BY id LIMIT 1);

-- Row 1 | Mobile 9834568736 | श्री राजेश पांडु रंग. जाधव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('1', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9834568736', NULL, '9834568736', 'ca7e5b932a2fe44923f49525abab1479bc5e66b0f99d9d8d82bae61dfb60e552', 'श्री राजेश पांडु रंग. जाधव', 'Rajesh Pandurang Jadhav', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9834568736' OR username = '9834568736');
SET @user_id := (SELECT id FROM users WHERE mobile = '9834568736' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '1' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0001', 'मे पांडु रंग आंबादास. जाधव', 'M/s. Pandurang Ambadas Jadhav', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '1', '1', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '1' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे पांडु रंग आंबादास. जाधव', 'M/s. Pandurang Ambadas Jadhav', 'केळी विभाग', @banana_category_id, NULL, NULL, '1', '1', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 2 | Mobile 9890007007 | श्री राके श पांडु रंग. जाधव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('2', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890007007', NULL, '9890007007', 'd617122ec2a6a5f0699ec03fba74b69475d4f0af71136477232d076dd0d197fc', 'श्री राके श पांडु रंग. जाधव', 'Rakesh Pandurang Jadhav', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890007007' OR username = '9890007007');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890007007' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '2' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0002', 'मे पांडु रंग आंबादास. जाधव', 'M/s. Pandurang Ambadas Jadhav', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '2', '2', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '2' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे पांडु रंग आंबादास. जाधव', 'M/s. Pandurang Ambadas Jadhav', 'केळी विभाग', @banana_category_id, NULL, NULL, '2', '2', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 4 | Mobile 9881655599 | श्री राजेश भगवानशेठ. वखारे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('4', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9881655599', NULL, '9881655599', 'bce5e5b0602b62648e5970a83811ae7c6f71377ce7802d2d78ff9289de93f98a', 'श्री राजेश भगवानशेठ. वखारे', 'Rajesh Bhagwansheth Wakhare', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9881655599' OR username = '9881655599');
SET @user_id := (SELECT id FROM users WHERE mobile = '9881655599' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '4' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0004', 'मे राजेश ट्रे डिंग कं पनी.', 'M/s. Rajesh Trading Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '4', '4', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '4' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे राजेश ट्रे डिंग कं पनी.', 'M/s. Rajesh Trading Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '4', '4', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 5 | Mobile 9822289530 | इलियास अब्दुल रहिम बागवान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('5', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822289530', NULL, '9822289530', '676af6f5743f80761bce00bb38e9339f0894ad76249e623b18dc6755a6e96633', 'इलियास अब्दुल रहिम बागवान', 'Iliyas Abdul Rahim Bagwan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822289530' OR username = '9822289530');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822289530' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '5' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0005', 'मे इलियास अब्दुल. रहिम बागवान', 'M/s. Iliyas Abdul Rahim Bagwan', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '5', '5', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '5' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे इलियास अब्दुल. रहिम बागवान', 'M/s. Iliyas Abdul Rahim Bagwan', 'केळी विभाग', @banana_category_id, NULL, NULL, '5', '5', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 7 | Mobile 9822846778 | श्री सुरे श दगडू काकडे.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('7A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822846778', NULL, '9822846778', '7a5f317ee499d1a79421ccce910450c7078be970f1181a2545dced23ad9facd5', 'श्री सुरे श दगडू काकडे.', 'Suresh Dagdu Kakade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822846778' OR username = '9822846778');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822846778' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '7A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0007', 'मे सुरे श दगडू काकडे.', 'M/s. Suresh Dagdu Kakade', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '7', '7A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '7A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे सुरे श दगडू काकडे.', 'M/s. Suresh Dagdu Kakade', 'केळी विभाग', @banana_category_id, NULL, NULL, '7', '7A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 8 | Mobile 7774913177 | श्री विलास लक्ष्मण. लिंबोरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('7B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7774913177', NULL, '7774913177', '707531c064b8dccecf42e8ac07d14d896d4a3f1d3fc59fcacf153f647278cd65', 'श्री विलास लक्ष्मण. लिंबोरे', 'Vilas Laxman Limbore', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7774913177' OR username = '7774913177');
SET @user_id := (SELECT id FROM users WHERE mobile = '7774913177' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '7B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0008', 'मे लक्ष्मण बाबु राव. लिंबोरे', 'M/s. Laxman Baburao Limbore', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '8', '7B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '7B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे लक्ष्मण बाबु राव. लिंबोरे', 'M/s. Laxman Baburao Limbore', 'केळी विभाग', @banana_category_id, NULL, NULL, '8', '7B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 9 | Mobile 9850379778 | श्री प्रकाश दगडू काकडे.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('8B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850379778', NULL, '9850379778', '848cc748d436a1c3f091977cce33e7d797f130a618ebbf16387e3e12ab432f29', 'श्री प्रकाश दगडू काकडे.', 'Prakash Dagdu Kakade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850379778' OR username = '9850379778');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850379778' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '8B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0009', 'मे प्रकाश दगडू काकडे.', 'M/s. Prakash Dagdu Kakade', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '9', '8B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '8B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे प्रकाश दगडू काकडे.', 'M/s. Prakash Dagdu Kakade', 'केळी विभाग', @banana_category_id, NULL, NULL, '9', '8B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 10 | Mobile 8149193477 | श्री अमोल सहदेव. सोनावणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('8A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8149193477', NULL, '8149193477', '023e44ee83d41c25a5a7da9e4458b5f86b000e17cdc622bdc6df6c22d26c0d35', 'श्री अमोल सहदेव. सोनावणे', 'Amol Sahadev Sonawane', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8149193477' OR username = '8149193477');
SET @user_id := (SELECT id FROM users WHERE mobile = '8149193477' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '8A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0010', 'मे सहदेव अर्जुन. सोनावणे', 'M/s. Sahadev Arjun Sonawane', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '10', '8A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '8A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे सहदेव अर्जुन. सोनावणे', 'M/s. Sahadev Arjun Sonawane', 'केळी विभाग', @banana_category_id, NULL, NULL, '10', '8A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 11 | Mobile 9060112786 | मोहम्मद जाफर मो. शब्बीर मोमीन
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('9', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9060112786', NULL, '9060112786', '1b8a49d86694880c7bb97efa79e03765f39e06077d57acb36ebd83b3d08a6a97', 'मोहम्मद जाफर मो. शब्बीर मोमीन', 'Mohammad Jafar Mo. Shabbir Momin', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9060112786' OR username = '9060112786');
SET @user_id := (SELECT id FROM users WHERE mobile = '9060112786' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '9' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0011', 'मे मोहम्मद जाफर मो. . शब्बीर मोमीन', 'M/s. Mohammad Jafar Mo. Shabbir Momin', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '11', '9', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '9' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे मोहम्मद जाफर मो. . शब्बीर मोमीन', 'M/s. Mohammad Jafar Mo. Shabbir Momin', 'केळी विभाग', @banana_category_id, NULL, NULL, '11', '9', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 12 | Mobile 9890735632 | श्री गणेश श्रीपती जाधव.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('10A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890735632', NULL, '9890735632', '91e46ba7d3b2dbdb7f19211cc5d5831552b87727a6f2128615268107e4a36df9', 'श्री गणेश श्रीपती जाधव.', 'Ganesh Shripati Jadhav', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890735632' OR username = '9890735632');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890735632' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '10A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0012', 'मे श्रीपती लक्ष्मण जाधव.', 'M/s. Shripati Laxman Jadhav', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '12', '10A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '10A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे श्रीपती लक्ष्मण जाधव.', 'M/s. Shripati Laxman Jadhav', 'केळी विभाग', @banana_category_id, NULL, NULL, '12', '10A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 13 | Mobile 9822417890 | श्री निलेश प्रभाकर. पटवर्धन
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('10B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822417890', NULL, '9822417890', '05cebe73cddb18b0d283b42122ee6b3f65854f86c82daec2401f52d3a2a45064', 'श्री निलेश प्रभाकर. पटवर्धन', 'Nilesh Prabhakar Patwardhan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822417890' OR username = '9822417890');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822417890' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '10B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0013', 'मे प्रभाकर गजानन. पटवर्धन', 'M/s. Prabhakar Gajanan Patwardhan', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '13', '10B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '10B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे प्रभाकर गजानन. पटवर्धन', 'M/s. Prabhakar Gajanan Patwardhan', 'केळी विभाग', @banana_category_id, NULL, NULL, '13', '10B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 14 | Mobile 7738691111 | सैपन खुदाबक्ष लुकडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('11B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7738691111', NULL, '7738691111', '135ccc74f88c249e1db806ed2cd5d8b97e96d88337247fdec65a895bf05f9046', 'सैपन खुदाबक्ष लुकडे', 'Saipan Khudabaksh Lukade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7738691111' OR username = '7738691111');
SET @user_id := (SELECT id FROM users WHERE mobile = '7738691111' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '11B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0014', 'मे सैपन खुदाबक्ष लुकडे.', 'M/s. Saipan Khudabaksh Lukade', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '14', '11B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '11B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे सैपन खुदाबक्ष लुकडे.', 'M/s. Saipan Khudabaksh Lukade', 'केळी विभाग', @banana_category_id, NULL, NULL, '14', '11B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 15 | Mobile 9822422125 | श्री शशिकांत बबनराव. काजळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('11A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822422125', NULL, '9822422125', '7ccfeb82b537485f75cc846b8283090ce02198434ad08e86c8d90460b3a32f2f', 'श्री शशिकांत बबनराव. काजळे', 'Shashikant Babanrao Kajale', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822422125' OR username = '9822422125');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822422125' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '11A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0015', 'मे शशिकांत बबनराव. काजळे', 'M/s. Shashikant Babanrao Kajale', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '15', '11A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '11A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे शशिकांत बबनराव. काजळे', 'M/s. Shashikant Babanrao Kajale', 'केळी विभाग', @banana_category_id, NULL, NULL, '15', '11A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 16 | Mobile 9527149988 | श्री उल्हास भाऊसाहेब. गाडवे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('12', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9527149988', NULL, '9527149988', 'de8735ea036ea427978b30959147e2c4248012111dfad9264bcb49c418c4882b', 'श्री उल्हास भाऊसाहेब. गाडवे', 'Ulhas Bhausaheb Gadave', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9527149988' OR username = '9527149988');
SET @user_id := (SELECT id FROM users WHERE mobile = '9527149988' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '12' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0016', 'मे उल्हास ट्रे डिंग कं पनी.', 'M/s. Ulhas Trading Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '16', '12', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '12' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे उल्हास ट्रे डिंग कं पनी.', 'M/s. Ulhas Trading Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '16', '12', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 17 | Mobile 9850382244 | सलीम यासीन बांगी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('13', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850382244', NULL, '9850382244', 'a7385de4f436cce106cebc8c6f677abaf8118515b28a36fddfb95a083360489c', 'सलीम यासीन बांगी', 'Salim Yasin Bangi', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850382244' OR username = '9850382244');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850382244' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '13' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0017', 'मे सलीम यासीन बांगी.', 'M/s. Salim Yasin Bangi', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '17', '13', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '13' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे सलीम यासीन बांगी.', 'M/s. Salim Yasin Bangi', 'केळी विभाग', @banana_category_id, NULL, NULL, '17', '13', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 18 | Mobile 7249321737 | इब्राहीम मौलाअली भोले
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('14', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7249321737', NULL, '7249321737', '1eb853df5dbeac0b075f8d57022af230de243b424c2b83c9e4bb1279bf28c6cd', 'इब्राहीम मौलाअली भोले', 'Ibrahim Maulaali Bhole', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7249321737' OR username = '7249321737');
SET @user_id := (SELECT id FROM users WHERE mobile = '7249321737' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '14' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0018', 'मे नियामतबी चांदसाब. भोले', 'M/s. Niyamatbi Chandsab Bhole', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '18', '14', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '14' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे नियामतबी चांदसाब. भोले', 'M/s. Niyamatbi Chandsab Bhole', 'केळी विभाग', @banana_category_id, NULL, NULL, '18', '14', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 20 | Mobile 9822355581 | श्री विठ्ठल हरिभाऊ. वायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('16', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822355581', NULL, '9822355581', '4871636421c26e7a4e8900fb1296830652de34c75b22da66f7e726aee3597901', 'श्री विठ्ठल हरिभाऊ. वायकर', 'Vitthal Haribhau Waykar', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822355581' OR username = '9822355581');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822355581' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '16' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0020', 'मे विठ्ठल हरिभाऊ. वायकर', 'M/s. Vitthal Haribhau Waykar', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '20', '16', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '16' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे विठ्ठल हरिभाऊ. वायकर', 'M/s. Vitthal Haribhau Waykar', 'केळी विभाग', @banana_category_id, NULL, NULL, '20', '16', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 22 | Mobile 9890228855 | श्री अशोक रामभाऊ. गावडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('18', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890228855', NULL, '9890228855', '16436acb640b43493867031550d869a2d960d6f3b25d4473100318d6db57a118', 'श्री अशोक रामभाऊ. गावडे', 'Ashok Rambhau Gawade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890228855' OR username = '9890228855');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890228855' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '18' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0022', 'मे गावडे फ्रू ट कं पनी.', 'M/s. Gawade Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '22', '18', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '18' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे गावडे फ्रू ट कं पनी.', 'M/s. Gawade Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '22', '18', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 24 | Mobile 9370454097 | श्री राजें द्र दत्तात्रय. कामठे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('20', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9370454097', NULL, '9370454097', '8135d11f2b625b126c2cea9a8b8d4922e88caa95f06bdbe6dcd1d496fb1e77ea', 'श्री राजें द्र दत्तात्रय. कामठे', 'Rajendra Dattatray Kamathe', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9370454097' OR username = '9370454097');
SET @user_id := (SELECT id FROM users WHERE mobile = '9370454097' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '20' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0024', 'मे राजें द्र दत्तात्रय कामठे.', 'M/s. Rajendra Dattatray Kamathe', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '24', '20', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '20' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे राजें द्र दत्तात्रय कामठे.', 'M/s. Rajendra Dattatray Kamathe', 'केळी विभाग', @banana_category_id, NULL, NULL, '24', '20', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 26 | Mobile 9822285685 | जावेद बशिरभाई बागवान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('22', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822285685', NULL, '9822285685', '9fe13aa86984f8bd3c8e67c579cf60e315c20b3262bc5df08188f06b777e96a3', 'जावेद बशिरभाई बागवान', 'Javed Bashirbhai Bagwan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822285685' OR username = '9822285685');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822285685' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '22' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0026', 'मे बशिर दादूभाई. बागवान', 'M/s. Bashir Dadubhai Bagwan', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '26', '22', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '22' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे बशिर दादूभाई. बागवान', 'M/s. Bashir Dadubhai Bagwan', 'केळी विभाग', @banana_category_id, NULL, NULL, '26', '22', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 27 | Mobile 7350073922 | श्री संतोष बबनराव. साकोरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('22B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7350073922', NULL, '7350073922', '9a91f444cefa803baedf8738dc5e3afe773215085611522fef8002d2c4765511', 'श्री संतोष बबनराव. साकोरे', 'Santosh Babanrao Sakore', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7350073922' OR username = '7350073922');
SET @user_id := (SELECT id FROM users WHERE mobile = '7350073922' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '22B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0027', 'मे बबनराव तुळशीराम. साकोरे', 'M/s. Babanrao TulshiraM/s. akore', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '27', '22B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '22B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे बबनराव तुळशीराम. साकोरे', 'M/s. Babanrao TulshiraM/s. akore', 'केळी विभाग', @banana_category_id, NULL, NULL, '27', '22B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 28 | Mobile 7887625757 | श्री गणेश सुखदेव. वायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('23', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7887625757', NULL, '7887625757', '92d4680d60f2981ceae14662888c9521d28901a73da3d13d13abea49ac154080', 'श्री गणेश सुखदेव. वायकर', 'Ganesh Sukhdev Waykar', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7887625757' OR username = '7887625757');
SET @user_id := (SELECT id FROM users WHERE mobile = '7887625757' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '23' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0028', 'मे जयगणेश फ्रू ट कं पनी.', 'M/s. Jayganesh Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '28', '23', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '23' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे जयगणेश फ्रू ट कं पनी.', 'M/s. Jayganesh Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '28', '23', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 29 | Mobile 9890520433 | रियाज राजअहमद बाबु र्डे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('24', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890520433', NULL, '9890520433', 'a6dccce6c1a8c00b39997ea7eadc5e9e8d93d356195752ea754ec78ef535f908', 'रियाज राजअहमद बाबु र्डे', 'Riyaz Rajahmad Baburde', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890520433' OR username = '9890520433');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890520433' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '24' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0029', 'मे राजअहमद बंदेआळी. बाबु र्डे', 'M/s. Rajahmad Bandeali Baburde', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '29', '24', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '24' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे राजअहमद बंदेआळी. बाबु र्डे', 'M/s. Rajahmad Bandeali Baburde', 'केळी विभाग', @banana_category_id, NULL, NULL, '29', '24', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 31 | Mobile 7972327722 | अन्वर जाफर बागवान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('26', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7972327722', NULL, '7972327722', '42af154f7a04ef20bfc697d2c196ed4000bc147133dc23d32da15fdb142166db', 'अन्वर जाफर बागवान', 'Anwar Jafar Bagwan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7972327722' OR username = '7972327722');
SET @user_id := (SELECT id FROM users WHERE mobile = '7972327722' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '26' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0031', 'मे गुलशन फ्रू ट कं पनी.', 'M/s. Gulshan Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '31', '26', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '26' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे गुलशन फ्रू ट कं पनी.', 'M/s. Gulshan Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '31', '26', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 32 | Mobile 9822417380 | मोहम्मद हांजी उमरअली साचे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('27', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822417380', NULL, '9822417380', '1241726228343c7b61bce8d2be362612c27ebf11eda4730c32258fbeda2115d5', 'मोहम्मद हांजी उमरअली साचे', 'Mohammad Hanji Umarali Sache', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822417380' OR username = '9822417380');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822417380' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '27' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0032', 'मे मोहम्मद हांजी. उमरअली साचे', 'M/s. Mohammad Hanji Umarali Sache', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '32', '27', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '27' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे मोहम्मद हांजी. उमरअली साचे', 'M/s. Mohammad Hanji Umarali Sache', 'केळी विभाग', @banana_category_id, NULL, NULL, '32', '27', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 33 | Mobile 9422028761 | फिरोज मोहम्मद हांजी साचे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('28', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422028761', NULL, '9422028761', 'facba8b193dad6f59d91c91ff67c18c69347d75064b7ba5f49812da565d2061e', 'फिरोज मोहम्मद हांजी साचे', 'Firoz Mohammad Hanji Sache', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422028761' OR username = '9422028761');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422028761' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '28' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0033', 'मे फिरोज मोहम्मद. हांजी साचे', 'M/s. Firoz Mohammad Hanji Sache', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '33', '28', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '28' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे फिरोज मोहम्मद. हांजी साचे', 'M/s. Firoz Mohammad Hanji Sache', 'केळी विभाग', @banana_category_id, NULL, NULL, '33', '28', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 34 | Mobile 9850918526 | आरमान हनिफ बागवान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('29', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850918526', NULL, '9850918526', '4122cf153b18d0cac49e1cecfbef1af401f7edfcbc243f0bcb1ecca2d3bdfc7f', 'आरमान हनिफ बागवान', 'Arman Hanif Bagwan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850918526' OR username = '9850918526');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850918526' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '29' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0034', 'मे एच बी बागवान अँड. . . सन्स', 'M/s. H. B. Bagwan & Sons', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '34', '29', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '29' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे एच बी बागवान अँड. . . सन्स', 'M/s. H. B. Bagwan & Sons', 'केळी विभाग', @banana_category_id, NULL, NULL, '34', '29', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 36 | Mobile 9890065989 | श्री सुनिल मारुती. सोनावणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('31', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890065989', NULL, '9890065989', 'b7c29bff299c48983e61847dcd73e6b48c6a9c7e4ac35b92fc07545fcb773e83', 'श्री सुनिल मारुती. सोनावणे', 'Sunil Maruti Sonawane', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890065989' OR username = '9890065989');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890065989' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '31' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0036', 'मे मारुती बाळशीराम. सोनावणे', 'M/s. Maruti BalshiraM/s. onawane', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '36', '31', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '31' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे मारुती बाळशीराम. सोनावणे', 'M/s. Maruti BalshiraM/s. onawane', 'केळी विभाग', @banana_category_id, NULL, NULL, '36', '31', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 37 | Mobile 8796960775 | राजू मेहबूब जिडगे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('32', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8796960775', NULL, '8796960775', 'c7300cc9a2a0e6863aba2e0210d29ead818c7b153c756833c710e39de8d94a9b', 'राजू मेहबूब जिडगे', 'Raju Mehboob Jidge', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8796960775' OR username = '8796960775');
SET @user_id := (SELECT id FROM users WHERE mobile = '8796960775' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '32' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0037', 'मे मेहबूब अल्लाबक्ष. जिडगे', 'M/s. Mehboob Allabaksh Jidge', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '37', '32', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '32' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे मेहबूब अल्लाबक्ष. जिडगे', 'M/s. Mehboob Allabaksh Jidge', 'केळी विभाग', @banana_category_id, NULL, NULL, '37', '32', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 38 | Mobile 9822214496 | श्री बाळासाहेब. नानासाहेब खैरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('34', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822214496', NULL, '9822214496', 'c49a601ae406375d3892cb6c00470e326c4f5a7b127e78cca20d37f7e70f9993', 'श्री बाळासाहेब. नानासाहेब खैरे', 'Balasaheb Nanasaheb Khaire', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822214496' OR username = '9822214496');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822214496' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '34' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0038', 'मे राहु ल फ्रू ट कं पनी.', 'M/s. Rahul Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '38', '34', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '34' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे राहु ल फ्रू ट कं पनी.', 'M/s. Rahul Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '38', '34', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 39 | Mobile 9011009102 | श्री सुबोध सुधाकर. खानविलकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('35', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9011009102', NULL, '9011009102', 'a99adb08aa27558d843e530654e2041a69d78828fccb86b2a0f04542b448c429', 'श्री सुबोध सुधाकर. खानविलकर', 'Subodh Sudhakar Khanvilkar', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9011009102' OR username = '9011009102');
SET @user_id := (SELECT id FROM users WHERE mobile = '9011009102' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '35' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0039', 'मे खानविलकर फ्रू ट. कं पनी', 'M/s. Khanvilkar Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '39', '35', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '35' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे खानविलकर फ्रू ट. कं पनी', 'M/s. Khanvilkar Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '39', '35', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 40 | Mobile 9822777029 | श्री दत्तात्रय राजाराम. काळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('36A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822777029', NULL, '9822777029', 'bcd757382653e224302951dd29266c7238f7ad6747a7848d70c1323c588793c3', 'श्री दत्तात्रय राजाराम. काळे', 'Dattatray Rajaram Kale', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822777029' OR username = '9822777029');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822777029' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '36A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0040', 'मे राजाराम पांडु रंग. काळे', 'M/s. Rajaram Pandurang Kale', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '40', '36A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '36A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे राजाराम पांडु रंग. काळे', 'M/s. Rajaram Pandurang Kale', 'केळी विभाग', @banana_category_id, NULL, NULL, '40', '36A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 41 | Mobile 7709061272 | अल्ताफ जाकिर बागवान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('37A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7709061272', NULL, '7709061272', 'cd3425ab95826a2e8f471282db7ff3de35c600db5aefe57c46d467d92f5912ac', 'अल्ताफ जाकिर बागवान', 'Altaf Zakir Bagwan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7709061272' OR username = '7709061272');
SET @user_id := (SELECT id FROM users WHERE mobile = '7709061272' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '37A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0041', 'मे झाकीर हशमभाई. बागवान अँड सन्स', 'M/s. Zakir Hashambhai Bagwan & Sons', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '41', '37A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '37A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे झाकीर हशमभाई. बागवान अँड सन्स', 'M/s. Zakir Hashambhai Bagwan & Sons', 'केळी विभाग', @banana_category_id, NULL, NULL, '41', '37A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 42 | Mobile 9595406470 | मोसीन जाकिर बागवान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('37B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9595406470', NULL, '9595406470', '3e9758be86daef811007f4385102ed7c593e2ff1c9793f6b9078de8e008546c5', 'मोसीन जाकिर बागवान', 'Mohsin Zakir Bagwan', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9595406470' OR username = '9595406470');
SET @user_id := (SELECT id FROM users WHERE mobile = '9595406470' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '37B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0042', 'मे झाकीर हशमभाई. बागवान अँड ब्र दर्स', 'M/s. Zakir Hashambhai Bagwan & Brothers', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '42', '37B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '37B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे झाकीर हशमभाई. बागवान अँड ब्र दर्स', 'M/s. Zakir Hashambhai Bagwan & Brothers', 'केळी विभाग', @banana_category_id, NULL, NULL, '42', '37B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 43 | Mobile 9881998727 | श्री अतुल दत्तात्रय. सानप
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('38A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9881998727', NULL, '9881998727', '27dbb86dd71fbd3b52422552dc9fbfb3235b80edd2ebbfbdaadadbea18e106cd', 'श्री अतुल दत्तात्रय. सानप', 'Atul Dattatray Sanap', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9881998727' OR username = '9881998727');
SET @user_id := (SELECT id FROM users WHERE mobile = '9881998727' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '38A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0043', 'मे दत्तात्रय खंडू सानप.', 'M/s. Dattatray Khandu Sanap', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '43', '38A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '38A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे दत्तात्रय खंडू सानप.', 'M/s. Dattatray Khandu Sanap', 'केळी विभाग', @banana_category_id, NULL, NULL, '43', '38A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 44 | Mobile 9860540351 | श्री सतिश मारुती नरवडे.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('38B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860540351', NULL, '9860540351', 'ddd0209af2b38ff8335a7f93344183c6bdc2fe287ee72561c7002726555ae6c0', 'श्री सतिश मारुती नरवडे.', 'Satish Maruti Narawade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860540351' OR username = '9860540351');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860540351' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '38B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0044', 'मे मारुती कोंडाजी. नरवडे', 'M/s. Maruti Kondaji Narawade', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '44', '38B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '38B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे मारुती कोंडाजी. नरवडे', 'M/s. Maruti Kondaji Narawade', 'केळी विभाग', @banana_category_id, NULL, NULL, '44', '38B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 45 | Mobile 9822634070 | श्री सागर राजेश परदेशी.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('39', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822634070', NULL, '9822634070', '36e9956b41ff63841a230c0e2a7af254317d0a48a64e4e7e50c2ece6c368f7c2', 'श्री सागर राजेश परदेशी.', 'Sagar Rajesh Pardeshi', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822634070' OR username = '9822634070');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822634070' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '39' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0045', 'मे परदेशी फ्रू ट कं पनी.', 'M/s. Pardeshi Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '45', '39', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '39' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे परदेशी फ्रू ट कं पनी.', 'M/s. Pardeshi Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '45', '39', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 48 | Mobile 9860630543 | श्रीमती शारदा शेखर कुं जीर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('41', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860630543', NULL, '9860630543', '956a658a5023018b33fef1da4ba4790a6fd112a6944b5d1f6af8b2e7001588db', 'श्रीमती शारदा शेखर कुं जीर', 'Sharda Shekhar Kunjir', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860630543' OR username = '9860630543');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860630543' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '41' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0048', 'मे सौरभ फ्रू ट कं पनी.', 'M/s. Saurabh Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '48', '41', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '41' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे सौरभ फ्रू ट कं पनी.', 'M/s. Saurabh Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '48', '41', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 49 | Mobile 8888688887 | श्री यश करमचंदानी.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('42', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8888688887', NULL, '8888688887', '412829bc0a487d1bcd3717529bf0b0a7ce057259d02fa4bc0b42e99d41ac0486', 'श्री यश करमचंदानी.', 'Yash Karamchandani', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8888688887' OR username = '8888688887');
SET @user_id := (SELECT id FROM users WHERE mobile = '8888688887' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '42' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0049', 'मे प्रकाश मोतीराम. करमचंदानी', 'M/s. Prakash Motiram Karamchandani', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '49', '42', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '42' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे प्रकाश मोतीराम. करमचंदानी', 'M/s. Prakash Motiram Karamchandani', 'केळी विभाग', @banana_category_id, NULL, NULL, '49', '42', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 52 | Mobile 7709153863 | श्री कृ पाल सोपनराव. साळुं के
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('46', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7709153863', NULL, '7709153863', 'a3efbd31cf2bb9981e7b016f5f99642930dd7e23cb303c1fca226cb3ce56061f', 'श्री कृ पाल सोपनराव. साळुं के', 'Krupal Sopanrao Salunke', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7709153863' OR username = '7709153863');
SET @user_id := (SELECT id FROM users WHERE mobile = '7709153863' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '46' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0052', 'मे साळुं के तोडकर कं पनी.', 'M/s. Salunke Todkar Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '52', '46', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '46' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे साळुं के तोडकर कं पनी.', 'M/s. Salunke Todkar Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '52', '46', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 53 | Mobile 9921498236 | रिजवान सिराज शेख
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('47', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9921498236', NULL, '9921498236', '8fd5d78f78cfbbaaaeecc0272d959edb8ddea68c438c063a8a8edd5318f11cd3', 'रिजवान सिराज शेख', 'Rizwan Siraj Shaikh', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9921498236' OR username = '9921498236');
SET @user_id := (SELECT id FROM users WHERE mobile = '9921498236' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '47' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0053', 'मे आय एम फ्रू ट कं पनी. . .', 'M/s. I. M. Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '53', '47', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '47' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे आय एम फ्रू ट कं पनी. . .', 'M/s. I. M. Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '53', '47', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 54 | Mobile 9422316279 | श्री तानाजी दगडू चौधरी.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('48', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422316279', NULL, '9422316279', '57bb4883f5fde1703b2a28d101bfe85200ca92689e141198e92a98ea44be22fb', 'श्री तानाजी दगडू चौधरी.', 'Tanaji Dagdu Chaudhari', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422316279' OR username = '9422316279');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422316279' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '48' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0054', 'मे के डी चौधरी. . .', 'M/s. K. D. Chaudhari', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '54', '48', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '48' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे के डी चौधरी. . .', 'M/s. K. D. Chaudhari', 'केळी विभाग', @banana_category_id, NULL, NULL, '54', '48', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 55 | Mobile 9545757444 | श्री आकाश आप्पा. मासाळ
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('50', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9545757444', NULL, '9545757444', 'e54b70fd9634e9f5434ba56149c0cf96fff1e68162b06db25204839b55a91fc0', 'श्री आकाश आप्पा. मासाळ', 'Akash Appa Masal', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9545757444' OR username = '9545757444');
SET @user_id := (SELECT id FROM users WHERE mobile = '9545757444' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '50' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0055', 'मे दत्तकृ पा फ्रू ट कं पनी.', 'M/s. Dattakrupa Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '55', '50', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '50' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे दत्तकृ पा फ्रू ट कं पनी.', 'M/s. Dattakrupa Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '55', '50', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 58 | Mobile 9860341527 | श्री राहु ल आवडाजी. सोनावणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('53A', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860341527', NULL, '9860341527', '0e63c830a829e69e93b4fed96c7ab6c3160a640d05eeb7b949188dfcf30355c6', 'श्री राहु ल आवडाजी. सोनावणे', 'Rahul Awadaji Sonawane', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860341527' OR username = '9860341527');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860341527' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '53A' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0058', 'मे आवडाजी आबाजी. सोनावणे', 'M/s. Awadaji Abaji Sonawane', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '58', '53A', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '53A' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे आवडाजी आबाजी. सोनावणे', 'M/s. Awadaji Abaji Sonawane', 'केळी विभाग', @banana_category_id, NULL, NULL, '58', '53A', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 59 | Mobile 8806158028 | श्री सुरज पंढरीनाथ. काकडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('53B', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8806158028', NULL, '8806158028', 'f06731e5a3e242bd7bb57f02ddba404b8b04171432efda3dc291e91fb4b2e57e', 'श्री सुरज पंढरीनाथ. काकडे', 'Suraj Pandharinath Kakade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8806158028' OR username = '8806158028');
SET @user_id := (SELECT id FROM users WHERE mobile = '8806158028' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '53B' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0059', 'मे पंढरीनाथ मारुती. काकडे', 'M/s. Pandharinath Maruti Kakade', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '59', '53B', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '53B' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे पंढरीनाथ मारुती. काकडे', 'M/s. Pandharinath Maruti Kakade', 'केळी विभाग', @banana_category_id, NULL, NULL, '59', '53B', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 60 | Mobile 9422304418 | श्री अशोक गणपत. काकडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('54', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422304418', NULL, '9422304418', '0e85ce2b33bd8ef4ddf28c9de84ffb7bc1f7ddf7ee903e22dc468beceda61131', 'श्री अशोक गणपत. काकडे', 'Ashok Ganpat Kakade', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422304418' OR username = '9422304418');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422304418' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '54' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0060', 'मे श्रीराम ट्रे डिंग कं पनी.', 'M/s. Shriram Trading Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '60', '54', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '54' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे श्रीराम ट्रे डिंग कं पनी.', 'M/s. Shriram Trading Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '60', '54', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 62 | Mobile 9422303401 | श्री राजें द्र बाबु राव. पायमोडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('56', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422303401', NULL, '9422303401', '7c09c18f7284c99fb6c4b26e36644fdf67ab5cf0892bd65f3e3cfbf4302eab29', 'श्री राजें द्र बाबु राव. पायमोडे', 'Rajendra Baburao Paymode', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422303401' OR username = '9422303401');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422303401' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '56' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0062', 'मे जयगणेश फ्रू ट कं पनी.', 'M/s. Jayganesh Fruit Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '62', '56', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '56' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे जयगणेश फ्रू ट कं पनी.', 'M/s. Jayganesh Fruit Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '62', '56', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 65 | Mobile 9028400696 | श्री नामदेव विठ्ठल माने.
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('60', 'केळी विभाग', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9028400696', NULL, '9028400696', 'd66b28002a7859f440c3e5a9787023e226a40acb44f007a902769c33758df264', 'श्री नामदेव विठ्ठल माने.', 'Namdev Vitthal Mane', 'mr', 'active', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9028400696' OR username = '9028400696');
SET @user_id := (SELECT id FROM users WHERE mobile = '9028400696' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '60' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, verified_by, verified_at, created_at, updated_at)
SELECT @user_id, 'BAN-0065', 'मे हरि विठ्ठल फ्रू ट्स. कं पनी', 'M/s. Hari Vitthal Fruits Company', NULL, @primary_gala_id, @banana_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '65', '60', 'approved', @admin_user_id, NOW(), NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '60' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, verified_by, verified_at, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे हरि विठ्ठल फ्रू ट्स. कं पनी', 'M/s. Hari Vitthal Fruits Company', 'केळी विभाग', @banana_category_id, NULL, NULL, '65', '60', 'approved', 1, @admin_user_id, NOW(), NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

SELECT COUNT(*) AS banana_import_users FROM users WHERE mobile IN ('9834568736', '9890007007', '9881655599', '9822289530', '9822846778', '7774913177', '9850379778', '8149193477', '9060112786', '9890735632', '9822417890', '7738691111', '9822422125', '9527149988', '9850382244', '7249321737', '9822355581', '9890228855', '9370454097', '9822285685', '7350073922', '7887625757', '9890520433', '7972327722', '9822417380', '9422028761', '9850918526', '9890065989', '8796960775', '9822214496', '9011009102', '9822777029', '7709061272', '9595406470', '9881998727', '9860540351', '9822634070', '9860630543', '8888688887', '7709153863', '9921498236', '9422316279', '9545757444', '9860341527', '8806158028', '9422304418', '9422303401', '9028400696');
SELECT COUNT(*) AS banana_import_approved_traders FROM traders WHERE trader_code LIKE 'BAN-%' AND verification_status = 'approved';
SELECT COUNT(*) AS banana_import_approved_galas FROM trader_galas tg JOIN traders t ON t.id = tg.trader_id WHERE t.trader_code LIKE 'BAN-%' AND tg.status = 'approved';
COMMIT;
