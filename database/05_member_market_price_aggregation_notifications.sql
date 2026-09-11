-- Member market price aggregation metadata and notification duplicate protection.
-- Safe/idempotent migration for existing production databases.

ALTER TABLE member_market_prices
  ADD COLUMN IF NOT EXISTS is_outlier TINYINT(1) NOT NULL DEFAULT 0 AFTER unit,
  ADD COLUMN IF NOT EXISTS included_in_aggregate TINYINT(1) NOT NULL DEFAULT 1 AFTER is_outlier;

CREATE INDEX IF NOT EXISTS idx_member_market_prices_aggregate
  ON member_market_prices (price_date, market_item_id, status, included_in_aggregate);

ALTER TABLE market_prices
  ADD COLUMN IF NOT EXISTS raw_submission_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER notes,
  ADD COLUMN IF NOT EXISTS valid_submission_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER raw_submission_count,
  ADD COLUMN IF NOT EXISTS submission_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER valid_submission_count,
  ADD COLUMN IF NOT EXISTS aggregate_status VARCHAR(30) NOT NULL DEFAULT 'updated' AFTER submission_count;

CREATE INDEX IF NOT EXISTS idx_market_prices_date_item_aggregate
  ON market_prices (price_date, market_item_id, status, aggregate_status);

CREATE TABLE IF NOT EXISTS market_price_notification_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  price_date DATE NOT NULL,
  notification_type VARCHAR(80) NOT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  recipient_count INT UNSIGNED NOT NULL DEFAULT 0,
  push_success_count INT UNSIGNED NOT NULL DEFAULT 0,
  push_failure_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_market_price_notification_log_date_type (price_date, notification_type),
  INDEX idx_market_price_notification_log_sent (notification_type, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;