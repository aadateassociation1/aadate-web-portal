-- Update Onion-Potato English spellings after Phase 3 import
-- Scope: English display names only. Does not change login, password, mobile, status, Marathi names, or approval state.
-- Missing-phone rows are intentionally skipped because they were not imported.
SET NAMES utf8mb4;
START TRANSACTION;

-- Serial 4 | Mobile 9922752117 | M/s. Hemant Traders | Shri. Hemant Dattatray Shete
UPDATE users SET full_name_en = 'Shri. Hemant Dattatray Shete', updated_at = NOW() WHERE mobile = '9922752117';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Hemant Traders', t.updated_at = NOW() WHERE u.mobile = '9922752117' AND t.association_sequence_number = '4';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Hemant Traders', tg.updated_at = NOW() WHERE u.mobile = '9922752117' AND tg.association_sequence_number = '4' AND mg.gala_number IN ('48', '49');

-- Serial 7 | Mobile 9822197724 | M/s. Dudhale Trading Company | Shri. Prashant Dattatray Dudhale
UPDATE users SET full_name_en = 'Shri. Prashant Dattatray Dudhale', updated_at = NOW() WHERE mobile = '9822197724';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Dudhale Trading Company', t.updated_at = NOW() WHERE u.mobile = '9822197724' AND t.association_sequence_number = '7';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Dudhale Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9822197724' AND tg.association_sequence_number = '7' AND mg.gala_number IN ('52');

-- Serial 8 | Mobile 9850155531 | M/s. Jayvijay Traders | Shri. Nilesh Shankarrao Rajgire
UPDATE users SET full_name_en = 'Shri. Nilesh Shankarrao Rajgire', updated_at = NOW() WHERE mobile = '9850155531';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Jayvijay Traders', t.updated_at = NOW() WHERE u.mobile = '9850155531' AND t.association_sequence_number = '8';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Jayvijay Traders', tg.updated_at = NOW() WHERE u.mobile = '9850155531' AND tg.association_sequence_number = '8' AND mg.gala_number IN ('53');

-- Serial 10 | Mobile 8698920227 | M/s. Dattatray Kisan Kolate | Shri. Dattatray Kisan Kolate
UPDATE users SET full_name_en = 'Shri. Dattatray Kisan Kolate', updated_at = NOW() WHERE mobile = '8698920227';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Dattatray Kisan Kolate', t.updated_at = NOW() WHERE u.mobile = '8698920227' AND t.association_sequence_number = '10';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Dattatray Kisan Kolate', tg.updated_at = NOW() WHERE u.mobile = '8698920227' AND tg.association_sequence_number = '10' AND mg.gala_number IN ('55');

-- Serial 11 | Mobile 9503760511 | M/s. Pune Trading Company | Shri. Nilesh Shankar Pol
UPDATE users SET full_name_en = 'Shri. Nilesh Shankar Pol', updated_at = NOW() WHERE mobile = '9503760511';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Pune Trading Company', t.updated_at = NOW() WHERE u.mobile = '9503760511' AND t.association_sequence_number = '11';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Pune Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9503760511' AND tg.association_sequence_number = '11' AND mg.gala_number IN ('57');

-- Serial 13 | Mobile 9822022007 | M/s. Kishor Kunjir & Company | Shri. Kishor Vasant Kunjir
UPDATE users SET full_name_en = 'Shri. Kishor Vasant Kunjir', updated_at = NOW() WHERE mobile = '9822022007';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Kishor Kunjir & Company', t.updated_at = NOW() WHERE u.mobile = '9822022007' AND t.association_sequence_number = '13';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Kishor Kunjir & Company', tg.updated_at = NOW() WHERE u.mobile = '9822022007' AND tg.association_sequence_number = '13' AND mg.gala_number IN ('60', '61', '155', '156', '444');

