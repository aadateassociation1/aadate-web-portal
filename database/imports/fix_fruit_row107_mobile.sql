-- Fix Fruit row 107 login mobile.
-- Old/wrong mobile: 9485847862
-- Correct mobile:   8485847862
-- Existing password hash stays unchanged.

START TRANSACTION;

SET @old_mobile := '9485847862';
SET @new_mobile := '8485847862';

SET @row107_user_id := (
  SELECT u.id
  FROM users u
  JOIN traders t ON t.user_id = u.id
  JOIN trader_galas tg ON tg.trader_id = t.id
  JOIN market_galas mg ON mg.id = tg.gala_id
  WHERE u.mobile = @old_mobile
    AND t.association_sequence_number = '107'
    AND mg.gala_number = '874'
  LIMIT 1
);

SET @duplicate_target_count := (
  SELECT COUNT(*)
  FROM users
  WHERE (mobile = @new_mobile OR username = @new_mobile)
    AND id <> COALESCE(@row107_user_id, 0)
);

UPDATE users
SET mobile = @new_mobile,
    username = CASE WHEN username = @old_mobile THEN @new_mobile ELSE username END,
    updated_at = NOW()
WHERE id = @row107_user_id
  AND @duplicate_target_count = 0;

COMMIT;

SELECT
  u.id,
  u.mobile,
  u.username,
  u.full_name,
  t.trader_code,
  t.association_sequence_number,
  mg.gala_number
FROM users u
JOIN traders t ON t.user_id = u.id
JOIN trader_galas tg ON tg.trader_id = t.id
JOIN market_galas mg ON mg.id = tg.gala_id
WHERE u.mobile = @new_mobile
  AND t.association_sequence_number = '107'
  AND mg.gala_number = '874';
