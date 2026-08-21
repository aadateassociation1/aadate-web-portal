-- Hostinger import file: schema, tables, views, permissions and master data.
-- Open your Hostinger phpMyAdmin database first, then import this file.
-- If you are importing through MySQL CLI, uncomment and update the next line:
-- USE your_hostinger_database_name;



SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. ACCESS CONTROL
-- ============================================================

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    module VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(190) NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    preferred_language ENUM('en','mr') NOT NULL DEFAULT 'en',
    status ENUM('pending','active','suspended','deactivated','rejected') NOT NULL DEFAULT 'pending',
    mobile_verified_at DATETIME NULL,
    email_verified_at DATETIME NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    last_login_at DATETIME NULL,
    password_changed_at DATETIME NULL,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_users_role_status (role_id, status),
    INDEX idx_users_mobile (mobile),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE otp_verifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    mobile VARCHAR(20) NULL,
    email VARCHAR(190) NULL,
    purpose ENUM('registration','login','password_reset','mobile_change','email_change','kyc_consent') NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_lookup (mobile, purpose, expires_at),
    CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sessions_user_expiry (user_id, expires_at),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 2. LOCATIONS AND MASTER DATA
-- ============================================================

CREATE TABLE business_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(120) NOT NULL,
    name_mr VARCHAR(120) NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE market_galas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    gala_number VARCHAR(50) NOT NULL UNIQUE,
    section_name VARCHAR(100) NULL,
    floor_name VARCHAR(100) NULL,
    status ENUM('available','occupied','inactive') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. TRADERS AND TRADER KYC
-- ============================================================

CREATE TABLE traders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    trader_code VARCHAR(30) NOT NULL UNIQUE,
    business_name VARCHAR(180) NOT NULL,
    market_registration_number VARCHAR(100) NULL UNIQUE,
    gala_id BIGINT UNSIGNED NULL,
    business_category_id BIGINT UNSIGNED NULL,
    alternate_mobile VARCHAR(20) NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    village_city VARCHAR(120) NOT NULL,
    taluka VARCHAR(120) NULL,
    district VARCHAR(120) NOT NULL,
    state VARCHAR(120) NOT NULL DEFAULT 'Maharashtra',
    pincode VARCHAR(10) NULL,
    gst_number VARCHAR(20) NULL,
    aadhaar_masked VARCHAR(20) NULL,
    aadhaar_hash CHAR(64) NULL,
    pan_masked VARCHAR(20) NULL,
    pan_hash CHAR(64) NULL,
    blood_group VARCHAR(5) NULL,
    licence_number VARCHAR(100) NULL,
    association_sequence_number VARCHAR(50) NULL,
    association_registration_number VARCHAR(50) NULL,
    bank_account_masked VARCHAR(40) NULL,
    ifsc_code VARCHAR(20) NULL,
    verification_status ENUM(
        'draft','submitted','under_review','correction_required',
        'approved','rejected','suspended','deactivated'
    ) NOT NULL DEFAULT 'draft',
    verified_by BIGINT UNSIGNED NULL,
    verified_at DATETIME NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_traders_status (verification_status),
    INDEX idx_traders_aadhaar_hash (aadhaar_hash),
    INDEX idx_traders_pan_hash (pan_hash),
    INDEX idx_traders_business_name (business_name),
    CONSTRAINT fk_traders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_traders_gala FOREIGN KEY (gala_id) REFERENCES market_galas(id) ON DELETE SET NULL,
    CONSTRAINT fk_traders_category FOREIGN KEY (business_category_id) REFERENCES business_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_traders_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE trader_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    document_type ENUM(
        'profile_photo','aadhaar_masked','pan','shop_allotment',
        'market_registration','gst_certificate','address_proof',
        'bank_proof','signature','other'
    ) NOT NULL,
    document_number_masked VARCHAR(100) NULL,
    document_hash CHAR(64) NULL,
    storage_key VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    status ENUM('uploaded','verified','rejected','expired','replaced') NOT NULL DEFAULT 'uploaded',
    verified_by BIGINT UNSIGNED NULL,
    verified_at DATETIME NULL,
    rejection_reason VARCHAR(500) NULL,
    expiry_date DATE NULL,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_trader_docs_trader_type (trader_id, document_type),
    CONSTRAINT fk_trader_docs_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
    CONSTRAINT fk_trader_docs_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_trader_docs_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE trader_galas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    gala_id BIGINT UNSIGNED NOT NULL,
    business_name VARCHAR(180) NOT NULL,
    market_section VARCHAR(120) NULL,
    business_category_id BIGINT UNSIGNED NULL,
    market_registration_number VARCHAR(100) NULL UNIQUE,
    licence_number VARCHAR(100) NULL,
    association_sequence_number VARCHAR(50) NULL,
    association_registration_number VARCHAR(50) NULL,
    status ENUM(
        'submitted','under_review','correction_required',
        'approved','rejected','suspended','deactivated'
    ) NOT NULL DEFAULT 'submitted',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    admin_remarks TEXT NULL,
    verified_by BIGINT UNSIGNED NULL,
    verified_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_trader_galas_trader_gala (trader_id, gala_id),
    INDEX idx_trader_galas_trader_status (trader_id, status),
    INDEX idx_trader_galas_gala (gala_id),
    INDEX idx_trader_galas_primary (trader_id, is_primary),
    CONSTRAINT fk_trader_galas_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
    CONSTRAINT fk_trader_galas_gala FOREIGN KEY (gala_id) REFERENCES market_galas(id) ON DELETE CASCADE,
    CONSTRAINT fk_trader_galas_category FOREIGN KEY (business_category_id) REFERENCES business_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_trader_galas_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Optional maintenance SQL for updating one linked gala/shop.