-- Serial 24 | Mobile 9822171999 | M/s. Mahadev Bhagwan Kumbharkar & Sons | Shri. Dipak Mahadev Kumbharkar
UPDATE users SET full_name_en = 'Shri. Dipak Mahadev Kumbharkar', updated_at = NOW() WHERE mobile = '9822171999';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Mahadev Bhagwan Kumbharkar & Sons', t.updated_at = NOW() WHERE u.mobile = '9822171999' AND t.association_sequence_number = '24';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Mahadev Bhagwan Kumbharkar & Sons', tg.updated_at = NOW() WHERE u.mobile = '9822171999' AND tg.association_sequence_number = '24' AND mg.gala_number IN ('144');

-- Serial 31 | Mobile 9860489321 | M/s. Gandhi & Company | Shri. Anand Rameshlal Gandhi
UPDATE users SET full_name_en = 'Shri. Anand Rameshlal Gandhi', updated_at = NOW() WHERE mobile = '9860489321';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Gandhi & Company', t.updated_at = NOW() WHERE u.mobile = '9860489321' AND t.association_sequence_number = '31';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Gandhi & Company', tg.updated_at = NOW() WHERE u.mobile = '9860489321' AND tg.association_sequence_number = '31' AND mg.gala_number IN ('151');

-- Serial 32 | Mobile 9850489321 | M/s. Rameshlal Bhagwandas Gandhi | Shri. Mahavir Rameshlal Gandhi
UPDATE users SET full_name_en = 'Shri. Mahavir Rameshlal Gandhi', updated_at = NOW() WHERE mobile = '9850489321';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Rameshlal Bhagwandas Gandhi', t.updated_at = NOW() WHERE u.mobile = '9850489321' AND t.association_sequence_number = '32';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Rameshlal Bhagwandas Gandhi', tg.updated_at = NOW() WHERE u.mobile = '9850489321' AND tg.association_sequence_number = '32' AND mg.gala_number IN ('152');

-- Serial 33 | Mobile 9850950995 | M/s. Chandrakant Gangaram Ghogare | Shri. Chetan Chandrakant Ghogare
UPDATE users SET full_name_en = 'Shri. Chetan Chandrakant Ghogare', updated_at = NOW() WHERE mobile = '9850950995';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Chandrakant Gangaram Ghogare', t.updated_at = NOW() WHERE u.mobile = '9850950995' AND t.association_sequence_number = '33';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Chandrakant Gangaram Ghogare', tg.updated_at = NOW() WHERE u.mobile = '9850950995' AND tg.association_sequence_number = '33' AND mg.gala_number IN ('153');

-- Serial 35 | Mobile 9822061949 | M/s. Dattatray Thorat & Company | Shri. Dattatray Vitthal Thorat
UPDATE users SET full_name_en = 'Shri. Dattatray Vitthal Thorat', updated_at = NOW() WHERE mobile = '9822061949';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Dattatray Thorat & Company', t.updated_at = NOW() WHERE u.mobile = '9822061949' AND t.association_sequence_number = '35';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Dattatray Thorat & Company', tg.updated_at = NOW() WHERE u.mobile = '9822061949' AND tg.association_sequence_number = '35' AND mg.gala_number IN ('158');

-- Serial 36 | Mobile 9850100049 | M/s. Thorat & Company | Shri. Tejas Dattatray Thorat
UPDATE users SET full_name_en = 'Shri. Tejas Dattatray Thorat', updated_at = NOW() WHERE mobile = '9850100049';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Thorat & Company', t.updated_at = NOW() WHERE u.mobile = '9850100049' AND t.association_sequence_number = '36';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Thorat & Company', tg.updated_at = NOW() WHERE u.mobile = '9850100049' AND tg.association_sequence_number = '36' AND mg.gala_number IN ('159');

