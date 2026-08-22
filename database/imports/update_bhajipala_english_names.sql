-- Fill English display names from Market_Yard_Vegetable_Members_Bilingual_List.pdf
-- This updates only English name columns. Approval/status/login fields are intentionally untouched.
SET NAMES utf8mb4;
START TRANSACTION;

-- Row 1 | BHV-0001 | Mobile 9890490808 | Gala 2
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vasant Dinkar Todakar',
    t.business_name_en = 'Vasant Dinkar Todakar'
WHERE t.trader_code = 'BHV-0001';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vasant Dinkar Todakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '1'
  AND tg.association_registration_number = '2';

-- Row 2 | BHV-0002 | Mobile 9970365580 | Gala 3
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mahesh Sambhajirao Dighe',
    t.business_name_en = 'Sambhajirao Sajaram Digheand Das'
WHERE t.trader_code = 'BHV-0002';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sambhajirao Sajaram Digheand Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '2'
  AND tg.association_registration_number = '3';

-- Row 3 | BHV-0003 | Mobile 9823925995 | Gala 4
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Mi Chhankalabhor',
    t.business_name_en = 'Mi Chhantak ram Kalbhor'
WHERE t.trader_code = 'BHV-0003';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mi Chhantak ram Kalbhor'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '3'
  AND tg.association_registration_number = '4';

-- Row 4 | BHV-0004 | Mobile 9823987428 | Gala 5
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dadabhau Tanajighadage',
    t.business_name_en = 'Ghatagesalanke& Company'
WHERE t.trader_code = 'BHV-0004';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ghatagesalanke& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '4'
  AND tg.association_registration_number = '5';

-- Row 5 | BHV-0005 | Mobile 9763876561 | Gala 6
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sabir Hasen Tanboli',
    t.business_name_en = 'Jay Kasin Agency'
WHERE t.trader_code = 'BHV-0005';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jay Kasin Agency'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '5'
  AND tg.association_registration_number = '6';

-- Row 6 | BHV-0006 | Mobile 9422011872 | Gala 7
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'nath Sanpatarav Hagavane',
    t.business_name_en = 'Pailavan Keshavarav Balobamal'
WHERE t.trader_code = 'BHV-0006';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pailavan Keshavarav Balobamal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '6'
  AND tg.association_registration_number = '7';

-- Row 7 | BHV-0007 | Mobile - | Gala 8
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ekanath Pavatarav Gadavedeshamukh',
    t.business_name_en = 'Deshamukh Pawar Company'
WHERE t.trader_code = 'BHV-0007';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Deshamukh Pawar Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '7'
  AND tg.association_registration_number = '8';

-- Row 8 | BHV-0008 | Mobile 9545554501 | Gala 9, 10, 11, 100
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dapaki Vasant Kanjir',
    t.business_name_en = 'Vasant Ramachankanjir'
WHERE t.trader_code = 'BHV-0008';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vasant Ramachankanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '8'
  AND tg.association_registration_number = '9';

-- Row 9 | BHV-0009 | Mobile 9850031371 | Gala 12
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anakit Ashok Taware',
    t.business_name_en = 'Ashok Ekanatharav Taware'
WHERE t.trader_code = 'BHV-0009';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashok Ekanatharav Taware'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '9'
  AND tg.association_registration_number = '12';

-- Row 10 | BHV-0010 | Mobile 9850031371 | Gala 13
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Abhajit Ashok Taware',
    t.business_name_en = 'Ashok Ekanatharav Taware'
WHERE t.trader_code = 'BHV-0010';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashok Ekanatharav Taware'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '10'
  AND tg.association_registration_number = '13';

-- Row 11 | BHV-0011 | Mobile 9960203320 | Gala 14
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ratesh Dalip Talekar',
    t.business_name_en = 'Dalip Jaywantrao Talikar'
WHERE t.trader_code = 'BHV-0011';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dalip Jaywantrao Talikar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '11'
  AND tg.association_registration_number = '14';

-- Row 12 | BHV-0012 | Mobile 9890716555 | Gala 15
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Natin Chhaganarav Dighe',
    t.business_name_en = 'Chhaganarav Devaram Dighe'
WHERE t.trader_code = 'BHV-0012';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Chhaganarav Devaram Dighe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '12'
  AND tg.association_registration_number = '15';

-- Row 13 | BHV-0013 | Mobile 9822108716 | Gala 16
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganapat Ramabhau Shevale',
    t.business_name_en = 'Ganapat Ramabhau Shevale'
WHERE t.trader_code = 'BHV-0013';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganapat Ramabhau Shevale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '13'
  AND tg.association_registration_number = '16';

-- Row 14 | BHV-0014 | Mobile 9822273727 | Gala 17
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Namadev Jaywantrao Yenabhar',
    t.business_name_en = 'nath d G Company'
WHERE t.trader_code = 'BHV-0014';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'nath d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '14'
  AND tg.association_registration_number = '17';

-- Row 15 | BHV-0015 | Mobile 9822273727 | Gala 17â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nindaninamadev Yenabhar',
    t.business_name_en = 'Joger d G Company'
WHERE t.trader_code = 'BHV-0015';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Joger d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '15'
  AND tg.association_registration_number = '17';

-- Row 16 | BHV-0016 | Mobile - | Gala 18
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'D y Bhosale',
    t.business_name_en = 'Gal barav Tak ram Bhosale'
WHERE t.trader_code = 'BHV-0016';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Gal barav Tak ram Bhosale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '16'
  AND tg.association_registration_number = '18';

-- Row 17 | BHV-0017 | Mobile 9881912020 | Gala 19
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Wadkar',
    t.business_name_en = 'Shabhurang d G Company'
WHERE t.trader_code = 'BHV-0017';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shabhurang d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '17'
  AND tg.association_registration_number = '19';

-- Row 18 | BHV-0018 | Mobile 9850099300 | Gala 20
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sharad Mahadev Kanbharakar',
    t.business_name_en = 'Mahadev Bhagavanarav Kanbharakar'
WHERE t.trader_code = 'BHV-0018';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mahadev Bhagavanarav Kanbharakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '18'
  AND tg.association_registration_number = '20';

-- Row 19 | BHV-0019 | Mobile 9881257208 | Gala 21, 110
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tamasheth Kachi',
    t.business_name_en = 'Pachanvatid G Company'
WHERE t.trader_code = 'BHV-0019';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pachanvatid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '19'
  AND tg.association_registration_number = '21';

-- Row 20 | BHV-0020 | Mobile 9665924645 | Gala 22
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Santosh Rajabhau Kanbharakar',
    t.business_name_en = 'Rajabhau Bhagavanarav Kanbharakar'
WHERE t.trader_code = 'BHV-0020';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rajabhau Bhagavanarav Kanbharakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '20'
  AND tg.association_registration_number = '22';

-- Row 21 | BHV-0021 | Mobile 9850504075 | Gala 23
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi Nath Gal barav Jagtap',
    t.business_name_en = 'Bhosalejagatap & Company'
WHERE t.trader_code = 'BHV-0021';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhosalejagatap & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '21'
  AND tg.association_registration_number = '23';

-- Row 22 | BHV-0022 | Mobile 9881668877 | Gala 24
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nalish Anandarav Ch Han',
    t.business_name_en = 'Sahebarav Bapajuch Han'
WHERE t.trader_code = 'BHV-0022';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sahebarav Bapajuch Han'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '22'
  AND tg.association_registration_number = '24';

-- Row 23 | BHV-0023 | Mobile 9922550333 | Gala 25, 114, 115
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jagadish Babanarav Paygude',
    t.business_name_en = 'Babanarav Anantarav Paygude'
WHERE t.trader_code = 'BHV-0023';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Babanarav Anantarav Paygude'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '23'
  AND tg.association_registration_number = '25';

-- Row 24 | BHV-0024 | Mobile 9922550333 | Gala 26
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Jagadish Payagadu',
    t.business_name_en = 'Sachani d G Company'
WHERE t.trader_code = 'BHV-0024';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sachani d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '24'
  AND tg.association_registration_number = '26';

-- Row 25 | BHV-0025 | Mobile 9921847227 | Gala 27
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'D y Bapasu heb Nagadi',
    t.business_name_en = 'Nagadibhosalekanpani'
WHERE t.trader_code = 'BHV-0025';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Nagadibhosalekanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '25'
  AND tg.association_registration_number = '27';

-- Row 26 | BHV-0026 | Mobile 9960001133 | Gala 30
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Amar Raghanuth Kale',
    t.business_name_en = 'Jag Nath D baharale'
WHERE t.trader_code = 'BHV-0026';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jag Nath D baharale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '26'
  AND tg.association_registration_number = '30';

-- Row 27 | BHV-0027 | Mobile 9822216500 | Gala 31
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vatisachin Harale',
    t.business_name_en = 'Jag Nath D baharale'
WHERE t.trader_code = 'BHV-0027';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jag Nath D baharale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '27'
  AND tg.association_registration_number = '31';

-- Row 28 | BHV-0028 | Mobile 9822509288 | Gala 32
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vajayi Babanarav Shatile',
    t.business_name_en = 'Kale-Shatile& Company'
WHERE t.trader_code = 'BHV-0028';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kale-Shatile& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '28'
  AND tg.association_registration_number = '32';

-- Row 29 | BHV-0029 | Mobile 9822557007 | Gala 33
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Alakad y Dadhule',
    t.business_name_en = 'Dadhulij Si'
WHERE t.trader_code = 'BHV-0029';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dadhulij Si'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '29'
  AND tg.association_registration_number = '33';

-- Row 30 | BHV-0030 | Mobile 9822557007 | Gala 34
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chankant D y Dadhule',
    t.business_name_en = 'Dadhuled S S'
WHERE t.trader_code = 'BHV-0030';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dadhuled S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '30'
  AND tg.association_registration_number = '34';

-- Row 31 | BHV-0031 | Mobile 9822557007 | Gala 35
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Adi Y kant Dadhule',
    t.business_name_en = 'Dadhuledas'
WHERE t.trader_code = 'BHV-0031';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dadhuledas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '31'
  AND tg.association_registration_number = '35';

-- Row 32 | BHV-0032 | Mobile 9881879736 | Gala 36
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Raj D y Borakar',
    t.business_name_en = 'Raj D y Borakar'
WHERE t.trader_code = 'BHV-0032';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Raj D y Borakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '32'
  AND tg.association_registration_number = '36';

-- Row 33 | BHV-0033 | Mobile 9762115770 | Gala 37
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sagar Navin Jarande',
    t.business_name_en = 'Sar Vatiej Si'
WHERE t.trader_code = 'BHV-0033';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sar Vatiej Si'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '33'
  AND tg.association_registration_number = '37';

-- Row 34 | BHV-0034 | Mobile 9850775722 | Gala 38
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sabhanjil Man Jhade',
    t.business_name_en = 'Sabhanjil Man Jhade'
WHERE t.trader_code = 'BHV-0034';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sabhanjil Man Jhade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '34'
  AND tg.association_registration_number = '38';

-- Row 35 | BHV-0035 | Mobile 9422083557 | Gala 39
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jagadish Ranganath Shedage',
    t.business_name_en = 'Tej Vid G Company'
WHERE t.trader_code = 'BHV-0035';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Tej Vid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '35'
  AND tg.association_registration_number = '39';

-- Row 36 | BHV-0036 | Mobile 9850159469 | Gala 40
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tak ram Kasani Awate',
    t.business_name_en = 'Joshiavate& Company'
WHERE t.trader_code = 'BHV-0036';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Joshiavate& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '36'
  AND tg.association_registration_number = '40';

-- Row 37 | BHV-0037 | Mobile 9923444141 | Gala 41
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Bajirav Jhade',
    t.business_name_en = 'Bajirav Ramachanjhade'
WHERE t.trader_code = 'BHV-0037';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bajirav Ramachanjhade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '37'
  AND tg.association_registration_number = '41';

-- Row 38 | BHV-0038 | Mobile 9850119001 | Gala 42
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi M Ankush Satav',
    t.business_name_en = 'Ankush Ramachansatav'
WHERE t.trader_code = 'BHV-0038';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ankush Ramachansatav'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '38'
  AND tg.association_registration_number = '42';

-- Row 39 | BHV-0039 | Mobile 9423233399 | Gala 43
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Palinalish Thopte',
    t.business_name_en = 'Si vaniyak d G Company'
WHERE t.trader_code = 'BHV-0039';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Si vaniyak d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '39'
  AND tg.association_registration_number = '43';

-- Row 40 | BHV-0040 | Mobile - | Gala 87
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = '-',
    t.business_name_en = 'Ghodaked G Company'
WHERE t.trader_code = 'BHV-0040';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ghodaked G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '40'
  AND tg.association_registration_number = '87';

-- Row 41 | BHV-0041 | Mobile 9823438866 | Gala 87
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Pesh Shavarij Ghodake',
    t.business_name_en = 'Ghodaked G Company'
WHERE t.trader_code = 'BHV-0041';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ghodaked G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '41'
  AND tg.association_registration_number = '87';

-- Row 42 | BHV-0042 | Mobile 9850980477 | Gala 89
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinal Rajaram Kannapali',
    t.business_name_en = 'Sinal Rajaram Kannapali'
WHERE t.trader_code = 'BHV-0042';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sinal Rajaram Kannapali'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '42'
  AND tg.association_registration_number = '89';

-- Row 43 | BHV-0043 | Mobile 7875893737 | Gala 91
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dasharath L Man Rede',
    t.business_name_en = 'Dasharath L Man Rede& Company'
WHERE t.trader_code = 'BHV-0043';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dasharath L Man Rede& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '43'
  AND tg.association_registration_number = '91';

-- Row 44 | BHV-0044 | Mobile 9422323753 | Gala 92
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinal Ramachans Te',
    t.business_name_en = 'Ramachanshankararav S Te'
WHERE t.trader_code = 'BHV-0044';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramachanshankararav S Te'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '44'
  AND tg.association_registration_number = '92';

-- Row 45 | BHV-0045 | Mobile 9822622677 | Gala 93
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bapasuheb nobakalabhor',
    t.business_name_en = 'Bapasuheb nobakalabhor'
WHERE t.trader_code = 'BHV-0045';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bapasuheb nobakalabhor'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '45'
  AND tg.association_registration_number = '93';

-- Row 46 | BHV-0046 | Mobile 9922012828 | Gala 94, 95
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Takuram Dh Dibatapu',
    t.business_name_en = 'Tak ram Dh Dibatapu'
WHERE t.trader_code = 'BHV-0046';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Tak ram Dh Dibatapu'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '46'
  AND tg.association_registration_number = '94';

-- Row 47 | BHV-0047 | Mobile 9822112742 | Gala 96
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sandip A r Ghal',
    t.business_name_en = 'A R Ekanath Ghal'
WHERE t.trader_code = 'BHV-0047';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'A R Ekanath Ghal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '47'
  AND tg.association_registration_number = '96';

-- Row 48 | BHV-0048 | Mobile 9420482676 | Gala 97
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'D y Gaganram Jagadale',
    t.business_name_en = 'D y Gaganram Jagadale'
