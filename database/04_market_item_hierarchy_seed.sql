-- Market item hierarchy + practical fruit/vegetable subtype seed.
-- Safe/idempotent: does not delete or reset existing market_items or market_prices.

SET @has_parent_id := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'market_items' AND COLUMN_NAME = 'parent_id'
);
SET @ddl := IF(@has_parent_id = 0, 'ALTER TABLE market_items ADD COLUMN parent_id BIGINT UNSIGNED NULL AFTER variety', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_item_type := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'market_items' AND COLUMN_NAME = 'item_type'
);
SET @ddl := IF(@has_item_type = 0, "ALTER TABLE market_items ADD COLUMN item_type ENUM('main','subtype') NOT NULL DEFAULT 'main' AFTER parent_id", 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_parent_idx := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'market_items' AND INDEX_NAME = 'idx_market_items_parent'
);
SET @ddl := IF(@has_parent_idx = 0, 'ALTER TABLE market_items ADD INDEX idx_market_items_parent (parent_id, is_active, deleted_at, display_order)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_parent_fk := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = 'fk_market_items_parent'
);
SET @ddl := IF(@has_parent_fk = 0, 'ALTER TABLE market_items ADD CONSTRAINT fk_market_items_parent FOREIGN KEY (parent_id) REFERENCES market_items(id) ON DELETE SET NULL', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE market_items
SET item_type = IF(parent_id IS NULL, 'main', 'subtype')
WHERE item_type IS NULL OR item_type NOT IN ('main','subtype');

CREATE TEMPORARY TABLE IF NOT EXISTS market_item_hierarchy_seed (
  category ENUM('vegetable','fruit') NOT NULL,
  parent_en VARCHAR(120) NOT NULL,
  parent_mr VARCHAR(120) NOT NULL,
  child_en VARCHAR(120) NOT NULL,
  child_mr VARCHAR(120) NOT NULL,
  unit VARCHAR(40) NOT NULL DEFAULT 'Kg',
  parent_order INT NOT NULL,
  child_order INT NOT NULL
);
TRUNCATE TABLE market_item_hierarchy_seed;

INSERT INTO market_item_hierarchy_seed (category, parent_en, parent_mr, child_en, child_mr, unit, parent_order, child_order) VALUES
('fruit','Mango','आंबा','Hapus / Alphonso','हापूस','Kg',101,1),
('fruit','Mango','आंबा','Kesar','केसर','Kg',101,2),
('fruit','Mango','आंबा','Totapuri','तोतापुरी','Kg',101,3),
('fruit','Mango','आंबा','Dasheri','दशहरी','Kg',101,4),
('fruit','Mango','आंबा','Langra','लंगडा','Kg',101,5),
('fruit','Mango','आंबा','Pairi','पायरी','Kg',101,6),
('fruit','Mango','आंबा','Neelam','नीलम','Kg',101,7),
('fruit','Mango','आंबा','Rajapuri','राजापुरी','Kg',101,8),
('fruit','Mango','आंबा','Badami','बदामी','Kg',101,9),
('fruit','Mango','आंबा','Chausa','चौसा','Kg',101,10),
('fruit','Banana','केळी','Grand Naine / G9','ग्रँड नैन','Dozen',102,1),
('fruit','Banana','केळी','Yelakki','येलक्की','Dozen',102,2),
('fruit','Banana','केळी','Robusta','रोबस्टा','Dozen',102,3),
('fruit','Banana','केळी','Red Banana','लाल केळी','Dozen',102,4),
('fruit','Banana','केळी','Nendran','नेन्द्रन','Dozen',102,5),
('fruit','Apple','सफरचंद','Royal Delicious','रॉयल डिलिशस','Kg',103,1),
('fruit','Apple','सफरचंद','Red Delicious','रेड डिलिशस','Kg',103,2),
('fruit','Apple','सफरचंद','Golden Delicious','गोल्डन डिलिशस','Kg',103,3),
('fruit','Apple','सफरचंद','Gala','गाला','Kg',103,4),
('fruit','Apple','सफरचंद','Fuji','फुजी','Kg',103,5),
('fruit','Apple','सफरचंद','Shimla Apple','शिमला सफरचंद','Kg',103,6),
('fruit','Orange','संत्रे','Nagpur Orange','नागपूर संत्रे','Kg',104,1),
('fruit','Orange','संत्रे','Mandarin','मँडरीन','Kg',104,2),
('fruit','Orange','संत्रे','Kinnow','किन्नू','Kg',104,3),
('fruit','Pomegranate','डाळिंब','Bhagwa','भगवा','Kg',105,1),
('fruit','Pomegranate','डाळिंब','Ganesh','गणेश','Kg',105,2),
('fruit','Grapes','द्राक्षे','Thompson Seedless','थॉम्पसन सीडलेस','Kg',106,1),
('fruit','Grapes','द्राक्षे','Sonaka','सोनाका','Kg',106,2),
('fruit','Grapes','द्राक्षे','Black Grapes','काळी द्राक्षे','Kg',106,3),
('vegetable','Onion','कांदा','Red Onion','लाल कांदा','Kg',1,1),
('vegetable','Onion','कांदा','White Onion','पांढरा कांदा','Kg',1,2),
('vegetable','Onion','कांदा','Small Onion','छोटा कांदा','Kg',1,3),
('vegetable','Onion','कांदा','Bangalore Rose Onion','बेंगळुरू रोज कांदा','Kg',1,4),
('vegetable','Potato','बटाटा','Jyoti','ज्योती','Kg',2,1),
('vegetable','Potato','बटाटा','Kufri Pukhraj','कुफरी पुखराज','Kg',2,2),
('vegetable','Potato','बटाटा','Chipsona','चिपसोना','Kg',2,3),
('vegetable','Tomato','टोमॅटो','Hybrid','हायब्रिड','Kg',3,1),
('vegetable','Tomato','टोमॅटो','Desi','देशी','Kg',3,2),
('vegetable','Tomato','टोमॅटो','Cherry Tomato','चेरी टोमॅटो','Kg',3,3),
('vegetable','Brinjal','वांगी','Purple Long','जांभळी लांब','Kg',4,1),
('vegetable','Brinjal','वांगी','Purple Round','जांभळी गोल','Kg',4,2),
('vegetable','Brinjal','वांगी','Green Brinjal','हिरवी वांगी','Kg',4,3),
('vegetable','Chilli','मिरची','Green Chilli','हिरवी मिरची','Kg',5,1),
('vegetable','Chilli','मिरची','Bhavnagari','भावनगरी','Kg',5,2),
('vegetable','Capsicum','ढोबळी मिरची','Green Capsicum','हिरवी ढोबळी','Kg',6,1),
('vegetable','Capsicum','ढोबळी मिरची','Red Capsicum','लाल ढोबळी','Kg',6,2),
('vegetable','Cauliflower','फ्लॉवर','White Cauliflower','पांढरा फ्लॉवर','Kg',7,1),
('vegetable','Cabbage','कोबी','Green Cabbage','हिरवी कोबी','Kg',8,1),
('vegetable','Okra / Bhindi','भेंडी','Green Long','हिरवी लांब','Kg',9,1),
('vegetable','Cucumber','काकडी','Green Cucumber','हिरवी काकडी','Kg',10,1),
('vegetable','Carrot','गाजर','Red Carrot','लाल गाजर','Kg',11,1),
('vegetable','Garlic','लसूण','White Garlic','पांढरा लसूण','Kg',12,1),
('vegetable','Ginger','आले','Fresh Ginger','ताजे आले','Kg',13,1),
('vegetable','Coriander','कोथिंबीर','Local','स्थानिक','Bunch',14,1),
('vegetable','Spinach','पालक','Local','स्थानिक','Bunch',15,1);

INSERT INTO market_items (category, name_en, name_mr, variety, parent_id, item_type, default_unit, display_order, is_active)
SELECT s.category, s.parent_en, s.parent_mr, NULL, NULL, 'main', s.unit, MIN(s.parent_order), 1
FROM market_item_hierarchy_seed s
WHERE NOT EXISTS (
  SELECT 1 FROM market_items mi
  WHERE mi.category = s.category
    AND mi.name_en = s.parent_en
    AND mi.deleted_at IS NULL
    AND mi.parent_id IS NULL
)
GROUP BY s.category, s.parent_en, s.parent_mr, s.unit;

UPDATE market_items mi
JOIN (SELECT category, parent_en, MIN(parent_order) AS parent_order FROM market_item_hierarchy_seed GROUP BY category, parent_en) s
  ON s.category = mi.category AND s.parent_en = mi.name_en
SET mi.item_type = 'main', mi.display_order = LEAST(mi.display_order, s.parent_order)
WHERE mi.parent_id IS NULL AND mi.deleted_at IS NULL;

INSERT INTO market_items (category, name_en, name_mr, variety, parent_id, item_type, default_unit, display_order, is_active)
SELECT s.category, s.child_en, s.child_mr, s.parent_en, parent.id, 'subtype', s.unit, (s.parent_order * 100 + s.child_order), 1
FROM market_item_hierarchy_seed s
JOIN market_items parent
  ON parent.category = s.category
 AND parent.name_en = s.parent_en
 AND parent.parent_id IS NULL
 AND parent.deleted_at IS NULL
WHERE NOT EXISTS (
  SELECT 1 FROM market_items child
  WHERE child.category = s.category
    AND child.parent_id = parent.id
    AND child.name_en = s.child_en
    AND child.deleted_at IS NULL
);

DROP TEMPORARY TABLE IF EXISTS market_item_hierarchy_seed;