-- Serial 38 | Mobile 9850957492 | M/s. Saurabh Mukund Khaire | Shri. Mukund Tukaram Khaire
UPDATE users SET full_name_en = 'Shri. Mukund Tukaram Khaire', updated_at = NOW() WHERE mobile = '9850957492';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Saurabh Mukund Khaire', t.updated_at = NOW() WHERE u.mobile = '9850957492' AND t.association_sequence_number = '38';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Saurabh Mukund Khaire', tg.updated_at = NOW() WHERE u.mobile = '9850957492' AND tg.association_sequence_number = '38' AND mg.gala_number IN ('161');

-- Serial 50 | Mobile 9822940668 | M/s. Kisan Bapuji Chavan | Shri. Dattatray Kisan Chavan
UPDATE users SET full_name_en = 'Shri. Dattatray Kisan Chavan', updated_at = NOW() WHERE mobile = '9822940668';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Kisan Bapuji Chavan', t.updated_at = NOW() WHERE u.mobile = '9822940668' AND t.association_sequence_number = '50';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Kisan Bapuji Chavan', tg.updated_at = NOW() WHERE u.mobile = '9822940668' AND tg.association_sequence_number = '50' AND mg.gala_number IN ('267');

-- Serial 51 | Mobile 9850747373 | M/s. Atul Morade & Company | Shri. Atul Nivrutti Morade
UPDATE users SET full_name_en = 'Shri. Atul Nivrutti Morade', updated_at = NOW() WHERE mobile = '9850747373';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Atul Morade & Company', t.updated_at = NOW() WHERE u.mobile = '9850747373' AND t.association_sequence_number = '51';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Atul Morade & Company', tg.updated_at = NOW() WHERE u.mobile = '9850747373' AND tg.association_sequence_number = '51' AND mg.gala_number IN ('268');

-- Serial 54 | Mobile 9822849496 | M/s. Suyakant Vitthal Thorat | Shri. Tushar Suyakant Thorat
UPDATE users SET full_name_en = 'Shri. Tushar Suyakant Thorat', updated_at = NOW() WHERE mobile = '9822849496';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Suyakant Vitthal Thorat', t.updated_at = NOW() WHERE u.mobile = '9822849496' AND t.association_sequence_number = '54';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Suyakant Vitthal Thorat', tg.updated_at = NOW() WHERE u.mobile = '9822849496' AND tg.association_sequence_number = '54' AND mg.gala_number IN ('272', '424');

-- Serial 57 | Mobile 9850508986 | M/s. Sancheti Agency | Smt. Ujwala Ashok Sancheti
UPDATE users SET full_name_en = 'Smt. Ujwala Ashok Sancheti', updated_at = NOW() WHERE mobile = '9850508986';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Sancheti Agency', t.updated_at = NOW() WHERE u.mobile = '9850508986' AND t.association_sequence_number = '57';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Sancheti Agency', tg.updated_at = NOW() WHERE u.mobile = '9850508986' AND tg.association_sequence_number = '57' AND mg.gala_number IN ('275', '277');

-- Serial 65 | Mobile 9822883038 | M/s. Vaishnavi Trading Company | Shri. Nilesh Maruti Shinde
UPDATE users SET full_name_en = 'Shri. Nilesh Maruti Shinde', updated_at = NOW() WHERE mobile = '9822883038';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Vaishnavi Trading Company', t.updated_at = NOW() WHERE u.mobile = '9822883038' AND t.association_sequence_number = '65';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Vaishnavi Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9822883038' AND tg.association_sequence_number = '65' AND mg.gala_number IN ('295');

-- Serial 76 | Mobile 9850634721 | M/s. Ramane & Das | Shri. Sakharam Laxman Ramane
UPDATE users SET full_name_en = 'Shri. Sakharam Laxman Ramane', updated_at = NOW() WHERE mobile = '9850634721';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Ramane & Das', t.updated_at = NOW() WHERE u.mobile = '9850634721' AND t.association_sequence_number = '76';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Ramane & Das', tg.updated_at = NOW() WHERE u.mobile = '9850634721' AND tg.association_sequence_number = '76' AND mg.gala_number IN ('422');