WHERE t.trader_code = 'BHV-0048';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'D y Gaganram Jagadale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '48'
  AND tg.association_registration_number = '97';

-- Row 49 | BHV-0049 | Mobile 9970095415 | Gala 98
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinal Babanarav Vanjhe',
    t.business_name_en = 'Bi.Es. Vajhan'
WHERE t.trader_code = 'BHV-0049';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bi.Es. Vajhan'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '49'
  AND tg.association_registration_number = '98';

-- Row 50 | BHV-0050 | Mobile 9850955060 | Gala 99
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dhananjay Pandurang Pawar',
    t.business_name_en = 'Dhananjay Pandurang Pawar & Das'
WHERE t.trader_code = 'BHV-0050';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dhananjay Pandurang Pawar & Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '50'
  AND tg.association_registration_number = '99';

-- Row 51 | BHV-0051 | Mobile 7776813030 | Gala 101
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Somanath Vi L Vahekar',
    t.business_name_en = 'Matu das'
WHERE t.trader_code = 'BHV-0051';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Matu das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '51'
  AND tg.association_registration_number = '101';

-- Row 52 | BHV-0052 | Mobile 9226709170 | Gala 102
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nandasuresh Gayakavad',
    t.business_name_en = 'Jagadabandas'
WHERE t.trader_code = 'BHV-0052';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jagadabandas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '52'
  AND tg.association_registration_number = '102';

-- Row 53 | BHV-0053 | Mobile 9822647948 | Gala 103
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi M K Hai Yalal Rayakar',
    t.business_name_en = 'K Hai Yalal Navi rayakar Patil'
WHERE t.trader_code = 'BHV-0053';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'K Hai Yalal Navi rayakar Patil'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '53'
  AND tg.association_registration_number = '103';

-- Row 54 | BHV-0054 | Mobile 9881404537 | Gala 104
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shankar Kashiram Katke',
    t.business_name_en = 'Yash Vid G Company'
WHERE t.trader_code = 'BHV-0054';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Yash Vid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '54'
  AND tg.association_registration_number = '104';

-- Row 55 | BHV-0055 | Mobile 9890655540 | Gala 105
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Balakri N Wadkar',
    t.business_name_en = 'Wadkar Hejitebal'
WHERE t.trader_code = 'BHV-0055';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Wadkar Hejitebal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '55'
  AND tg.association_registration_number = '105';

-- Row 56 | BHV-0056 | Mobile 9890655540 | Gala 106
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Wadkar',
    t.business_name_en = 'Ramachank Dibavadakar'
WHERE t.trader_code = 'BHV-0056';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramachank Dibavadakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '56'
  AND tg.association_registration_number = '106';

-- Row 57 | BHV-0057 | Mobile 9822441649 | Gala 107
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Somanath Nasheth Bhosale',
    t.business_name_en = 'Nasheth Gulabarav Bhosale'
WHERE t.trader_code = 'BHV-0057';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Nasheth Gulabarav Bhosale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '57'
  AND tg.association_registration_number = '107';

-- Row 58 | BHV-0058 | Mobile 9922351915 | Gala 108
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mayaruyak Nt Bhokare',
    t.business_name_en = 'Ganaraj d G Company'
WHERE t.trader_code = 'BHV-0058';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganaraj d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '58'
  AND tg.association_registration_number = '108';

-- Row 59 | BHV-0059 | Mobile 9021231212 | Gala 109
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anali Kasani Kanjir',
    t.business_name_en = 'Kasani Ganapat Kanjir'
WHERE t.trader_code = 'BHV-0059';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kasani Ganapat Kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '59'
  AND tg.association_registration_number = '109';

-- Row 60 | BHV-0060 | Mobile 9021544276 | Gala 111
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rishakish Kantapoman',
    t.business_name_en = 'Kantasajarav Poman'
WHERE t.trader_code = 'BHV-0060';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kantasajarav Poman'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '60'
  AND tg.association_registration_number = '111';

-- Row 61 | BHV-0061 | Mobile 9822032836 | Gala 112
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Abhajit Kantapoman',
    t.business_name_en = 'Kantasajarav Poman'
WHERE t.trader_code = 'BHV-0061';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kantasajarav Poman'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '61'
  AND tg.association_registration_number = '112';

-- Row 62 | BHV-0062 | Mobile 9881131144 | Gala 113
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Manoj Gawade',
    t.business_name_en = 'Idanbu i ner Gawade'
WHERE t.trader_code = 'BHV-0062';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Idanbu i ner Gawade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '62'
  AND tg.association_registration_number = '113';

-- Row 63 | BHV-0063 | Mobile 9822515857 | Gala 116
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Gholap Daulat Baban',
    t.business_name_en = 'Gholap Bandehavaladar Company'
WHERE t.trader_code = 'BHV-0063';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Gholap Bandehavaladar Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '63'
  AND tg.association_registration_number = '116';

-- Row 64 | BHV-0064 | Mobile 9422986501 | Gala 117
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nanasaheb Vi Larav Garade',
    t.business_name_en = 'Nanasaheb Vi Larav Garade'
WHERE t.trader_code = 'BHV-0064';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Nanasaheb Vi Larav Garade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '64'
  AND tg.association_registration_number = '117';

-- Row 65 | BHV-0065 | Mobile 9890900991 | Gala 118
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shashakitanrang Vaghamode',
    t.business_name_en = 'Jayam Har d G Company'
WHERE t.trader_code = 'BHV-0065';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jayam Har d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '65'
  AND tg.association_registration_number = '118';

-- Row 66 | BHV-0066 | Mobile 9822216500 | Gala 120
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Jag Nath Harale',
    t.business_name_en = 'Harale& Company'
WHERE t.trader_code = 'BHV-0066';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Harale& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '66'
  AND tg.association_registration_number = '120';

-- Row 67 | BHV-0067 | Mobile 9822216500 | Gala 121
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sankri Tisachani Harale',
    t.business_name_en = 'Harale& Company'
WHERE t.trader_code = 'BHV-0067';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Harale& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '67'
  AND tg.association_registration_number = '121';

-- Row 68 | BHV-0068 | Mobile 8378842625 | Gala 122
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'A Maram Shankararav Khatape',
    t.business_name_en = 'Shankararav H Rabhau Khatape'
WHERE t.trader_code = 'BHV-0068';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shankararav H Rabhau Khatape'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '68'
  AND tg.association_registration_number = '122';

-- Row 69 | BHV-0069 | Mobile 9379710666 | Gala 124
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ravinaravind Bande',
    t.business_name_en = 'ram das'
WHERE t.trader_code = 'BHV-0069';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ram das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '69'
  AND tg.association_registration_number = '124';

-- Row 70 | BHV-0070 | Mobile 9422303390 | Gala 125
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Sadashavariv Kul',
    t.business_name_en = 'Shabhannu th d G Company'
WHERE t.trader_code = 'BHV-0070';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shabhannu th d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '70'
  AND tg.association_registration_number = '125';

-- Row 71 | BHV-0071 | Mobile 9333993399 | Gala 126
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nalish Baban Thopte',
    t.business_name_en = 'Jay Ganesh d G Company'
WHERE t.trader_code = 'BHV-0071';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jay Ganesh d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '71'
  AND tg.association_registration_number = '126';

-- Row 72 | BHV-0072 | Mobile 8600799180 | Gala 128
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sanjay Ravasaheb Urasal',
    t.business_name_en = 'Ravasaheb Tukaram Urasal'
WHERE t.trader_code = 'BHV-0072';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ravasaheb Tukaram Urasal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '72'
  AND tg.association_registration_number = '128';

-- Row 73 | BHV-0073 | Mobile 9371078777 | Gala 129
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ashokarav Manakariv Kamathe',
    t.business_name_en = 'Manakariv Anadanrav Kamathe'
WHERE t.trader_code = 'BHV-0073';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Manakariv Anadanrav Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '73'
  AND tg.association_registration_number = '129';

-- Row 74 | BHV-0074 | Mobile 9850164190 | Gala 130
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nandakumar Vi Larav Garami',
    t.business_name_en = 'Janadan Raghunath Garami& Company'
WHERE t.trader_code = 'BHV-0074';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Janadan Raghunath Garami& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '74'
  AND tg.association_registration_number = '130';

-- Row 75 | BHV-0075 | Mobile 9822111120 | Gala 131/132
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Hashad Dapaki Shedage',
    t.business_name_en = 'Ganesh Ranganath Shedage& Company'
WHERE t.trader_code = 'BHV-0075';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganesh Ranganath Shedage& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '75'
  AND tg.association_registration_number = '131';

-- Row 76 | BHV-0076 | Mobile 9422031687 | Gala 133
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rohadis Vaniyak Bh Dave',
    t.business_name_en = 'Risi das'
WHERE t.trader_code = 'BHV-0076';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Risi das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '76'
  AND tg.association_registration_number = '133';

-- Row 77 | BHV-0077 | Mobile 9881873004 | Gala 134
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shavijigenabakhaire',
    t.business_name_en = 'Shavijigenabakhaire'
WHERE t.trader_code = 'BHV-0077';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavijigenabakhaire'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '77'
  AND tg.association_registration_number = '134';

-- Row 78 | BHV-0078 | Mobile 9822883005 | Gala 135
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shavijimatibehekar',
    t.business_name_en = 'Maulid G Company'
WHERE t.trader_code = 'BHV-0078';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Maulid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '78'
  AND tg.association_registration_number = '135';

-- Row 79 | BHV-0079 | Mobile 9850145610 | Gala 192
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ram Sadashavariv Pingale',
    t.business_name_en = 'Sadashavariv Ramabhau Pingale'
WHERE t.trader_code = 'BHV-0079';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sadashavariv Ramabhau Pingale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '79'
  AND tg.association_registration_number = '192';

-- Row 80 | BHV-0080 | Mobile 9881507775 | Gala 199
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush patarav Majumale',
    t.business_name_en = 'Sinal & Company'
WHERE t.trader_code = 'BHV-0080';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sinal & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '80'
  AND tg.association_registration_number = '199';

-- Row 81 | BHV-0081 | Mobile 8788921955 | Gala 257 â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shavijibalasaheb Pathare',
    t.business_name_en = 'Balasaheb Babaruv Pathare'
WHERE t.trader_code = 'BHV-0081';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balasaheb Babaruv Pathare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '81'
  AND tg.association_registration_number = '257';

-- Row 82 | BHV-0082 | Mobile 9850085999 | Gala 257
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dalip Devaram Su',
    t.business_name_en = 'Dalipakumar Company'
WHERE t.trader_code = 'BHV-0082';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dalipakumar Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '82'
  AND tg.association_registration_number = '257';

-- Row 83 | BHV-0083 | Mobile 9922614166 | Gala 256
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dapaki ner More',
    t.business_name_en = 'ner Pandharinath More'
WHERE t.trader_code = 'BHV-0083';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ner Pandharinath More'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '83'
  AND tg.association_registration_number = '256';

-- Row 84 | BHV-0084 | Mobile 9764261759 | Gala 255
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Hadinrav Sahebarav Nanavare',
    t.business_name_en = 'Saj d G Company'
WHERE t.trader_code = 'BHV-0084';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Saj d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '84'
  AND tg.association_registration_number = '255';

-- Row 85 | BHV-0085 | Mobile 9890472749 | Gala 252
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'S Lau n Inamadar',
    t.business_name_en = 'Es.Di. Inamadar'
WHERE t.trader_code = 'BHV-0085';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Es.Di. Inamadar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '85'
  AND tg.association_registration_number = '252';

-- Row 86 | BHV-0086 | Mobile 9121116402 | Gala 254
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Pandurang Ekataparu',
    t.business_name_en = 'Pandurang d G Company'
WHERE t.trader_code = 'BHV-0086';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandurang d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '86'
  AND tg.association_registration_number = '254';

-- Row 87 | BHV-0087 | Mobile 9850842747 | Gala 250
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'D y Sh Ghun Pawar',
    t.business_name_en = 'D y Sh Ghun Pawar'
WHERE t.trader_code = 'BHV-0087';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'D y Sh Ghun Pawar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '87'
  AND tg.association_registration_number = '250';

-- Row 88 | BHV-0088 | Mobile 8605589155 | Gala 245
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ajati Sonabarajagire',
    t.business_name_en = 'Vajayi d G Company'
WHERE t.trader_code = 'BHV-0088';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vajayi d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '88'
  AND tg.association_registration_number = '245';

-- Row 89 | BHV-0089 | Mobile 9822251930 | Gala 244
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shekhar Ramachanranasagin',
    t.business_name_en = 'Ramachankashanith Ranasing'
WHERE t.trader_code = 'BHV-0089';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramachankashanith Ranasing'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '89'
  AND tg.association_registration_number = '244';

-- Row 90 | BHV-0090 | Mobile 8796064323 | Gala 243
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dhanesh Ashok Devakar',
    t.business_name_en = 'Ashok Navi devakar'
WHERE t.trader_code = 'BHV-0090';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashok Navi devakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '90'
  AND tg.association_registration_number = '243';

-- Row 91 | BHV-0091 | Mobile 9011040937 | Gala 385
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'L Man Kri Najipoman',
    t.business_name_en = 'Parundar d G Company'
WHERE t.trader_code = 'BHV-0091';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Parundar d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '91'
  AND tg.association_registration_number = '385';

-- Row 92 | BHV-0092 | Mobile 9422080719 | Gala 383
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Balasaheb Payagadu',
    t.business_name_en = 'Malai d G Company'
WHERE t.trader_code = 'BHV-0092';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Malai d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '92'
  AND tg.association_registration_number = '383';

-- Row 93 | BHV-0093 | Mobile 9850881978 | Gala 384
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'S Yajit Honarav',
    t.business_name_en = 'Baliram Sayukant & Company'
WHERE t.trader_code = 'BHV-0093';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Baliram Sayukant & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '93'
  AND tg.association_registration_number = '384';

-- Row 94 | BHV-0094 | Mobile 9822543560 | Gala 235
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tukaram Madhavarav Jagtap',
    t.business_name_en = 'Jagtap & S S'
WHERE t.trader_code = 'BHV-0094';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jagtap & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '94'
  AND tg.association_registration_number = '235';

-- Row 95 | BHV-0095 | Mobile 9822840953 | Gala 390
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Manimorer Ch Han',
    t.business_name_en = 'L Mishak Nr d G Company'
WHERE t.trader_code = 'BHV-0095';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'L Mishak Nr d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '95'
  AND tg.association_registration_number = '390';

-- Row 96 | BHV-0096 | Mobile 9822423839 | Gala 386
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Pandharinath Navi kanjir',
    t.business_name_en = 'Pandharinath Navi kanjir'
WHERE t.trader_code = 'BHV-0096';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandharinath Navi kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '96'
  AND tg.association_registration_number = '386';

-- Row 97 | BHV-0097 | Mobile - | Gala 246
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shavijiramachanjavalakar',
    t.business_name_en = 'Shavijiramachanjavalakar'
WHERE t.trader_code = 'BHV-0097';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavijiramachanjavalakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '97'
  AND tg.association_registration_number = '246';

-- Row 98 | BHV-0098 | Mobile 9890002466 | Gala 238
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rohit Balasaheb Jagtap',
    t.business_name_en = 'Balasaheb Bhakibajagatap'
