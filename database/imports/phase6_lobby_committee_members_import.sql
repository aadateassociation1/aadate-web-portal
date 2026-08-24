-- Phase 6 import: Lobby / committee members from Marketyard_Members_List.docx
-- IMPORTANT: Run after backup. This script only adds missing committee members and keeps existing records/photos.
SET NAMES utf8mb4;
START TRANSACTION;

SET @designation_mr_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'committee_members'
    AND COLUMN_NAME = 'designation_mr'
);
SET @designation_mr_sql := IF(
  @designation_mr_exists = 0,
  'ALTER TABLE committee_members ADD COLUMN designation_mr VARCHAR(100) NULL',
  'SELECT 1'
);
PREPARE designation_mr_stmt FROM @designation_mr_sql;
EXECUTE designation_mr_stmt;
DEALLOCATE PREPARE designation_mr_stmt;

-- To avoid duplicate rows, each insert checks the English name + designation.

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Sandip Katke', 'संदिप कटके', 'Vice President (Vegetable)', 'उपाध्यक्ष (भाजीपाला)', NULL, NULL, NULL, 10, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Sandip Katke' AND designation = 'Vice President (Vegetable)');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Dipak Lohakare', 'दिपक लोहकरे', 'Co-opted Director', 'स्विकृत संचालक', NULL, NULL, NULL, 20, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Dipak Lohakare' AND designation = 'Co-opted Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Rahul Bhosale', 'राहुल भोसले', 'Director', 'संचालक', NULL, NULL, NULL, 30, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Rahul Bhosale' AND designation = 'Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Sambhaji Khedekar', 'संभाजी खेडेकर', 'Co-opted Director', 'स्विकृत संचालक', NULL, NULL, NULL, 40, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Sambhaji Khedekar' AND designation = 'Co-opted Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Rajendra Korpe', 'राजेंद्र कोरपे', 'Vice President (Onion, Potato)', 'उपाध्यक्ष (कांदा, बटाटा)', NULL, NULL, NULL, 50, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Rajendra Korpe' AND designation = 'Vice President (Onion, Potato)');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Yogesh Yadav', 'योगेश यादव', 'Treasurer', 'खजिनदार', NULL, NULL, NULL, 60, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Yogesh Yadav' AND designation = 'Treasurer');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Sanjay Vakhare', 'संजय वखारे', 'Director', 'संचालक', NULL, NULL, NULL, 70, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Sanjay Vakhare' AND designation = 'Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Shankar Bhalerao', 'शंकर भालेराव', 'Co-opted Director', 'स्विकृत संचालक', NULL, NULL, NULL, 80, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Shankar Bhalerao' AND designation = 'Co-opted Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Sharad Gawade', 'शरद गावडे', 'Director', 'संचालक', NULL, NULL, NULL, 90, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Sharad Gawade' AND designation = 'Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Santosh Kumbharkar', 'संतोष कुंभारकर', 'Director (Vice President)', 'संचालक (उपाध्यक्ष)', NULL, NULL, NULL, 100, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Santosh Kumbharkar' AND designation = 'Director (Vice President)');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Ravi Kolte', 'रवी कोलते', 'Director', 'संचालक', NULL, NULL, NULL, 110, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Ravi Kolte' AND designation = 'Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Dipak Kanade', 'दिपक कानडे', 'Director', 'संचालक', NULL, NULL, NULL, 120, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Dipak Kanade' AND designation = 'Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Ramabhau Wad (Ganesh) Waykar', 'रामाभाऊ वाड (गणेश) वायकर', 'Member', 'सदस्य', NULL, NULL, NULL, 130, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Ramabhau Wad (Ganesh) Waykar' AND designation = 'Member');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Aniket Shet Ghodekar', 'अनिकेत शेट घोडेकर', 'Member', 'सदस्य', NULL, NULL, NULL, 140, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Aniket Shet Ghodekar' AND designation = 'Member');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Rajushet (Ganesh) Waykar', 'राजुशेट (गणेश) वायकर', 'Member', 'सदस्य', NULL, NULL, NULL, 150, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Rajushet (Ganesh) Waykar' AND designation = 'Member');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Sagar Kedare', 'सागर केदारे', 'Member', 'सदस्य', NULL, NULL, NULL, 160, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Sagar Kedare' AND designation = 'Member');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Rohan Jadhav', 'रोहन जाधव', 'Vice President', 'उपाध्यक्ष', NULL, NULL, NULL, 170, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Rohan Jadhav' AND designation = 'Vice President');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Mahesh Shirke', 'महेश शिरके', 'Secretary', 'सचिव', NULL, NULL, NULL, 180, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Mahesh Shirke' AND designation = 'Secretary');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Raju Sheth Bhole', 'राजु शेठ भोळे', 'Director', 'संचालक', NULL, NULL, NULL, 190, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Raju Sheth Bhole' AND designation = 'Director');

INSERT INTO committee_members (full_name, name_mr, designation, designation_mr, gala_number, term_label, message, display_order, status)
SELECT 'Shri. Raju Sheth Suryawanshi', 'राजु शेठ सुर्यवंशी', 'Director', 'संचालक', NULL, NULL, NULL, 200, 'active'
WHERE NOT EXISTS (SELECT 1 FROM committee_members WHERE full_name = 'Shri. Raju Sheth Suryawanshi' AND designation = 'Director');

COMMIT;