-- Serial 77 | Mobile 9822343207 | M/s. Krishna Shankar Devkar | Shri. Sunil Krishna Devkar
UPDATE users SET full_name_en = 'Shri. Sunil Krishna Devkar', updated_at = NOW() WHERE mobile = '9822343207';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Krishna Shankar Devkar', t.updated_at = NOW() WHERE u.mobile = '9822343207' AND t.association_sequence_number = '77';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Krishna Shankar Devkar', tg.updated_at = NOW() WHERE u.mobile = '9822343207' AND tg.association_sequence_number = '77' AND mg.gala_number IN ('423');

-- Serial 87 | Mobile 9766264126 | M/s. Bhimashankar Trading Company | Shri. Swapnil Genbhau Thorat
UPDATE users SET full_name_en = 'Shri. Swapnil Genbhau Thorat', updated_at = NOW() WHERE mobile = '9766264126';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Bhimashankar Trading Company', t.updated_at = NOW() WHERE u.mobile = '9766264126' AND t.association_sequence_number = '87';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Bhimashankar Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9766264126' AND tg.association_sequence_number = '87' AND mg.gala_number IN ('448');

-- Serial 91 | Mobile 9922614579 | M/s. Gauri Trading Company | Shri. Mahesh Subhash Bhadve
UPDATE users SET full_name_en = 'Shri. Mahesh Subhash Bhadve', updated_at = NOW() WHERE mobile = '9922614579';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Gauri Trading Company', t.updated_at = NOW() WHERE u.mobile = '9922614579' AND t.association_sequence_number = '91';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Gauri Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9922614579' AND tg.association_sequence_number = '91' AND mg.gala_number IN ('642');

-- Serial 92 | Mobile 9822064979 | M/s. Vishnu Dagdu Khutwad | Shri. Sunil Vishnu Khutwad
UPDATE users SET full_name_en = 'Shri. Sunil Vishnu Khutwad', updated_at = NOW() WHERE mobile = '9822064979';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Vishnu Dagdu Khutwad', t.updated_at = NOW() WHERE u.mobile = '9822064979' AND t.association_sequence_number = '92';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Vishnu Dagdu Khutwad', tg.updated_at = NOW() WHERE u.mobile = '9822064979' AND tg.association_sequence_number = '92' AND mg.gala_number IN ('643', '644');

-- Serial 107 | Mobile 9850917407 | M/s. Sadashiv Laxman Shinde & Company | Shri. Rahul Mahadev Shinde
UPDATE users SET full_name_en = 'Shri. Rahul Mahadev Shinde', updated_at = NOW() WHERE mobile = '9850917407';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Sadashiv Laxman Shinde & Company', t.updated_at = NOW() WHERE u.mobile = '9850917407' AND t.association_sequence_number = '107';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Sadashiv Laxman Shinde & Company', tg.updated_at = NOW() WHERE u.mobile = '9850917407' AND tg.association_sequence_number = '107' AND mg.gala_number IN ('715');

-- Serial 108 | Mobile 9822216518 | M/s. Anchaleshwar Traders | Shri. Tulshiram Mahadev Pandhare
UPDATE users SET full_name_en = 'Shri. Tulshiram Mahadev Pandhare', updated_at = NOW() WHERE mobile = '9822216518';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Anchaleshwar Traders', t.updated_at = NOW() WHERE u.mobile = '9822216518' AND t.association_sequence_number = '108';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Anchaleshwar Traders', tg.updated_at = NOW() WHERE u.mobile = '9822216518' AND tg.association_sequence_number = '108' AND mg.gala_number IN ('716');

-- Serial 117 | Mobile 8087613091 | M/s. Arun Tukaram Ghodake | Shri. Ashish Arun Ghodake
UPDATE users SET full_name_en = 'Shri. Ashish Arun Ghodake', updated_at = NOW() WHERE mobile = '8087613091';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Arun Tukaram Ghodake', t.updated_at = NOW() WHERE u.mobile = '8087613091' AND t.association_sequence_number = '117';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Arun Tukaram Ghodake', tg.updated_at = NOW() WHERE u.mobile = '8087613091' AND tg.association_sequence_number = '117' AND mg.gala_number IN ('731');