WHERE t.trader_code = 'BHV-0098';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balasaheb Bhakibajagatap'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '98'
  AND tg.association_registration_number = '238';

-- Row 99 | BHV-0099 | Mobile 9422029235 | Gala 247
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jayavant Matijagatap',
    t.business_name_en = 'Matiramabhau Jagtap'
WHERE t.trader_code = 'BHV-0099';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Matiramabhau Jagtap'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '99'
  AND tg.association_registration_number = '247';

-- Row 100 | BHV-0100 | Mobile 9881216647 | Gala 251
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Bhakijitavare',
    t.business_name_en = 'Sad d G Company'
WHERE t.trader_code = 'BHV-0100';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sad d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '100'
  AND tg.association_registration_number = '251';

-- Row 101 | BHV-0101 | Mobile - | Gala 236
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shavijiramachanbhapakar',
    t.business_name_en = 'Shavijiramachanbhapakar'
WHERE t.trader_code = 'BHV-0101';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavijiramachanbhapakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '101'
  AND tg.association_registration_number = '236';

-- Row 102 | BHV-0102 | Mobile 9850543872 | Gala 240
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Okar Shankar Khopade',
    t.business_name_en = 'Shavashi d G Company'
WHERE t.trader_code = 'BHV-0102';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavashi d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '102'
  AND tg.association_registration_number = '240';

-- Row 103 | BHV-0103 | Mobile 8788827964 | Gala 185
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nalami Sopanarav Salan Ke',
    t.business_name_en = 'Salanked G Company'
WHERE t.trader_code = 'BHV-0103';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Salanked G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '103'
  AND tg.association_registration_number = '185';

-- Row 104 | BHV-0104 | Mobile 9850444297 | Gala 186
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shakanr Bankarav Rayakar Patil',
    t.business_name_en = 'Shak Nr Nbakarav Rayakar Patil'
WHERE t.trader_code = 'BHV-0104';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shak Nr Nbakarav Rayakar Patil'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '104'
  AND tg.association_registration_number = '186';

-- Row 105 | BHV-0105 | Mobile 9011911965 | Gala 187
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadanp Sahebarav Sanas',
    t.business_name_en = 'Sahebarav Natharum Sanas'
WHERE t.trader_code = 'BHV-0105';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sahebarav Natharum Sanas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '105'
  AND tg.association_registration_number = '187';

-- Row 106 | BHV-0106 | Mobile 9850297481 | Gala 188
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sajarav Abasaheb Sayuvanshi',
    t.business_name_en = 'Sajarav Abasaheb Sayuvanshi'
WHERE t.trader_code = 'BHV-0106';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sajarav Abasaheb Sayuvanshi'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '106'
  AND tg.association_registration_number = '188';

-- Row 107 | BHV-0107 | Mobile 9850837609 | Gala 189
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Savunau M Jhagade',
    t.business_name_en = 'Es. Ar. Jhagade& Company'
WHERE t.trader_code = 'BHV-0107';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Es. Ar. Jhagade& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '107'
  AND tg.association_registration_number = '189';

-- Row 108 | BHV-0108 | Mobile 9860352772 | Gala 190
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vakis Ramadas Th Bare',
    t.business_name_en = 'Ramadas Vamanarav Th Bare'
WHERE t.trader_code = 'BHV-0108';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramadas Vamanarav Th Bare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '108'
  AND tg.association_registration_number = '190';

-- Row 109 | BHV-0109 | Mobile 9922857007 | Gala 191
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Ekanath Yadav',
    t.business_name_en = 'Bhal r das'
WHERE t.trader_code = 'BHV-0109';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhal r das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '109'
  AND tg.association_registration_number = '191';

-- Row 110 | BHV-0110 | Mobile 9960444467 | Gala 193
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Abhajit Chankant Pawar',
    t.business_name_en = 'Sadashavi Khanderav Pawar'
WHERE t.trader_code = 'BHV-0110';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sadashavi Khanderav Pawar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '110'
  AND tg.association_registration_number = '193';

-- Row 111 | BHV-0111 | Mobile 9890112975 | Gala 194
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tanajibabaruv Doke',
    t.business_name_en = 'Tanajibaburav Doke'
WHERE t.trader_code = 'BHV-0111';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Tanajibaburav Doke'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '111'
  AND tg.association_registration_number = '194';

-- Row 112 | BHV-0112 | Mobile 9923032079 | Gala 196
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sanjay A Nasaheb Ghalu',
    t.business_name_en = 'Sanjay A Nasaheb Ghule'
WHERE t.trader_code = 'BHV-0112';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sanjay A Nasaheb Ghule'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '112'
  AND tg.association_registration_number = '196';

-- Row 113 | BHV-0113 | Mobile 7083545030 | Gala 197
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi Nath D y Jhade',
    t.business_name_en = 'Navanath Agency'
WHERE t.trader_code = 'BHV-0113';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Navanath Agency'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '113'
  AND tg.association_registration_number = '197';

-- Row 114 | BHV-0114 | Mobile 9881507775 | Gala 199
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush patarav Majumu Le',
    t.business_name_en = 'Sinal & Company'
WHERE t.trader_code = 'BHV-0114';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sinal & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '114'
  AND tg.association_registration_number = '199';

-- Row 115 | BHV-0115 | Mobile 9822400369 | Gala 200
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dip nobakhatal',
    t.business_name_en = 'nobabalavant Khatal'
WHERE t.trader_code = 'BHV-0115';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'nobabalavant Khatal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '115'
  AND tg.association_registration_number = '200';

-- Row 116 | BHV-0116 | Mobile 9224304200 | Gala 201
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Parasaram Mahadev Jhade',
    t.business_name_en = 'Parasaram Mahadev Jhade'
WHERE t.trader_code = 'BHV-0116';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Parasaram Mahadev Jhade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '116'
  AND tg.association_registration_number = '201';

-- Row 117 | BHV-0117 | Mobile 9881912020 | Gala 202
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Wadkar',
    t.business_name_en = 'Shabhuranbh d G Company'
WHERE t.trader_code = 'BHV-0117';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shabhuranbh d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '117'
  AND tg.association_registration_number = '202';

-- Row 118 | BHV-0118 | Mobile 9822524242 | Gala 203
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chanbhagamanohar Badade',
    t.business_name_en = 'Badade& Company'
WHERE t.trader_code = 'BHV-0118';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Badade& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '118'
  AND tg.association_registration_number = '203';

-- Row 119 | BHV-0119 | Mobile 7773912584 | Gala 204
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vavik Tukaram Kamathe',
    t.business_name_en = 'Tak ram Sajarav Kamathe'
WHERE t.trader_code = 'BHV-0119';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Tak ram Sajarav Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '119'
  AND tg.association_registration_number = '204';

-- Row 120 | BHV-0120 | Mobile 8149139129 | Gala 205
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mahal G Dagadu Korape',
    t.business_name_en = 'Mahal G Dagadu Korape& Company'
WHERE t.trader_code = 'BHV-0120';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mahal G Dagadu Korape& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '120'
  AND tg.association_registration_number = '205';

-- Row 121 | BHV-0121 | Mobile 8380881086 | Gala 206
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Najhir Bashari Shekh',
    t.business_name_en = 'Ganibhai Dagadubhai & Brothers'
WHERE t.trader_code = 'BHV-0121';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganibhai Dagadubhai & Brothers'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '121'
  AND tg.association_registration_number = '206';

-- Row 122 | BHV-0122 | Mobile 9422000224 | Gala 207
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rohan ner Banakar',
    t.business_name_en = 'ner Narayan Banakar'
WHERE t.trader_code = 'BHV-0122';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ner Narayan Banakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '122'
  AND tg.association_registration_number = '207';

-- Row 123 | BHV-0123 | Mobile 9657721219 | Gala 208
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Gawadenandakumar Mohan',
    t.business_name_en = 'Gawadekalekanpani'
WHERE t.trader_code = 'BHV-0123';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Gawadekalekanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '123'
  AND tg.association_registration_number = '208';

-- Row 124 | BHV-0124 | Mobile 9860892916 | Gala 209
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Atal shavijirav Kadam',
    t.business_name_en = 'L Manarav Kri Najikadam'
WHERE t.trader_code = 'BHV-0124';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'L Manarav Kri Najikadam'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '124'
  AND tg.association_registration_number = '209';

-- Row 125 | BHV-0125 | Mobile 9822044467 | Gala 210
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Keshavarav Navi malasure',
    t.business_name_en = 'Keshavarav Navi malasure'
WHERE t.trader_code = 'BHV-0125';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Keshavarav Navi malasure'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '125'
  AND tg.association_registration_number = '210';

-- Row 126 | BHV-0126 | Mobile 9890863131 | Gala 211
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ajati Raghanuth Navale',
    t.business_name_en = 'Raghanuth Bhakijinavale'
WHERE t.trader_code = 'BHV-0126';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Raghanuth Bhakijinavale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '126'
  AND tg.association_registration_number = '211';

-- Row 127 | BHV-0127 | Mobile 9822283270 | Gala 212
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramadas Anantakatakar',
    t.business_name_en = 'Ramadas Anantakatakar'
WHERE t.trader_code = 'BHV-0127';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramadas Anantakatakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '127'
  AND tg.association_registration_number = '212';

-- Row 128 | BHV-0128 | Mobile 9422338151 | Gala 213
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chankant Ghadge',
    t.business_name_en = 'Vi Nahatd G Company'
WHERE t.trader_code = 'BHV-0128';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Nahatd G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '128'
  AND tg.association_registration_number = '213';

-- Row 129 | BHV-0129 | Mobile 8329864833 | Gala 214
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Namadev Ganapat Th Bare',
    t.business_name_en = 'Namadev Ganapat Th Bare'
WHERE t.trader_code = 'BHV-0129';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Namadev Ganapat Th Bare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '129'
  AND tg.association_registration_number = '214';

-- Row 130 | BHV-0130 | Mobile 9527085876 | Gala 215 â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rahal Kandalik Khatape',
    t.business_name_en = 'Balasaheb D y Khatape'
WHERE t.trader_code = 'BHV-0130';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balasaheb D y Khatape'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '130'
  AND tg.association_registration_number = '215';

-- Row 131 | BHV-0131 | Mobile 9890692215 | Gala 215
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mi Chhanch Han',
    t.business_name_en = 'Had Ani Baliram Company'
WHERE t.trader_code = 'BHV-0131';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Had Ani Baliram Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '131'
  AND tg.association_registration_number = '215';

-- Row 132 | BHV-0132 | Mobile 8180989989 | Gala 216â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Thamesh Ramesh Ch Han',
    t.business_name_en = 'S Ngikri Shisevaej Si'
WHERE t.trader_code = 'BHV-0132';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'S Ngikri Shisevaej Si'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '132'
  AND tg.association_registration_number = '216â– ';

-- Row 133 | BHV-0133 | Mobile 9371041525 | Gala 216, 217, 364, 365
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramesh Vi Nath Khaire',
    t.business_name_en = 'Vi Nath L Man Khaire'
WHERE t.trader_code = 'BHV-0133';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Nath L Man Khaire'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '133'
  AND tg.association_registration_number = '216';

-- Row 134 | BHV-0134 | Mobile 9921473330 | Gala 218
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'D dapaki Jagadale',
    t.business_name_en = 'kri N d G Company'
WHERE t.trader_code = 'BHV-0134';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'kri N d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '134'
  AND tg.association_registration_number = '218';

-- Row 135 | BHV-0135 | Mobile 7350015501 | Gala 220, 221
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anali Marulidhar Ghule',
    t.business_name_en = 'Anali Marulidhar Ghule'
WHERE t.trader_code = 'BHV-0135';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Anali Marulidhar Ghule'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '135'
  AND tg.association_registration_number = '220';

-- Row 136 | BHV-0136 | Mobile 9422002360 | Gala 222, 223
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Amol Marulidhar Ghal',
    t.business_name_en = 'Marulidhar Padhanrinath & Company'
WHERE t.trader_code = 'BHV-0136';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Marulidhar Padhanrinath & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '136'
  AND tg.association_registration_number = '222';

-- Row 137 | BHV-0137 | Mobile - | Gala 224
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dalip Shavarim Bhujabal',
    t.business_name_en = 'Dalip Shavarim Bhajubal'
WHERE t.trader_code = 'BHV-0137';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dalip Shavarim Bhajubal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '137'
  AND tg.association_registration_number = '224';

-- Row 138 | BHV-0138 | Mobile 9860601313 | Gala 225, 427,428
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sabhush Pandurang Thati',
    t.business_name_en = 'Pandurang Bhakibathatiand S S'
WHERE t.trader_code = 'BHV-0138';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandurang Bhakibathatiand S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '138'
  AND tg.association_registration_number = '225';

-- Row 139 | BHV-0139 | Mobile 9922318555 | Gala 226, 374
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Harinbabaruv Padhanre',
    t.business_name_en = 'Babaruv Matipadhanre'
WHERE t.trader_code = 'BHV-0139';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Babaruv Matipadhanre'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '139'
  AND tg.association_registration_number = '226';

-- Row 140 | BHV-0140 | Mobile 9912220016 | Gala 227
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Raj Vi Larav Taware',
    t.business_name_en = 'Vi L Gulabarav Taware'
WHERE t.trader_code = 'BHV-0140';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi L Gulabarav Taware'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '140'
  AND tg.association_registration_number = '227';

-- Row 141 | BHV-0141 | Mobile 9665690002 | Gala 228, 376
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Samari Vaniyak Akhade',
    t.business_name_en = 'Marulidhar Ramabhau Akhade'
WHERE t.trader_code = 'BHV-0141';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Marulidhar Ramabhau Akhade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '141'
  AND tg.association_registration_number = '228';

-- Row 142 | BHV-0142 | Mobile 7798842269 | Gala 229
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = '-',
    t.business_name_en = 'Jayah D d G Companymatinalami Amati Jadhav'
WHERE t.trader_code = 'BHV-0142';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jayah D d G Companymatinalami Amati Jadhav'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '142'
  AND tg.association_registration_number = '229';

-- Row 143 | BHV-0143 | Mobile 9822308047 | Gala 230
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Somanath Mujihole',
    t.business_name_en = 'L Mibai Mujihole'
WHERE t.trader_code = 'BHV-0143';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'L Mibai Mujihole'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '143'
  AND tg.association_registration_number = '230';

-- Row 144 | BHV-0144 | Mobile 9822845511 | Gala 231
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Raj H Rabhau Rayakar',
    t.business_name_en = 'Sadashavi H Rabhau Rayakar'
WHERE t.trader_code = 'BHV-0144';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sadashavi H Rabhau Rayakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '144'
  AND tg.association_registration_number = '231';

-- Row 145 | BHV-0145 | Mobile 9371022039 | Gala 233, 382
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Valis D y Bhujabal',
    t.business_name_en = 'Valis D y Bhajubal & S S'
WHERE t.trader_code = 'BHV-0145';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Valis D y Bhajubal & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '145'
  AND tg.association_registration_number = '233';

