-- Production migration: Web Push subscriptions and delivery logs.
-- Safe to run repeatedly.
-- Open your Hostinger/phpMyAdmin database first, then import this file.
-- If using MySQL CLI, uncomment and update:
-- USE your_hostinger_database_name;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS push_subscriptions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS push_delivery_logs (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