-- Serial 121 | Mobile 9970404141 | M/s. Someshwar Traders | Shri. Nilesh Namdev Thorat
UPDATE users SET full_name_en = 'Shri. Nilesh Namdev Thorat', updated_at = NOW() WHERE mobile = '9970404141';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Someshwar Traders', t.updated_at = NOW() WHERE u.mobile = '9970404141' AND t.association_sequence_number = '121';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Someshwar Traders', tg.updated_at = NOW() WHERE u.mobile = '9970404141' AND tg.association_sequence_number = '121' AND mg.gala_number IN ('735');

-- Serial 124 | Mobile 9921115252 | M/s. Saibaba Trading Company | Mrs. Surekha Vinay Gandhi
UPDATE users SET full_name_en = 'Mrs. Surekha Vinay Gandhi', updated_at = NOW() WHERE mobile = '9921115252';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Saibaba Trading Company', t.updated_at = NOW() WHERE u.mobile = '9921115252' AND t.association_sequence_number = '124';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Saibaba Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9921115252' AND tg.association_sequence_number = '124' AND mg.gala_number IN ('738');

-- Serial 126 | Mobile 9822098816 | M/s. Dilip Tukaram Karhale | Shri. Dilip Tukaram Karhale
UPDATE users SET full_name_en = 'Shri. Dilip Tukaram Karhale', updated_at = NOW() WHERE mobile = '9822098816';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Dilip Tukaram Karhale', t.updated_at = NOW() WHERE u.mobile = '9822098816' AND t.association_sequence_number = '126';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Dilip Tukaram Karhale', tg.updated_at = NOW() WHERE u.mobile = '9822098816' AND tg.association_sequence_number = '126' AND mg.gala_number IN ('742', '743');

-- Serial 127 | Mobile 9049597337 | M/s. Gaurav Ganesh Ghule | Shri. Gaurav Ganesh Ghule
UPDATE users SET full_name_en = 'Shri. Gaurav Ganesh Ghule', updated_at = NOW() WHERE mobile = '9049597337';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Gaurav Ganesh Ghule', t.updated_at = NOW() WHERE u.mobile = '9049597337' AND t.association_sequence_number = '127';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Gaurav Ganesh Ghule', tg.updated_at = NOW() WHERE u.mobile = '9049597337' AND tg.association_sequence_number = '127' AND mg.gala_number IN ('744', '744');

-- Serial 132 | Mobile 9860489455 | M/s. Shrinath & Company | Shri. Vitthal Murlidhar Zhurange
UPDATE users SET full_name_en = 'Shri. Vitthal Murlidhar Zhurange', updated_at = NOW() WHERE mobile = '9860489455';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Shrinath & Company', t.updated_at = NOW() WHERE u.mobile = '9860489455' AND t.association_sequence_number = '132';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Shrinath & Company', tg.updated_at = NOW() WHERE u.mobile = '9860489455' AND tg.association_sequence_number = '132' AND mg.gala_number IN ('750');

-- Serial 136 | Mobile 9921184213 | M/s. Gangaram Sagarmal Nagare | Shri. Shivraj Gangaram Nagare
UPDATE users SET full_name_en = 'Shri. Shivraj Gangaram Nagare', updated_at = NOW() WHERE mobile = '9921184213';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Gangaram Sagarmal Nagare', t.updated_at = NOW() WHERE u.mobile = '9921184213' AND t.association_sequence_number = '136';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Gangaram Sagarmal Nagare', tg.updated_at = NOW() WHERE u.mobile = '9921184213' AND tg.association_sequence_number = '136' AND mg.gala_number IN ('755');