-- Row 146 | BHV-0146 | Mobile 9822967206 | Gala 237
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Garish ner Korape',
    t.business_name_en = 'ner Shak Nr Korapeand S S'
WHERE t.trader_code = 'BHV-0146';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ner Shak Nr Korapeand S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '146'
  AND tg.association_registration_number = '237';

-- Row 147 | BHV-0147 | Mobile - | Gala 241
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mi Chhanbaban Wadkar',
    t.business_name_en = 'Wadkar & S S'
WHERE t.trader_code = 'BHV-0147';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Wadkar & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '147'
  AND tg.association_registration_number = '241';

-- Row 148 | BHV-0148 | Mobile 9422316279 | Gala 248
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sanpat Dagadu Chaudhari',
    t.business_name_en = 'Ke.Di.Chaudhari'
WHERE t.trader_code = 'BHV-0148';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ke.Di.Chaudhari'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '148'
  AND tg.association_registration_number = '248';

-- Row 149 | BHV-0149 | Mobile - | Gala 197
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi Nath D y Jhade',
    t.business_name_en = 'Navanath Agency'
WHERE t.trader_code = 'BHV-0149';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Navanath Agency'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '149'
  AND tg.association_registration_number = '253';

-- Row 150 | BHV-0150 | Mobile 9333993399 | Gala 257â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Yash Nalish Thopte',
    t.business_name_en = 'Davukur d G Company'
WHERE t.trader_code = 'BHV-0150';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Davukur d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '150'
  AND tg.association_registration_number = '257';

-- Row 151 | BHV-0151 | Mobile 9822080154 | Gala 331
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Pandurang Jag Nath Harale',
    t.business_name_en = 'Pandurang Jag Nath Harale'
WHERE t.trader_code = 'BHV-0151';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandurang Jag Nath Harale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '151'
  AND tg.association_registration_number = '331';

-- Row 152 | BHV-0152 | Mobile - | Gala 332
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sabhush Matishadagar',
    t.business_name_en = 'Jarandeshadakar & Company'
WHERE t.trader_code = 'BHV-0152';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jarandeshadakar & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '152'
  AND tg.association_registration_number = '332';

-- Row 153 | BHV-0153 | Mobile 9850320335 | Gala 333
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jag Nath Sahebarav Jhade',
    t.business_name_en = 'Jag Nath Sahebarav Jhade'
WHERE t.trader_code = 'BHV-0153';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jag Nath Sahebarav Jhade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '153'
  AND tg.association_registration_number = '333';

-- Row 154 | BHV-0154 | Mobile 9922424685 | Gala 334
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nasheth Babaruv Devakar',
    t.business_name_en = 'Yotibd G Company'
WHERE t.trader_code = 'BHV-0154';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Yotibd G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '154'
  AND tg.association_registration_number = '334';

-- Row 155 | BHV-0155 | Mobile 9422003335 | Gala 335
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'N Tukaram Ghodake',
    t.business_name_en = 'N Tukaram Ghodake'
WHERE t.trader_code = 'BHV-0155';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'N Tukaram Ghodake'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '155'
  AND tg.association_registration_number = '335';

-- Row 156 | BHV-0156 | Mobile 9727268744 | Gala 336
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Kasani Anantaghare',
    t.business_name_en = 'Kasani Anantaghare'
WHERE t.trader_code = 'BHV-0156';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kasani Anantaghare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '156'
  AND tg.association_registration_number = '336';

-- Row 157 | BHV-0157 | Mobile - | Gala 337
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vaibhav Lalaso Jagtap',
    t.business_name_en = 'Jadhav Jagtap Company'
WHERE t.trader_code = 'BHV-0157';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jadhav Jagtap Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '157'
  AND tg.association_registration_number = '337';

-- Row 158 | BHV-0158 | Mobile - | Gala 338
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinal Balakri N Gayakavad',
    t.business_name_en = 'Gayakavad & Company'
WHERE t.trader_code = 'BHV-0158';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Gayakavad & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '158'
  AND tg.association_registration_number = '338';

-- Row 159 | BHV-0159 | Mobile 9422349430 | Gala 339
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sajany Sopan K De',
    t.business_name_en = 'Bhoradek De& Company'
WHERE t.trader_code = 'BHV-0159';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhoradek De& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '159'
  AND tg.association_registration_number = '339';

-- Row 160 | BHV-0160 | Mobile 9823697300 | Gala 340, 341
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ak Nsh Tanajikanjir',
    t.business_name_en = 'Ganapat Vi Nu Kanjir'
WHERE t.trader_code = 'BHV-0160';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganapat Vi Nu Kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '160'
  AND tg.association_registration_number = '340';

-- Row 161 | BHV-0161 | Mobile 9527148267 | Gala 342
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhakar Devaram Lonakar',
    t.business_name_en = 'Bhakar Devaram Lonakar'
WHERE t.trader_code = 'BHV-0161';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhakar Devaram Lonakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '161'
  AND tg.association_registration_number = '342';

-- Row 162 | BHV-0162 | Mobile 9823055545 | Gala 343
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vani Balasaheb Gayakavad',
    t.business_name_en = 'Ji.Ji. Company'
WHERE t.trader_code = 'BHV-0162';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ji.Ji. Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '162'
  AND tg.association_registration_number = '343';

-- Row 163 | BHV-0163 | Mobile 9960506010 | Gala 344
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ravinnatharum Manakar',
    t.business_name_en = 'Natharum Ganapatimanakar'
WHERE t.trader_code = 'BHV-0163';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Natharum Ganapatimanakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '163'
  AND tg.association_registration_number = '344';

-- Row 164 | BHV-0164 | Mobile 9890913906 | Gala 345
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Hanumatankasanariv Kamathe',
    t.business_name_en = 'Kasanariv Ganapatarav Kamatheand S S'
WHERE t.trader_code = 'BHV-0164';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kasanariv Ganapatarav Kamatheand S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '164'
  AND tg.association_registration_number = '345';

-- Row 165 | BHV-0165 | Mobile 9922734637 | Gala 346
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vakis Shavijik De',
    t.business_name_en = 'Sai Sad d G Company'
WHERE t.trader_code = 'BHV-0165';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sai Sad d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '165'
  AND tg.association_registration_number = '346';

-- Row 166 | BHV-0166 | Mobile 9970438888 | Gala 347
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = '-',
    t.business_name_en = 'patianatankhatatematimanashisajany Khatate'
WHERE t.trader_code = 'BHV-0166';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'patianatankhatatematimanashisajany Khatate'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '166'
  AND tg.association_registration_number = '347';

-- Row 167 | BHV-0167 | Mobile 9422509398 | Gala 349
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Kantalil Hariman Chatalakari',
    t.business_name_en = 'Kantalil Hariman Chatalakari'
WHERE t.trader_code = 'BHV-0167';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kantalil Hariman Chatalakari'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '167'
  AND tg.association_registration_number = '349';

-- Row 168 | BHV-0168 | Mobile 9226746906 | Gala 350
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Manohar U M Choraghe',
    t.business_name_en = 'Choraged G Company'
WHERE t.trader_code = 'BHV-0168';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Choraged G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '168'
  AND tg.association_registration_number = '350';

-- Row 169 | BHV-0169 | Mobile 7666833861 | Gala 351
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Wadkar Kamal Jag Nath',
    t.business_name_en = 'Navanath d G Company'
WHERE t.trader_code = 'BHV-0169';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Navanath d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '169'
  AND tg.association_registration_number = '351';

-- Row 170 | BHV-0170 | Mobile 9922424684 | Gala 352
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = '-',
    t.business_name_en = 'Sakh raj Ekanath Kanjir Vamali Sukharaj Kanjir'
WHERE t.trader_code = 'BHV-0170';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sakh raj Ekanath Kanjir Vamali Sukharaj Kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '170'
  AND tg.association_registration_number = '352';

-- Row 171 | BHV-0171 | Mobile 9921512299 | Gala 353
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sharad Dhamale',
    t.business_name_en = 'Dhamalenanavare& Company'
WHERE t.trader_code = 'BHV-0171';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dhamalenanavare& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '171'
  AND tg.association_registration_number = '353';

-- Row 172 | BHV-0172 | Mobile - | Gala 354
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tak ram Shankar Badade',
    t.business_name_en = 'Tak ram Shak Nr Badade'
WHERE t.trader_code = 'BHV-0172';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Tak ram Shak Nr Badade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '172'
  AND tg.association_registration_number = '354';

-- Row 173 | BHV-0173 | Mobile 7058267803 | Gala 355
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhosalepesh Sadashavi',
    t.business_name_en = 'Bi.Ke.Di. & Company'
WHERE t.trader_code = 'BHV-0173';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bi.Ke.Di. & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '173'
  AND tg.association_registration_number = '355';

-- Row 174 | BHV-0174 | Mobile 9822894140 | Gala 356
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadanp Bhakijikatake',
    t.business_name_en = 'Katked G Company'
WHERE t.trader_code = 'BHV-0174';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Katked G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '174'
  AND tg.association_registration_number = '356';

-- Row 175 | BHV-0175 | Mobile 9881749353 | Gala 357
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Kash Shavasim Kale',
    t.business_name_en = 'Gawadekalekanpani'
WHERE t.trader_code = 'BHV-0175';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Gawadekalekanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '175'
  AND tg.association_registration_number = '357';

-- Row 176 | BHV-0176 | Mobile 8087702217 | Gala 358
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sahus Sadhukar Borakar',
    t.business_name_en = 'Sadhukar Keshav Borakar'
WHERE t.trader_code = 'BHV-0176';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sadhukar Keshav Borakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '176'
  AND tg.association_registration_number = '358';

-- Row 177 | BHV-0177 | Mobile 9422356550 | Gala 359
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Popat Gogavale',
    t.business_name_en = 'Popat Matigogavale'
WHERE t.trader_code = 'BHV-0177';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Popat Matigogavale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '177'
  AND tg.association_registration_number = '359';

-- Row 178 | BHV-0178 | Mobile 9175790832 | Gala 360
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shant D y Dedage',
    t.business_name_en = 'Shant D y Dedage'
WHERE t.trader_code = 'BHV-0178';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shant D y Dedage'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '178'
  AND tg.association_registration_number = '360';

-- Row 179 | BHV-0179 | Mobile - | Gala 361
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'ner Vi L Pasil',
    t.business_name_en = 'Vi Larav Bhavariv Pasil'
WHERE t.trader_code = 'BHV-0179';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Larav Bhavariv Pasil'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '179'
  AND tg.association_registration_number = '361';

-- Row 180 | BHV-0180 | Mobile - | Gala 362
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mohan Shak Nr Jagtap',
    t.business_name_en = 'Shakanr Balajijagatap'
WHERE t.trader_code = 'BHV-0180';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shakanr Balajijagatap'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '180'
  AND tg.association_registration_number = '362';

-- Row 181 | BHV-0181 | Mobile - | Gala 363
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vashil Manasing Gote',
    t.business_name_en = 'Manasing Madhavarav Gote'
WHERE t.trader_code = 'BHV-0181';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Manasing Madhavarav Gote'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '181'
  AND tg.association_registration_number = '363';

-- Row 182 | BHV-0182 | Mobile 7588218747 | Gala 366
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'ner Satiram Pavale',
    t.business_name_en = 'Pavale& Company'
WHERE t.trader_code = 'BHV-0182';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pavale& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '182'
  AND tg.association_registration_number = '366';

-- Row 183 | BHV-0183 | Mobile 9822958083 | Gala 367
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Satansh Baparuv Kapase',
    t.business_name_en = 'Shavaganish d G Company'
WHERE t.trader_code = 'BHV-0183';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavaganish d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '183'
  AND tg.association_registration_number = '367';

-- Row 184 | BHV-0184 | Mobile 9881796131 | Gala 368
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Aravind Sanbhajivadakar',
    t.business_name_en = 'Babanarav Anantarav Wadkar & Das'
WHERE t.trader_code = 'BHV-0184';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Babanarav Anantarav Wadkar & Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '184'
  AND tg.association_registration_number = '368';

-- Row 185 | BHV-0185 | Mobile 9422002360 | Gala 369
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Gautam Amol Ghal',
    t.business_name_en = 'Marulidhar Pandharinath Ghal ank Company'
WHERE t.trader_code = 'BHV-0185';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Marulidhar Pandharinath Ghal ank Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '185'
  AND tg.association_registration_number = '369';

-- Row 186 | BHV-0186 | Mobile 9422002360 | Gala 370
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Aratiamol Ghule',
    t.business_name_en = 'Ghal and S S'
WHERE t.trader_code = 'BHV-0186';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ghal and S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '186'
  AND tg.association_registration_number = '370';

-- Row 187 | BHV-0187 | Mobile 9763454471 | Gala 371
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chankatanbabanarav Jadhav',
    t.business_name_en = 'Chankatanbabanarav Jadhav & S S'
WHERE t.trader_code = 'BHV-0187';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Chankatanbabanarav Jadhav & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '187'
  AND tg.association_registration_number = '371';

-- Row 188 | BHV-0188 | Mobile 9421052455 | Gala 372
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anali Shavarim Bhajubal',
    t.business_name_en = 'Anali Shavarim Bhajubal'
WHERE t.trader_code = 'BHV-0188';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Anali Shavarim Bhajubal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '188'
  AND tg.association_registration_number = '372';

-- Row 189 | BHV-0189 | Mobile 9822015492 | Gala 373
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anali Vi L Dagu',
    t.business_name_en = 'Vasant Agency'
WHERE t.trader_code = 'BHV-0189';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vasant Agency'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '189'
  AND tg.association_registration_number = '373';

-- Row 190 | BHV-0190 | Mobile 9822312053 | Gala 375
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Raj Shamarav Palande',
    t.business_name_en = 'Raj Shamarav Palande'
WHERE t.trader_code = 'BHV-0190';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Raj Shamarav Palande'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '190'
  AND tg.association_registration_number = '375';

-- Row 191 | BHV-0191 | Mobile 9960888911 | Gala 377
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Balasaheb Shak Nrarav Kamathe',
    t.business_name_en = 'Balasaheb Shakanrarav Kamathe'
WHERE t.trader_code = 'BHV-0191';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balasaheb Shakanrarav Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '191'
  AND tg.association_registration_number = '377';

-- Row 192 | BHV-0192 | Mobile 8149438361 | Gala 378
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Baparu v Babaru v Raut',
    t.business_name_en = 'Vagat Agency'
WHERE t.trader_code = 'BHV-0192';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vagat Agency'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '192'
  AND tg.association_registration_number = '378';

-- Row 193 | BHV-0193 | Mobile 9850132575 | Gala 379
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Valis Babanarav Katke',
    t.business_name_en = 'Katkeand S S'
WHERE t.trader_code = 'BHV-0193';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Katkeand S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '193'
  AND tg.association_registration_number = '379';

-- Row 194 | BHV-0194 | Mobile 9850813858 | Gala 380
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Karani Bhakijikatake',
    t.business_name_en = 'Katke& Company'
WHERE t.trader_code = 'BHV-0194';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Katke& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '194'
  AND tg.association_registration_number = '380';

-- Row 195 | BHV-0195 | Mobile - | Gala 381
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramesh D y Bhujabal',
    t.business_name_en = 'Ramesh D y Bhujabal & S S'
