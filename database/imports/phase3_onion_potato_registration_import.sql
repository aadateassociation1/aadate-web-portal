-- Phase 3 import: Onion-Potato member registrations from bilingual PDF preview
-- IMPORTANT: Run only after taking DB + uploads backup and verifying preview CSV.
-- Missing-phone rows are intentionally excluded. This script sends new records to admin approval; it does not approve logins.
-- Existing users/traders are not downgraded; duplicate mobiles only receive linked gala/shop records when possible.
SET NAMES utf8mb4;
START TRANSACTION;
SET @trader_role_id := (SELECT id FROM roles WHERE code = 'TRADER' LIMIT 1);
INSERT INTO business_categories (name_en, name_mr, status)
SELECT 'Onion-Potato', 'कांदा-बटाटा', 'active'
WHERE NOT EXISTS (SELECT 1 FROM business_categories WHERE name_en IN ('Onion-Potato', 'Onion Potato') OR name_mr = 'कांदा-बटाटा');
SET @onion_potato_category_id := (SELECT id FROM business_categories WHERE name_en IN ('Onion-Potato', 'Onion Potato') OR name_mr = 'कांदा-बटाटा' ORDER BY id LIMIT 1);

-- Row 1 | Mobile 9422031908 | मुनवर पीरभाई
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('44', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422031908', NULL, '9422031908', '9b99cd999cca01983620110627296821724e99d70c886731ebe08a405d704a64', 'मुनवर पीरभाई', 'Munavar Peerabhaaee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422031908' OR username = '9422031908');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422031908' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '44' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0001', 'हमा ट्रेडर्स', 'Hama Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '1', '44', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '44' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'हमा ट्रेडर्स', 'Hama Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '1', '44', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 2 | Mobile 9422031908 | महम्मद अल्ताफ पटेल
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('45', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422031908', NULL, '9422031908', '1a3ada1161d84fcec6e541bc90d99088de14a698c4fc8acece28d1e01630daf6', 'महम्मद अल्ताफ पटेल', 'Mahammad Altaaph Patel', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422031908' OR username = '9422031908');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422031908' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '45' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0002', 'मे.गो डन ॲग्रो', 'M/s. Go Dana Agro', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '2', '45', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '45' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गो डन ॲग्रो', 'M/s. Go Dana Agro', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '2', '45', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 3 | Mobile 9890679259 | श्री.भरत साधू िगरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('46', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890679259', NULL, '9890679259', '8184d643981e8508f4eb42c917f49e8aa17b8524feb2abf7e576f87db039058b', 'श्री.भरत साधू िगरे', 'Shri. Bharat Saadhoo Gire', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890679259' OR username = '9890679259');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890679259' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '46' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0003', 'मे.बालाजी ट्रेडिंग कंपनी', 'M/s. Baalaajee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '3', '46', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '46' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बालाजी ट्रेडिंग कंपनी', 'M/s. Baalaajee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '3', '46', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 4 | Mobile 9922752117 | श्री.हेमतं द ा य शेटे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('48', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('49', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9922752117', NULL, '9922752117', 'caf21bfe06afb0aeb4e4db27b5bcb641e344ba3174a1193d8624b0002015dcee', 'श्री.हेमतं द ा य शेटे', 'Shri. Hematan Da A Ya Shete', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9922752117' OR username = '9922752117');
SET @user_id := (SELECT id FROM users WHERE mobile = '9922752117' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '48' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0004', 'मे.हेमतं ट्रेडर्स', 'M/s. Hematan Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '4', '48', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '48' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.हेमतं ट्रेडर्स', 'M/s. Hematan Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '4', '48', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '49' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.हेमतं ट्रेडर्स', 'M/s. Hematan Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '4', '48', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 5 | Mobile 9011037688 | श्री.सुरज सितश संचेती
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('50', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9011037688', NULL, '9011037688', 'ba3c60a9ae28565e1305900f23074b3c13188617f159920413a76ecbbcb0dc22', 'श्री.सुरज सितश संचेती', 'Shri. Suraj Satish Sanchetee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9011037688' OR username = '9011037688');
SET @user_id := (SELECT id FROM users WHERE mobile = '9011037688' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '50' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0005', 'मे.सुरज ट्रेडिंग कंपनी', 'M/s. Suraj Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '5', '50', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '50' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सुरज ट्रेडिंग कंपनी', 'M/s. Suraj Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '5', '50', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 6 | Mobile 9822050196 | श्री.कुणाल संजय तळेकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('51', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822050196', NULL, '9822050196', 'd0492e0edece53901c83d9e8e42ea0bb113b3ad8a21e7f6616449319cb91f2cb', 'श्री.कुणाल संजय तळेकर', 'Shri. Kunaal Sanjay Talekar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822050196' OR username = '9822050196');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822050196' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '51' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0006', 'मे.आनंत ट्रेडिंग कंपनी', 'M/s. Aanant Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '6', '51', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '51' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.आनंत ट्रेडिंग कंपनी', 'M/s. Aanant Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '6', '51', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 7 | Mobile 9822197724 | श्री. प्रशांत द ा य दुधाळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('52', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822197724', NULL, '9822197724', 'b653005790d14098f834e4d0302b8fa0e297cb62588511409ed7a096bf90ab08', 'श्री. प्रशांत द ा य दुधाळे', 'Shri. Prashaant Da A Ya Dudhaale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822197724' OR username = '9822197724');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822197724' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '52' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0007', 'मे.दुधाळे ट्रेडिंग कंपनी', 'M/s. Dudhaale Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '7', '52', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '52' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.दुधाळे ट्रेडिंग कंपनी', 'M/s. Dudhaale Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '7', '52', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 8 | Mobile 9850155531 | श्री.निलेश शंकरराव राजगीरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('53', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850155531', NULL, '9850155531', 'be3b28e5a710f0aaa2d88a74b853836697570890d5e1ab4e816368b7acad6aa9', 'श्री.निलेश शंकरराव राजगीरे', 'Shri. Naliesh Shankararaav Raajageere', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850155531' OR username = '9850155531');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850155531' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '53' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0008', 'मे.जयिवषय ट्रेडर्स', 'M/s. Jayavishay Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '8', '53', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '53' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जयिवषय ट्रेडर्स', 'M/s. Jayavishay Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '8', '53', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 9 | Mobile 8087232322 | श्री. प्रतिक रंगनाथ टेमकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('54', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8087232322', NULL, '8087232322', '2af3448bf61838e2221b42aebb04da52e82bf8e5ffdc0d01ae8c89946d3a4b64', 'श्री. प्रतिक रंगनाथ टेमकर', 'Shri. Prataki Ranganaath Temakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8087232322' OR username = '8087232322');
SET @user_id := (SELECT id FROM users WHERE mobile = '8087232322' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '54' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0009', 'मे.बापू टेमकर आणि कंपनी', 'M/s. Baapoo Temakar & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '9', '54', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '54' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बापू टेमकर आणि कंपनी', 'M/s. Baapoo Temakar & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '9', '54', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 10 | Mobile 8698920227 | श्री.द ा य किसन कोलते
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('55', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8698920227', NULL, '8698920227', '475a336cc57e8447be056354987aa3f0bc2fcd509b2070dc47f3026915f3bc47', 'श्री.द ा य किसन कोलते', 'Shri. Da A Ya Kasin Kolate', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8698920227' OR username = '8698920227');
SET @user_id := (SELECT id FROM users WHERE mobile = '8698920227' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '55' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0010', 'मे.द ा य किसन कोलते', 'M/s. Da A Ya Kasin Kolate', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '10', '55', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '55' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.द ा य किसन कोलते', 'M/s. Da A Ya Kasin Kolate', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '10', '55', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 11 | Mobile 9503760511 | श्री.निलेश शंकर पोळ
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('57', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9503760511', NULL, '9503760511', '4c51cae3c8dcd907e0d5cb095bda0f512ff0ff2300d7445798517e1740cef030', 'श्री.निलेश शंकर पोळ', 'Shri. Naliesh Shankar Pola', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9503760511' OR username = '9503760511');
SET @user_id := (SELECT id FROM users WHERE mobile = '9503760511' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '57' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0011', 'मे.पुना ट्रेडिंग कंपनी', 'M/s. Puna Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '11', '57', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '57' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पुना ट्रेडिंग कंपनी', 'M/s. Puna Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '11', '57', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 12 | Mobile 9822061939 | श्री.उत्तम संभाजी गाडगे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('58', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('59', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061939', NULL, '9822061939', '1ee21a34911d1d13cd14800468c2406ad664eb0995057b5e190bb18a48bb0d7b', 'श्री.उत्तम संभाजी गाडगे', 'Shri. Uttam Sanbhaajee Gaadage', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061939' OR username = '9822061939');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061939' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '58' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0012', 'मे.उत्तम संभाजी गाडगे', 'M/s. Uttam Sanbhaajee Gaadage', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '12', '58', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '58' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.उत्तम संभाजी गाडगे', 'M/s. Uttam Sanbhaajee Gaadage', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '12', '58', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '59' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.उत्तम संभाजी गाडगे', 'M/s. Uttam Sanbhaajee Gaadage', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '12', '58', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 13 | Mobile 9822022007 | श्री.किशोर वसंत कुजीर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('60', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('61', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('155', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('156', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('444', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822022007', NULL, '9822022007', '904f5193446b0589857b8166a748ed6fbb1756832b84ca298cd087278fa1663b', 'श्री.किशोर वसंत कुजीर', 'Shri. Kashior Vasant Kujeer', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822022007' OR username = '9822022007');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822022007' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '60' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0013', 'मे.किशोर कुंजीर आणि कंपनी', 'M/s. Kashior Kunjeer & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '13', '60', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '60' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किशोर कुंजीर आणि कंपनी', 'M/s. Kashior Kunjeer & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '13', '60', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '61' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किशोर कुंजीर आणि कंपनी', 'M/s. Kashior Kunjeer & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '13', '60', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '155' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किशोर कुंजीर आणि कंपनी', 'M/s. Kashior Kunjeer & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '13', '60', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '156' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किशोर कुंजीर आणि कंपनी', 'M/s. Kashior Kunjeer & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '13', '60', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '444' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किशोर कुंजीर आणि कंपनी', 'M/s. Kashior Kunjeer & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '13', '60', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 14 | Mobile 9822558477 | श्री.मनोहर तुकाराम थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('63', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822558477', NULL, '9822558477', '75b765189aa725dfe2421416b4da6eca0acb8a8290a6a8f2931b58293198b23f', 'श्री.मनोहर तुकाराम थोरात', 'Shri. Manohar Tukaaraam Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822558477' OR username = '9822558477');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822558477' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '63' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0014', 'मे.मनाजी तुकाराम थोरात अँड सन्स', 'M/s. Manaajee Tukaaraam Thoraat & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '14', '63', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '63' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.मनाजी तुकाराम थोरात अँड सन्स', 'M/s. Manaajee Tukaaraam Thoraat & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '14', '63', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 15 | Mobile 9822061909 | श्री. समीर वसंत मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('64', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061909', NULL, '9822061909', '13b5590ec71b1fbb8ca60f6b09052adaabdaeb5596bc06f35ee0d9959d3bedc1', 'श्री. समीर वसंत मोरडे', 'Shri. Sameer Vasant Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061909' OR username = '9822061909');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061909' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '64' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0015', 'मे.समीर वसंत मोरडे', 'M/s. Sameer Vasant Morade', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '15', '64', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '64' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.समीर वसंत मोरडे', 'M/s. Sameer Vasant Morade', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '15', '64', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 16 | Mobile 9822602760 | श्री.आर्णव नामदेव िनकम
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('65', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822602760', NULL, '9822602760', '42485555aa5d09ca34f791a4905c4120f191744b3121f1578e73fd473241c984', 'श्री.आर्णव नामदेव िनकम', 'Shri. Aarnav Naamadev Nikam', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822602760' OR username = '9822602760');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822602760' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '65' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0016', 'मे.आर्णव ट्रेडिंग कंपनी', 'M/s. Aarnav Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '16', '65', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '65' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.आर्णव ट्रेडिंग कंपनी', 'M/s. Aarnav Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '16', '65', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 17 | Mobile 9822847921 | श्री.सतेश सदानंदशेठ
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('66', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822847921', NULL, '9822847921', '212841987aecd878fd745513a9baac3fa5b2a30748c6d19a87e75fadceaba3ac', 'श्री.सतेश सदानंदशेठ', 'Shri. Satesh Sadaanandasheth', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822847921' OR username = '9822847921');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822847921' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '66' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0017', 'मे.सदानंद अँड सन्स', 'M/s. Sadaanand & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '17', '66', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '66' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सदानंद अँड सन्स', 'M/s. Sadaanand & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '17', '66', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 18 | Mobile 9545457596 | श्री.संजय कुमारपाल शहा
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('67', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('68', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9545457596', NULL, '9545457596', 'bf2dd2460f4cf4098932daca8aad4c6354099ff1acf2037bd3cab86ef25d5ccf', 'श्री.संजय कुमारपाल शहा', 'Shri. Sanjay Kumaarapaal Shah', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9545457596' OR username = '9545457596');
SET @user_id := (SELECT id FROM users WHERE mobile = '9545457596' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '67' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0018', 'मे.कुमारपाल मंगलदास शहा', 'M/s. Kumaarapaal Mangaladaas Shah', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '18', '67', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '67' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कुमारपाल मंगलदास शहा', 'M/s. Kumaarapaal Mangaladaas Shah', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '18', '67', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '68' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कुमारपाल मंगलदास शहा', 'M/s. Kumaarapaal Mangaladaas Shah', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '18', '67', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 19 | Mobile 9819387184 | अ दलु अिहम पटेल
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('137', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9819387184', NULL, '9819387184', '552df48834162ab13daef5971583579aa03ff72058ff6101e5c4174e66580254', 'अ दलु अिहम पटेल', 'A Dalu Ahim Patel', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9819387184' OR username = '9819387184');
SET @user_id := (SELECT id FROM users WHERE mobile = '9819387184' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '137' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0019', 'मे.पटेल अँड कंपनी', 'M/s. Patel & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '19', '137', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '137' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पटेल अँड कंपनी', 'M/s. Patel & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '19', '137', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 20 | Mobile 9822194508 | श्री.संजय महादेव मुळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('138', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822194508', NULL, '9822194508', 'bd499b30bd768250d01648874e53519ca3fb7c0d2f8ce86f1d88f2a46ada1982', 'श्री.संजय महादेव मुळे', 'Shri. Sanjay Mahaadev Mule', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822194508' OR username = '9822194508');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822194508' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '138' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0020', 'मे.संजय ट्रेडिंग कंपनी', 'M/s. Sanjay Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '20', '138', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '138' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.संजय ट्रेडिंग कंपनी', 'M/s. Sanjay Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '20', '138', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 21 | Mobile 9822013101 | हािनफभाई तांबोळी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('139', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('6', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822013101', NULL, '9822013101', '3a6a47793b62dc041ae4a48fce39eba65ecdcacf76e3c644e9681efd03fba0f3', 'हािनफभाई तांबोळी', 'Haaniphabhaaee Taanbolee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822013101' OR username = '9822013101');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822013101' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '139' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0021', 'मे.जयिकसान एजन्सी', 'M/s. Jayakisaan Agency', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '21', '139', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '139' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जयिकसान एजन्सी', 'M/s. Jayakisaan Agency', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '21', '139', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '6' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जयिकसान एजन्सी', 'M/s. Jayakisaan Agency', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '21', '139', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 22 | Mobile 9923877979 | श्री.सुभाष पंढरीनाथ जाधव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('140', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('141', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9923877979', NULL, '9923877979', '92dbe5d3412e199fae495313095a19e4232a14b672d438a9a1ebd398dd1644ea', 'श्री.सुभाष पंढरीनाथ जाधव', 'Shri. Subhaash Pandhareenaath Jaadhav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9923877979' OR username = '9923877979');
SET @user_id := (SELECT id FROM users WHERE mobile = '9923877979' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '140' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0022', 'मे.पंढरीनाथ प्रभाकर जाधव', 'M/s. Pandhareenaath Prabhaakar Jaadhav', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '22', '140', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '140' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पंढरीनाथ प्रभाकर जाधव', 'M/s. Pandhareenaath Prabhaakar Jaadhav', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '22', '140', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '141' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पंढरीनाथ प्रभाकर जाधव', 'M/s. Pandhareenaath Prabhaakar Jaadhav', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '22', '140', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 23 | Mobile 9822027688 | श्री.संदेश सितश संचेती
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('143', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822027688', NULL, '9822027688', '7a7054ef98eadde7f876dd60722294c7955ea7061174dfee70e2eff31e8fc587', 'श्री.संदेश सितश संचेती', 'Shri. Sandesh Satish Sanchetee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822027688' OR username = '9822027688');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822027688' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '143' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0023', 'मे.सचं ेती ट्रेडिंग कंपनी', 'M/s. Sachan Etee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '23', '143', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '143' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सचं ेती ट्रेडिंग कंपनी', 'M/s. Sachan Etee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '23', '143', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 24 | Mobile 9822171999 | श्री.दिपक महादेव कुंभारकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('144', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822171999', NULL, '9822171999', 'fcd1a0aae8e1468007cc61a794d0271a9f6ac9dbd77ac37698fdd082fedb3359', 'श्री.दिपक महादेव कुंभारकर', 'Shri. Dapik Mahaadev Kunbhaarakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822171999' OR username = '9822171999');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822171999' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '144' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0024', 'मे.महादेव भगवान कुंभारकर अँड सन्स', 'M/s. Mahaadev Bhagavaan Kunbhaarakar & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '24', '144', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '144' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.महादेव भगवान कुंभारकर अँड सन्स', 'M/s. Mahaadev Bhagavaan Kunbhaarakar & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '24', '144', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 25 | Mobile 9850099300 | श्री.शरद महादेव कुंभारकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('145', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850099300', NULL, '9850099300', '14b20f4139f8e6779581374fd6ee210ab2245f83fc7358a84016ba59ba45fa4d', 'श्री.शरद महादेव कुंभारकर', 'Shri. Sharad Mahaadev Kunbhaarakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850099300' OR username = '9850099300');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850099300' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '145' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0025', 'मे.राज ट्रेडिंग कंपनी', 'M/s. Raaj Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '25', '145', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '145' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.राज ट्रेडिंग कंपनी', 'M/s. Raaj Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '25', '145', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 27 | Mobile 9822101118 | श्री.ऋिषके श काश टेमकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('147', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822101118', NULL, '9822101118', '1fb693569fa27122cec1841fcf08cc269400b7eef60c8b225797f28f30c0432f', 'श्री.ऋिषके श काश टेमकर', 'Shri. Rishike Sha Kaash Temakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822101118' OR username = '9822101118');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822101118' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '147' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0027', 'मे.श्री.द िदगंबर कंपनी', 'M/s. Shri. Da Diganbar Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '27', '147', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '147' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.श्री.द िदगंबर कंपनी', 'M/s. Shri. Da Diganbar Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '27', '147', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 28 | Mobile 9011939393 | श्री.अमोल विलास टेमकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('148', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9011939393', NULL, '9011939393', '60b6ddc9d9344b9c0229b606efed2a11b8a17ac99403d187bc436611d178bebe', 'श्री.अमोल विलास टेमकर', 'Shri. Amol Valiaas Temakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9011939393' OR username = '9011939393');
SET @user_id := (SELECT id FROM users WHERE mobile = '9011939393' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '148' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0028', 'मे.टेमकर आणि कंपनी', 'M/s. Temakar & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '28', '148', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '148' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.टेमकर आणि कंपनी', 'M/s. Temakar & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '28', '148', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 29 | Mobile 9850904647 | श्री.विलासशेठ एकनाथ टेमकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('149', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850904647', NULL, '9850904647', 'b17359a98ffe445a1dfa233ab5a98fdaa6fdc22a51ce1d9c212b7b82ff28ff27', 'श्री.विलासशेठ एकनाथ टेमकर', 'Shri. Valiaasasheth Ekanaath Temakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850904647' OR username = '9850904647');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850904647' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '149' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0029', 'मे.विलासशेठ एकनाथ टेमकर', 'M/s. Valiaasasheth Ekanaath Temakar', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '29', '149', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '149' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.विलासशेठ एकनाथ टेमकर', 'M/s. Valiaasasheth Ekanaath Temakar', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '29', '149', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 30 | Mobile 9822297499 | सौ.वषा सबु ोध काळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('150', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822297499', NULL, '9822297499', '820b65ee351fb49d7727bbb46eaf370458f2c42c64e68f6ff17d7072932ca705', 'सौ.वषा सबु ोध काळे', 'Mrs. Vash Sabu Odha Kaale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822297499' OR username = '9822297499');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822297499' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '150' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0030', 'मे.संजीवनी ट्रेडिंग कंपनी', 'M/s. Sanjeevanee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '30', '150', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '150' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.संजीवनी ट्रेडिंग कंपनी', 'M/s. Sanjeevanee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '30', '150', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 31 | Mobile 9860489321 | श्री.आनदं रमेशलाल गांधी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('151', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860489321', NULL, '9860489321', 'ec37ee7e654bb1f0dbc9f23338d81fb2d9f85b2a12e1bbae675e0c6051030d06', 'श्री.आनदं रमेशलाल गांधी', 'Shri. Aanadan Ra M/s. Shalaal Gaandhee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860489321' OR username = '9860489321');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860489321' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '151' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0031', 'मे.गांधी आणि कंपनी', 'M/s. Gaandhee & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '31', '151', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '151' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गांधी आणि कंपनी', 'M/s. Gaandhee & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '31', '151', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 32 | Mobile 9850489321 | श्री.महावीर रमेशलाल गांधी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('152', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850489321', NULL, '9850489321', '5d7d15031ed3deaf59b6eec1d155d28f632feedc8eb4a753d260285e583211d0', 'श्री.महावीर रमेशलाल गांधी', 'Shri. Mahaaveer Ra M/s. Shalaal Gaandhee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850489321' OR username = '9850489321');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850489321' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '152' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0032', 'मे.रमेशलाल भगवानदास गांधी', 'M/s. Ra M/s. Shalaal Bhagavaanadaas Gaandhee', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '32', '152', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '152' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रमेशलाल भगवानदास गांधी', 'M/s. Ra M/s. Shalaal Bhagavaanadaas Gaandhee', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '32', '152', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 33 | Mobile 9850950995 | श्री.चेतन चं कांत घोगरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('153', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850950995', NULL, '9850950995', '20e11f5a02aa9fe2d736e27855ee4c7cc501d4aad4c6d3809569a187f737cf24', 'श्री.चेतन चं कांत घोगरे', 'Shri. Chetan Chan Kaant Ghogare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850950995' OR username = '9850950995');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850950995' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '153' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0033', 'मे.चं कातं गगं ाराम घोगरे', 'M/s. Chan Kaatan Gagan Aaraam Ghogare', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '33', '153', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '153' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.चं कातं गगं ाराम घोगरे', 'M/s. Chan Kaatan Gagan Aaraam Ghogare', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '33', '153', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 34 | Mobile 9822207426 | श्री.िनतीन सदािशव काळणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('154', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822207426', NULL, '9822207426', 'd4ad1fcae51126954723eadffc667df0faf0fb1386944b2c930f32900a98b87e', 'श्री.िनतीन सदािशव काळणे', 'Shri. Niteen Sadaashiv Kaalane', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822207426' OR username = '9822207426');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822207426' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '154' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0034', 'मे.म हार एजन्सी', 'M/s. Ma Haar Agency', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '34', '154', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '154' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.म हार एजन्सी', 'M/s. Ma Haar Agency', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '34', '154', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 35 | Mobile 9822061949 | श्री.द ा य िव ल थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('158', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061949', NULL, '9822061949', '1e6111ec6db998ea2c3e283b18c0b3fd101f07909c02edc3a760eae2b1ed5468', 'श्री.द ा य िव ल थोरात', 'Shri. Da A Ya Vi La Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061949' OR username = '9822061949');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061949' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '158' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0035', 'मे.द ा य थोरात आणि कंपनी', 'M/s. Da A Ya Thoraat & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '35', '158', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '158' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.द ा य थोरात आणि कंपनी', 'M/s. Da A Ya Thoraat & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '35', '158', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 36 | Mobile 9850100049 | श्री.तेजस द ा य थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('159', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850100049', NULL, '9850100049', 'b2a3f174c08fd564f84e33f686d8ebc8e597f38eceb434d30b774b7b67fef4de', 'श्री.तेजस द ा य थोरात', 'Shri. Tejas Da A Ya Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850100049' OR username = '9850100049');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850100049' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '159' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0036', 'मे.थोरात आणि कंपनी', 'M/s. Thoraat & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '36', '159', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '159' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.थोरात आणि कंपनी', 'M/s. Thoraat & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '36', '159', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 37 | Mobile 9822608760 | सौ.सनु दं ा सयु कातं माढं रे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('160', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822608760', NULL, '9822608760', 'caa4b6ba64ed51f56e3936ebfce44c9d14000b6db032fc606fd859e00147475c', 'सौ.सनु दं ा सयु कातं माढं रे', 'Mrs. Sanu Dan A Sayu Kaatan Maadhan Re', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822608760' OR username = '9822608760');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822608760' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '160' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0037', 'मे.पुना गाल क ट्रेडर्स', 'M/s. Puna Gaal Ka Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '37', '160', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '160' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पुना गाल क ट्रेडर्स', 'M/s. Puna Gaal Ka Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '37', '160', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 38 | Mobile 9850957492 | श्री.मुकुंद तुकाराम खैरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('161', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850957492', NULL, '9850957492', '3ad36323efa5577cbd74ea4ee8122dd7644682b45f439e6dae335a88049e4e34', 'श्री.मुकुंद तुकाराम खैरे', 'Shra Shri. Mukund Tukaaraam Khaire', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850957492' OR username = '9850957492');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850957492' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '161' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0038', 'मे.सौरभ मुकुंद खैरे', 'M/s. Mrs. Rabh Mukund Khaire', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '38', '161', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '161' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सौरभ मुकुंद खैरे', 'M/s. Mrs. Rabh Mukund Khaire', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '38', '161', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 39 | Mobile 9822061909 | श्री.समीर वसंत मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('163', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061909', NULL, '9822061909', 'ddc9ef65a851325327cb5ef8bcc50c9c14012e01a21e8bb1df1d48ab3b61052b', 'श्री.समीर वसंत मोरडे', 'Shri. Sameer Vasant Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061909' OR username = '9822061909');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061909' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '163' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0039', 'मे.समीर मोरडे आणि कंपनी', 'M/s. Sameer Morade & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '39', '163', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '163' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.समीर मोरडे आणि कंपनी', 'M/s. Sameer Morade & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '39', '163', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 40 | Mobile 9822006688 | श्री.महेश िदपचंद पारे ख
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('164', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('69', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822006688', NULL, '9822006688', '170ab073d3ac192f14a10d540a7154480b61081d79e42f49f8b0f8c0543e7048', 'श्री.महेश िदपचंद पारे ख', 'Shri. Mahesh Dipachand Paare Kha', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822006688' OR username = '9822006688');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822006688' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '164' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0040', 'मे.पारे ख दस लोणीवाला', 'M/s. Paare Kha Dasa Loneevaal', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '40', '164', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '164' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पारे ख दस लोणीवाला', 'M/s. Paare Kha Dasa Loneevaal', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '40', '164', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '69' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पारे ख दस लोणीवाला', 'M/s. Paare Kha Dasa Loneevaal', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '40', '164', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 41 | Mobile 9822299477 | श्री.िदलीप ीकृ ण भालेराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('258', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('258', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822299477', NULL, '9822299477', 'e62283a308dad44703890cf749d11e5e1d083163a230af438eba8e1f1ff6e342', 'श्री.िदलीप ीकृ ण भालेराव', 'Shri. Dileep Eekri Na Bhaaleraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822299477' OR username = '9822299477');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822299477' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '258' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0041', 'मे.बळीराम सयु कांत आणि कंपनी', 'M/s. Baleeraam Sayu Kaant & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '41', '258', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '258' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बळीराम सयु कांत आणि कंपनी', 'M/s. Baleeraam Sayu Kaant & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '41', '258', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '258' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बळीराम सयु कांत आणि कंपनी', 'M/s. Baleeraam Sayu Kaant & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '41', '258', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 42 | Mobile 9850217136 | श्री.द ू िदनकर फडतरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('258', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850217136', NULL, '9850217136', '26a76d869e2d05f298be59ccc8714f83918d3facfcddbb78cd65e61353dae7bf', 'श्री.द ू िदनकर फडतरे', 'Shri. Da Oo Dinakar Phadatare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850217136' OR username = '9850217136');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850217136' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '258' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0042', 'मे.वरद ट्रेडिंग कंपनी', 'M/s. Varad Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '42', '258', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '258' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.वरद ट्रेडिंग कंपनी', 'M/s. Varad Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '42', '258', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 43 | Mobile 9766999005 | श्री.अभय उदयिसहं शिंदे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('259', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9766999005', NULL, '9766999005', 'd58d8915f1e4ba2da433ce33981607c6cd1dbadc5beb24169f27a902218b4458', 'श्री.अभय उदयिसहं शिंदे', 'Shri. Abhay Udayasihan Shinde', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9766999005' OR username = '9766999005');
SET @user_id := (SELECT id FROM users WHERE mobile = '9766999005' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '259' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0043', 'मे.तापगडे ट्रेडिंग कंपनी', 'M/s. Taapagade Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '43', '259', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '259' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.तापगडे ट्रेडिंग कंपनी', 'M/s. Taapagade Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '43', '259', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 44 | Mobile 8806997799 | श्री.िव म उदयिसगं शिंदे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('260', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8806997799', NULL, '8806997799', 'd19547bc010bcf963315cf5ad461305686ad070ae4415584f895ad9b83461dde', 'श्री.िव म उदयिसगं शिंदे', 'Shri. Vi Ma Udayasigan Shinde', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8806997799' OR username = '8806997799');
SET @user_id := (SELECT id FROM users WHERE mobile = '8806997799' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '260' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0044', 'मे.अलकनंदा ट्रेडर्स', 'M/s. Alakanand Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '44', '260', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '260' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अलकनंदा ट्रेडर्स', 'M/s. Alakanand Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '44', '260', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 46 | Mobile 9422083558 | श्री.गणेश रंगनाथ शेडगे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('263', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('415', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422083558', NULL, '9422083558', '477f7f976e4cb18dcd6c4c637f28908c8f10f2622dc1ec5836140801a3dda18e', 'श्री.गणेश रंगनाथ शेडगे', 'Shri. Ganesh Ranganaath Shedage', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422083558' OR username = '9422083558');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422083558' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '263' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0046', 'मे.गणेश रंगनाथ शेडगे', 'M/s. Ganesh Ranganaath Shedage', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '46', '263', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '263' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गणेश रंगनाथ शेडगे', 'M/s. Ganesh Ranganaath Shedage', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '46', '263', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '415' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गणेश रंगनाथ शेडगे', 'M/s. Ganesh Ranganaath Shedage', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '46', '263', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 47 | Mobile 9822061901 | श्री.अिवनाश िनवृ ी मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('264', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061901', NULL, '9822061901', '1a7284252f01ee793293bc3a5542716b59c1a39baf01dcd932442a39cf98d2a4', 'श्री.अिवनाश िनवृ ी मोरडे', 'Shri. Avinaash Nivri Ee Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061901' OR username = '9822061901');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061901' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '264' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0047', 'मे.अिवनाश मोरडे आणि कंपनी', 'M/s. Avinaash Morade & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '47', '264', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '264' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अिवनाश मोरडे आणि कंपनी', 'M/s. Avinaash Morade & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '47', '264', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 50 | Mobile 9822940668 | श्री.द ा य किसन च हाण
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('267', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822940668', NULL, '9822940668', 'f730779f4bc0874666fa15118030f0bd71d8c260363232724e2f201048141728', 'श्री.द ा य किसन च हाण', 'Shri. Da A Ya Kasin Cha Haan', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822940668' OR username = '9822940668');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822940668' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '267' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0050', 'मे.किसन बापजु ी च हाण', 'M/s. Kasin Baapaju Ee Cha Haan', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '50', '267', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '267' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किसन बापजु ी च हाण', 'M/s. Kasin Baapaju Ee Cha Haan', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '50', '267', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 51 | Mobile 9850747373 | श्री.अतुल निवृत्ती मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('268', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850747373', NULL, '9850747373', 'e4886f39544894a342f26d1a7d84581568315c13694beab196ef3d2089760566', 'श्री.अतुल निवृत्ती मोरडे', 'Shra Shri. Atul Navirittee Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850747373' OR username = '9850747373');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850747373' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '268' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0051', 'मे.अतुल मोरडे आणि कंपनी', 'M/s. Atul Morade & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '51', '268', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '268' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अतुल मोरडे आणि कंपनी', 'M/s. Atul Morade & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '51', '268', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 52 | Mobile 9422500151 | श्री.अमर सखाराम रामाणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('269', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422500151', NULL, '9422500151', '8105c2b9f024fc3d83cdb8dfe9722d5ab0655df5146a454b0de0ff27554761d4', 'श्री.अमर सखाराम रामाणे', 'Shri. Amar Sakhaaraam Raamaane', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422500151' OR username = '9422500151');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422500151' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '269' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0052', 'मे.अमर ट्रेडिंग कंपनी', 'M/s. Amar Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '52', '269', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '269' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अमर ट्रेडिंग कंपनी', 'M/s. Amar Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '52', '269', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 53 | Mobile 9822075771 | श्री.पाडं ु रंग लीबाजी थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('270', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822075771', NULL, '9822075771', '2fecd5505590f31c2a1df505542788034782f5eca2d0d06bb38ae9ee758fcb03', 'श्री.पाडं ु रंग लीबाजी थोरात', 'Shri. Paadan U Rang Leebaajee Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822075771' OR username = '9822075771');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822075771' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '270' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0053', 'मे.जीवन ट्रेडिंग कंपनी', 'M/s. Jeevan Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '53', '270', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '270' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जीवन ट्रेडिंग कंपनी', 'M/s. Jeevan Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '53', '270', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 54 | Mobile 9822849496 | श्री.तषु ार सयु कांत थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('272', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('424', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822849496', NULL, '9822849496', 'd63a4ceff8edcc40728ff297bc0506cbf5a897d58201c55eb362fedf084c8009', 'श्री.तषु ार सयु कांत थोरात', 'Shri. Tashu Aara Sayu Kaant Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822849496' OR username = '9822849496');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822849496' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '272' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0054', 'मे.सयु कांत िव ल थोरात', 'M/s. Sayu Kaant Vi La Thoraat', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '54', '272', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '272' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सयु कांत िव ल थोरात', 'M/s. Sayu Kaant Vi La Thoraat', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '54', '272', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '424' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सयु कांत िव ल थोरात', 'M/s. Sayu Kaant Vi La Thoraat', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '54', '272', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 55 | Mobile 9822502596 | श्री.शंकर अनसु भालेराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('273', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822502596', NULL, '9822502596', '7b4575fbdacbe2369268a01cd757420e2fba9f7c32ee5f15e90673652d0269d5', 'श्री.शंकर अनसु भालेराव', 'Shri. Shankar Anasu Bhaaleraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822502596' OR username = '9822502596');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822502596' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '273' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0055', 'मे.गु कृ पया ट्रेडिंग कंपनी', 'M/s. Gu Kri Paya Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '55', '273', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '273' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गु कृ पया ट्रेडिंग कंपनी', 'M/s. Gu Kri Paya Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '55', '273', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 56 | Mobile 9822099406 | श्री.वसंत अनसु भालेराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('274', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822099406', NULL, '9822099406', 'c5e8a4a45728c9bf35869ad8bdc26edb24d77c86a350a473870934743264c336', 'श्री.वसंत अनसु भालेराव', 'Shri. Vasant Anasu Bhaaleraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822099406' OR username = '9822099406');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822099406' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '274' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0056', 'मे.गजानन ट्रेडिंग कंपनी', 'M/s. Gajaanan Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '56', '274', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '274' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गजानन ट्रेडिंग कंपनी', 'M/s. Gajaanan Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '56', '274', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 57 | Mobile 9850508986 | ीमती उ वला अशोक संचेती
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('275', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('277', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850508986', NULL, '9850508986', '6c0a06bfdfeb952f97ee824828e98a167ab7f34c3bc3f3ce6a2f708a97960b6a', 'ीमती उ वला अशोक संचेती', 'Eematee U Vala Ashok Sanchetee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850508986' OR username = '9850508986');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850508986' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '275' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0057', 'मे.संचेती एजन्सी', 'M/s. Sanchetee Agency', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '57', '275', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '275' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.संचेती एजन्सी', 'M/s. Sanchetee Agency', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '57', '275', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '277' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.संचेती एजन्सी', 'M/s. Sanchetee Agency', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '57', '275', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 58 | Mobile 9657854150 | श्री.मि छं वाळूंज
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('276', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9657854150', NULL, '9657854150', 'f54b0e1a3431bf20cf6aad3b77228ffcbfc24da82de10e13f24d64db6d877c16', 'श्री.मि छं वाळूंज', 'Shri. Mi Chhan Vaaloonj', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9657854150' OR username = '9657854150');
SET @user_id := (SELECT id FROM users WHERE mobile = '9657854150' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '276' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0058', 'मे.महारा आळू कंपनी', 'M/s. Mahaar Aaloo Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '58', '276', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '276' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.महारा आळू कंपनी', 'M/s. Mahaar Aaloo Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '58', '276', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 60 | Mobile 9822197665 | श्री.विलास महादेव रायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('285', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822197665', NULL, '9822197665', '41d6d24bf5ea099092dd0d95c141b63e03568f91c4ef2247183d66332095fd20', 'श्री.विलास महादेव रायकर', 'Shri. Valiaas Mahaadev Raayakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822197665' OR username = '9822197665');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822197665' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '285' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0060', 'मे.रायकर दस', 'M/s. Raayakar Dasa', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '60', '285', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '285' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रायकर दस', 'M/s. Raayakar Dasa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '60', '285', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 61 | Mobile 8087689408 | श्री.अिभजीत िदलीप रायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('286', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('729', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8087689408', NULL, '8087689408', 'acfcf8b4820e7d077dbc0785485a32e450be8fda63a93eda2c7886d16fc685eb', 'श्री.अिभजीत िदलीप रायकर', 'Shri. Abhijeet Dileep Raayakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8087689408' OR username = '8087689408');
SET @user_id := (SELECT id FROM users WHERE mobile = '8087689408' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '286' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0061', 'मे.रायकर आणि कंपनी', 'M/s. Raayakar & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '61', '286', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '286' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रायकर आणि कंपनी', 'M/s. Raayakar & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '61', '286', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '729' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रायकर आणि कंपनी', 'M/s. Raayakar & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '61', '286', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 62 | Mobile 9822038906 | श्री.अिनल िशवक याण कोरपे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('287', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('289', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('290', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822038906', NULL, '9822038906', 'a2db6c4250c95c32b3e56a8ee7af6350cd38e369054c011deb35656ba3fbb6de', 'श्री.अिनल िशवक याण कोरपे', 'Shri. Anil Shivak Yaan Korape', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822038906' OR username = '9822038906');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822038906' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '287' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0062', 'मे.कोरपे आणि कंपनी', 'M/s. Korape & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '62', '287', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '287' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कोरपे आणि कंपनी', 'M/s. Korape & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '62', '287', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '289' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कोरपे आणि कंपनी', 'M/s. Korape & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '62', '287', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '290' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कोरपे आणि कंपनी', 'M/s. Korape & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '62', '287', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 63 | Mobile 9822001379 | श्री.राज िशवक याण कोरपे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('288', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('440', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('441', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('442', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822001379', NULL, '9822001379', '79775caccfd4538e7882c4963590ea324976741feae6af40a447f52d040eaa88', 'श्री.राज िशवक याण कोरपे', 'Shri. Raaj Shivak Yaan Korape', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822001379' OR username = '9822001379');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822001379' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '288' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0063', 'मे.िशवशंकर ट्रेडर्स', 'M/s. Shivashankar Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '63', '288', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '288' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िशवशंकर ट्रेडर्स', 'M/s. Shivashankar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '63', '288', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '440' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िशवशंकर ट्रेडर्स', 'M/s. Shivashankar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '63', '288', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '441' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िशवशंकर ट्रेडर्स', 'M/s. Shivashankar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '63', '288', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '442' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िशवशंकर ट्रेडर्स', 'M/s. Shivashankar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '63', '288', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 64 | Mobile 9822551527 | श्री.संतोष शांताराम खेडेकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('294', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822551527', NULL, '9822551527', '75ec49ad33648cd18fa20e23f4152c832da55c3d5507aa9621b1cc7088f6581a', 'श्री.संतोष शांताराम खेडेकर', 'Shri. Santosh Shaantaaraam Khedekar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822551527' OR username = '9822551527');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822551527' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '294' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0064', 'मे.ेयस ट्रेडिंग कंपनी', 'M/s. Eyas Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '64', '294', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '294' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.ेयस ट्रेडिंग कंपनी', 'M/s. Eyas Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '64', '294', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 65 | Mobile 9822883038 | श्री.निलेश मा ती शिंदे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('295', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822883038', NULL, '9822883038', '695c6e4990b02a87ed81e215838bb89d3d769b1902844faf53caf1d5437c72c2', 'श्री.निलेश मा ती शिंदे', 'Shri. Naliesh Ma Tee Shinde', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822883038' OR username = '9822883038');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822883038' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '295' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0065', 'मे.वै णवी ट्रेडिंग कंपनी', 'M/s. Vai Navee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '65', '295', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '295' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.वै णवी ट्रेडिंग कंपनी', 'M/s. Vai Navee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '65', '295', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 66 | Mobile 9422003335 | श्री.अ ण तक ु ाराम घोडके
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('335', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422003335', NULL, '9422003335', 'e2a5793a1f574f211a3d3bf04fc0caeb5beb1d7c104b9dae4c802d4cf4eaf5ca', 'श्री.अ ण तक ु ाराम घोडके', 'Shri. A Na Taka U Aaraam Ghodake', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422003335' OR username = '9422003335');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422003335' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '335' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0066', 'मे.अ ण तुकाराम घोडके', 'M/s. A Na Tukaaraam Ghodake', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '66', '335', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '335' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अ ण तुकाराम घोडके', 'M/s. A Na Tukaaraam Ghodake', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '66', '335', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 67 | Mobile 9822000818 | श्री.र नाकर राजाराम भालेराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('409', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822000818', NULL, '9822000818', 'acce1d9509373be45fc4935335021de4d79f7d82a79bfd39aba242debbe451ee', 'श्री.र नाकर राजाराम भालेराव', 'Shri. Ra Naakar Raajaaraam Bhaaleraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822000818' OR username = '9822000818');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822000818' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '409' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0067', 'मे.बळीराम सुयकांत अँड सन्स', 'M/s. Baleeraam Suyakaant & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '67', '409', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '409' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बळीराम सुयकांत अँड सन्स', 'M/s. Baleeraam Suyakaant & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '67', '409', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 68 | Mobile 9822045997 | श्री.सिचन ीकांत होनराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('411', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822045997', NULL, '9822045997', '90403fce86372ac65874caa44b06529d4693fcc10a75e31051d4ef9e853b8c7b', 'श्री.सिचन ीकांत होनराव', 'Shri. Sachin Eekaant Honaraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822045997' OR username = '9822045997');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822045997' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '411' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0068', 'मे.बश्री.एस.पाटील आणि कंपनी', 'M/s. Ba Shri. Esa.paateel & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '68', '411', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '411' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बश्री.एस.पाटील आणि कंपनी', 'M/s. Ba Shri. Esa.paateel & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '68', '411', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 69 | Mobile 9595095222 | श्री. साद रामचं फडतरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('413', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9595095222', NULL, '9595095222', '925091f012a3593da92a2b3f3c488a3377e590b9c6f2c3e104a18d781c7a8e09', 'श्री. साद रामचं फडतरे', 'Shri. Saad Raamachan Phadatare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9595095222' OR username = '9595095222');
SET @user_id := (SELECT id FROM users WHERE mobile = '9595095222' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '413' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0069', 'मे.कै लासपती आणि कंपनी', 'M/s. Kai Laasapatee & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '69', '413', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '413' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कै लासपती आणि कंपनी', 'M/s. Kai Laasapatee & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '69', '413', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 70 | Mobile 9822883425 | सौ.ितभा अिवनाश मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('416', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822883425', NULL, '9822883425', '7207c3eecc7639c79e0ec2db083a9e6b80088a12e0f01af450316ddaf9c5ad40', 'सौ.ितभा अिवनाश मोरडे', 'Mrs. Tibh Avinaash Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822883425' OR username = '9822883425');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822883425' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '416' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0070', 'मे.अिवनाथ मोरडे आणि दस', 'M/s. Avinaath Morade & Dasa', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '70', '416', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '416' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अिवनाथ मोरडे आणि दस', 'M/s. Avinaath Morade & Dasa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '70', '416', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 71 | Mobile 9081121314 | श्री. वपनील काश हरपळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('417', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9081121314', NULL, '9081121314', '88d2c9c1cf9fa8b30a2b3b2ed56fe88458c4ea4d242953f37083fd66f0846a89', 'श्री. वपनील काश हरपळे', 'Shri. Vapaneel Kaash Harapale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9081121314' OR username = '9081121314');
SET @user_id := (SELECT id FROM users WHERE mobile = '9081121314' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '417' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0071', 'मे.हरपळे अँड सन्स', 'M/s. Harapale & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '71', '417', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '417' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.हरपळे अँड सन्स', 'M/s. Harapale & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '71', '417', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 72 | Mobile 9552591314 | श्री.शिवराज विजय हरपळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('418', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9552591314', NULL, '9552591314', 'd8248399240c4b465b287a33472ce9066cc915f6401c9234c5d99b8107dd439d', 'श्री.शिवराज विजय हरपळे', 'Shri. Shaviraaj Vajiy Harapale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9552591314' OR username = '9552591314');
SET @user_id := (SELECT id FROM users WHERE mobile = '9552591314' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '418' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0072', 'मे.शिवराज विजय हरपळे', 'M/s. Shaviraaj Vajiy Harapale', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '72', '418', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '418' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.शिवराज विजय हरपळे', 'M/s. Shaviraaj Vajiy Harapale', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '72', '418', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 73 | Mobile 9850894550 | श्री.अिमत अशोक टेमिगरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('419', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850894550', NULL, '9850894550', 'cfee4e28249b83123ef83ba3ae4ec3764c9f328e2c8f188bf71220b1d30b572e', 'श्री.अिमत अशोक टेमिगरे', 'Shri. Amit Ashok Temagire', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850894550' OR username = '9850894550');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850894550' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '419' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0073', 'मे.जयवतं राव पढं रीनाथ टेमगीरे आणि कं', 'M/s. Jayavatan Raav Padhan Reenaath Temageere & Kan', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '73', '419', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '419' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जयवतं राव पढं रीनाथ टेमगीरे आणि कं', 'M/s. Jayavatan Raav Padhan Reenaath Temageere & Kan', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '73', '419', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 76 | Mobile 9850634721 | श्री.सखाराम ल मण रामाणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('422', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850634721', NULL, '9850634721', '3373bf3641b54c57c76ca17037c529bb998bfd433ebd1b1610ff209de1183e70', 'श्री.सखाराम ल मण रामाणे', 'Shri. Sakhaaraam La Mana Raamaane', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850634721' OR username = '9850634721');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850634721' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '422' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0076', 'मे.रामाणे अँड दस', 'M/s. Raamaane & Dasa', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '76', '422', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '422' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रामाणे अँड दस', 'M/s. Raamaane & Dasa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '76', '422', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 77 | Mobile 9822343207 | श्री.सिु नल कृ णा देवकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('423', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822343207', NULL, '9822343207', '12bb580bdc1eb8ff7c1e46920471281272896d17fc8514c69f021ad49e6865bd', 'श्री.सिु नल कृ णा देवकर', 'Shri. Siu Nala Kri Na Devakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822343207' OR username = '9822343207');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822343207' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '423' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0077', 'मे.कृ णा शंकर देवकर', 'M/s. Kri Na Shankar Devakar', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '77', '423', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '423' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कृ णा शंकर देवकर', 'M/s. Kri Na Shankar Devakar', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '77', '423', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 78 | Mobile 9923005885 | श्री.िशवादास ानोबा खेडेकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('426', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9923005885', NULL, '9923005885', 'cdaccbfaf47f374d1c56253883c91bc0d92253f8a19fe27f091d3f208f2d88f4', 'श्री.िशवादास ानोबा खेडेकर', 'Shri. Shivaadaas Aanob Khedekar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9923005885' OR username = '9923005885');
SET @user_id := (SELECT id FROM users WHERE mobile = '9923005885' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '426' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0078', 'मे.पनु म ट्रेडिंग कंपनी', 'M/s. Panu Ma Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '78', '426', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '426' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पनु म ट्रेडिंग कंपनी', 'M/s. Panu Ma Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '78', '426', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 79 | Mobile 9850501966 | श्री.संभाजी खंडू यादव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('429', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850501966', NULL, '9850501966', 'b9056dfdebd35e582ae849dd1e20b05c49ccd1cf2ec255c93362220a8323a60d', 'श्री.संभाजी खंडू यादव', 'Shri. Sanbhaajee Khandoo Yaadav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850501966' OR username = '9850501966');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850501966' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '429' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0079', 'मे.गंगाई ट्रेडिंग कंपनी', 'M/s. Gangaaee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '79', '429', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '429' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गंगाई ट्रेडिंग कंपनी', 'M/s. Gangaaee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '79', '429', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 80 | Mobile 9822315470 | समीर बाबाजान तांबोळी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('430', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822315470', NULL, '9822315470', '838bf5ee04782eacab28db62bc27f124388751b7de9032ffd1eab01c694e10ac', 'समीर बाबाजान तांबोळी', 'Sameer Baabaajaan Taanbolee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822315470' OR username = '9822315470');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822315470' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '430' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0080', 'मे.तांबोळी ट्रेडिंग कंपनी', 'M/s. Taanbolee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '80', '430', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '430' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.तांबोळी ट्रेडिंग कंपनी', 'M/s. Taanbolee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '80', '430', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 82 | Mobile 9595344777 | श्री.योगेश वसंतराव यादव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('433', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9595344777', NULL, '9595344777', '2261a639159d580009a929013966b809145297b0d26bfcf9e3c9b1cf28271945', 'श्री.योगेश वसंतराव यादव', 'Shri. Yogesh Vasantaraav Yaadav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9595344777' OR username = '9595344777');
SET @user_id := (SELECT id FROM users WHERE mobile = '9595344777' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '433' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0082', 'मे.राजेश ट्रेडिंग कंपनी', 'M/s. Raajesh Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '82', '433', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '433' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.राजेश ट्रेडिंग कंपनी', 'M/s. Raajesh Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '82', '433', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 83 | Mobile 9822261433 | सौ.अंजली समीर रायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('437', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('438', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('439', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822261433', NULL, '9822261433', 'b607543444a1d5ea3e398f54708640e74d04048854909cdd84f1ea04d0c66a10', 'सौ.अंजली समीर रायकर', 'Mrs. Anjalee Sameer Raayakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822261433' OR username = '9822261433');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822261433' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '437' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0083', 'मे.महादेव ह रभाऊ रायकर ॲ ड स स', 'M/s. Mahaadev Ha Rabhaaoo Raayakar A Da Sa Sa', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '83', '438', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '437' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.महादेव ह रभाऊ रायकर ॲ ड स स', 'M/s. Mahaadev Ha Rabhaaoo Raayakar A Da Sa Sa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '83', '438', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '438' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.महादेव ह रभाऊ रायकर ॲ ड स स', 'M/s. Mahaadev Ha Rabhaaoo Raayakar A Da Sa Sa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '83', '438', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '439' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.महादेव ह रभाऊ रायकर ॲ ड स स', 'M/s. Mahaadev Ha Rabhaaoo Raayakar A Da Sa Sa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '83', '438', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 84 | Mobile 9850559975 | श्री.कंु डलीक रामदास दोरगे पाटील
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('443', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850559975', NULL, '9850559975', '52334599dd204796ee34d719d7a940ea91167a8f0580b0934cea6e836b745782', 'श्री.कंु डलीक रामदास दोरगे पाटील', 'Shri. Kanu Daleek Raamadaas Dorage Paateel', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850559975' OR username = '9850559975');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850559975' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '443' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0084', 'मे.कंु डलीक रामदास दोरगे पाटील', 'M/s. Kanu Daleek Raamadaas Dorage Paateel', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '84', '443', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '443' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कंु डलीक रामदास दोरगे पाटील', 'M/s. Kanu Daleek Raamadaas Dorage Paateel', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '84', '443', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 85 | Mobile 9850054279 | श्री.नागनाथ म लीकाजनु कळशे ी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('445', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('291', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850054279', NULL, '9850054279', 'c9db8bddb62e7ccce13a0c3eacb047478118b3524e26fa6df0792ba1a58944ae', 'श्री.नागनाथ म लीकाजनु कळशे ी', 'Shri. Naaganaath Ma Leekaajanu Kalashe Ee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850054279' OR username = '9850054279');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850054279' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '445' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0085', 'मे.वाघे र ट्रेडिंग कंपनी', 'M/s. Vaaghe Ra Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '85', '445', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '445' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.वाघे र ट्रेडिंग कंपनी', 'M/s. Vaaghe Ra Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '85', '445', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '291' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.वाघे र ट्रेडिंग कंपनी', 'M/s. Vaaghe Ra Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '85', '445', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 86 | Mobile 9822786868 | श्री. योगेश शिशकांत खैरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('447', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('298', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822786868', NULL, '9822786868', '448502c4b42f7388fd66a74ab52cbc95d76ecda81079ad49332bdece2b35def5', 'श्री. योगेश शिशकांत खैरे', 'Shri. Yogesh Shashikaant Khaire', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822786868' OR username = '9822786868');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822786868' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '447' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0086', 'मे.शिशकांत मोरे र खैरे', 'M/s. Shashikaant More Ra Khaire', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '86', '447', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '447' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.शिशकांत मोरे र खैरे', 'M/s. Shashikaant More Ra Khaire', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '86', '447', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '298' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.शिशकांत मोरे र खैरे', 'M/s. Shashikaant More Ra Khaire', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '86', '447', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 87 | Mobile 9766264126 | श्री.स्वप्नील गेनभाऊ थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('448', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9766264126', NULL, '9766264126', 'daeb39d0aaa349b7d071c6a38d0a98edf53462470b7a597251a4c59cc8cfaf11', 'श्री.स्वप्नील गेनभाऊ थोरात', 'Shra Shri. Svapneel Genabhaaoo Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9766264126' OR username = '9766264126');
SET @user_id := (SELECT id FROM users WHERE mobile = '9766264126' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '448' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0087', 'मे.भिमाशंकर ट्रेडिंग कंपनी', 'M/s. Bhamiaashankar Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '87', '448', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '448' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.भिमाशंकर ट्रेडिंग कंपनी', 'M/s. Bhamiaashankar Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '87', '448', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 88 | Mobile 9822297730 | श्री.उदय रामदास गाडगे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('449', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822297730', NULL, '9822297730', '4e22e8d7616e164a397a587739c33b4e4a93d3f15fdb3d2af5a3b57247869f2b', 'श्री.उदय रामदास गाडगे', 'Shri. Uday Raamadaas Gaadage', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822297730' OR username = '9822297730');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822297730' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '449' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0088', 'मे.उदय ट्रेडिंग कंपनी', 'M/s. Uday Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '88', '449', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '449' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.उदय ट्रेडिंग कंपनी', 'M/s. Uday Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '88', '449', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 89 | Mobile 9028506699 | श्री.सागर विलास काळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('640', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9028506699', NULL, '9028506699', 'adb6953d654f7a05ef096358b9a32744496c148d1ddc35dd1404d277f6156ec5', 'श्री.सागर विलास काळे', 'Shri. Saagar Valiaas Kaale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9028506699' OR username = '9028506699');
SET @user_id := (SELECT id FROM users WHERE mobile = '9028506699' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '640' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0089', 'मे.सागर ट्रेडिंग कंपनी', 'M/s. Saagar Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '89', '640', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '640' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सागर ट्रेडिंग कंपनी', 'M/s. Saagar Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '89', '640', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 90 | Mobile 9922566699 | श्री.विलास क िडबा काळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('641', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9922566699', NULL, '9922566699', 'b3f53177447474063d25b1cf9ed2a591aae84e8bc02fe7b8ca6a9b8f48912b27', 'श्री.विलास क िडबा काळे', 'Shri. Valiaas Ka Diba Kaale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9922566699' OR username = '9922566699');
SET @user_id := (SELECT id FROM users WHERE mobile = '9922566699' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '641' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0090', 'मे.विलास काळे अँड सन्स', 'M/s. Valiaas Kaale & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '90', '641', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '641' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.विलास काळे अँड सन्स', 'M/s. Valiaas Kaale & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '90', '641', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 91 | Mobile 9922614579 | श्री.महेश सभु ाष भ डवे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('642', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9922614579', NULL, '9922614579', 'faf75bb5eeb78a44f7e7d330f2b770a38a1fd7467ec4a0a701838595cac2042b', 'श्री.महेश सभु ाष भ डवे', 'Shri. Mahesh Sabhu Aash Bha Dave', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9922614579' OR username = '9922614579');
SET @user_id := (SELECT id FROM users WHERE mobile = '9922614579' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '642' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0091', 'मे.गौरी ट्रेडिंग कंपनी', 'M/s. Gauree Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '91', '642', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '642' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गौरी ट्रेडिंग कंपनी', 'M/s. Gauree Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '91', '642', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 92 | Mobile 9822064979 | श्री.सिु नल िव णू खटु वड
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('643', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('644', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822064979', NULL, '9822064979', '6f2d5e00d8616d0026aa01b8be9ef6b27f113e11de7d31c94a822672a168161f', 'श्री.सिु नल िव णू खटु वड', 'Shri. Siu Nala Vi Noo Khatu Vada', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822064979' OR username = '9822064979');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822064979' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '643' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0092', 'मे.िव णू दगडू खटु वड', 'M/s. Vi Noo Dagadoo Khatu Vada', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '92', '643', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '643' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िव णू दगडू खटु वड', 'M/s. Vi Noo Dagadoo Khatu Vada', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '92', '643', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '644' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िव णू दगडू खटु वड', 'M/s. Vi Noo Dagadoo Khatu Vada', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '92', '643', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 93 | Mobile 9860090391 | श्री.शांताराम रघुनाथ करंडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('645', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860090391', NULL, '9860090391', '602a8c73d33a972c9d73031652c78216bf60fc47345d064555c5b397780c6d49', 'श्री.शांताराम रघुनाथ करंडे', 'Shri. Shaantaaraam Raghunaath Karande', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860090391' OR username = '9860090391');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860090391' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '645' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0093', 'मे.िकत ट्रेडिंग कंपनी', 'M/s. Kita Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '93', '645', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '645' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िकत ट्रेडिंग कंपनी', 'M/s. Kita Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '93', '645', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 94 | Mobile 9762123749 | श्री.िनवृ ी मा ती बे हेकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('646', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9762123749', NULL, '9762123749', 'd4d4666ad467301e2e973afbf625128a0ac532a999705149a0017af472a794f5', 'श्री.िनवृ ी मा ती बे हेकर', 'Shri. Nivri Ee Ma Tee Be Hekar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9762123749' OR username = '9762123749');
SET @user_id := (SELECT id FROM users WHERE mobile = '9762123749' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '646' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0094', 'मे.बे हेकर ट्रेडर्स', 'M/s. Be Hekar Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '94', '646', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '646' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बे हेकर ट्रेडर्स', 'M/s. Be Hekar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '94', '646', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 95 | Mobile 9823089599 | मे.पश्री.एस.रामू
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('647', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9823089599', NULL, '9823089599', '9bba6823c2e016622fac2f7428c6ac6d1049149fa5bfd7bdd72e8efb5fc53960', 'मे.पश्री.एस.रामू', 'M/s. Pa Shri. Esa.raamoo', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9823089599' OR username = '9823089599');
SET @user_id := (SELECT id FROM users WHERE mobile = '9823089599' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '647' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0095', 'मे.पश्री.एस.रामू', 'M/s. Pa Shri. Esa.raamoo', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '95', '647', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '647' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पश्री.एस.रामू', 'M/s. Pa Shri. Esa.raamoo', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '95', '647', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 100 | Mobile 9822287139 | श्री.बाजीराव कुषाबा अतकरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('705', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822287139', NULL, '9822287139', 'a21db0f6aaf8384958518d7be0847620aa4e81d85d19dd0c324018aba86e90f9', 'श्री.बाजीराव कुषाबा अतकरे', 'Shri. Baajeeraav Kushaab Atakare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822287139' OR username = '9822287139');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822287139' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '705' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0100', 'मे.अवधतू ट्रेडिंग कंपनी', 'M/s. Avadhatoo Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '100', '705', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '705' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अवधतू ट्रेडिंग कंपनी', 'M/s. Avadhatoo Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '100', '705', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 101 | Mobile 9767513692 | सौ.अ ता अतुल रा े
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('706', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9767513692', NULL, '9767513692', 'caa130ca132b76d42bc6c4fdd1956364dab5122a2133b4854ef4978d2f4581c1', 'सौ.अ ता अतुल रा े', 'Mrs. A Ta Atul Ra E', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9767513692' OR username = '9767513692');
SET @user_id := (SELECT id FROM users WHERE mobile = '9767513692' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '706' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0101', 'मे.हषा ट्रेडिंग कंपनी', 'M/s. Hash Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '101', '706', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '706' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.हषा ट्रेडिंग कंपनी', 'M/s. Hash Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '101', '706', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 102 | Mobile 9552334356 | अिजस लालखान
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('707', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9552334356', NULL, '9552334356', '92f2be0a3d2f0f8de3a4de2b63eb59bce16a6248e32863a1784123ae22d65df9', 'अिजस लालखान', 'Ajis Laalakhaan', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9552334356' OR username = '9552334356');
SET @user_id := (SELECT id FROM users WHERE mobile = '9552334356' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '707' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0102', 'मे.एकता ट्रेडिंग कंपनी', 'M/s. Ekat Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '102', '707', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '707' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.एकता ट्रेडिंग कंपनी', 'M/s. Ekat Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '102', '707', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 103 | Mobile 9822094440 | श्री.शरद रामचं गावडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('710', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822094440', NULL, '9822094440', 'dba61de2427549c9a77e92513be6a745ccc97599dec4f7aa204174e50666e69f', 'श्री.शरद रामचं गावडे', 'Shri. Sharad Raamachan Gaavade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822094440' OR username = '9822094440');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822094440' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '710' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0103', 'मे.शरद ट्रेडिंग कंपनी', 'M/s. Sharad Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '103', '710', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '710' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.शरद ट्रेडिंग कंपनी', 'M/s. Sharad Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '103', '710', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 104 | Mobile 7248998304 | श्री.विलास दशरथ पाटील
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('711', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7248998304', NULL, '7248998304', 'da7f83d0a85dc85c7312a163b9267d12284e437042c74c721a07e56c2395eadb', 'श्री.विलास दशरथ पाटील', 'Shri. Valiaas Dasharath Paateel', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7248998304' OR username = '7248998304');
SET @user_id := (SELECT id FROM users WHERE mobile = '7248998304' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '711' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0104', 'मे.िब.टश्री.के . ट्रेडिंग कंपनी', 'M/s. Bi.t Shri. Ke . Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '104', '711', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '711' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िब.टश्री.के . ट्रेडिंग कंपनी', 'M/s. Bi.t Shri. Ke . Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '104', '711', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 105 | Mobile 9890005191 | श्री.के दार साहेबराव तावरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('712', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('713', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9890005191', NULL, '9890005191', 'b1b27c1c6c5bc7c1fa1b3b9b7ae157eb4b0decd824dbd5b0dbdf470182f87ab3', 'श्री.के दार साहेबराव तावरे', 'Shri. Ke Daar Saahebaraav Taavare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9890005191' OR username = '9890005191');
SET @user_id := (SELECT id FROM users WHERE mobile = '9890005191' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '712' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0105', 'मे.साहेबराव एकनाथ तावरे अँड दस', 'M/s. Saahebaraav Ekanaath Taavare & Dasa', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '105', '712', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '712' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.साहेबराव एकनाथ तावरे अँड दस', 'M/s. Saahebaraav Ekanaath Taavare & Dasa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '105', '712', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '713' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.साहेबराव एकनाथ तावरे अँड दस', 'M/s. Saahebaraav Ekanaath Taavare & Dasa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '105', '712', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 106 | Mobile 9370144640 | श्री.पु षो म सुभेदार क डे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('714', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9370144640', NULL, '9370144640', '8850b2d0f0087832f942860ed9a1e4978335da633763db7730ea6a7d122c5889', 'श्री.पु षो म सुभेदार क डे', 'Shri. Pu Sho Ma Subhedaar Ka De', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9370144640' OR username = '9370144640');
SET @user_id := (SELECT id FROM users WHERE mobile = '9370144640' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '714' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0106', 'मे.पु षो म सभु ेदार क डे', 'M/s. Pu Sho Ma Sabhu Edaar Ka De', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '106', '714', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '714' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.पु षो म सभु ेदार क डे', 'M/s. Pu Sho Ma Sabhu Edaar Ka De', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '106', '714', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 107 | Mobile 9850917407 | श्री.राहल महादेव शिंदे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('715', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850917407', NULL, '9850917407', '94b7d727365e0b69132036373db12ccb200ece690eccecc60823c7ac48bca275', 'श्री.राहल महादेव शिंदे', 'Shri. Raahal Mahaadev Shinde', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850917407' OR username = '9850917407');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850917407' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '715' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0107', 'मे.सादािशव ल मण शिंदे आणि कंपनी', 'M/s. Saadaashiv La Mana Shinde & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '107', '715', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '715' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सादािशव ल मण शिंदे आणि कंपनी', 'M/s. Saadaashiv La Mana Shinde & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '107', '715', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 108 | Mobile 9822216518 | श्री.तुळशीराम महादेव पांढरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('716', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822216518', NULL, '9822216518', '8974f991e02e16dbd0e7691fb1e5a836b33bf77ad29c478996276902bbb2cae2', 'श्री.तुळशीराम महादेव पांढरे', 'Shra Shri. Tulasheeraam Mahaadev Paandhare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822216518' OR username = '9822216518');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822216518' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '716' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0108', 'मे.आंचलेश्वर ट्रेडर्स', 'M/s. Aanchaleshvar Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '108', '716', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '716' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.आंचलेश्वर ट्रेडर्स', 'M/s. Aanchaleshvar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '108', '716', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 109 | Mobile 9657662575 | श्री.अथव विलास कटके
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('717', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('718', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9657662575', NULL, '9657662575', '0b786ae41264167ce23e055d114899226e5e3d6f40f9e5e849c606ee86b49315', 'श्री.अथव विलास कटके', 'Shri. Athav Valiaas Katake', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9657662575' OR username = '9657662575');
SET @user_id := (SELECT id FROM users WHERE mobile = '9657662575' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '717' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0109', 'मे.कटके ट्रेडर्स', 'M/s. Katake Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '109', '717', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '717' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कटके ट्रेडर्स', 'M/s. Katake Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '109', '717', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '718' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.कटके ट्रेडर्स', 'M/s. Katake Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '109', '717', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 110 | Mobile 9822976719 | श्री.काळूराम गणपत वाघमारे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('719', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822976719', NULL, '9822976719', 'c05cfebb43cd271cb859a3006af8765e2e0aebd2624a99a4435ec7cbf3f49f92', 'श्री.काळूराम गणपत वाघमारे', 'Shri. Kaalooraam Ganapat Vaaghamaare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822976719' OR username = '9822976719');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822976719' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '719' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0110', 'मे.धमराज ट्रेडिंग कंपनी', 'M/s. Dhamaraaj Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '110', '719', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '719' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.धमराज ट्रेडिंग कंपनी', 'M/s. Dhamaraaj Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '110', '719', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 111 | Mobile 9284585050 | इ ाहीम बशीर शेख
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('721', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9284585050', NULL, '9284585050', '3acf51cf0746585acc1c24546ad9dd2214222f71dbdb6bc664cf9338415aa9a2', 'इ ाहीम बशीर शेख', 'I Aaheem Basheer Shekh', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9284585050' OR username = '9284585050');
SET @user_id := (SELECT id FROM users WHERE mobile = '9284585050' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '721' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0111', 'मे.अ सा ट्रेडिंग कंपनी', 'M/s. A Sa Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '111', '721', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '721' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अ सा ट्रेडिंग कंपनी', 'M/s. A Sa Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '111', '721', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 112 | Mobile 9960040062 | श्री.रामदास सोमनाथ पवार
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('724', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9960040062', NULL, '9960040062', '7e02d0dc8ef5918a47cda1bc6e4d347504055a36cc99bc66e9346278b34c991c', 'श्री.रामदास सोमनाथ पवार', 'Shri. Raamadaas Somanaath Pavaar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9960040062' OR username = '9960040062');
SET @user_id := (SELECT id FROM users WHERE mobile = '9960040062' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '724' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0112', 'मे.योत ल ग ट्रेडिंग कंपनी', 'M/s. Yota La Ga Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '112', '724', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '724' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.योत ल ग ट्रेडिंग कंपनी', 'M/s. Yota La Ga Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '112', '724', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 113 | Mobile 9822011769 | श्री.राज वासदु वे भालेराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('725', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822011769', NULL, '9822011769', '7585977de31e580b4d7261004d3984a761317ccd52a5c70a585db4d239467454', 'श्री.राज वासदु वे भालेराव', 'Shri. Raaj Vaasadu Ve Bhaaleraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822011769' OR username = '9822011769');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822011769' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '725' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0113', 'मे.भालेराव ट्रेडिंग कंपनी', 'M/s. Bhaaleraav Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '113', '725', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '725' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.भालेराव ट्रेडिंग कंपनी', 'M/s. Bhaaleraav Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '113', '725', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 114 | Mobile 9822192751 | श्री. िवण जयवतं राव िहगं े
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('726', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822192751', NULL, '9822192751', '4b7916c59443a3d692df9363c8f6f4e8336bd12e924207fd5ba013ce2d0122af', 'श्री. िवण जयवतं राव िहगं े', 'Shri. Vina Jayavatan Raav Higan E', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822192751' OR username = '9822192751');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822192751' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '726' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0114', 'मे.िवण जयवतं राव िहगं े', 'M/s. Vina Jayavatan Raav Higan E', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '114', '726', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '726' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िवण जयवतं राव िहगं े', 'M/s. Vina Jayavatan Raav Higan E', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '114', '726', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 115 | Mobile 9049182267 | श्री.संदीप बापरु ाव ता हाणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('727', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9049182267', NULL, '9049182267', '59fd567ca733501c53ff1b6386fa0e264a296c818e19f2c315898a4218dc7fd0', 'श्री.संदीप बापरु ाव ता हाणे', 'Shri. Sandeep Baaparu Aava Ta Haane', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9049182267' OR username = '9049182267');
SET @user_id := (SELECT id FROM users WHERE mobile = '9049182267' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '727' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0115', 'मे.ता हाणे ट्रेडिंग कंपनी', 'M/s. Ta Haane Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '115', '727', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '727' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.ता हाणे ट्रेडिंग कंपनी', 'M/s. Ta Haane Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '115', '727', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 116 | Mobile 9822059695 | श्री.समीर विलास रायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('728', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822059695', NULL, '9822059695', '67031fe2a9ffc53d5bf75c2ecc32ec0bfe36bdb768dd2ad1626d3ac0326e8618', 'श्री.समीर विलास रायकर', 'Shri. Sameer Valiaas Raayakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822059695' OR username = '9822059695');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822059695' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '728' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0116', 'मे.विलास महादेव रायकर', 'M/s. Valiaas Mahaadev Raayakar', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '116', '728', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '728' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.विलास महादेव रायकर', 'M/s. Valiaas Mahaadev Raayakar', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '116', '728', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 117 | Mobile 8087613091 | श्री.आशिष अरुण घोडके
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('731', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8087613091', NULL, '8087613091', '87d8af36a2dfc68510e68e8c66f6c518bc4745dbeb1dbef4f7a7cacb3275c048', 'श्री.आशिष अरुण घोडके', 'Shra Shri. Aashashi Arun Ghodake', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8087613091' OR username = '8087613091');
SET @user_id := (SELECT id FROM users WHERE mobile = '8087613091' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '731' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0117', 'मे.अरुण तुकाराम घोडके', 'M/s. Arun Tukaaraam Ghodake', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '117', '731', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '731' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अरुण तुकाराम घोडके', 'M/s. Arun Tukaaraam Ghodake', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '117', '731', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 118 | Mobile 9822620657 | श्री.संभाजी ध डीबा खेडेकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('732', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822620657', NULL, '9822620657', 'f8c795d032b75e0d1464929d037eb879b4aafec86690516c2871d7f7c991bb8d', 'श्री.संभाजी ध डीबा खेडेकर', 'Shri. Sanbhaajee Dha Deeb Khedekar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822620657' OR username = '9822620657');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822620657' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '732' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0118', 'मे.संभाजी ध डीबा खेडेकर', 'M/s. Sanbhaajee Dha Deeb Khedekar', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '118', '732', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '732' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.संभाजी ध डीबा खेडेकर', 'M/s. Sanbhaajee Dha Deeb Khedekar', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '118', '732', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 119 | Mobile 9822156313 | श्री.उ व मा ती तळेकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('733', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822156313', NULL, '9822156313', '50f735837a64a74a01ada468b7a68eba6842968ff68ef54a121b2896c75ed04f', 'श्री.उ व मा ती तळेकर', 'Shri. U Va Ma Tee Talekar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822156313' OR username = '9822156313');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822156313' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '733' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0119', 'मे.ओम ट्रेडिंग कंपनी', 'M/s. Oma Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '119', '733', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '733' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.ओम ट्रेडिंग कंपनी', 'M/s. Oma Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '119', '733', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 120 | Mobile 9822061961 | श्री.वसंत एकनाथ मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('734', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061961', NULL, '9822061961', 'aa308490ca140d01360778a8d03e1906747ed034d424b9514a27866cc288c609', 'श्री.वसंत एकनाथ मोरडे', 'Shri. Vasant Ekanaath Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061961' OR username = '9822061961');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061961' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '734' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0120', 'मे.वसंत मोरडे आणि कंपनी', 'M/s. Vasant Morade & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '120', '734', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '734' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.वसंत मोरडे आणि कंपनी', 'M/s. Vasant Morade & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '120', '734', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 121 | Mobile 9970404141 | श्री.निलेश नामदेव थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('735', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9970404141', NULL, '9970404141', '929546f14bafda43e341a118c8faffd401993865d6b59ec05d15c0216892966a', 'श्री.निलेश नामदेव थोरात', 'Shri. Naliesh Naamadev Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9970404141' OR username = '9970404141');
SET @user_id := (SELECT id FROM users WHERE mobile = '9970404141' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '735' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0121', 'मे.सोमे र ट्रेडर्स', 'M/s. So M/s. Ra Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '121', '735', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '735' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सोमे र ट्रेडर्स', 'M/s. So M/s. Ra Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '121', '735', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 122 | Mobile 9422031687 | श्री.अिमत रोिहदास भ डवे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('736', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9422031687', NULL, '9422031687', '12a0759809831e614d982196c50417327eac0dce9743a747942369bd9c30d24a', 'श्री.अिमत रोिहदास भ डवे', 'Shri. Amit Rohidaas Bha Dave', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9422031687' OR username = '9422031687');
SET @user_id := (SELECT id FROM users WHERE mobile = '9422031687' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '736' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0122', 'मे.रोिहदास िवनायक भ डवे', 'M/s. Rohidaas Vinaayak Bha Dave', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '122', '736', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '736' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रोिहदास िवनायक भ डवे', 'M/s. Rohidaas Vinaayak Bha Dave', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '122', '736', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 123 | Mobile 9921115252 | श्री. िवणकुमार पचंद गांधी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('737', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9921115252', NULL, '9921115252', 'baf906aa13986d98daca4a1ade1c7e3124be62c4a360ac1b3b926ccad42fa06c', 'श्री. िवणकुमार पचंद गांधी', 'Shri. Vinakumaar Pachand Gaandhee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9921115252' OR username = '9921115252');
SET @user_id := (SELECT id FROM users WHERE mobile = '9921115252' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '737' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0123', 'मे.महावीर ट्रेडिंग कंपनी', 'M/s. Mahaaveer Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '123', '737', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '737' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.महावीर ट्रेडिंग कंपनी', 'M/s. Mahaaveer Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '123', '737', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 124 | Mobile 9921115252 | सौ.सरु े खा िवण गांधी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('738', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9921115252', NULL, '9921115252', 'e06959d9e4043d83891fc37f01acb8dd91992c3e3e509bdc9f507e2380c09f94', 'सौ.सरु े खा िवण गांधी', 'Mrs. Saru E Kha Vina Gaandhee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9921115252' OR username = '9921115252');
SET @user_id := (SELECT id FROM users WHERE mobile = '9921115252' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '738' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0124', 'मे.साईबाबा ट्रेडिंग कंपनी', 'M/s. Saaeebaab Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '124', '738', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '738' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.साईबाबा ट्रेडिंग कंपनी', 'M/s. Saaeebaab Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '124', '738', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 125 | Mobile 9822434607 | श्री.राहल लालासो जगताप
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('740', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822434607', NULL, '9822434607', 'd69f4b766221fe896a18e79a406d4a3d0ee0610d417815cfa4bb2eb050e18083', 'श्री.राहल लालासो जगताप', 'Shri. Raahal Laalaaso Jagataap', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822434607' OR username = '9822434607');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822434607' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '740' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0125', 'मे.जे.जे. ट्रेडर्स', 'M/s. Je.je. Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '125', '740', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '740' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जे.जे. ट्रेडर्स', 'M/s. Je.je. Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '125', '740', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 126 | Mobile 9822098816 | श्री.दिलीप तुकाराम काऱ्हाळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('742', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('743', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822098816', NULL, '9822098816', '5a314f5febb3c0a9352ed0f65fecee43e6fff1400df7e08286667a72c5b83471', 'श्री.दिलीप तुकाराम काऱ्हाळे', 'Shra Shri. Dalieep Tukaaraam Kaahaale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822098816' OR username = '9822098816');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822098816' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '742' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0126', 'मे.दिलीप तुकाराम काऱ्हाळे', 'M/s. Dalieep Tukaaraam Kaahaale', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '126', '742', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '742' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.दिलीप तुकाराम काऱ्हाळे', 'M/s. Dalieep Tukaaraam Kaahaale', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '126', '742', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '743' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.दिलीप तुकाराम काऱ्हाळे', 'M/s. Dalieep Tukaaraam Kaahaale', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '126', '742', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 127 | Mobile 9049597337 | श्री.गौरव गणेश घुले
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('744', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('744', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9049597337', NULL, '9049597337', 'e220acbc87df146f493c31e103bd22c10a80af18a16e47ec9ab8ddd72b4b782d', 'श्री.गौरव गणेश घुले', 'Shra Shri. Gaurav Ganesh Ghule', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9049597337' OR username = '9049597337');
SET @user_id := (SELECT id FROM users WHERE mobile = '9049597337' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '744' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0127', 'मे.गौरव गणेश घुले', 'M/s. Gaurav Ganesh Ghule', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '127', '744', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '744' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गौरव गणेश घुले', 'M/s. Gaurav Ganesh Ghule', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '127', '744', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '744' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गौरव गणेश घुले', 'M/s. Gaurav Ganesh Ghule', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '127', '744', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 128 | Mobile 9850818015 | श्री.लालासाहेब ानदेव ताकवले
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('746', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850818015', NULL, '9850818015', '622fc2a77b72d32954eadd7b96ca33cd6909b8c2bc049bf6e9d4cde3be5e9ca5', 'श्री.लालासाहेब ानदेव ताकवले', 'Shri. Laalaasaaheb Aanadev Taakavale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850818015' OR username = '9850818015');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850818015' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '746' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0128', 'मे.अिजं य ट्रेडिंग कंपनी', 'M/s. Ajin Ya Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '128', '746', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '746' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अिजं य ट्रेडिंग कंपनी', 'M/s. Ajin Ya Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '128', '746', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 129 | Mobile 9822883047 | श्री.पोपटराव जयिसगं राव जाधव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('747', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822883047', NULL, '9822883047', '4336488f032ff3dd936fe2157bf05a462c0294bdc7348be4500837f05d1fded9', 'श्री.पोपटराव जयिसगं राव जाधव', 'Shri. Popataraav Jayasigan Raav Jaadhav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822883047' OR username = '9822883047');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822883047' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '747' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0129', 'मे.जाधव जगताप आणि कंपनी', 'M/s. Jaadhav Jagataap & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '129', '747', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '747' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जाधव जगताप आणि कंपनी', 'M/s. Jaadhav Jagataap & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '129', '747', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 130 | Mobile 9850421832 | श्री.रिवं किसन कोलते
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('748', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850421832', NULL, '9850421832', '25f283c55384aa826dd20060f1943a8137e5f3338f46a0e9d3f8fdd72fb0b09d', 'श्री.रिवं किसन कोलते', 'Shri. Ravin Kasin Kolate', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850421832' OR username = '9850421832');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850421832' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '748' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0130', 'मे.िस नाथ ट्रेडिंग कंपनी', 'M/s. Si Naath Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '130', '748', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '748' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िस नाथ ट्रेडिंग कंपनी', 'M/s. Si Naath Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '130', '748', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 131 | Mobile 9822080154 | सौ.वै णवी पाडं ु रंग हराळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('749', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822080154', NULL, '9822080154', '4169ff07b9374aaa962214c13b0e4c332e44f27cd999a94983f52d9715f0d13d', 'सौ.वै णवी पाडं ु रंग हराळे', 'Mrs. Vai Navee Paadan U Rang Haraale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822080154' OR username = '9822080154');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822080154' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '749' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0131', 'मे.जग नाथ द ोबा हराळे', 'M/s. Jaga Naath Da Oba Haraale', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '131', '749', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '749' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जग नाथ द ोबा हराळे', 'M/s. Jaga Naath Da Oba Haraale', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '131', '749', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 132 | Mobile 9860489455 | श्री.िव ल मरु लीधर झुरंगे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('750', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860489455', NULL, '9860489455', '127194d7dbec1fce461559752f3e264eaefb22158e4bd40c69a26511d6c132f1', 'श्री.िव ल मरु लीधर झुरंगे', 'Shri. Vi La Maru Leedhar Jhurange', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860489455' OR username = '9860489455');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860489455' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '750' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0132', 'मे.ीनाथ आणि कंपनी', 'M/s. Eenaath & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '132', '750', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '750' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.ीनाथ आणि कंपनी', 'M/s. Eenaath & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '132', '750', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 133 | Mobile 9423520509 | श्री. िदप भानदु ास कदम
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('752', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9423520509', NULL, '9423520509', '076c5b7f1f35ec3493df59866687c6fb8e98c4e0692fb47b80fe9cf864edd37d', 'श्री. िदप भानदु ास कदम', 'Shri. Dipa Bhaanadu Aasa Kadam', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9423520509' OR username = '9423520509');
SET @user_id := (SELECT id FROM users WHERE mobile = '9423520509' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '752' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0133', 'मे.जय तुळजाभवानी ट्रेडिंग कंपनी', 'M/s. Jaya Tulajaabhavaanee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '133', '752', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '752' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जय तुळजाभवानी ट्रेडिंग कंपनी', 'M/s. Jaya Tulajaabhavaanee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '133', '752', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 134 | Mobile 9850039319 | श्री.संतोष राजाराम जगताप
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('753', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850039319', NULL, '9850039319', '3c057e0e7452676a0e403df3aabf4669ae9b1296ec0f6c90910c64ccc8fb20c1', 'श्री.संतोष राजाराम जगताप', 'Shri. Santosh Raajaaraam Jagataap', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850039319' OR username = '9850039319');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850039319' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '753' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0134', 'मे.जीनाई ट्रेडिंग कंपनी', 'M/s. Jeenaaee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '134', '753', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '753' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जीनाई ट्रेडिंग कंपनी', 'M/s. Jeenaaee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '134', '753', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 135 | Mobile 9619052333 | श्री.रामचं यशवंत नरवडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('754', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9619052333', NULL, '9619052333', 'f4ca2d84fbcde5ab4c01295757185b2a84c8945b47f65ed892062df341e22d50', 'श्री.रामचं यशवंत नरवडे', 'Shri. Raamachan Yashavant Naravade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9619052333' OR username = '9619052333');
SET @user_id := (SELECT id FROM users WHERE mobile = '9619052333' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '754' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0135', 'मे.नरवडे आणि कंपनी', 'M/s. Naravade & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '135', '754', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '754' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.नरवडे आणि कंपनी', 'M/s. Naravade & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '135', '754', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 136 | Mobile 9921184213 | श्री.शिवराज गगं ाराम नगरे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('755', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9921184213', NULL, '9921184213', 'a3cdf5ea2c55f5408705529efcaa38e9fbc007c314cf9c5ae44beb1da7c91611', 'श्री.शिवराज गगं ाराम नगरे', 'Shri. Shaviraaj Gagan Aaraam Nagare', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9921184213' OR username = '9921184213');
SET @user_id := (SELECT id FROM users WHERE mobile = '9921184213' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '755' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0136', 'मे.गगं ाराम सागरमल नगरे', 'M/s. Gagan Aaraam Saagaramal Nagare', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '136', '755', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '755' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.गगं ाराम सागरमल नगरे', 'M/s. Gagan Aaraam Saagaramal Nagare', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '136', '755', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 137 | Mobile 9970404141 | श्री.नामदेव थोरात
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('756', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9970404141', NULL, '9970404141', 'e30d8ca98b386376bc43f118e4503855312993fbf07ac01ffce1449b2fd73c93', 'श्री.नामदेव थोरात', 'Shri. Naamadev Thoraat', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9970404141' OR username = '9970404141');
SET @user_id := (SELECT id FROM users WHERE mobile = '9970404141' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '756' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0137', 'मे.नामदेवराव थोरात आणि कंपनी', 'M/s. Naamadevaraav Thoraat & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '137', '756', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '756' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.नामदेवराव थोरात आणि कंपनी', 'M/s. Naamadevaraav Thoraat & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '137', '756', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 138 | Mobile 9822061961 | श्री.वसंत एकनाथ मोरडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('757', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822061961', NULL, '9822061961', '471b4a93a8e7e1f802590915694868a4dcb049db1a5403a7061e88cf60619d95', 'श्री.वसंत एकनाथ मोरडे', 'Shri. Vasant Ekanaath Morade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822061961' OR username = '9822061961');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822061961' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '757' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0138', 'मे.वसंत एकनाथ मोरडे', 'M/s. Vasant Ekanaath Morade', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '138', '757', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '757' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.वसंत एकनाथ मोरडे', 'M/s. Vasant Ekanaath Morade', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '138', '757', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 139 | Mobile 9822617112 | श्री.शिवाजी मि छं नाथ तळे कर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('758', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822617112', NULL, '9822617112', 'c336eb2662253969cfd6f619bdc67fbce293b1ddbc6e5e4e6da8d8b094e61c90', 'श्री.शिवाजी मि छं नाथ तळे कर', 'Shri. Shaviaajee Mi Chhan Naath Tale Kara', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822617112' OR username = '9822617112');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822617112' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '758' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0139', 'मे.ि मतु ट्रेडर्स', 'M/s. I Matu Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '139', '758', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '758' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.ि मतु ट्रेडर्स', 'M/s. I Matu Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '139', '758', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 140 | Mobile 9822661511 | श्री.शिवराज तुकाराम घोडके
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('760', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822661511', NULL, '9822661511', 'a45b9523507eda1c6d12f4fefd4ff77c860bd26361263f936169a33c717867b9', 'श्री.शिवराज तुकाराम घोडके', 'Shri. Shaviraaj Tukaaraam Ghodake', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822661511' OR username = '9822661511');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822661511' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '760' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0140', 'मे.घोडके ट्रेडिंग कंपनी', 'M/s. Ghodake Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '140', '760', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '760' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.घोडके ट्रेडिंग कंपनी', 'M/s. Ghodake Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '140', '760', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 141 | Mobile 9881079232 | सौ.वैशाली विलास रायकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('761', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('762', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9881079232', NULL, '9881079232', 'c4219b372fb78eb9ebbdeb4303a98aa6682585cbb2bc5eaf201568049d2f4fbc', 'सौ.वैशाली विलास रायकर', 'Mrs. Vaishaalee Valiaas Raayakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9881079232' OR username = '9881079232');
SET @user_id := (SELECT id FROM users WHERE mobile = '9881079232' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '761' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0141', 'मे.रायकर ट्रेडर्स', 'M/s. Raayakar Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '141', '761', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '761' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रायकर ट्रेडर्स', 'M/s. Raayakar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '141', '761', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '762' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रायकर ट्रेडर्स', 'M/s. Raayakar Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '141', '761', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 142 | Mobile 9823016602 | सौ.मगं ल शंकर जवळकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('763', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9823016602', NULL, '9823016602', '8de9beec53190c1ea9822f447f9d24149a5b14a3f4385ebaeefdcde171532f3c', 'सौ.मगं ल शंकर जवळकर', 'Mrs. Magan La Shankar Javalakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9823016602' OR username = '9823016602');
SET @user_id := (SELECT id FROM users WHERE mobile = '9823016602' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '763' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0142', 'मे.जवळकर आणि कंपनी', 'M/s. Javalakar & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '142', '763', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '763' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जवळकर आणि कंपनी', 'M/s. Javalakar & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '142', '763', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 143 | Mobile 9850765933 | श्री.सिु नल द ा य पाबळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('764', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850765933', NULL, '9850765933', '7a05d6f35f7e6264b707f0c836af14e895003442b4c4a307c1756422bca470a0', 'श्री.सिु नल द ा य पाबळे', 'Shri. Siu Nala Da A Ya Paabale', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850765933' OR username = '9850765933');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850765933' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '764' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0143', 'मे.िव णूकृपा ट्रेडिंग कंपनी', 'M/s. Vi Nookrip Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '143', '764', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '764' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िव णूकृपा ट्रेडिंग कंपनी', 'M/s. Vi Nookrip Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '143', '764', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 144 | Mobile 7744040726 | श्री.शभु म िवण िहगं े
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('765', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7744040726', NULL, '7744040726', '9c59175a343357052e14ca19403d922578676f72c9ac71b405399d6bbc053993', 'श्री.शभु म िवण िहगं े', 'Shri. Shabhu Ma Vina Higan E', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7744040726' OR username = '7744040726');
SET @user_id := (SELECT id FROM users WHERE mobile = '7744040726' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '765' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0144', 'मे.िवण जयवतं राव िहगं े', 'M/s. Vina Jayavatan Raav Higan E', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '144', '765', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '765' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िवण जयवतं राव िहगं े', 'M/s. Vina Jayavatan Raav Higan E', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '144', '765', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 145 | Mobile 9172727609 | श्री.राज िशवराम झगडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('766', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9172727609', NULL, '9172727609', '20c4c12c75bc0c22473a97272021346f3c780fa295b904749e108c28196d47a7', 'श्री.राज िशवराम झगडे', 'Shri. Raaj Shivaraam Jhagade', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9172727609' OR username = '9172727609');
SET @user_id := (SELECT id FROM users WHERE mobile = '9172727609' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '766' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0145', 'मे.एस.आर.झगडे आणि स स', 'M/s. Esa.aara.jhagade & Sa Sa', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '145', '766', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '766' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.एस.आर.झगडे आणि स स', 'M/s. Esa.aara.jhagade & Sa Sa', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '145', '766', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 146 | Mobile 7709090424 | श्री.अ य िव ल पवार
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('768', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7709090424', NULL, '7709090424', '3231033fb5cfd8eba802937f0dc4a4376c30f8f630a3f23abd3334402bceddce', 'श्री.अ य िव ल पवार', 'Shri. A Ya Vi La Pavaar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7709090424' OR username = '7709090424');
SET @user_id := (SELECT id FROM users WHERE mobile = '7709090424' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '768' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0146', 'मे.सदग् ु ट्रेडर्स', 'M/s. Sadag U Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '146', '768', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '768' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सदग् ु ट्रेडर्स', 'M/s. Sadag U Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '146', '768', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 147 | Mobile 9850804713 | श्री.दयानदं ानोबा देवकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('769', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850804713', NULL, '9850804713', '942174a0d430bae389d6d9e92ae979b7c3184b81ca4502812348d25a55f1eb5d', 'श्री.दयानदं ानोबा देवकर', 'Shri. Dayaanadan Aanob Devakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850804713' OR username = '9850804713');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850804713' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '769' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0147', 'मे.स ाट ट्रेडिंग कंपनी', 'M/s. Sa Aata Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '147', '769', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '769' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.स ाट ट्रेडिंग कंपनी', 'M/s. Sa Aata Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '147', '769', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 148 | Mobile 9822646412 | श्री.मेहबूब गुलाब शेख
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('770', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822646412', NULL, '9822646412', '8b9d0619a856eebccd3ac4dc11291e4989b97fdea23b6e8ef15eca3f7bd233e4', 'श्री.मेहबूब गुलाब शेख', 'Shra Shri. M/s. Haboob Gulaab Shekh', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822646412' OR username = '9822646412');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822646412' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '770' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0148', 'मे.लकी ट्रेडिंग कंपनी', 'M/s. Lakee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '148', '770', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '770' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.लकी ट्रेडिंग कंपनी', 'M/s. Lakee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '148', '770', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 149 | Mobile 9762729191 | श्री.महेश बाळकृ ण सोनावणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('771', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9762729191', NULL, '9762729191', '42ae292c8a65e3ef8b619e9acb7a671b068401104012249a2206b04e3a5ca60d', 'श्री.महेश बाळकृ ण सोनावणे', 'Shri. Mahesh Baalakri Na Sonaavane', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9762729191' OR username = '9762729191');
SET @user_id := (SELECT id FROM users WHERE mobile = '9762729191' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '771' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0149', 'मे.जय बजरंग ट्रेडिंग कंपनी', 'M/s. Jaya Bajarang Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '149', '771', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '771' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.जय बजरंग ट्रेडिंग कंपनी', 'M/s. Jaya Bajarang Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '149', '771', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 150 | Mobile 8600092788 | श्री.सधु ीर सयु कांत होनराव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('772', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8600092788', NULL, '8600092788', 'd491ecf73d4f12d02ebf03d45cbf08650a701fe8f5ef4b8ef29e9da7258b3d77', 'श्री.सधु ीर सयु कांत होनराव', 'Shri. Sadhu Eera Sayu Kaant Honaraav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8600092788' OR username = '8600092788');
SET @user_id := (SELECT id FROM users WHERE mobile = '8600092788' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '772' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0150', 'मे.धनल मी ट्रेडिंग कंपनी', 'M/s. Dhanal Mee Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '150', '772', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '772' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.धनल मी ट्रेडिंग कंपनी', 'M/s. Dhanal Mee Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '150', '772', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 151 | Mobile 7719995533 | सै यद गोस अली
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('773', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7719995533', NULL, '7719995533', '99c2372ad670ced314b1fceb06832cb38d8ad0b9af703f513dc8a804e6e43ad7', 'सै यद गोस अली', 'Sai Yada Gosa Alee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7719995533' OR username = '7719995533');
SET @user_id := (SELECT id FROM users WHERE mobile = '7719995533' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '773' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0151', 'मे.परीवार ट्रेडिंग कंपनी', 'M/s. Pareevaar Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '151', '773', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '773' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.परीवार ट्रेडिंग कंपनी', 'M/s. Pareevaar Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '151', '773', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 152 | Mobile 9822411749 | श्री.संजय रघनु ाथ िगरमे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('774', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822411749', NULL, '9822411749', '3f450ab0110c56acbf2305deb447a697e4a84e2b30e0369a5a3f4457916f0ff7', 'श्री.संजय रघनु ाथ िगरमे', 'Shri. Sanjay Raghanu Aath Gira M/s.', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822411749' OR username = '9822411749');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822411749' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '774' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0152', 'मे.एस.आर. िगरमे', 'M/s. Esa.aara. Gira M/s.', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '152', '774', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '774' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.एस.आर. िगरमे', 'M/s. Esa.aara. Gira M/s.', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '152', '774', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 153 | Mobile 9970437680 | श्री.अंकुश महादेव झेंडे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('776', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9970437680', NULL, '9970437680', 'b51d3cf3ef17843db591b634e5bd5f60d0de4d4af473fc72490328c212d20307', 'श्री.अंकुश महादेव झेंडे', 'Shra Shri. Ankush Mahaadev Jhende', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9970437680' OR username = '9970437680');
SET @user_id := (SELECT id FROM users WHERE mobile = '9970437680' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '776' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0153', 'मे.अंकुश महादेव झेंडे', 'M/s. Ankush Mahaadev Jhende', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '153', '776', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '776' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.अंकुश महादेव झेंडे', 'M/s. Ankush Mahaadev Jhende', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '153', '776', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 154 | Mobile 9922857007 | श्री.एकनाथ बाजीराव यादव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('777', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9922857007', NULL, '9922857007', 'b0475e72188e2254e3800f724107e71870972a9e2576e561297061bf8ebe0ab6', 'श्री.एकनाथ बाजीराव यादव', 'Shri. Ekanaath Baajeeraav Yaadav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9922857007' OR username = '9922857007');
SET @user_id := (SELECT id FROM users WHERE mobile = '9922857007' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '777' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0154', 'मे.भुले र ट्रेडिंग कंपनी', 'M/s. Bhule Ra Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '154', '777', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '777' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.भुले र ट्रेडिंग कंपनी', 'M/s. Bhule Ra Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '154', '777', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 155 | Mobile 9860273737 | श्री.निलेश पंिडत पवार
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('778', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('779', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9860273737', NULL, '9860273737', '32ccd0cd739c505370f979d3ccaece00d453a53a6186be524e90dbbc28c147d7', 'श्री.निलेश पंिडत पवार', 'Shri. Naliesh Pandit Pavaar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9860273737' OR username = '9860273737');
SET @user_id := (SELECT id FROM users WHERE mobile = '9860273737' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '778' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0155', 'मे.रोकडोबा ट्रेडिंग कंपनी', 'M/s. Rokadob Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '155', '778', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '778' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रोकडोबा ट्रेडिंग कंपनी', 'M/s. Rokadob Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '155', '778', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '779' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.रोकडोबा ट्रेडिंग कंपनी', 'M/s. Rokadob Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '155', '778', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 156 | Mobile 9764708285 | श्री.अरिवंद बाळू भोकसे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('780', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9764708285', NULL, '9764708285', 'c68b7dae2accf62e100ff510c1e653462584013fa8f300bcdaa7652ea25a9323', 'श्री.अरिवंद बाळू भोकसे', 'Shri. Aravind Baaloo Bhokase', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9764708285' OR username = '9764708285');
SET @user_id := (SELECT id FROM users WHERE mobile = '9764708285' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '780' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0156', 'मे.उटाणे भोकसे आणि कंपनी', 'M/s. Utaane Bhokase & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '156', '780', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '780' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.उटाणे भोकसे आणि कंपनी', 'M/s. Utaane Bhokase & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '156', '780', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 157 | Mobile 9022551549 | श्री.मोह मद अजीम रहीमानी
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('781', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9022551549', NULL, '9022551549', '903d9b6e2f8de946d7ad127b90387b8a5eae18f66eda6ef767bfaad5b8e6c839', 'श्री.मोह मद अजीम रहीमानी', 'Shri. Moha Mada Ajeem Raheemaanee', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9022551549' OR username = '9022551549');
SET @user_id := (SELECT id FROM users WHERE mobile = '9022551549' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '781' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0157', 'मे.राईन ट्रेडिंग कंपनी', 'M/s. Raaeen Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '157', '781', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '781' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.राईन ट्रेडिंग कंपनी', 'M/s. Raaeen Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '157', '781', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 158 | Mobile 9850663959 | श्री.सरु े श ध डीराम तळे कर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('782', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850663959', NULL, '9850663959', '40ca8fc11ff4e7dbad22150409916b7b1817fb32bcfab465ce61a7a176840f0a', 'श्री.सरु े श ध डीराम तळे कर', 'Shri. Saru E Sha Dha Deeraam Tale Kara', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850663959' OR username = '9850663959');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850663959' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '782' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0158', 'मे.सगं म ट्रेडर्स', 'M/s. Sagan Ma Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '158', '782', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '782' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सगं म ट्रेडर्स', 'M/s. Sagan Ma Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '158', '782', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 159 | Mobile 9372704447 | श्री.राजशेखर िभमाशंकर त डमरु
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('783', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9372704447', NULL, '9372704447', 'ea9f7fab7cb7a8988e68beeca805fc45fae941bc766e4386a64c529c4f3cb766', 'श्री.राजशेखर िभमाशंकर त डमरु', 'Shri. Raajashekhar Bhimaashankar Ta Damaru', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9372704447' OR username = '9372704447');
SET @user_id := (SELECT id FROM users WHERE mobile = '9372704447' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '783' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0159', 'मे.िवनायक ट्रेडिंग कंपनी', 'M/s. Vinaayak Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '159', '783', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '783' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िवनायक ट्रेडिंग कंपनी', 'M/s. Vinaayak Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '159', '783', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 160 | Mobile 9822020756 | श्री.राहल शिशकांत िगते
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('784', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('708', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822020756', NULL, '9822020756', '104bd72aa4a2f2f22d5c5d6cb800d8e4132a86eb31a9c494e03e15290b8baeee', 'श्री.राहल शिशकांत िगते', 'Shri. Raahal Shashikaant Gite', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822020756' OR username = '9822020756');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822020756' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '784' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0160', 'मे.िगते ट्रेडर्स', 'M/s. Gite Traders', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '160', '784', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '784' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िगते ट्रेडर्स', 'M/s. Gite Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '160', '784', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '708' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िगते ट्रेडर्स', 'M/s. Gite Traders', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '160', '784', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 161 | Mobile 9850553292 | श्री.अशोक उत्तमराव यादव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('785', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850553292', NULL, '9850553292', '255d57983d1b68a5bc3d829d6bb9b620dda45a4e44af288e33fdb23281b90a21', 'श्री.अशोक उत्तमराव यादव', 'Shri. Ashok Uttamaraav Yaadav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850553292' OR username = '9850553292');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850553292' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '785' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0161', 'मे.िनलाजं न ट्रेडिंग कंपनी', 'M/s. Nilaajan Na Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '161', '785', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '785' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िनलाजं न ट्रेडिंग कंपनी', 'M/s. Nilaajan Na Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '161', '785', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 162 | Mobile 9822963252 | श्री.सुधाकर नाग पा पाटील
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('786', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822963252', NULL, '9822963252', 'ba3247d9be77ecf272631246f6131ee45ba34e715730167886047e19b34ab121', 'श्री.सुधाकर नाग पा पाटील', 'Shri. Sudhaakar Naag Pa Paateel', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822963252' OR username = '9822963252');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822963252' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '786' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0162', 'मे.मोरया ट्रेडिंग कंपनी', 'M/s. Moray Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '162', '786', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '786' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.मोरया ट्रेडिंग कंपनी', 'M/s. Moray Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '162', '786', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 163 | Mobile 9527965968 | श्री.िववेक रामचं कोलते
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('788', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9527965968', NULL, '9527965968', '4dafc5f8ba04a8f454bdb7e18d10f816c1b3138bed0e2b4c954a3b90efacb840', 'श्री.िववेक रामचं कोलते', 'Shri. Vivek Raamachan Kolate', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9527965968' OR username = '9527965968');
SET @user_id := (SELECT id FROM users WHERE mobile = '9527965968' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '788' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0163', 'मे.िववेक रामचं कोलते', 'M/s. Vivek Raamachan Kolate', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '163', '788', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '788' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.िववेक रामचं कोलते', 'M/s. Vivek Raamachan Kolate', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '163', '788', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 164 | Mobile 9850007447 | श्री.बाळासाहेब ल मण कोलते
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('789', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850007447', NULL, '9850007447', '81c2901a38698f609cb6048ab096d32037a6e8f318b1d65642b0d2eb3d407074', 'श्री.बाळासाहेब ल मण कोलते', 'Shri. Baalaasaaheb La Mana Kolate', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850007447' OR username = '9850007447');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850007447' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '789' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0164', 'मे.बाळासाहेब ल मण कोलते', 'M/s. Baalaasaaheb La Mana Kolate', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '164', '789', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '789' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बाळासाहेब ल मण कोलते', 'M/s. Baalaasaaheb La Mana Kolate', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '164', '789', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 165 | Mobile 9850120992 | श्री.मा ती पांडुरंग कामठे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('790', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850120992', NULL, '9850120992', 'fa86e3b140d5192bd7bc8175df0ad7044123f56b085342d1678df5fff06278f5', 'श्री.मा ती पांडुरंग कामठे', 'Shri. Ma Tee Paandurang Kaamathe', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850120992' OR username = '9850120992');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850120992' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '790' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0165', 'मे.सिु नल ट्रेडिंग कंपनी', 'M/s. Siu Nala Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '165', '790', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '790' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सिु नल ट्रेडिंग कंपनी', 'M/s. Siu Nala Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '165', '790', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 166 | Mobile 8423016347 | श्री.बाळासाहेब आनदं राव रा े
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('791', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '8423016347', NULL, '8423016347', 'e9c3af00b79889c75579ea7872b662c5a794202ea151162207518b9ad6d7d2d1', 'श्री.बाळासाहेब आनदं राव रा े', 'Shri. Baalaasaaheb Aanadan Raav Ra E', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '8423016347' OR username = '8423016347');
SET @user_id := (SELECT id FROM users WHERE mobile = '8423016347' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '791' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0166', 'मे.बाळासाहेब आनदं राव रा े आणि कं.', 'M/s. Baalaasaaheb Aanadan Raav Ra E & Kan.', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '166', '791', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '791' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.बाळासाहेब आनदं राव रा े आणि कं.', 'M/s. Baalaasaaheb Aanadan Raav Ra E & Kan.', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '166', '791', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 170 | Mobile 9881872796 | श्री.महेंद्र आनंद जाधव
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('796', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9881872796', NULL, '9881872796', 'b264f8a055e7d1fda33833fe06f2d75c56338248f85026ea80559b23c460c5a2', 'श्री.महेंद्र आनंद जाधव', 'Shra Shri. Mahendr Aanand Jaadhav', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9881872796' OR username = '9881872796');
SET @user_id := (SELECT id FROM users WHERE mobile = '9881872796' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '796' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0170', 'मे.आनंद तुकाराम जाधव आणि सन्स', 'M/s. Aanand Tukaaraam Jaadhav & Sons', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '170', '796', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '796' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.आनंद तुकाराम जाधव आणि सन्स', 'M/s. Aanand Tukaaraam Jaadhav & Sons', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '170', '796', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 171 | Mobile 9850143735 | सौ.शभु ांगी सुरेश होले
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('797', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('798', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('649', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9850143735', NULL, '9850143735', '7742ae7b519ee87a2550e846cdd5cbf8e983f6927da607e6f1dcd1b8f522cbee', 'सौ.शभु ांगी सुरेश होले', 'Mrs. Shabhu Aangee Suresh Hole', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9850143735' OR username = '9850143735');
SET @user_id := (SELECT id FROM users WHERE mobile = '9850143735' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '797' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0171', 'मे.सरु े श होले आणि कंपनी', 'M/s. Saru E Sha Hole & Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '171', '797', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '797' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सरु े श होले आणि कंपनी', 'M/s. Saru E Sha Hole & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '171', '797', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '798' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सरु े श होले आणि कंपनी', 'M/s. Saru E Sha Hole & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '171', '797', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '649' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.सरु े श होले आणि कंपनी', 'M/s. Saru E Sha Hole & Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '171', '797', 'submitted', 0, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 172 | Mobile 7276210684 | श्री.गणपत एकनाथ मळ ु ूक
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('799', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '7276210684', NULL, '7276210684', '11140403fbd0f31c4ac42746215563208bd49e0d5a51df8e84a1ba18c0ac70cf', 'श्री.गणपत एकनाथ मळ ु ूक', 'Shri. Ganapat Ekanaath Mala U Ooka', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '7276210684' OR username = '7276210684');
SET @user_id := (SELECT id FROM users WHERE mobile = '7276210684' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '799' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0172', 'मे.आयषु ट्रेडिंग कंपनी', 'M/s. Aayashu Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '172', '799', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '799' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.आयषु ट्रेडिंग कंपनी', 'M/s. Aayashu Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '172', '799', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 173 | Mobile 9822025457 | श्री.राहल िव ल बोरकर
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('800', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9822025457', NULL, '9822025457', '5e67ea20406679f9e4941cd5d5832f168c1c8229544f6df38e6e9e780749e297', 'श्री.राहल िव ल बोरकर', 'Shri. Raahal Vi La Borakar', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9822025457' OR username = '9822025457');
SET @user_id := (SELECT id FROM users WHERE mobile = '9822025457' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '800' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0173', 'मे.एस.आर. ट्रेडिंग कंपनी', 'M/s. Esa.aara. Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '173', '800', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '800' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.एस.आर. ट्रेडिंग कंपनी', 'M/s. Esa.aara. Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '173', '800', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 174 | Mobile 9970958550 | श्री.संतोष रामदास ितखोळे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('801', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9970958550', NULL, '9970958550', 'ab2c745a3ed541cb248940d56d282162971994df828c45792773c48c4b98c071', 'श्री.संतोष रामदास ितखोळे', 'Shri. Santosh Raamadaas Tikhole', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9970958550' OR username = '9970958550');
SET @user_id := (SELECT id FROM users WHERE mobile = '9970958550' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '801' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0174', 'मे.माटोबा ट्रेडिंग कंपनी', 'M/s. Maatob Trading Company', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '174', '801', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '801' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.माटोबा ट्रेडिंग कंपनी', 'M/s. Maatob Trading Company', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '174', '801', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 176 | Mobile 9763724709 | श्री.संजय िदनकर भ डवे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('803', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9763724709', NULL, '9763724709', '8fc643710a9036988400c3fe67084c27517506454b52dce77ab57c1b31b14bed', 'श्री.संजय िदनकर भ डवे', 'Shri. Sanjay Dinakar Bha Dave', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9763724709' OR username = '9763724709');
SET @user_id := (SELECT id FROM users WHERE mobile = '9763724709' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '803' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0176', 'मे.संजय िदनकर भ डवे', 'M/s. Sanjay Dinakar Bha Dave', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '176', '803', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '803' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.संजय िदनकर भ डवे', 'M/s. Sanjay Dinakar Bha Dave', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '176', '803', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

-- Row 177 | Mobile 9766041974 | श्री.किसनराव क िडबा काळाणे
INSERT INTO market_galas (gala_number, section_name, status) VALUES ('804', 'कांदा-बटाटा', 'occupied') ON DUPLICATE KEY UPDATE section_name = VALUES(section_name), status = 'occupied';
INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, full_name_en, preferred_language, status, mobile_verified_at, created_at, updated_at)
SELECT @trader_role_id, '9766041974', NULL, '9766041974', 'deeb083d3406ae6ec94e8554525c1a9618a85e3332e88512ca24f31ad2089b5f', 'श्री.किसनराव क िडबा काळाणे', 'Shri. Kasinaraav Ka Diba Kaalaane', 'mr', 'pending', NOW(), NOW(), NOW()
WHERE @trader_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE mobile = '9766041974' OR username = '9766041974');
SET @user_id := (SELECT id FROM users WHERE mobile = '9766041974' LIMIT 1);
SET @primary_gala_id := (SELECT id FROM market_galas WHERE gala_number = '804' LIMIT 1);
INSERT INTO traders (user_id, trader_code, business_name, business_name_en, market_registration_number, gala_id, business_category_id, address_line1, village_city, district, state, association_sequence_number, association_registration_number, verification_status, created_at, updated_at)
SELECT @user_id, 'ONP-0177', 'मे.किसनराव क िडबा काळाणे', 'M/s. Kasinaraav Ka Diba Kaalaane', NULL, @primary_gala_id, @onion_potato_category_id, 'Market Yard, Saswad', 'Saswad', 'Pune', 'Maharashtra', '177', '804', 'submitted', NOW(), NOW()
WHERE @user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traders WHERE user_id = @user_id);
SET @trader_id := (SELECT id FROM traders WHERE user_id = @user_id LIMIT 1);
SET @gala_id := (SELECT id FROM market_galas WHERE gala_number = '804' LIMIT 1);
INSERT INTO trader_galas (trader_id, gala_id, business_name, business_name_en, market_section, business_category_id, market_registration_number, licence_number, association_sequence_number, association_registration_number, status, is_primary, created_at, updated_at)
SELECT @trader_id, @gala_id, 'मे.किसनराव क िडबा काळाणे', 'M/s. Kasinaraav Ka Diba Kaalaane', 'कांदा-बटाटा', @onion_potato_category_id, NULL, NULL, '177', '804', 'submitted', 1, NOW(), NOW()
WHERE @trader_id IS NOT NULL AND @gala_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM trader_galas WHERE trader_id = @trader_id AND gala_id = @gala_id);

COMMIT;

SELECT COUNT(*) AS onion_potato_import_users FROM users u JOIN traders t ON t.user_id = u.id WHERE t.trader_code LIKE 'ONP-%';
SELECT COUNT(*) AS onion_potato_import_submitted_traders FROM traders WHERE trader_code LIKE 'ONP-%' AND verification_status = 'submitted';
SELECT COUNT(*) AS onion_potato_import_submitted_galas FROM trader_galas tg JOIN traders t ON t.id = tg.trader_id WHERE tg.market_section = 'कांदा-बटाटा' AND tg.status = 'submitted';
