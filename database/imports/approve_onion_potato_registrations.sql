-- Approve Onion-Potato registrations after Phase 3 import.
-- Scope: only traders with trader_code ONP-*.
-- This activates user logins and marks linked trader + gala records approved.
SET NAMES utf8mb4;
START TRANSACTION;

SET @admin_user_id := (
    SELECT u.id
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE r.code IN ('MAIN_ADMIN', 'ADMIN', 'SUPER_ADMIN')
      AND u.status IN ('active', 'pending')
    ORDER BY FIELD(r.code, 'MAIN_ADMIN', 'SUPER_ADMIN', 'ADMIN'), u.id
    LIMIT 1
);

UPDATE users u
JOIN traders t ON t.user_id = u.id
SET
    u.status = 'active',
    u.mobile_verified_at = COALESCE(u.mobile_verified_at, NOW()),
    u.updated_at = NOW()
WHERE t.trader_code LIKE 'ONP-%'
  AND u.status IN ('pending', 'active');

UPDATE traders t
SET
    t.verification_status = 'approved',
    t.verified_by = COALESCE(@admin_user_id, t.verified_by),
    t.verified_at = COALESCE(t.verified_at, NOW()),
    t.updated_at = NOW()
WHERE t.trader_code LIKE 'ONP-%'
  AND t.verification_status IN ('submitted', 'under_review', 'correction_required', 'approved');

UPDATE trader_galas tg
JOIN traders t ON t.id = tg.trader_id
SET
    tg.status = 'approved',
    tg.verified_by = COALESCE(@admin_user_id, tg.verified_by),
    tg.verified_at = COALESCE(tg.verified_at, NOW()),
    tg.updated_at = NOW()
WHERE t.trader_code LIKE 'ONP-%'
  AND tg.status IN ('submitted', 'under_review', 'correction_required', 'approved');

COMMIT;

SELECT COUNT(*) AS onion_potato_active_users
FROM users u
JOIN traders t ON t.user_id = u.id
WHERE t.trader_code LIKE 'ONP-%'
  AND u.status = 'active';

SELECT COUNT(*) AS onion_potato_approved_traders
FROM traders
WHERE trader_code LIKE 'ONP-%'
  AND verification_status = 'approved';

SELECT COUNT(*) AS onion_potato_approved_galas
FROM trader_galas tg
JOIN traders t ON t.id = tg.trader_id
WHERE t.trader_code LIKE 'ONP-%'
  AND tg.status = 'approved';