WHERE t.trader_code = 'BHV-0195';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramesh D y Bhujabal & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '195'
  AND tg.association_registration_number = '381';

-- Row 196 | BHV-0196 | Mobile 9823723246 | Gala 387
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'B Silal Tak ram Shadakar',
    t.business_name_en = 'B Silal Tak ram Shadakar'
WHERE t.trader_code = 'BHV-0196';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'B Silal Tak ram Shadakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '196'
  AND tg.association_registration_number = '387';

-- Row 197 | BHV-0197 | Mobile 7588034104 | Gala 388
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rajaram Shamarav Payagadu',
    t.business_name_en = 'Shamarav Babaruv Payagadu'
WHERE t.trader_code = 'BHV-0197';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shamarav Babaruv Payagadu'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '197'
  AND tg.association_registration_number = '388';

-- Row 198 | BHV-0198 | Mobile 8830938630 | Gala 393
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vandanaanali Jadhav',
    t.business_name_en = 'Mahal Midas'
WHERE t.trader_code = 'BHV-0198';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mahal Midas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '198'
  AND tg.association_registration_number = '393';

-- Row 199 | BHV-0199 | Mobile 9850558279 | Gala 395
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sayukant L Man Pawar',
    t.business_name_en = 'El.Di.Pi. & Company'
WHERE t.trader_code = 'BHV-0199';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'El.Di.Pi. & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '199'
  AND tg.association_registration_number = '395';

-- Row 200 | BHV-0200 | Mobile 9822050196 | Gala 396
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sanjay Satiram Talekar',
    t.business_name_en = 'Sanjay Satiram Talekar'
WHERE t.trader_code = 'BHV-0200';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sanjay Satiram Talekar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '200'
  AND tg.association_registration_number = '396';

-- Row 201 | BHV-0201 | Mobile 9822015048 | Gala 400, 401
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dapaki Shankararav Gore',
    t.business_name_en = 'Maharaj Jar Company'
WHERE t.trader_code = 'BHV-0201';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Maharaj Jar Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '201'
  AND tg.association_registration_number = '400';

-- Row 202 | BHV-0202 | Mobile 9881463359 | Gala 402
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shatangayakavad',
    t.business_name_en = 'Bhagavan das'
WHERE t.trader_code = 'BHV-0202';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhagavan das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '202'
  AND tg.association_registration_number = '402';

-- Row 203 | BHV-0203 | Mobile 9881204203 | Gala 404
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Raj Ramadas Mokashi',
    t.business_name_en = 'Mahadev Ganapat Mokashi'
WHERE t.trader_code = 'BHV-0203';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mahadev Ganapat Mokashi'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '203'
  AND tg.association_registration_number = '404';

-- Row 204 | BHV-0204 | Mobile 9822295661 | Gala 405
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shantaram Gangaram Gavare',
    t.business_name_en = 'Es.Ji.Gavare'
WHERE t.trader_code = 'BHV-0204';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Es.Ji.Gavare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '204'
  AND tg.association_registration_number = '405';

-- Row 205 | BHV-0205 | Mobile 9822291397 | Gala 406
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Kash Babanarav More',
    t.business_name_en = 'Babanarav Padanrang More'
WHERE t.trader_code = 'BHV-0205';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Babanarav Padanrang More'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '205'
  AND tg.association_registration_number = '406';

-- Row 206 | BHV-0206 | Mobile 9881232401 | Gala 407
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rajesh Satiram Talekar',
    t.business_name_en = 'Rajesh Satiram Talekar'
WHERE t.trader_code = 'BHV-0206';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rajesh Satiram Talekar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '206'
  AND tg.association_registration_number = '407';

-- Row 207 | BHV-0207 | Mobile 9823107058 | Gala 487, 488
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganeshasheth Sopanarav Ghal',
    t.business_name_en = 'Jay Sharadagajanan'
WHERE t.trader_code = 'BHV-0207';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jay Sharadagajanan'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '207'
  AND tg.association_registration_number = '487';

-- Row 208 | BHV-0208 | Mobile - | Gala 490
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Pri Viraj rang Bhoite',
    t.business_name_en = 'Rajakri Shir N d G Company'
WHERE t.trader_code = 'BHV-0208';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rajakri Shir N d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '208'
  AND tg.association_registration_number = '490';

-- Row 209 | BHV-0209 | Mobile 9422305238 | Gala 491
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rajiv Pandharinath Kanjir',
    t.business_name_en = 'Pandharinath Chamijikanjir'
WHERE t.trader_code = 'BHV-0209';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandharinath Chamijikanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '209'
  AND tg.association_registration_number = '491';

-- Row 210 | BHV-0210 | Mobile 9922218333 | Gala 492
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sagar Shavijibhosale',
    t.business_name_en = 'Bhosaledeshamakh kanpani'
WHERE t.trader_code = 'BHV-0210';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhosaledeshamakh kanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '210'
  AND tg.association_registration_number = '492';

-- Row 211 | BHV-0211 | Mobile 9623441442 | Gala 493
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rahal Babanarav Kachi',
    t.business_name_en = 'Babanarav Tulajaram Kachi'
WHERE t.trader_code = 'BHV-0211';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Babanarav Tulajaram Kachi'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '211'
  AND tg.association_registration_number = '493';

-- Row 212 | BHV-0212 | Mobile 9822018125 | Gala 495
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Dh Dibapoman',
    t.business_name_en = 'Dh Dibashavarim Poman'
WHERE t.trader_code = 'BHV-0212';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dh Dibashavarim Poman'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '212'
  AND tg.association_registration_number = '495';

-- Row 213 | BHV-0213 | Mobile 9850874570 | Gala 496
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tak ram Rakhanath Katke',
    t.business_name_en = 'Shavashakinr d G Company'
WHERE t.trader_code = 'BHV-0213';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavashakinr d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '213'
  AND tg.association_registration_number = '496';

-- Row 214 | BHV-0214 | Mobile 7083001110 | Gala 498
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'R Nakar Hariman Kedari',
    t.business_name_en = 'Daninath & Company'
WHERE t.trader_code = 'BHV-0214';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Daninath & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '214'
  AND tg.association_registration_number = '498';

-- Row 215 | BHV-0215 | Mobile 9850422636 | Gala 499
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dhananjay Navi bhalerav',
    t.business_name_en = 'Ramakri N d G Company'
WHERE t.trader_code = 'BHV-0215';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramakri N d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '215'
  AND tg.association_registration_number = '499';

-- Row 216 | BHV-0216 | Mobile 9623277249 | Gala 500
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sharad Shavarim Khenat',
    t.business_name_en = 'Sharad Shavarim Khenat'
WHERE t.trader_code = 'BHV-0216';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sharad Shavarim Khenat'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '216'
  AND tg.association_registration_number = '500';

-- Row 217 | BHV-0217 | Mobile 9284510790 | Gala 501
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shant Anandavag Kar',
    t.business_name_en = 'Anandabhamariv Vag Kar'
WHERE t.trader_code = 'BHV-0217';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Anandabhamariv Vag Kar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '217'
  AND tg.association_registration_number = '501';

-- Row 218 | BHV-0218 | Mobile 9822211678 | Gala 502
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhausaheb Shankar Kadam',
    t.business_name_en = 'Shankararav Matarav Kadam'
WHERE t.trader_code = 'BHV-0218';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shankararav Matarav Kadam'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '218'
  AND tg.association_registration_number = '502';

-- Row 219 | BHV-0219 | Mobile 9860204100 | Gala 503
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bharatasahinshak Nrasahinparadeshi',
    t.business_name_en = 'Ayan Hejitebal Company'
WHERE t.trader_code = 'BHV-0219';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ayan Hejitebal Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '219'
  AND tg.association_registration_number = '503';

-- Row 220 | BHV-0220 | Mobile - | Gala 506
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'ner Dh Dibathorat',
    t.business_name_en = 'ner Dh Dibathorat'
WHERE t.trader_code = 'BHV-0220';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ner Dh Dibathorat'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '220'
  AND tg.association_registration_number = '506';

-- Row 221 | BHV-0221 | Mobile 9822530754 | Gala 507
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Devaram Babaruv Karale',
    t.business_name_en = 'D d G Company'
WHERE t.trader_code = 'BHV-0221';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'D d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '221'
  AND tg.association_registration_number = '507';

-- Row 222 | BHV-0222 | Mobile 9325656170 | Gala 508
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Yash Natin Khedekar',
    t.business_name_en = 'Natin nadev Khedekar'
WHERE t.trader_code = 'BHV-0222';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Natin nadev Khedekar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '222'
  AND tg.association_registration_number = '508';

-- Row 223 | BHV-0223 | Mobile 8087662553 | Gala 509
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ashashi Nandakumar Ch Han',
    t.business_name_en = 'Nandakumar Sakharam Ch Han'
WHERE t.trader_code = 'BHV-0223';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Nandakumar Sakharam Ch Han'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '223'
  AND tg.association_registration_number = '509';

-- Row 224 | BHV-0224 | Mobile 9767192289 | Gala 510
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ashok Shak Nrarav Thorat',
    t.business_name_en = 'Ashok Shak Nrarav Thorat'
WHERE t.trader_code = 'BHV-0224';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashok Shak Nrarav Thorat'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '224'
  AND tg.association_registration_number = '510';

-- Row 225 | BHV-0225 | Mobile 9552592071 | Gala 511
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Madhak r Ramakri N Thorat',
    t.business_name_en = 'Ramakri N Matarav Thorat Das'
WHERE t.trader_code = 'BHV-0225';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramakri N Matarav Thorat Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '225'
  AND tg.association_registration_number = '511';

-- Row 226 | BHV-0226 | Mobile 9922433672 | Gala 513, 489
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Janadan Ganapat Thorat',
    t.business_name_en = 'Vathibaramajithorat & S S'
WHERE t.trader_code = 'BHV-0226';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vathibaramajithorat & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '226'
  AND tg.association_registration_number = '513';

-- Row 227 | BHV-0227 | Mobile 9822314673 | Gala 514
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ravasaheb Dinkar Kanjir',
    t.business_name_en = 'Ravasaheb Dinkar Kanjir'
WHERE t.trader_code = 'BHV-0227';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ravasaheb Dinkar Kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '227'
  AND tg.association_registration_number = '514';

-- Row 228 | BHV-0228 | Mobile 7420917858 | Gala 515
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shavijinamadev Dhumal',
    t.business_name_en = 'Taki d G Company'
WHERE t.trader_code = 'BHV-0228';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Taki d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '228'
  AND tg.association_registration_number = '515';

-- Row 229 | BHV-0229 | Mobile 9915517507 | Gala 517
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sagar Narayan Kedari',
    t.business_name_en = 'L Minarayan & Company'
WHERE t.trader_code = 'BHV-0229';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'L Minarayan & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '229'
  AND tg.association_registration_number = '517';

-- Row 230 | BHV-0230 | Mobile 9822742630 | Gala 518
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Somanath Ganapat He',
    t.business_name_en = 'Ganapat Gulab He'
WHERE t.trader_code = 'BHV-0230';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganapat Gulab He'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '230'
  AND tg.association_registration_number = '518';

-- Row 231 | BHV-0231 | Mobile 9561000585 | Gala 519
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Danish Vi L Salanke',
    t.business_name_en = 'Pawar Salanked G Company'
WHERE t.trader_code = 'BHV-0231';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pawar Salanked G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '231'
  AND tg.association_registration_number = '519';

-- Row 232 | BHV-0232 | Mobile - | Gala 520
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhashu N Sabhanjibhosale',
    t.business_name_en = 'Sabhanjibabanarav Bhosale'
WHERE t.trader_code = 'BHV-0232';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sabhanjibabanarav Bhosale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '232'
  AND tg.association_registration_number = '520';

-- Row 233 | BHV-0233 | Mobile 9822553231 | Gala 522
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadanp Vi L Khatate',
    t.business_name_en = 'Vi L Anantakhatate'
WHERE t.trader_code = 'BHV-0233';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi L Anantakhatate'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '233'
  AND tg.association_registration_number = '522';

-- Row 234 | BHV-0234 | Mobile 9881593159 | Gala 523
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Takuram Sahebarav Jarande',
    t.business_name_en = 'Tukaram Sahebarav Jarande'
WHERE t.trader_code = 'BHV-0234';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Tukaram Sahebarav Jarande'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '234'
  AND tg.association_registration_number = '523';

-- Row 235 | BHV-0235 | Mobile 9822115218 | Gala 524
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Vasatanrav Kamathe',
    t.business_name_en = 'Sachani Vasatanrav Kamathe'
WHERE t.trader_code = 'BHV-0235';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sachani Vasatanrav Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '235'
  AND tg.association_registration_number = '524';

-- Row 236 | BHV-0236 | Mobile 9822516525 | Gala 525
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Gajanan Raghobabhor',
    t.business_name_en = 'Bholaimatd K Company'
WHERE t.trader_code = 'BHV-0236';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bholaimatd K Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '236'
  AND tg.association_registration_number = '525';

-- Row 237 | BHV-0237 | Mobile 7885098828 | Gala 526
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Santosh Vasant Kanjir',
    t.business_name_en = 'Santosh Vasant Kanjir'
WHERE t.trader_code = 'BHV-0237';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Santosh Vasant Kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '237'
  AND tg.association_registration_number = '526';

-- Row 238 | BHV-0238 | Mobile - | Gala 528
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Balasaheb Ganapatarav Valagude',
    t.business_name_en = 'Balasaheb Ganapatarav Valagude'
WHERE t.trader_code = 'BHV-0238';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balasaheb Ganapatarav Valagude'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '238'
  AND tg.association_registration_number = '528';

-- Row 239 | BHV-0239 | Mobile 9850097252 | Gala 529
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Th Barekasani Vaman',
    t.business_name_en = 'Th Bare& Company'
WHERE t.trader_code = 'BHV-0239';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Th Bare& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '239'
  AND tg.association_registration_number = '529';

-- Row 240 | BHV-0240 | Mobile 9822519649 | Gala 529
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jayesh Vi L Harapale',
    t.business_name_en = 'Jayabhavanishetisivadh'
WHERE t.trader_code = 'BHV-0240';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jayabhavanishetisivadh'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '240'
  AND tg.association_registration_number = '529';

-- Row 241 | BHV-0241 | Mobile 9822023890 | Gala 531
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rajesh Narayan Pawari',
    t.business_name_en = 'Gay das'
WHERE t.trader_code = 'BHV-0241';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Gay das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '241'
  AND tg.association_registration_number = '531';

-- Row 242 | BHV-0242 | Mobile 9881394347 | Gala 532
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Satiram nadev Khedekar',
    t.business_name_en = 'Khedekar Das'
WHERE t.trader_code = 'BHV-0242';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Khedekar Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '242'
  AND tg.association_registration_number = '532';

-- Row 243 | BHV-0243 | Mobile 7887500065 | Gala 533
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nalish Sadhukar Jagtap',
    t.business_name_en = 'Vi Nand d G Company'
WHERE t.trader_code = 'BHV-0243';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Nand d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '243'
  AND tg.association_registration_number = '533';