-- Serial 139 | Mobile 9822617112 | M/s. Trimurti Traders | Shri. Shivaji Machhindranath Talekar
UPDATE users SET full_name_en = 'Shri. Shivaji Machhindranath Talekar', updated_at = NOW() WHERE mobile = '9822617112';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Trimurti Traders', t.updated_at = NOW() WHERE u.mobile = '9822617112' AND t.association_sequence_number = '139';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Trimurti Traders', tg.updated_at = NOW() WHERE u.mobile = '9822617112' AND tg.association_sequence_number = '139' AND mg.gala_number IN ('758');

-- Serial 143 | Mobile 9850765933 | M/s. Vishnukrupa Trading Company | Shri. Sunil Dattatray Pabale
UPDATE users SET full_name_en = 'Shri. Sunil Dattatray Pabale', updated_at = NOW() WHERE mobile = '9850765933';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Vishnukrupa Trading Company', t.updated_at = NOW() WHERE u.mobile = '9850765933' AND t.association_sequence_number = '143';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Vishnukrupa Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9850765933' AND tg.association_sequence_number = '143' AND mg.gala_number IN ('764');

-- Serial 146 | Mobile 7709090424 | M/s. Sadguru Traders | Shri. Akshay Vitthal Pawar
UPDATE users SET full_name_en = 'Shri. Akshay Vitthal Pawar', updated_at = NOW() WHERE mobile = '7709090424';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Sadguru Traders', t.updated_at = NOW() WHERE u.mobile = '7709090424' AND t.association_sequence_number = '146';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Sadguru Traders', tg.updated_at = NOW() WHERE u.mobile = '7709090424' AND tg.association_sequence_number = '146' AND mg.gala_number IN ('768');

-- Serial 147 | Mobile 9850804713 | M/s. Samrat Trading Company | Shri. Dayanand Danoba Devkar
UPDATE users SET full_name_en = 'Shri. Dayanand Danoba Devkar', updated_at = NOW() WHERE mobile = '9850804713';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Samrat Trading Company', t.updated_at = NOW() WHERE u.mobile = '9850804713' AND t.association_sequence_number = '147';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Samrat Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9850804713' AND tg.association_sequence_number = '147' AND mg.gala_number IN ('769');

-- Serial 148 | Mobile 9822646412 | M/s. Lucky Trading Company | Shri. Mehboob Gulab Sheikh
UPDATE users SET full_name_en = 'Shri. Mehboob Gulab Sheikh', updated_at = NOW() WHERE mobile = '9822646412';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Lucky Trading Company', t.updated_at = NOW() WHERE u.mobile = '9822646412' AND t.association_sequence_number = '148';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Lucky Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9822646412' AND tg.association_sequence_number = '148' AND mg.gala_number IN ('770');

-- Serial 153 | Mobile 9970437680 | M/s. Ankush Mahadev Jhende | Shri. Ankush Mahadev Jhende
UPDATE users SET full_name_en = 'Shri. Ankush Mahadev Jhende', updated_at = NOW() WHERE mobile = '9970437680';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Ankush Mahadev Jhende', t.updated_at = NOW() WHERE u.mobile = '9970437680' AND t.association_sequence_number = '153';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Ankush Mahadev Jhende', tg.updated_at = NOW() WHERE u.mobile = '9970437680' AND tg.association_sequence_number = '153' AND mg.gala_number IN ('776');

-- Serial 155 | Mobile 9860273737 | M/s. Rokdoba Trading Company | Shri. Nilesh Pandit Pawar
UPDATE users SET full_name_en = 'Shri. Nilesh Pandit Pawar', updated_at = NOW() WHERE mobile = '9860273737';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Rokdoba Trading Company', t.updated_at = NOW() WHERE u.mobile = '9860273737' AND t.association_sequence_number = '155';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Rokdoba Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9860273737' AND tg.association_sequence_number = '155' AND mg.gala_number IN ('778', '779');