-- Keep this commented in the schema. Copy it to a query tab, change the SET values,
-- run the SELECT first, then set @trader_gala_id to the real numeric id from the result.
--
-- SET @member_mobile = '9988776655';
-- SET @trader_gala_id = 9;
-- SET @new_gala_number = 'B-204';
-- SET @new_market_section = 'Fruit Department';
-- SET @new_category = 'Fruit Department';
-- SET @new_business_name = 'Abhi Fruit Stall';
-- SET @new_registration_number = '';
-- SET @new_licence_number = '';
-- SET @new_sr_no = '';
-- SET @new_number = '';
--
-- SELECT u.full_name, u.mobile, t.trader_code,
--        tg.id AS trader_gala_id, mg.gala_number, tg.business_name,
--        tg.market_section, tg.status, tg.is_primary
-- FROM users u
-- JOIN traders t ON t.user_id = u.id
-- JOIN trader_galas tg ON tg.trader_id = t.id
-- JOIN market_galas mg ON mg.id = tg.gala_id
-- WHERE u.mobile = @member_mobile
-- ORDER BY tg.is_primary DESC, tg.created_at ASC, tg.id ASC;
--
-- INSERT INTO market_galas (gala_number, section_name, status)
-- VALUES (@new_gala_number, @new_market_section, 'occupied')
-- ON DUPLICATE KEY UPDATE
--   section_name = VALUES(section_name),
--   status = 'occupied';
--
-- INSERT INTO business_categories (name_en, status)
-- VALUES (@new_category, 'active')
-- ON DUPLICATE KEY UPDATE
--   name_en = VALUES(name_en),
--   status = 'active';
--
-- UPDATE trader_galas tg
-- JOIN traders t ON t.id = tg.trader_id
-- JOIN users u ON u.id = t.user_id
-- JOIN market_galas mg_new ON mg_new.gala_number = @new_gala_number
-- LEFT JOIN business_categories bc ON bc.name_en = @new_category
-- SET tg.gala_id = mg_new.id,
--     tg.business_name = @new_business_name,
--     tg.market_section = @new_market_section,
--     tg.business_category_id = bc.id,
--     tg.market_registration_number = NULLIF(@new_registration_number, ''),
--     tg.licence_number = NULLIF(@new_licence_number, ''),
--     tg.association_sequence_number = NULLIF(@new_sr_no, ''),
--     tg.association_registration_number = NULLIF(@new_number, ''),
--     tg.status = 'submitted',
--     tg.admin_remarks = NULL,
--     tg.verified_by = NULL,
--     tg.verified_at = NULL
-- WHERE u.mobile = @member_mobile
--   AND tg.id = @trader_gala_id;