-- Row 244 | BHV-0244 | Mobile 9923907042 | Gala 534
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarang ner Tapak R',
    t.business_name_en = 'ner Babasaheb Tapak R'
WHERE t.trader_code = 'BHV-0244';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ner Babasaheb Tapak R'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '244'
  AND tg.association_registration_number = '534';

-- Row 245 | BHV-0245 | Mobile 9822608760 | Gala 535
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Namadev Shavijirav Nakami',
    t.business_name_en = 'Namadev Shavijirav Nakami'
WHERE t.trader_code = 'BHV-0245';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Namadev Shavijirav Nakami'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '245'
  AND tg.association_registration_number = '535';

-- Row 246 | BHV-0246 | Mobile 9766515731 | Gala 536
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Maran Yogesh Thorat',
    t.business_name_en = 'L Manarav Thorat & S S'
WHERE t.trader_code = 'BHV-0246';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'L Manarav Thorat & S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '246'
  AND tg.association_registration_number = '536';

-- Row 247 | BHV-0247 | Mobile 9823523923 | Gala 539
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhagu jiramadas Takhile',
    t.business_name_en = 'Ramadas Matitakhile'
WHERE t.trader_code = 'BHV-0247';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramadas Matitakhile'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '247'
  AND tg.association_registration_number = '539';

-- Row 248 | BHV-0248 | Mobile 9822518025 | Gala 540
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chetan Sadum Rasakar',
    t.business_name_en = 'Chankant Sadum Rasakar'
WHERE t.trader_code = 'BHV-0248';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Chankant Sadum Rasakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '248'
  AND tg.association_registration_number = '540';

-- Row 249 | BHV-0249 | Mobile 9922433838 | Gala 541
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'D y Namadev Gawade',
    t.business_name_en = 'Omansai Hejitebal Company'
WHERE t.trader_code = 'BHV-0249';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Omansai Hejitebal Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '249'
  AND tg.association_registration_number = '541';

-- Row 250 | BHV-0250 | Mobile 9881573915 | Gala 542
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Ramachantavade',
    t.business_name_en = 'Ti Patidas'
WHERE t.trader_code = 'BHV-0250';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ti Patidas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '250'
  AND tg.association_registration_number = '542';

-- Row 251 | BHV-0251 | Mobile 8007830741 | Gala 543
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shashakint Ratanarav Shaki',
    t.business_name_en = 'Somer Agency'
WHERE t.trader_code = 'BHV-0251';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Somer Agency'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '251'
  AND tg.association_registration_number = '543';

-- Row 252 | BHV-0252 | Mobile 9822882645 | Gala 544
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'H Ku Sabhush Badade',
    t.business_name_en = 'Sabhush Vi L Badade'
WHERE t.trader_code = 'BHV-0252';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sabhush Vi L Badade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '252'
  AND tg.association_registration_number = '544';

-- Row 253 | BHV-0253 | Mobile 9881995775 | Gala 545
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dalip Anajiabhang',
    t.business_name_en = 'Dalip Anajiabhang'
WHERE t.trader_code = 'BHV-0253';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dalip Anajiabhang'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '253'
  AND tg.association_registration_number = '545';

-- Row 254 | BHV-0254 | Mobile 9822753956 | Gala 546
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinal Mahadev Kanbharakar',
    t.business_name_en = 'Ramadas Mahadev Kanbharakar'
WHERE t.trader_code = 'BHV-0254';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramadas Mahadev Kanbharakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '254'
  AND tg.association_registration_number = '546';

-- Row 255 | BHV-0255 | Mobile 9822050019 | Gala 547
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'nobaraghunath Kale',
    t.business_name_en = 'nobaraghunath Kale'
WHERE t.trader_code = 'BHV-0255';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'nobaraghunath Kale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '255'
  AND tg.association_registration_number = '547';

-- Row 256 | BHV-0256 | Mobile 9623114491 | Gala 548
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vamik D y Jagadale',
    t.business_name_en = 'Vamik D y Jagadale'
WHERE t.trader_code = 'BHV-0256';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vamik D y Jagadale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '256'
  AND tg.association_registration_number = '548';

-- Row 257 | BHV-0257 | Mobile 9850280131 | Gala 549
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Vi L Datir',
    t.business_name_en = 'Mahal Mid G Company'
WHERE t.trader_code = 'BHV-0257';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mahal Mid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '257'
  AND tg.association_registration_number = '549';

-- Row 258 | BHV-0258 | Mobile 9604612266 | Gala 550
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadanp Namadev Gayakavad',
    t.business_name_en = 'Sandip Namadev Gayakavad'
WHERE t.trader_code = 'BHV-0258';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sandip Namadev Gayakavad'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '258'
  AND tg.association_registration_number = '550';

-- Row 259 | BHV-0259 | Mobile 9881441176 | Gala 551
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rahal Shashakint Bhosale',
    t.business_name_en = 'Shashakint Kaluram Babanarav Bhosale'
WHERE t.trader_code = 'BHV-0259';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shashakint Kaluram Babanarav Bhosale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '259'
  AND tg.association_registration_number = '551';

-- Row 260 | BHV-0260 | Mobile 9881279703 | Gala 552
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ashok Pandurang Kamathe',
    t.business_name_en = 'Sinal & Das'
WHERE t.trader_code = 'BHV-0260';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sinal & Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '260'
  AND tg.association_registration_number = '552';

-- Row 261 | BHV-0261 | Mobile 9850026363 | Gala 553
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vani Tukaram Bh Dave',
    t.business_name_en = 'Vani Tukaram Bh Dave'
WHERE t.trader_code = 'BHV-0261';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vani Tukaram Bh Dave'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '261'
  AND tg.association_registration_number = '553';

-- Row 262 | BHV-0262 | Mobile 9922375045 | Gala 554
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Okanr U M Kotale',
    t.business_name_en = 'U M Balakri N Kolate'
WHERE t.trader_code = 'BHV-0262';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'U M Balakri N Kolate'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '262'
  AND tg.association_registration_number = '554';

-- Row 263 | BHV-0263 | Mobile 9881311635 | Gala 555
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Kash Kamalakar Shatile',
    t.business_name_en = 'Kash Kamalakar Shatiledas'
WHERE t.trader_code = 'BHV-0263';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kash Kamalakar Shatiledas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '263'
  AND tg.association_registration_number = '555';

-- Row 264 | BHV-0264 | Mobile 9822375621 | Gala 556
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Matinobakatake',
    t.business_name_en = 'nobadagadu Katke'
WHERE t.trader_code = 'BHV-0264';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'nobadagadu Katke'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '264'
  AND tg.association_registration_number = '556';

-- Row 265 | BHV-0265 | Mobile 8308620644 | Gala 557
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Namadev D y Kamathe',
    t.business_name_en = 'D y Dhamajikamathe'
WHERE t.trader_code = 'BHV-0265';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'D y Dhamajikamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '265'
  AND tg.association_registration_number = '557';

-- Row 266 | BHV-0266 | Mobile 9822122303 | Gala 558â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tap Shavijirav Nakami',
    t.business_name_en = 'Apulak Kri Shiseva'
WHERE t.trader_code = 'BHV-0266';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Apulak Kri Shiseva'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '266'
  AND tg.association_registration_number = '558';

-- Row 267 | BHV-0267 | Mobile 9423158158 | Gala 558
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Gaurav Dalip Modak',
    t.business_name_en = 'Dalip Govindarav Modak'
WHERE t.trader_code = 'BHV-0267';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dalip Govindarav Modak'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '267'
  AND tg.association_registration_number = '559';

-- Row 268 | BHV-0268 | Mobile 9623557181 | Gala 561
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadanp Padanrang K De',
    t.business_name_en = 'Padanrang Anajik De'
WHERE t.trader_code = 'BHV-0268';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Padanrang Anajik De'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '268'
  AND tg.association_registration_number = '561';

-- Row 269 | BHV-0269 | Mobile - | Gala 562
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anali Vi Rav Dhamadhere',
    t.business_name_en = 'Vi Rav Dh Dibadhamadhere'
WHERE t.trader_code = 'BHV-0269';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Rav Dh Dibadhamadhere'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '269'
  AND tg.association_registration_number = '562';

-- Row 270 | BHV-0270 | Mobile 9370144640 | Gala 563
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Yashavant Sabhudar K De',
    t.business_name_en = 'Sabhudar Sopanarav K De'
WHERE t.trader_code = 'BHV-0270';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sabhudar Sopanarav K De'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '270'
  AND tg.association_registration_number = '563';

-- Row 271 | BHV-0271 | Mobile 9822273752 | Gala 564
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'vaniabhajit Marane',
    t.business_name_en = 'N Raghanuth Marane'
WHERE t.trader_code = 'BHV-0271';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'N Raghanuth Marane'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '271'
  AND tg.association_registration_number = '564';

-- Row 272 | BHV-0272 | Mobile 9689470074 | Gala 565
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Sopan Paganre',
    t.business_name_en = 'Sopan Dagadobapangare'
WHERE t.trader_code = 'BHV-0272';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sopan Dagadobapangare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '272'
  AND tg.association_registration_number = '565';

-- Row 273 | BHV-0273 | Mobile 9923390978 | Gala 566
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadhukar Raghanuth Marane',
    t.business_name_en = 'Sadhukar Raghunath Marane'
WHERE t.trader_code = 'BHV-0273';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sadhukar Raghunath Marane'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '273'
  AND tg.association_registration_number = '566';

-- Row 274 | BHV-0274 | Mobile 9822969220 | Gala 567
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Changadev ram Lokhande',
    t.business_name_en = 'Changadev ram Lokhande'
WHERE t.trader_code = 'BHV-0274';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Changadev ram Lokhande'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '274'
  AND tg.association_registration_number = '567';

-- Row 275 | BHV-0275 | Mobile 9822861640 | Gala 568
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shakanr Anantalohakare',
    t.business_name_en = 'Lohakared G Company'
WHERE t.trader_code = 'BHV-0275';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Lohakared G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '275'
  AND tg.association_registration_number = '568';

-- Row 276 | BHV-0276 | Mobile 7066569569 | Gala 569
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ashok Gorakhanath Bhosale',
    t.business_name_en = 'Ashok Gorakhanath Bhosale'
WHERE t.trader_code = 'BHV-0276';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashok Gorakhanath Bhosale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '276'
  AND tg.association_registration_number = '569';

-- Row 277 | BHV-0277 | Mobile - | Gala 570
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Baban Shabu Lonakar',
    t.business_name_en = 'Baban Shabu Lonakar'
WHERE t.trader_code = 'BHV-0277';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Baban Shabu Lonakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '277'
  AND tg.association_registration_number = '570';

-- Row 278 | BHV-0278 | Mobile 9822251303 | Gala 571
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vathil Shankar Khagare',
    t.business_name_en = 'Vathil Shankar Khagare'
WHERE t.trader_code = 'BHV-0278';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vathil Shankar Khagare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '278'
  AND tg.association_registration_number = '571';

-- Row 279 | BHV-0279 | Mobile 9158006300 | Gala 572
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rishakish Ramachanch Han',
    t.business_name_en = 'Ramachanbapaju ch Han'
WHERE t.trader_code = 'BHV-0279';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramachanbapaju ch Han'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '279'
  AND tg.association_registration_number = '572';

-- Row 280 | BHV-0280 | Mobile 9850081888 | Gala 573
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Shakanr Vi Larav Javalakar',
    t.business_name_en = 'Shankar Vi Larav Javalakar'
WHERE t.trader_code = 'BHV-0280';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shankar Vi Larav Javalakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '280'
  AND tg.association_registration_number = '573';

-- Row 281 | BHV-0281 | Mobile 9225771777 | Gala 574
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Shankararav Parakale',
    t.business_name_en = 'Sarush Shankararav Parakale'
WHERE t.trader_code = 'BHV-0281';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sarush Shankararav Parakale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '281'
  AND tg.association_registration_number = '574';

-- Row 282 | BHV-0282 | Mobile 9960608211 | Gala 575
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinal Manasaginkhagare',
    t.business_name_en = 'Manasing Jayasaginrav Khagare'
WHERE t.trader_code = 'BHV-0282';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Manasing Jayasaginrav Khagare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '282'
  AND tg.association_registration_number = '575';

-- Row 283 | BHV-0283 | Mobile 9822449486 | Gala 576
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anali Ramadas B Gane',
    t.business_name_en = 'Ramadas Kri Najib Gane'
WHERE t.trader_code = 'BHV-0283';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramadas Kri Najib Gane'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '283'
  AND tg.association_registration_number = '576';

-- Row 284 | BHV-0284 | Mobile 9763080717 | Gala 577
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sajany Vi L Adasal',
    t.business_name_en = 'Jadhav Adasul & Company'
WHERE t.trader_code = 'BHV-0284';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jadhav Adasul & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '284'
  AND tg.association_registration_number = '577';

-- Row 285 | BHV-0285 | Mobile 9850297481 | Gala 578
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sayuvash Nraj Abasaheb',
    t.business_name_en = 'Mai d G Company'
WHERE t.trader_code = 'BHV-0285';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mai d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '285'
  AND tg.association_registration_number = '578';

-- Row 286 | BHV-0286 | Mobile 9850828216 | Gala 579â– 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jamagenatin Shaviji',
    t.business_name_en = 'Mai d G Company'
WHERE t.trader_code = 'BHV-0286';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mai d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '286'
  AND tg.association_registration_number = '579';

-- Row 287 | BHV-0287 | Mobile 9081544876 | Gala 580
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bharat Dhagemahadev',
    t.business_name_en = 'Rishakish Kantapoman'
WHERE t.trader_code = 'BHV-0287';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rishakish Kantapoman'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '287'
  AND tg.association_registration_number = '580';

-- Row 288 | BHV-0288 | Mobile 9021544276 | Gala 581
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Babarajegayakavad',
    t.business_name_en = 'Abhajit Kantapoman'
WHERE t.trader_code = 'BHV-0288';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Abhajit Kantapoman'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '288'
  AND tg.association_registration_number = '581';

-- Row 289 | BHV-0289 | Mobile 9881918777 | Gala 582
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mahesh Balasaheb Shaki',
    t.business_name_en = 'Balasaheb Babanarav Shaki'
WHERE t.trader_code = 'BHV-0289';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balasaheb Babanarav Shaki'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '289'
  AND tg.association_registration_number = '582';

-- Row 290 | BHV-0290 | Mobile 9422000679 | Gala 583
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dalip Ekanath Kharid',
    t.business_name_en = 'Ekanath Ramachankharid'
WHERE t.trader_code = 'BHV-0290';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ekanath Ramachankharid'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '290'
  AND tg.association_registration_number = '583';

-- Row 291 | BHV-0291 | Mobile 9881335720 | Gala 584
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ravadinkasani Gavare',
    t.business_name_en = 'Vamisamath d G Company'
WHERE t.trader_code = 'BHV-0291';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vamisamath d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '291'
  AND tg.association_registration_number = '584';

-- Row 292 | BHV-0292 | Mobile 9860690972 | Gala 585
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sanbhajibalasaheb Pathare',
    t.business_name_en = 'Sanbhajibalasaheb Pathare'