-- Serial 158 | Mobile 9850663959 | M/s. Sangam Traders | Shri. Suresh Dhandiram Talekar
UPDATE users SET full_name_en = 'Shri. Suresh Dhandiram Talekar', updated_at = NOW() WHERE mobile = '9850663959';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Sangam Traders', t.updated_at = NOW() WHERE u.mobile = '9850663959' AND t.association_sequence_number = '158';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Sangam Traders', tg.updated_at = NOW() WHERE u.mobile = '9850663959' AND tg.association_sequence_number = '158' AND mg.gala_number IN ('782');

-- Serial 164 | Mobile 9850007447 | M/s. Balasaheb Laxman Kolate | Shri. Balasaheb Laxman Kolate
UPDATE users SET full_name_en = 'Shri. Balasaheb Laxman Kolate', updated_at = NOW() WHERE mobile = '9850007447';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Balasaheb Laxman Kolate', t.updated_at = NOW() WHERE u.mobile = '9850007447' AND t.association_sequence_number = '164';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Balasaheb Laxman Kolate', tg.updated_at = NOW() WHERE u.mobile = '9850007447' AND tg.association_sequence_number = '164' AND mg.gala_number IN ('789');

-- Serial 165 | Mobile 9850120992 | M/s. Sunil Trading Company | Shri. Maruti Pandurang Kamathe
UPDATE users SET full_name_en = 'Shri. Maruti Pandurang Kamathe', updated_at = NOW() WHERE mobile = '9850120992';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Sunil Trading Company', t.updated_at = NOW() WHERE u.mobile = '9850120992' AND t.association_sequence_number = '165';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Sunil Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9850120992' AND tg.association_sequence_number = '165' AND mg.gala_number IN ('790');

-- Serial 170 | Mobile 9881872796 | M/s. Anand Tukaram Jadhav & Sons | Shri. Mahendra Anand Jadhav
UPDATE users SET full_name_en = 'Shri. Mahendra Anand Jadhav', updated_at = NOW() WHERE mobile = '9881872796';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Anand Tukaram Jadhav & Sons', t.updated_at = NOW() WHERE u.mobile = '9881872796' AND t.association_sequence_number = '170';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Anand Tukaram Jadhav & Sons', tg.updated_at = NOW() WHERE u.mobile = '9881872796' AND tg.association_sequence_number = '170' AND mg.gala_number IN ('796');

-- Serial 171 | Mobile 9850143735 | M/s. Suresh Hole & Company | Mrs. Shubhangi Suresh Hole
UPDATE users SET full_name_en = 'Mrs. Shubhangi Suresh Hole', updated_at = NOW() WHERE mobile = '9850143735';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. Suresh Hole & Company', t.updated_at = NOW() WHERE u.mobile = '9850143735' AND t.association_sequence_number = '171';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. Suresh Hole & Company', tg.updated_at = NOW() WHERE u.mobile = '9850143735' AND tg.association_sequence_number = '171' AND mg.gala_number IN ('797', '798', '649');

-- Serial 173 | Mobile 9822025457 | M/s. S.R. Trading Company | Shri. Rahul Vitthal Borkar
UPDATE users SET full_name_en = 'Shri. Rahul Vitthal Borkar', updated_at = NOW() WHERE mobile = '9822025457';
UPDATE traders t JOIN users u ON u.id = t.user_id SET t.business_name_en = 'M/s. S.R. Trading Company', t.updated_at = NOW() WHERE u.mobile = '9822025457' AND t.association_sequence_number = '173';
UPDATE trader_galas tg JOIN traders t ON t.id = tg.trader_id JOIN users u ON u.id = t.user_id JOIN market_galas mg ON mg.id = tg.gala_id SET tg.business_name_en = 'M/s. S.R. Trading Company', tg.updated_at = NOW() WHERE u.mobile = '9822025457' AND tg.association_sequence_number = '173' AND mg.gala_number IN ('800');

COMMIT;