CREATE TABLE trader_verification_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    old_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NOT NULL,
    remarks TEXT NULL,
    changed_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_trader_verification_history (trader_id, created_at),
    CONSTRAINT fk_trader_verification_history_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
    CONSTRAINT fk_trader_verification_history_user FOREIGN KEY (changed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- 4. CENTRAL CUSTOMER MASTER AND SHARED KYC
-- ============================================================

CREATE TABLE customers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(180) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20) NULL,
    date_of_birth DATE NULL,
    occupation_business VARCHAR(180) NULL,
    profile_photo_storage_key VARCHAR(500) NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    village_city VARCHAR(120) NOT NULL,
    taluka VARCHAR(120) NULL,
    district VARCHAR(120) NOT NULL,
    state VARCHAR(120) NOT NULL DEFAULT 'Maharashtra',
    pincode VARCHAR(10) NULL,
    kyc_status ENUM(
        'draft','submitted','under_review','more_info_required',
        'verified','rejected','suspended','reverification_required','fraud_suspected','archived'
    ) NOT NULL DEFAULT 'draft',
    risk_status ENUM('normal','watch','warning_1','warning_2','high_risk','disputed','blocked') NOT NULL DEFAULT 'normal',
    verified_by BIGINT UNSIGNED NULL,
    verified_at DATETIME NULL,
    kyc_valid_until DATE NULL,
    created_by_trader_id BIGINT UNSIGNED NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_customers_mobile (mobile),
    INDEX idx_customers_name_dob (full_name, date_of_birth),
    INDEX idx_customers_kyc_risk (kyc_status, risk_status),
    FULLTEXT INDEX ft_customers_name_address (full_name, address_line1, village_city),
    CONSTRAINT fk_customers_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_customers_created_trader FOREIGN KEY (created_by_trader_id) REFERENCES traders(id) ON DELETE SET NULL,
    CONSTRAINT fk_customers_created_user FOREIGN KEY (created_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE customer_identifiers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    identifier_type ENUM('aadhaar','pan','voter_id','driving_licence','passport','other') NOT NULL,
    masked_value VARCHAR(100) NOT NULL,
    value_hash CHAR(64) NOT NULL,
    last_four VARCHAR(4) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_customer_identifier_hash (identifier_type, value_hash),
    INDEX idx_customer_identifiers_customer (customer_id),
    CONSTRAINT fk_customer_identifiers_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE customer_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    document_type ENUM(
        'profile_photo','aadhaar_masked','pan','voter_id','driving_licence',
        'address_proof','signature','consent_form','other'
    ) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    checksum_sha256 CHAR(64) NOT NULL,
    status ENUM('uploaded','verified','rejected','expired','replaced') NOT NULL DEFAULT 'uploaded',
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    verified_by_user_id BIGINT UNSIGNED NULL,
    verified_at DATETIME NULL,
    rejection_reason VARCHAR(500) NULL,
    expiry_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_docs_customer_type (customer_id, document_type),
    CONSTRAINT fk_customer_docs_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_docs_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_customer_docs_verified_by FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE customer_consents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    consent_type ENUM('kyc_collection','shared_kyc','risk_visibility','notifications','data_processing') NOT NULL,
    consent_text_version VARCHAR(50) NOT NULL,
    consent_given BOOLEAN NOT NULL,
    consent_method ENUM('signed_form','otp','digital_signature','recorded_offline') NOT NULL,
    evidence_storage_key VARCHAR(500) NULL,
    captured_by_user_id BIGINT UNSIGNED NOT NULL,
    ip_address VARCHAR(45) NULL,
    consented_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_consents (customer_id, consent_type),
    CONSTRAINT fk_customer_consents_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_consents_user FOREIGN KEY (captured_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE customer_kyc_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    old_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NOT NULL,
    remarks TEXT NULL,
    changed_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_kyc_history (customer_id, created_at),
    CONSTRAINT fk_customer_kyc_history_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_kyc_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE customer_duplicate_candidates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    source_customer_id BIGINT UNSIGNED NOT NULL,
    possible_duplicate_customer_id BIGINT UNSIGNED NOT NULL,
    match_score DECIMAL(5,2) NOT NULL,
    match_reasons JSON NOT NULL,
    status ENUM('pending','confirmed_duplicate','not_duplicate','merged') NOT NULL DEFAULT 'pending',
    reviewed_by_user_id BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_duplicate_pair (source_customer_id, possible_duplicate_customer_id),
    CONSTRAINT fk_duplicate_source FOREIGN KEY (source_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_duplicate_possible FOREIGN KEY (possible_duplicate_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_duplicate_reviewer FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 5. TRADER-CUSTOMER RELATIONSHIPS
-- ============================================================

CREATE TABLE trader_customers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    relationship_status ENUM('pending','active','blocked','closed') NOT NULL DEFAULT 'pending',
    trader_local_customer_number VARCHAR(50) NULL,
    default_credit_days INT UNSIGNED NOT NULL DEFAULT 0,
    credit_limit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    first_transaction_at DATETIME NULL,
    last_transaction_at DATETIME NULL,
    linked_by_user_id BIGINT UNSIGNED NOT NULL,
    linked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    UNIQUE KEY uq_trader_customer (trader_id, customer_id),
    INDEX idx_trader_customers_customer (customer_id),
    INDEX idx_trader_customers_trader_status (trader_id, relationship_status),
    CONSTRAINT fk_trader_customers_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
    CONSTRAINT fk_trader_customers_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trader_customers_linked_by FOREIGN KEY (linked_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- 6. INVOICES, PAYMENTS AND LEDGER
-- ============================================================

CREATE TABLE invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_customer_id BIGINT UNSIGNED NOT NULL,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    invoice_number VARCHAR(80) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    outstanding_amount DECIMAL(15,2) GENERATED ALWAYS AS (GREATEST(total_amount - paid_amount, 0)) STORED,
    status ENUM('draft','issued','partially_paid','paid','overdue','cancelled','disputed') NOT NULL DEFAULT 'draft',
    bill_storage_key VARCHAR(500) NULL,
    customer_acknowledgement_storage_key VARCHAR(500) NULL,
    notes TEXT NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uq_trader_invoice (trader_id, invoice_number),
    INDEX idx_invoices_customer_due (customer_id, due_date, status),
    INDEX idx_invoices_trader_due (trader_id, due_date, status),
    CONSTRAINT fk_invoices_relationship FOREIGN KEY (trader_customer_id) REFERENCES trader_customers(id),
    CONSTRAINT fk_invoices_trader FOREIGN KEY (trader_id) REFERENCES traders(id),
    CONSTRAINT fk_invoices_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_invoices_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE invoice_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    quantity DECIMAL(12,3) NOT NULL DEFAULT 1,
    unit VARCHAR(30) NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    tax_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    line_total DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_invoice_items_invoice (invoice_id),
    CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    payment_reference VARCHAR(100) NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_mode ENUM('cash','upi','bank_transfer','cheque','card','other') NOT NULL,
    proof_storage_key VARCHAR(500) NULL,
    notes TEXT NULL,
    status ENUM('recorded','confirmed','reversed') NOT NULL DEFAULT 'recorded',
    recorded_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payments_trader_customer (trader_id, customer_id, payment_date),
    CONSTRAINT fk_payments_trader FOREIGN KEY (trader_id) REFERENCES traders(id),
    CONSTRAINT fk_payments_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_payments_recorded_by FOREIGN KEY (recorded_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE payment_allocations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT UNSIGNED NOT NULL,
    invoice_id BIGINT UNSIGNED NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_payment_invoice (payment_id, invoice_id),
    CONSTRAINT fk_allocations_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    CONSTRAINT fk_allocations_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id)
) ENGINE=InnoDB;

CREATE TABLE ledger_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    trader_customer_id BIGINT UNSIGNED NOT NULL,
    invoice_id BIGINT UNSIGNED NULL,
    payment_id BIGINT UNSIGNED NULL,
    entry_type ENUM('invoice','payment','credit_note','debit_note','adjustment') NOT NULL,
    entry_date DATE NOT NULL,
    debit_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    credit_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    description VARCHAR(500) NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ledger_account_date (trader_customer_id, entry_date),
    CONSTRAINT fk_ledger_trader FOREIGN KEY (trader_id) REFERENCES traders(id),
    CONSTRAINT fk_ledger_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_ledger_relationship FOREIGN KEY (trader_customer_id) REFERENCES trader_customers(id),
    CONSTRAINT fk_ledger_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    CONSTRAINT fk_ledger_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    CONSTRAINT fk_ledger_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- 7. REMINDERS, WARNINGS AND DISPUTES
-- ============================================================

CREATE TABLE payment_reminders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    reminder_number TINYINT UNSIGNED NOT NULL,
    reminder_type ENUM('friendly','formal','final') NOT NULL,
    delivery_channel ENUM('in_person','phone','sms','whatsapp','email','printed_letter') NOT NULL,
    message_text TEXT NULL,
    proof_storage_key VARCHAR(500) NULL,
    sent_by_user_id BIGINT UNSIGNED NOT NULL,
    sent_at DATETIME NOT NULL,
    delivery_status ENUM('pending','sent','delivered','failed','acknowledged') NOT NULL DEFAULT 'sent',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_invoice_reminder_number (invoice_id, reminder_number),
    INDEX idx_reminders_customer (customer_id, sent_at),
    CONSTRAINT fk_reminders_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT fk_reminders_trader FOREIGN KEY (trader_id) REFERENCES traders(id),
    CONSTRAINT fk_reminders_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_reminders_user FOREIGN KEY (sent_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE warning_cases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(40) NOT NULL UNIQUE,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    invoice_id BIGINT UNSIGNED NOT NULL,
    warning_stage ENUM('warning_1','warning_2','market_alert') NOT NULL,
    claimed_outstanding_amount DECIMAL(15,2) NOT NULL,
    current_outstanding_amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    first_warning_at DATETIME NULL,
    second_warning_at DATETIME NULL,
    status ENUM(
        'draft','submitted','under_review','more_info_required',
        'approved','rejected','active','disputed','partially_paid',
        'resolved','withdrawn','temporarily_hidden','archived'
    ) NOT NULL DEFAULT 'draft',
    visibility ENUM('private','admin_only','market_summary') NOT NULL DEFAULT 'private',
    trader_statement TEXT NULL,
    admin_notes TEXT NULL,
    submitted_by_user_id BIGINT UNSIGNED NOT NULL,
    reviewed_by_user_id BIGINT UNSIGNED NULL,
    approved_by_user_id BIGINT UNSIGNED NULL,
    submitted_at DATETIME NULL,
    reviewed_at DATETIME NULL,
    approved_at DATETIME NULL,
    resolved_at DATETIME NULL,
    resolution_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_warning_customer_status (customer_id, status, visibility),
    INDEX idx_warning_trader_status (trader_id, status),
    INDEX idx_warning_invoice (invoice_id),
    CONSTRAINT fk_warning_trader FOREIGN KEY (trader_id) REFERENCES traders(id),
    CONSTRAINT fk_warning_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_warning_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT fk_warning_submitted_by FOREIGN KEY (submitted_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_warning_reviewed_by FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_warning_approved_by FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE warning_evidence (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warning_case_id BIGINT UNSIGNED NOT NULL,
    evidence_type ENUM('invoice','delivery_proof','reminder_proof','warning_letter','communication','other') NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_warning_evidence_case (warning_case_id),
    CONSTRAINT fk_warning_evidence_case FOREIGN KEY (warning_case_id) REFERENCES warning_cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_warning_evidence_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE warning_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    warning_case_id BIGINT UNSIGNED NOT NULL,
    old_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NOT NULL,
    old_visibility VARCHAR(30) NULL,
    new_visibility VARCHAR(30) NULL,
    remarks TEXT NULL,
    changed_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_warning_history_case (warning_case_id, created_at),
    CONSTRAINT fk_warning_history_case FOREIGN KEY (warning_case_id) REFERENCES warning_cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_warning_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE customer_disputes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_number VARCHAR(40) NOT NULL UNIQUE,
    warning_case_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    raised_by ENUM('customer','trader','user_admin','main_admin') NOT NULL,
    reason ENUM(
        'already_paid','incorrect_amount','wrong_customer','goods_issue',
        'duplicate_case','fraud_claim','other'
    ) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open','under_review','awaiting_trader','awaiting_customer','accepted','rejected','resolved') NOT NULL DEFAULT 'open',
    resolution TEXT NULL,
    assigned_to_user_id BIGINT UNSIGNED NULL,
    resolved_by_user_id BIGINT UNSIGNED NULL,
    raised_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_disputes_status (status, assigned_to_user_id),
    CONSTRAINT fk_disputes_warning FOREIGN KEY (warning_case_id) REFERENCES warning_cases(id),
    CONSTRAINT fk_disputes_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_disputes_assigned FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_disputes_resolved_by FOREIGN KEY (resolved_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE dispute_evidence (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT UNSIGNED NOT NULL,
    submitted_by_type ENUM('customer','trader','admin') NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    notes VARCHAR(500) NULL,
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dispute_evidence_dispute FOREIGN KEY (dispute_id) REFERENCES customer_disputes(id) ON DELETE CASCADE,
    CONSTRAINT fk_dispute_evidence_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- 8. CONTENT, MEDIA AND NOTIFICATIONS
-- ============================================================

CREATE TABLE media_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_category ENUM('public_image','public_video','public_pdf','private_kyc','private_financial','private_evidence') NOT NULL,
    storage_key VARCHAR(500) NOT NULL UNIQUE,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    checksum_sha256 CHAR(64) NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_type ENUM('news','notice','circular','event','gallery','announcement') NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_mr VARCHAR(255) NULL,
    content_en LONGTEXT NULL,
    content_mr LONGTEXT NULL,
    featured_media_id BIGINT UNSIGNED NULL,
    attachment_media_id BIGINT UNSIGNED NULL,
    status ENUM('draft','scheduled','published','expired','archived') NOT NULL DEFAULT 'draft',
    share_audience VARCHAR(30) NOT NULL DEFAULT 'all',
    share_category_id BIGINT UNSIGNED NULL,
    published_at DATETIME NULL,
    expires_at DATETIME NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    updated_by_user_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_posts_type_status_date (post_type, status, published_at),
    INDEX idx_posts_share_audience (share_audience, share_category_id, status, post_type),
    CONSTRAINT fk_posts_featured_media FOREIGN KEY (featured_media_id) REFERENCES media_files(id) ON DELETE SET NULL,
    CONSTRAINT fk_posts_attachment_media FOREIGN KEY (attachment_media_id) REFERENCES media_files(id) ON DELETE SET NULL,
    CONSTRAINT fk_posts_share_category FOREIGN KEY (share_category_id) REFERENCES business_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_posts_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_posts_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type VARCHAR(80) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(80) NULL,
    related_entity_id BIGINT UNSIGNED NULL,
    action_url VARCHAR(500) NULL,
    priority ENUM('normal','high','critical') NOT NULL DEFAULT 'normal',
    channel ENUM('in_app','push','sms','whatsapp','email') NOT NULL DEFAULT 'in_app',
    delivery_status ENUM('queued','sent','delivered','failed','read') NOT NULL DEFAULT 'queued',
    read_at DATETIME NULL,
    sent_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user_status (user_id, delivery_status, created_at),
    INDEX idx_notifications_user_created (user_id, created_at),
    INDEX idx_notifications_entity (related_entity_type, related_entity_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE push_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    endpoint VARCHAR(600) NOT NULL,
    p256dh_key VARCHAR(255) NOT NULL,
    auth_key VARCHAR(255) NOT NULL,
    device_label VARCHAR(120) NULL,
    user_agent VARCHAR(500) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_success_at DATETIME NULL,
    last_failure_at DATETIME NULL,
    UNIQUE KEY uq_push_subscriptions_endpoint (endpoint),
    INDEX idx_push_subscriptions_user_active (user_id, is_active),
    INDEX idx_push_subscriptions_active_updated (is_active, updated_at),
    CONSTRAINT fk_push_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE push_delivery_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT UNSIGNED NULL,
    subscription_id BIGINT UNSIGNED NOT NULL,
    status ENUM('sent','failed') NOT NULL,
    provider_status_code INT NULL,
    failure_reason VARCHAR(500) NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_push_logs_notification (notification_id, sent_at),
    INDEX idx_push_logs_subscription (subscription_id, sent_at),
    CONSTRAINT fk_push_logs_notification FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE SET NULL,
    CONSTRAINT fk_push_logs_subscription FOREIGN KEY (subscription_id) REFERENCES push_subscriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE support_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(40) NOT NULL UNIQUE,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    assigned_to_user_id BIGINT UNSIGNED NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
    status ENUM('open','in_progress','waiting_user','resolved','closed') NOT NULL DEFAULT 'open',
    resolved_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tickets_status_resolved (status, resolved_at),
    CONSTRAINT fk_tickets_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_tickets_assigned_to FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE ratings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trader_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    reviewer_user_id BIGINT UNSIGNED NULL,
    rating_scope VARCHAR(40) NOT NULL DEFAULT 'portal',
    reviewer_type VARCHAR(20) NOT NULL DEFAULT 'trader',
    reviewer_name VARCHAR(160) NULL,
    reviewer_mobile VARCHAR(20) NULL,
    rating_value TINYINT UNSIGNED NOT NULL,
    review_text TEXT NULL,
    moderation_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    moderation_remarks VARCHAR(500) NULL,
    moderated_by_user_id BIGINT UNSIGNED NULL,
    moderated_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ratings_trader_status (trader_id, moderation_status),
    INDEX idx_ratings_status_created (moderation_status, created_at),
    INDEX idx_ratings_customer (customer_id),
    INDEX idx_ratings_scope_status (rating_scope, moderation_status, created_at),
    CONSTRAINT fk_ratings_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    CONSTRAINT fk_ratings_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_ratings_moderator FOREIGN KEY (moderated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_ratings_value CHECK (rating_value BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ============================================================
-- 9. CONFIGURATION AND AUDIT
-- ============================================================

CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(120) NOT NULL UNIQUE,
    setting_value JSON NOT NULL,
    description VARCHAR(500) NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by_user_id BIGINT UNSIGNED NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_settings_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE translation_cache (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    source_lang ENUM('en','mr') NOT NULL,
    target_lang ENUM('en','mr') NOT NULL,
    source_hash CHAR(64) NOT NULL,
    source_text TEXT NOT NULL,
    target_text TEXT NOT NULL,
    provider VARCHAR(40) NOT NULL DEFAULT 'google',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_translation_cache_pair_hash (source_lang, target_lang, source_hash),
    INDEX idx_translation_cache_langs (source_lang, target_lang, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pwa_installs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    device_id VARCHAR(255) NULL,
    platform VARCHAR(40) NOT NULL DEFAULT 'other',
    ip_address VARCHAR(80) NULL,
    user_agent TEXT NULL,
    installed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_pwa_installs_device (device_id),
    INDEX idx_pwa_installs_installed_at (installed_at),
    INDEX idx_pwa_installs_platform (platform, installed_at),
    INDEX idx_pwa_installs_user (user_id),
    CONSTRAINT fk_pwa_installs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT UNSIGNED NULL,
    action VARCHAR(120) NOT NULL,
    module VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80) NULL,
    entity_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    request_id VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_actor_date (actor_user_id, created_at),
    INDEX idx_audit_entity (entity_type, entity_id, created_at),
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 10. SEED ROLES, PERMISSIONS AND SETTINGS
-- ============================================================

INSERT INTO roles (code, name, description) VALUES
('MAIN_ADMIN', 'Main Admin', 'Full system control'),
('USER_ADMIN', 'User Admin', 'Operations, trader verification, KYC and content handling'),
('TRADER', 'Trader', 'Trader dashboard and own customer/financial operations');

INSERT INTO permissions (code, name, module) VALUES
('dashboard.view_all', 'View complete dashboard', 'dashboard'),
('trader.review', 'Review trader applications', 'traders'),
('trader.manage', 'Manage traders', 'traders'),
('customer.search', 'Search shared customers', 'customers'),
('customer.create', 'Create customer', 'customers'),
('customer.kyc_submit', 'Submit customer KYC', 'customers'),
('customer.kyc_review', 'Review customer KYC', 'customers'),
('invoice.manage_own', 'Manage own invoices', 'finance'),
('payment.manage_own', 'Manage own payments', 'finance'),
('warning.submit', 'Submit warnings', 'warnings'),
('warning.review', 'Review warnings', 'warnings'),
('warning.approve_market_alert', 'Approve market-wide warning', 'warnings'),
('dispute.manage', 'Manage disputes', 'disputes'),
('content.manage', 'Manage posts and media', 'content'),
('report.export', 'Export reports', 'reports'),
('audit.view', 'View audit logs', 'audit'),
('settings.manage', 'Manage system settings', 'settings');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.code = 'MAIN_ADMIN';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p
WHERE r.code = 'USER_ADMIN'
AND p.code IN (
    'dashboard.view_all','trader.review','trader.manage','customer.search',
    'customer.create','customer.kyc_review','warning.review','dispute.manage',
    'content.manage','report.export'
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p
WHERE r.code = 'TRADER'
AND p.code IN (
    'customer.search','customer.create','customer.kyc_submit',
    'invoice.manage_own','payment.manage_own','warning.submit','report.export'
);

INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('warning_policy', JSON_OBJECT(
    'first_reminder_after_due_days', 1,
    'warning_1_after_due_days', 7,
    'warning_2_after_warning_1_days', 7,
    'market_alert_requires_admin_approval', true,
    'minimum_reminders_before_market_alert', 2
), 'Payment reminder and warning escalation rules', FALSE),
('kyc_policy', JSON_OBJECT(
    'admin_review_required', true,
    'kyc_validity_months', 36,
    'allow_shared_verified_kyc', true,
    'show_full_documents_to_traders', false
), 'Customer KYC rules', FALSE),
('upload_policy', JSON_OBJECT(
    'max_image_mb', 5,
    'max_pdf_mb', 15,
    'max_video_mb', 100,
    'allowed_types', JSON_ARRAY('image/jpeg','image/png','application/pdf','video/mp4')
), 'Upload limits', FALSE);

-- ============================================================
-- 11. VIEWS FOR SAFE DASHBOARDS AND CUSTOMER SEARCH
-- ============================================================

CREATE OR REPLACE VIEW vw_customer_market_risk_summary AS
SELECT
    c.id AS customer_id,
    c.customer_code,
    c.full_name,
    CONCAT(REPEAT('X', GREATEST(CHAR_LENGTH(c.mobile) - 4, 0)), RIGHT(c.mobile, 4)) AS masked_mobile,
    c.kyc_status,
    c.verified_at,
    c.risk_status,
    COUNT(DISTINCT CASE
        WHEN wc.status IN ('approved','active','partially_paid','disputed')
         AND wc.visibility = 'market_summary'
        THEN wc.id END) AS active_market_warning_count,
    COALESCE(SUM(CASE
        WHEN wc.status IN ('approved','active','partially_paid','disputed')
         AND wc.visibility = 'market_summary'
        THEN wc.current_outstanding_amount ELSE 0 END), 0) AS verified_market_outstanding,
    MIN(CASE
        WHEN wc.status IN ('approved','active','partially_paid','disputed')
         AND wc.visibility = 'market_summary'
        THEN wc.due_date END) AS oldest_active_due_date,
    MAX(wc.updated_at) AS risk_last_updated_at
FROM customers c
LEFT JOIN warning_cases wc ON wc.customer_id = c.id
WHERE c.deleted_at IS NULL
GROUP BY
    c.id, c.customer_code, c.full_name, c.mobile,
    c.kyc_status, c.verified_at, c.risk_status;

CREATE OR REPLACE VIEW vw_trader_customer_balances AS
SELECT
    tc.id AS trader_customer_id,
    tc.trader_id,
    tc.customer_id,
    c.customer_code,
    c.full_name,
    COALESCE(SUM(i.total_amount), 0) AS total_invoiced,
    COALESCE(SUM(i.paid_amount), 0) AS total_paid,
    COALESCE(SUM(i.outstanding_amount), 0) AS total_outstanding,
    COALESCE(SUM(CASE WHEN i.due_date < CURDATE() AND i.outstanding_amount > 0 THEN i.outstanding_amount ELSE 0 END), 0) AS overdue_amount,
    MAX(i.invoice_date) AS last_invoice_date
FROM trader_customers tc
JOIN customers c ON c.id = tc.customer_id
LEFT JOIN invoices i ON i.trader_customer_id = tc.id
    AND i.deleted_at IS NULL
    AND i.status <> 'cancelled'
GROUP BY tc.id, tc.trader_id, tc.customer_id, c.customer_code, c.full_name;

CREATE OR REPLACE VIEW vw_admin_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM traders WHERE verification_status = 'approved') AS approved_traders,
    (SELECT COUNT(*) FROM traders WHERE verification_status IN ('submitted','under_review','correction_required')) AS pending_trader_reviews,
    (SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL) AS total_customers,
    (SELECT COUNT(*) FROM customers WHERE kyc_status = 'verified' AND deleted_at IS NULL) AS verified_customers,
    (SELECT COUNT(*) FROM customer_duplicate_candidates WHERE status = 'pending') AS duplicate_candidates,
    (SELECT COUNT(*) FROM warning_cases WHERE status IN ('submitted','under_review','more_info_required')) AS pending_warning_reviews,
    (SELECT COUNT(*) FROM warning_cases WHERE status IN ('approved','active','partially_paid','disputed') AND visibility = 'market_summary') AS active_market_warnings,
    (SELECT COALESCE(SUM(current_outstanding_amount), 0) FROM warning_cases WHERE status IN ('approved','active','partially_paid','disputed') AND visibility = 'market_summary') AS active_warning_amount,
    (SELECT COUNT(*) FROM customer_disputes WHERE status NOT IN ('resolved','rejected')) AS open_disputes;

-- ============================================================
-- 12. DAILY MARKET PRICES / बाजार भाव
-- ============================================================

CREATE TABLE IF NOT EXISTS market_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category ENUM('vegetable','fruit','flower') NOT NULL,
    name_en VARCHAR(120) NOT NULL,
    name_mr VARCHAR(120) NOT NULL,
    variety VARCHAR(120) NULL,
    default_unit VARCHAR(40) NOT NULL DEFAULT 'Kg',
    display_order INT NOT NULL DEFAULT 100,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uq_market_item_name (category, name_en, variety),
    INDEX idx_market_items_category_active (category, is_active, deleted_at, display_order),
    INDEX idx_market_items_active_order (is_active, deleted_at, display_order),
    CONSTRAINT fk_market_items_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_market_items_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS market_prices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    market_item_id BIGINT UNSIGNED NOT NULL,
    price_date DATE NOT NULL,
    min_price DECIMAL(10,2) NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    modal_price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(40) NOT NULL,
    arrival_quantity DECIMAL(12,2) NULL,
    arrival_unit VARCHAR(40) NULL,
    quality_grade VARCHAR(80) NULL,
    notes TEXT NULL,
    status ENUM('draft','published') NOT NULL DEFAULT 'draft',
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    published_by BIGINT UNSIGNED NULL,
    published_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_market_price_item_date (market_item_id, price_date),
    INDEX idx_market_prices_date_status (price_date, status),
    INDEX idx_market_prices_status_published (status, published_at),
    INDEX idx_market_prices_item_date (market_item_id, price_date),
    CONSTRAINT fk_market_prices_item FOREIGN KEY (market_item_id) REFERENCES market_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_market_prices_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_market_prices_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_market_prices_published_by FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_market_prices_non_negative CHECK (min_price >= 0 AND max_price >= 0 AND modal_price >= 0),
    CONSTRAINT chk_market_prices_range CHECK (max_price >= min_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO market_items (category, name_en, name_mr, default_unit, display_order, is_active)
VALUES
('vegetable','Tomato','टोमॅटो','Kg',1,1),
('vegetable','Onion','कांदा','Kg',2,1),
('vegetable','Potato','बटाटा','Kg',3,1),
('vegetable','Brinjal','वांगी','Kg',4,1),
('vegetable','Cabbage','कोबी','Kg',5,1),
('vegetable','Cauliflower','फ्लॉवर','Kg',6,1),
('vegetable','Green Chilli','हिरवी मिरची','Kg',7,1),
('vegetable','Capsicum','ढोबळी मिरची','Kg',8,1),
('vegetable','Lady Finger','भेंडी','Kg',9,1),
('vegetable','Cucumber','काकडी','Kg',10,1),
('vegetable','Carrot','गाजर','Kg',11,1),
('vegetable','Beetroot','बीट','Kg',12,1),
('vegetable','Bitter Gourd','कारले','Kg',13,1),
('vegetable','Bottle Gourd','दुधी भोपळा','Kg',14,1),
('vegetable','Ridge Gourd','दोडका','Kg',15,1),
('vegetable','Pumpkin','भोपळा','Kg',16,1),
('vegetable','Green Peas','मटार','Kg',17,1),
('vegetable','Spinach','पालक','Bunch',18,1),
('vegetable','Coriander','कोथिंबीर','Bunch',19,1),
('vegetable','Fenugreek','मेथी','Bunch',20,1),
('vegetable','Drumstick','शेवगा','Kg',21,1),
('vegetable','Garlic','लसूण','Kg',22,1),
('vegetable','Ginger','आले','Kg',23,1),
('vegetable','Sweet Corn','स्वीट कॉर्न','Piece',24,1),
('fruit','Apple','सफरचंद','Kg',101,1),
('fruit','Banana','केळी','Dozen',102,1),
('fruit','Orange','संत्री','Kg',103,1),
('fruit','Pomegranate','डाळिंब','Kg',104,1),
('fruit','Grapes','द्राक्षे','Kg',105,1),
('fruit','Papaya','पपई','Kg',106,1),
('fruit','Watermelon','कलिंगड','Kg',107,1),
('fruit','Muskmelon','खरबूज','Kg',108,1),
('fruit','Guava','पेरू','Kg',109,1),
('fruit','Pineapple','अननस','Piece',110,1),
('fruit','Mango','आंबा','Kg',111,1),
('fruit','Sweet Lime','मोसंबी','Kg',112,1),
('fruit','Chikoo','चिकू','Kg',113,1),
('fruit','Custard Apple','सीताफळ','Kg',114,1),
('fruit','Coconut','नारळ','Piece',115,1),
('flower','Rose','गुलाब','Bunch',201,1),
('flower','Marigold','झेंडू','Kg',202,1),
('flower','Jasmine','मोगरा','Kg',203,1),
('flower','Chrysanthemum','शेवंती','Kg',204,1),
('flower','Tuberose','निशिगंध','Bunch',205,1),
('flower','Lotus','कमळ','Piece',206,1),
('flower','Gerbera','जरबेरा','Bunch',207,1),
('flower','Lily','लिली','Bunch',208,1);

SET FOREIGN_KEY_CHECKS = 1;

USE market_yard_portal;

-- ============================================================
-- FINAL MEMBER COMPATIBILITY UPDATES
-- ============================================================
-- The application keeps internal role/permission codes such as TRADER/trader.*
-- for compatibility, but the visible label is Member.

UPDATE roles
SET name = 'Member',
    description = 'Member dashboard and own customer/financial operations'
WHERE code = 'TRADER';

UPDATE roles
SET description = 'Operations, member verification, KYC and content handling'
WHERE code = 'USER_ADMIN';

UPDATE permissions
SET name = 'Review member applications',
    module = 'members'
WHERE code = 'trader.review';

UPDATE permissions
SET name = 'Manage members',
    module = 'members'
WHERE code = 'trader.manage';

-- If your existing Workbench database uses members/member_documents table names,
-- this block updates those tables too. It is safe to run repeatedly.

DROP PROCEDURE IF EXISTS schema_add_column_if_missing;
DELIMITER $$
CREATE PROCEDURE schema_add_column_if_missing(
    IN table_name_to_update VARCHAR(64),
    IN column_name_to_add VARCHAR(64),
    IN column_definition TEXT
)
BEGIN
    IF EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = table_name_to_update
    )
    AND NOT EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = table_name_to_update
          AND COLUMN_NAME = column_name_to_add
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', table_name_to_update, '` ADD COLUMN ', column_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS schema_add_index_if_missing;
DELIMITER $$
CREATE PROCEDURE schema_add_index_if_missing(
    IN table_name_to_update VARCHAR(64),
    IN index_name_to_add VARCHAR(64),
    IN index_definition TEXT
)
BEGIN
    IF EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = table_name_to_update
    )
    AND NOT EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = table_name_to_update
          AND INDEX_NAME = index_name_to_add
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', table_name_to_update, '` ADD INDEX ', index_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

CALL schema_add_column_if_missing('members', 'aadhaar_masked', 'aadhaar_masked VARCHAR(20) NULL');
CALL schema_add_column_if_missing('members', 'aadhaar_hash', 'aadhaar_hash CHAR(64) NULL');
CALL schema_add_column_if_missing('members', 'pan_masked', 'pan_masked VARCHAR(20) NULL');
CALL schema_add_column_if_missing('members', 'pan_hash', 'pan_hash CHAR(64) NULL');
CALL schema_add_column_if_missing('members', 'blood_group', 'blood_group VARCHAR(5) NULL');
CALL schema_add_column_if_missing('members', 'licence_number', 'licence_number VARCHAR(100) NULL');
CALL schema_add_column_if_missing('members', 'association_sequence_number', 'association_sequence_number VARCHAR(50) NULL');
CALL schema_add_column_if_missing('members', 'association_registration_number', 'association_registration_number VARCHAR(50) NULL');

CALL schema_add_index_if_missing('members', 'idx_members_aadhaar_hash', 'idx_members_aadhaar_hash (aadhaar_hash)');
CALL schema_add_index_if_missing('members', 'idx_members_pan_hash', 'idx_members_pan_hash (pan_hash)');

SET @member_document_enum_sql = IF(
    EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'member_documents'
    ),
    CONCAT(
        'ALTER TABLE `member_documents` MODIFY COLUMN document_type ENUM(',
        '''profile_photo'',''aadhaar_masked'',''pan'',''shop_allotment'',',
        '''market_registration'',''gst_certificate'',''address_proof'',',
        '''bank_proof'',''signature'',''other''',
        ') NOT NULL'
    ),
    'SELECT ''member_documents table not found; skipped document_type update'' AS message'
);

PREPARE stmt FROM @member_document_enum_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP PROCEDURE IF EXISTS schema_add_column_if_missing;
DROP PROCEDURE IF EXISTS schema_add_index_if_missing;

SELECT 'market_yard_portal_mysql_schema.sql completed' AS message;