WHERE t.trader_code = 'BHV-0292';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sanbhajibalasaheb Pathare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '292'
  AND tg.association_registration_number = '585';

-- Row 293 | BHV-0293 | Mobile 9921558345 | Gala 585
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Magansh Shavijirav Nakami',
    t.business_name_en = 'Magansh Shavijirav Nakami'
WHERE t.trader_code = 'BHV-0293';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Magansh Shavijirav Nakami'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '293'
  AND tg.association_registration_number = '585';

-- Row 294 | BHV-0294 | Mobile 9890112894 | Gala 586
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tanajisajarav Pawar',
    t.business_name_en = 'Shavadashani d G Company'
WHERE t.trader_code = 'BHV-0294';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavadashani d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '294'
  AND tg.association_registration_number = '586';

-- Row 295 | BHV-0295 | Mobile 9067892977 | Gala 587
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadansharav Narayan Harale',
    t.business_name_en = 'Narayanarav D baharale'
WHERE t.trader_code = 'BHV-0295';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Narayanarav D baharale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '295'
  AND tg.association_registration_number = '587';

-- Row 296 | BHV-0296 | Mobile 9822748268 | Gala 588
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Valis D y Borakar',
    t.business_name_en = 'Valis D y Borakar'
WHERE t.trader_code = 'BHV-0296';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Valis D y Borakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '296'
  AND tg.association_registration_number = '588';

-- Row 297 | BHV-0297 | Mobile 9422331425 | Gala 589
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sinatasarush Raut',
    t.business_name_en = 'Vi Nal d G Company'
WHERE t.trader_code = 'BHV-0297';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Nal d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '297'
  AND tg.association_registration_number = '589';

-- Row 298 | BHV-0298 | Mobile 9422331425 | Gala 590
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Ramachanraut',
    t.business_name_en = 'Sarush Ramachanraut'
WHERE t.trader_code = 'BHV-0298';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sarush Ramachanraut'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '298'
  AND tg.association_registration_number = '590';

-- Row 299 | BHV-0299 | Mobile 9822651415 | Gala 591
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vasant Vi L Jadhav',
    t.business_name_en = 'Vasant Vi L Jadhav'
WHERE t.trader_code = 'BHV-0299';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vasant Vi L Jadhav'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '299'
  AND tg.association_registration_number = '591';

-- Row 300 | BHV-0300 | Mobile 9421052525 | Gala 592
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bagavan',
    t.business_name_en = 'Bagavan Das'
WHERE t.trader_code = 'BHV-0300';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bagavan Das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '300'
  AND tg.association_registration_number = '592';

-- Row 301 | BHV-0301 | Mobile 9822668702 | Gala 593
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Nakhil Sarush Korade',
    t.business_name_en = 'Sarush Narayan Korade'
WHERE t.trader_code = 'BHV-0301';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sarush Narayan Korade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '301'
  AND tg.association_registration_number = '593';

-- Row 302 | BHV-0302 | Mobile - | Gala 594
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chanshekhar Borakar',
    t.business_name_en = 'Dadasaheb Pandharinath Borakar'
WHERE t.trader_code = 'BHV-0302';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dadasaheb Pandharinath Borakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '302'
  AND tg.association_registration_number = '594';

-- Row 303 | BHV-0303 | Mobile 9890001160 | Gala 595
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vajayi Ganapat Gole',
    t.business_name_en = 'Ravaresh d G Company'
WHERE t.trader_code = 'BHV-0303';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ravaresh d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '303'
  AND tg.association_registration_number = '595';

-- Row 304 | BHV-0304 | Mobile 7219701881 | Gala 596
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sabhanjishavijich Han',
    t.business_name_en = 'Shavijivasant Ch Han'
WHERE t.trader_code = 'BHV-0304';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavijivasant Ch Han'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '304'
  AND tg.association_registration_number = '596';

-- Row 305 | BHV-0305 | Mobile 9890341919 | Gala 598
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dapaki Vasantarav Marane',
    t.business_name_en = 'Vasantarav Pandurang Marane'
WHERE t.trader_code = 'BHV-0305';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vasantarav Pandurang Marane'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '305'
  AND tg.association_registration_number = '598';

-- Row 306 | BHV-0306 | Mobile 9822897320 | Gala 599
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Lalachand Kachi',
    t.business_name_en = 'Lalachand Valachand Kachi'
WHERE t.trader_code = 'BHV-0306';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Lalachand Valachand Kachi'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '306'
  AND tg.association_registration_number = '599';

-- Row 307 | BHV-0307 | Mobile 9850661430 | Gala 600
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bapu Babanarav Wadkar',
    t.business_name_en = 'Ganesh Hejitebal Company'
WHERE t.trader_code = 'BHV-0307';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganesh Hejitebal Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '307'
  AND tg.association_registration_number = '600';

-- Row 308 | BHV-0308 | Mobile - | Gala 602
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bharatiyashavant Bhosale',
    t.business_name_en = 'Yashavant Vi Larav Bhosale'
WHERE t.trader_code = 'BHV-0308';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Yashavant Vi Larav Bhosale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '308'
  AND tg.association_registration_number = '602';

-- Row 309 | BHV-0309 | Mobile 9822061235 | Gala 603
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tap Keshavarav K De',
    t.business_name_en = 'Mahal Mid G Company'
WHERE t.trader_code = 'BHV-0309';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mahal Mid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '309'
  AND tg.association_registration_number = '603';

-- Row 310 | BHV-0310 | Mobile 9011229044 | Gala 604
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'ner Baban Ko He',
    t.business_name_en = 'ner Baban Ko He'
WHERE t.trader_code = 'BHV-0310';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ner Baban Ko He'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '310'
  AND tg.association_registration_number = '604';

-- Row 311 | BHV-0311 | Mobile 9011229044 | Gala 605
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Taki Ko He',
    t.business_name_en = 'Ko Hebhosalekanpani'
WHERE t.trader_code = 'BHV-0311';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ko Hebhosalekanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '311'
  AND tg.association_registration_number = '605';

-- Row 312 | BHV-0312 | Mobile 9850896929 | Gala 606
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ratesh Sarush Poman',
    t.business_name_en = 'Sarush Sajarav Poman'
WHERE t.trader_code = 'BHV-0312';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sarush Sajarav Poman'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '312'
  AND tg.association_registration_number = '606';

-- Row 313 | BHV-0313 | Mobile 9822336944 | Gala 607
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ashok Ganapat Manere',
    t.business_name_en = 'Ashok Ganapat Manere'
WHERE t.trader_code = 'BHV-0313';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashok Ganapat Manere'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '313'
  AND tg.association_registration_number = '607';

-- Row 314 | BHV-0314 | Mobile 9422550626 | Gala 610
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'L Manarav Ramachanvaghole',
    t.business_name_en = 'L Manarav Ramachanvaghole'
WHERE t.trader_code = 'BHV-0314';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'L Manarav Ramachanvaghole'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '314'
  AND tg.association_registration_number = '610';

-- Row 315 | BHV-0315 | Mobile 9579795108 | Gala 611
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ranjanagenabapoman',
    t.business_name_en = 'Maganlamatud G Company'
WHERE t.trader_code = 'BHV-0315';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Maganlamatud G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '315'
  AND tg.association_registration_number = '611';

-- Row 316 | BHV-0316 | Mobile 8669023246 | Gala 612
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rishakish Katanlal Sabale',
    t.business_name_en = 'Kantilal patisabale'
WHERE t.trader_code = 'BHV-0316';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kantilal patisabale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '316'
  AND tg.association_registration_number = '612';

-- Row 317 | BHV-0317 | Mobile 9764757272 | Gala 613
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vani Sabhush Dadun',
    t.business_name_en = 'Sabhush Padhanrinath Dadan'
WHERE t.trader_code = 'BHV-0317';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sabhush Padhanrinath Dadan'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '317'
  AND tg.association_registration_number = '613';

-- Row 318 | BHV-0318 | Mobile 9922507441 | Gala 614
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Suraj L Man Ko He',
    t.business_name_en = 'Sant Savatamalid G Company'
WHERE t.trader_code = 'BHV-0318';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sant Savatamalid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '318'
  AND tg.association_registration_number = '614';

-- Row 319 | BHV-0319 | Mobile 7767974887 | Gala 615
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Anakit Ganapat Ghodekar',
    t.business_name_en = 'Anakit Ganapat Ghodekar'
WHERE t.trader_code = 'BHV-0319';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Anakit Ganapat Ghodekar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '319'
  AND tg.association_registration_number = '615';

-- Row 320 | BHV-0320 | Mobile 7620306870 | Gala 616
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramadas Bhagavan Gayakavad',
    t.business_name_en = 'Satankri Pd G Company'
WHERE t.trader_code = 'BHV-0320';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Satankri Pd G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '320'
  AND tg.association_registration_number = '616';

-- Row 321 | BHV-0321 | Mobile 9503637771 | Gala 617
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mahadev Pangarakar',
    t.business_name_en = 'Kedarer d G Company'
WHERE t.trader_code = 'BHV-0321';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kedarer d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '321'
  AND tg.association_registration_number = '617';

-- Row 322 | BHV-0322 | Mobile 9403319149 | Gala 618
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tapasheth She',
    t.business_name_en = 'P vatidas'
WHERE t.trader_code = 'BHV-0322';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'P vatidas'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '322'
  AND tg.association_registration_number = '618';

-- Row 323 | BHV-0323 | Mobile 9096117274 | Gala 619
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'S Yajit Bhakar Sayuvanshi',
    t.business_name_en = 'S d G Company'
WHERE t.trader_code = 'BHV-0323';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'S d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '323'
  AND tg.association_registration_number = '619';

-- Row 324 | BHV-0324 | Mobile 9822212316 | Gala 620
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramadas Shavijirav Gayakavad',
    t.business_name_en = 'Sangam d G Company'
WHERE t.trader_code = 'BHV-0324';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sangam d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '324'
  AND tg.association_registration_number = '620';

-- Row 325 | BHV-0325 | Mobile 9850667930 | Gala 621
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramesh Balavant Badade',
    t.business_name_en = 'Balavant K Dibabadade'
WHERE t.trader_code = 'BHV-0325';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Balavant K Dibabadade'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '325'
  AND tg.association_registration_number = '621';

-- Row 326 | BHV-0326 | Mobile 9850175481 | Gala 622
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rishakish Sarush Kamathe',
    t.business_name_en = 'Rishakish Sarush Kamathe'
WHERE t.trader_code = 'BHV-0326';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rishakish Sarush Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '326'
  AND tg.association_registration_number = '622';

-- Row 327 | BHV-0327 | Mobile 9822330880 | Gala 627
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sabhush Ramachankamathe',
    t.business_name_en = 'Ramachand G Company'
WHERE t.trader_code = 'BHV-0327';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ramachand G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '327'
  AND tg.association_registration_number = '627';

-- Row 328 | BHV-0328 | Mobile 9850765980 | Gala 629
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chankant Baburav Kamathe',
    t.business_name_en = 'Chankant Babaruv Kamathe'
WHERE t.trader_code = 'BHV-0328';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Chankant Babaruv Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '328'
  AND tg.association_registration_number = '629';

-- Row 329 | BHV-0329 | Mobile 9623630630 | Gala 630
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Popat Raghanuth Navaginnu',
    t.business_name_en = 'Popat Raghanuth Navaginnu'
WHERE t.trader_code = 'BHV-0329';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Popat Raghanuth Navaginnu'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '329'
  AND tg.association_registration_number = '630';

-- Row 330 | BHV-0330 | Mobile 7045204585 | Gala 631
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sadhanaramesh Shatile',
    t.business_name_en = 'Sadhand G Company'
WHERE t.trader_code = 'BHV-0330';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sadhand G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '330'
  AND tg.association_registration_number = '631';

-- Row 331 | BHV-0331 | Mobile 9850573329 | Gala 632
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dapaki Navi kanjir',
    t.business_name_en = 'Dapaki Navi kanjir'
WHERE t.trader_code = 'BHV-0331';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dapaki Navi kanjir'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '331'
  AND tg.association_registration_number = '632';

-- Row 332 | BHV-0332 | Mobile 9850826756 | Gala 633/812
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Kri Naramachanjharunge',
    t.business_name_en = 'Kri Naramachanjharunge'
WHERE t.trader_code = 'BHV-0332';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kri Naramachanjharunge'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '332'
  AND tg.association_registration_number = '633';

-- Row 333 | BHV-0333 | Mobile - | Gala 634
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rajashekhar M Lapapatil',
    t.business_name_en = 'Rajashekhar M Lapapatil'
WHERE t.trader_code = 'BHV-0333';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rajashekhar M Lapapatil'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '333'
  AND tg.association_registration_number = '634';

-- Row 334 | BHV-0334 | Mobile 9822978145 | Gala 635
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani ner Lokhadan',
    t.business_name_en = 'Sachani ner Lokhande'
WHERE t.trader_code = 'BHV-0334';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sachani ner Lokhande'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '334'
  AND tg.association_registration_number = '635';

-- Row 335 | BHV-0335 | Mobile 9822352610 | Gala 636
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Padant Pavatarav Pawar',
    t.business_name_en = 'Pandit Pavatarav Pawar'
WHERE t.trader_code = 'BHV-0335';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandit Pavatarav Pawar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '335'
  AND tg.association_registration_number = '636';

-- Row 336 | BHV-0336 | Mobile 9890029408 | Gala 637
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi dhar Narasing Kalbhor',
    t.business_name_en = 'Vi dhar Narasing Kalbhor'
WHERE t.trader_code = 'BHV-0336';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi dhar Narasing Kalbhor'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '336'
  AND tg.association_registration_number = '637';

-- Row 337 | BHV-0337 | Mobile 9881880202 | Gala 202, 794
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ganesh Babanarav Nakami',
    t.business_name_en = 'Babanarav Shak Nrarav Nakami'
WHERE t.trader_code = 'BHV-0337';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Babanarav Shak Nrarav Nakami'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '337'
  AND tg.association_registration_number = '794';

-- Row 338 | BHV-0338 | Mobile - | Gala -
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vaibhav Lalaso Jagtap',
    t.business_name_en = 'Jadhav Jagtap Company'
WHERE t.trader_code = 'BHV-0338';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jadhav Jagtap Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '338'
  AND tg.association_registration_number = '32';

-- Row 339 | BHV-0339 | Mobile 9960126560 | Gala 835
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Pandurang L Man Rasakar',
    t.business_name_en = 'Pandurang L Man Rasakar'
WHERE t.trader_code = 'BHV-0339';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Pandurang L Man Rasakar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '339'
  AND tg.association_registration_number = '835';

-- Row 340 | BHV-0340 | Mobile 9422078521 | Gala 830
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Hanumant Pandhare',
    t.business_name_en = 'd das'
WHERE t.trader_code = 'BHV-0340';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'd das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '340'
  AND tg.association_registration_number = '830';

-- Row 341 | BHV-0341 | Mobile 8805203440 | Gala 841
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sajany Vasantarav Shinde',
    t.business_name_en = 'Om Shavashi d G Company'
WHERE t.trader_code = 'BHV-0341';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Om Shavashi d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '341'
  AND tg.association_registration_number = '841';

-- Row 342 | BHV-0342 | Mobile 9422550626 | Gala 836
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramakatanl Man Vaghole',
    t.business_name_en = 'Vagholed G Company'
WHERE t.trader_code = 'BHV-0342';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vagholed G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '342'
  AND tg.association_registration_number = '836';

-- Row 343 | BHV-0343 | Mobile 9422519858 | Gala 834
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chhagan Bhamijih Ke',
    t.business_name_en = 'H Ked G Company'
WHERE t.trader_code = 'BHV-0343';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'H Ked G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '343'
  AND tg.association_registration_number = '834';

-- Row 344 | BHV-0344 | Mobile 9890034664 | Gala 828
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mi Chhanpandharinath Chaudhari',
    t.business_name_en = 'Mi Chhanpandharinath Chaudhari'
WHERE t.trader_code = 'BHV-0344';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Mi Chhanpandharinath Chaudhari'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '344'
  AND tg.association_registration_number = '828';

-- Row 345 | BHV-0345 | Mobile 9146175050 | Gala 829
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mahesh B',
    t.business_name_en = 'Jagadaband G Company'
WHERE t.trader_code = 'BHV-0345';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Jagadaband G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '345'
  AND tg.association_registration_number = '829';

-- Row 346 | BHV-0346 | Mobile 7385477989 | Gala 831
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sagar Vajayi Manere',
    t.business_name_en = 'Sagar Vajayi Manere'
WHERE t.trader_code = 'BHV-0346';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sagar Vajayi Manere'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '346'
  AND tg.association_registration_number = '831';

-- Row 347 | BHV-0347 | Mobile 9922856444 | Gala 832
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dadasaheb Baban Bandal',
    t.business_name_en = 'Bandal B & Company'
WHERE t.trader_code = 'BHV-0347';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bandal B & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '347'
  AND tg.association_registration_number = '832';

-- Row 348 | BHV-0348 | Mobile 9767513692 | Gala 833
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Atalukai Las R',
    t.business_name_en = 'Atal das'
WHERE t.trader_code = 'BHV-0348';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Atal das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '348'
  AND tg.association_registration_number = '833';

-- Row 349 | BHV-0349 | Mobile 9326865018 | Gala 838
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhagavan Sakharam Kamathe',
    t.business_name_en = 'Bhagavan Sakharam Kamathe'
WHERE t.trader_code = 'BHV-0349';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhagavan Sakharam Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '349'
  AND tg.association_registration_number = '838';

-- Row 350 | BHV-0350 | Mobile 9226942238 | Gala 839
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Jag Nath Sol Kar',
    t.business_name_en = 'Sol Kar & Company'
WHERE t.trader_code = 'BHV-0350';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sol Kar & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '350'
  AND tg.association_registration_number = '839';

-- Row 351 | BHV-0351 | Mobile 8408879977 | Gala 840
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sad Yashavatanbhosale',
    t.business_name_en = 'Ganesh das'
WHERE t.trader_code = 'BHV-0351';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ganesh das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '351'
  AND tg.association_registration_number = '840';

-- Row 352 | BHV-0352 | Mobile 9423206345 | Gala 807
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Govind nobashinde',
    t.business_name_en = 'Shadin& Company'
WHERE t.trader_code = 'BHV-0352';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shadin& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '352'
  AND tg.association_registration_number = '807';

-- Row 353 | BHV-0353 | Mobile 9860381705 | Gala 808
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jagadish Jijaram Pinpale',
    t.business_name_en = 'Bharat d G Company'
WHERE t.trader_code = 'BHV-0353';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bharat d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '353'
  AND tg.association_registration_number = '808';

-- Row 354 | BHV-0354 | Mobile 9511640399 | Gala 809
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Yadav Santosh pati',
    t.business_name_en = 'Ashavid d G Company'
WHERE t.trader_code = 'BHV-0354';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ashavid d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '354'
  AND tg.association_registration_number = '809';

-- Row 355 | BHV-0355 | Mobile 7387689160 | Gala 810
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chanshekhar U M Pawar',
    t.business_name_en = 'Radhakri N d G Company'
WHERE t.trader_code = 'BHV-0355';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Radhakri N d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '355'
  AND tg.association_registration_number = '810';

-- Row 356 | BHV-0356 | Mobile 9822043691 | Gala 811
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Satashi Shashakitanhonarav',
    t.business_name_en = 'Samath d G Company'
WHERE t.trader_code = 'BHV-0356';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Samath d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '356'
  AND tg.association_registration_number = '811';

-- Row 357 | BHV-0357 | Mobile 9422522244 | Gala 814
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Natin Anandarav Pol',
    t.business_name_en = 'Natin Pol & Company'
WHERE t.trader_code = 'BHV-0357';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Natin Pol & Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '357'
  AND tg.association_registration_number = '814';

-- Row 358 | BHV-0358 | Mobile 9156279279 | Gala 815
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Mohan Vi Nath Shinde',
    t.business_name_en = 'Vi nand d G Company'
WHERE t.trader_code = 'BHV-0358';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi nand d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '358'
  AND tg.association_registration_number = '815';

-- Row 359 | BHV-0359 | Mobile 9404414123 | Gala 816
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Jati ner Mahajan',
    t.business_name_en = 'Harihar d G Company'
WHERE t.trader_code = 'BHV-0359';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Harihar d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '359'
  AND tg.association_registration_number = '816';

-- Row 360 | BHV-0360 | Mobile 9860721259 | Gala 817
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'N Shak Nrarav Dadage',
    t.business_name_en = 'N Shak Nrarav Dadage'
WHERE t.trader_code = 'BHV-0360';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'N Shak Nrarav Dadage'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '360'
  AND tg.association_registration_number = '817';

-- Row 361 | BHV-0361 | Mobile 7057856856 | Gala 825
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Sarush Kamathe',
    t.business_name_en = 'Vi Nath Sachani Kamathe'
WHERE t.trader_code = 'BHV-0361';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Vi Nath Sachani Kamathe'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '361'
  AND tg.association_registration_number = '825';

-- Row 362 | BHV-0362 | Mobile 9763285555 | Gala 826
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Dasharath Gayakavad',
    t.business_name_en = 'Shanbharu j Shetipham'
WHERE t.trader_code = 'BHV-0362';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shanbharu j Shetipham'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '362'
  AND tg.association_registration_number = '826';

-- Row 363 | BHV-0363 | Mobile 9881615793 | Gala 846
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Magansh Narayan Navale',
    t.business_name_en = 'Magansh Narayan Navale'
WHERE t.trader_code = 'BHV-0363';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Magansh Narayan Navale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '363'
  AND tg.association_registration_number = '846';

-- Row 364 | BHV-0364 | Mobile 9763957866 | Gala 848
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Tausiph Karim S Yad',
    t.business_name_en = 'Sahayog d G Company'
WHERE t.trader_code = 'BHV-0364';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sahayog d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '364'
  AND tg.association_registration_number = '848';

-- Row 365 | BHV-0365 | Mobile 7350757545 | Gala 842
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani D y Ko He',
    t.business_name_en = 'Ko Hebhosalekanpani'
WHERE t.trader_code = 'BHV-0365';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ko Hebhosalekanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '365'
  AND tg.association_registration_number = '842';

-- Row 366 | BHV-0366 | Mobile 9850262862 | Gala 852
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Madhanresuyakant Shantaram',
    t.business_name_en = 'Anav d G Company'
WHERE t.trader_code = 'BHV-0366';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Anav d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '366'
  AND tg.association_registration_number = '852';

-- Row 367 | BHV-0367 | Mobile - | Gala 847
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Saurabh Sabhush Jadhav',
    t.business_name_en = 'Takuimatd G Company'
WHERE t.trader_code = 'BHV-0367';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Takuimatd G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '367'
  AND tg.association_registration_number = '847';

-- Row 368 | BHV-0368 | Mobile 9850226929 | Gala 859
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Satashi Namadev Pangare',
    t.business_name_en = 'Namadev Damu Pangare'
WHERE t.trader_code = 'BHV-0368';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Namadev Damu Pangare'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '368'
  AND tg.association_registration_number = '859';

-- Row 369 | BHV-0369 | Mobile 9850151589 | Gala 855
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Rajesh Had Gandu',
    t.business_name_en = 'Rajesh Had Gadunand S S'
WHERE t.trader_code = 'BHV-0369';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Rajesh Had Gadunand S S'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '369'
  AND tg.association_registration_number = '855';

-- Row 370 | BHV-0370 | Mobile 9850756854 | Gala 854
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Latababan Gavashete',
    t.business_name_en = 'ram d G Company'
WHERE t.trader_code = 'BHV-0370';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'ram d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '370'
  AND tg.association_registration_number = '854';

-- Row 371 | BHV-0371 | Mobile 8600845845 | Gala 845
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Namadev Narayan Kale',
    t.business_name_en = 'Si r d G Company'
WHERE t.trader_code = 'BHV-0371';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Si r d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '371'
  AND tg.association_registration_number = '845';

-- Row 372 | BHV-0372 | Mobile 9822848860 | Gala 844
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Parasharum Baban Amarale',
    t.business_name_en = 'Amarale& Company'
WHERE t.trader_code = 'BHV-0372';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Amarale& Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '372'
  AND tg.association_registration_number = '844';

-- Row 373 | BHV-0373 | Mobile 9175912080 | Gala 849
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhosalesagantasajany',
    t.business_name_en = 'Shavasamathi d G Company'
WHERE t.trader_code = 'BHV-0373';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavasamathi d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '373'
  AND tg.association_registration_number = '849';

-- Row 374 | BHV-0374 | Mobile 9823192076 | Gala 857
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarush Buvajijhanjad',
    t.business_name_en = 'Kanaphanith das'
WHERE t.trader_code = 'BHV-0374';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Kanaphanith das'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '374'
  AND tg.association_registration_number = '857';

-- Row 375 | BHV-0375 | Mobile 9822061235 | Gala 843
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Yashavant Vi Larav Bhosale',
    t.business_name_en = 'Ko Hebhosalekanpani'
WHERE t.trader_code = 'BHV-0375';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Ko Hebhosalekanpani'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '375'
  AND tg.association_registration_number = '843';

-- Row 376 | BHV-0376 | Mobile 9822938975 | Gala 867
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Bhanadus Dasharatharav Gote',
    t.business_name_en = 'Bhanadus Dasharatharav Gote'
WHERE t.trader_code = 'BHV-0376';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Bhanadus Dasharatharav Gote'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '376'
  AND tg.association_registration_number = '867';

-- Row 377 | BHV-0377 | Mobile 9607150639 | Gala 861
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Shavadis Dagu',
    t.business_name_en = 'Sachani Shavadis Dagu'
WHERE t.trader_code = 'BHV-0377';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sachani Shavadis Dagu'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '377'
  AND tg.association_registration_number = '861';

-- Row 378 | BHV-0378 | Mobile 9975731616 | Gala 865
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sachani Sarush Bho Hade',
    t.business_name_en = 'Es. d G Company'
WHERE t.trader_code = 'BHV-0378';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Es. d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '378'
  AND tg.association_registration_number = '865';

-- Row 379 | BHV-0379 | Mobile 9422338191 | Gala 866
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Chankatanshankararav Ghadge',
    t.business_name_en = 'Shankararav Narayan Ghadge'
WHERE t.trader_code = 'BHV-0379';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shankararav Narayan Ghadge'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '379'
  AND tg.association_registration_number = '866';

-- Row 380 | BHV-0380 | Mobile 9172780711 | Gala 863
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Vi Nath Genababhalire',
    t.business_name_en = 'Harii d G Company'
WHERE t.trader_code = 'BHV-0380';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Harii d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '380'
  AND tg.association_registration_number = '863';

-- Row 381 | BHV-0381 | Mobile 9822622540 | Gala 862
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dadasaheb Haribhau Badabhar',
    t.business_name_en = 'Dadasaheb Haribhau Badabhar'
WHERE t.trader_code = 'BHV-0381';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dadasaheb Haribhau Badabhar'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '381'
  AND tg.association_registration_number = '862';

-- Row 382 | BHV-0382 | Mobile 9423922595 | Gala 856
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Daguvatitanajipavar',
    t.business_name_en = 'Shavinjalid G Company'
WHERE t.trader_code = 'BHV-0382';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavinjalid G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '382'
  AND tg.association_registration_number = '856';

-- Row 383 | BHV-0383 | Mobile 8380000853 | Gala 853
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Dapaki Narayan Jagtap',
    t.business_name_en = 'Dapaki Narayan Jagtap'
WHERE t.trader_code = 'BHV-0383';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Dapaki Narayan Jagtap'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '383'
  AND tg.association_registration_number = '853';

-- Row 384 | BHV-0384 | Mobile 8669323838 | Gala 864
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Ramesh Shavijinakami',
    t.business_name_en = 'Shavaki Pd G Company'
WHERE t.trader_code = 'BHV-0384';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Shavaki Pd G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '384'
  AND tg.association_registration_number = '864';

-- Row 385 | BHV-0385 | Mobile - | Gala 
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = '-',
    t.business_name_en = 'Sainath d G Company'
WHERE t.trader_code = 'BHV-0385';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'Sainath d G Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '385'
  AND tg.association_registration_number = '851';

-- Row 386 | BHV-0386 | Mobile - | Gala -
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Yogesh Abasaheb Shinde',
    t.business_name_en = 'M/s Aaisaheb Trading Company'
WHERE t.trader_code = 'BHV-0386';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'M/s Aaisaheb Trading Company'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '386'
  AND tg.association_registration_number = '-';

-- Row 387 | BHV-0387 | Mobile - | Gala -
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Amit Vijay Sapkal',
    t.business_name_en = 'M/s Mahadev Sadashiv Sapkal'
WHERE t.trader_code = 'BHV-0387';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'M/s Mahadev Sadashiv Sapkal'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '387'
  AND tg.association_registration_number = '-';

-- Row 388 | BHV-0388 | Mobile - | Gala -
UPDATE users u
JOIN traders t ON t.user_id = u.id
SET u.full_name_en = 'Sarjerao Shripati Kale',
    t.business_name_en = 'M/s Baliram Shripati Kale'
WHERE t.trader_code = 'BHV-0388';
UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET tg.business_name_en = 'M/s Baliram Shripati Kale'
WHERE t.trader_code LIKE 'BHV-%'
  AND tg.association_sequence_number = '388'
  AND tg.association_registration_number = '-';

COMMIT;

SELECT COUNT(*) AS bhajipala_users_with_english_names
FROM users u JOIN traders t ON t.user_id = u.id
WHERE t.trader_code LIKE 'BHV-%' AND u.full_name_en IS NOT NULL AND u.full_name_en <> '';
SELECT COUNT(*) AS bhajipala_traders_with_english_business_names
FROM traders WHERE trader_code LIKE 'BHV-%' AND business_name_en IS NOT NULL AND business_name_en <> '';
SELECT COUNT(*) AS bhajipala_galas_with_english_business_names
FROM trader_galas tg JOIN traders t ON t.id = tg.trader_id
WHERE t.trader_code LIKE 'BHV-%' AND tg.business_name_en IS NOT NULL AND tg.business_name_en <> '';

