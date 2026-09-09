-- Complaint numbering support for Complaints Management.
-- Safe to rerun: preserves existing IDs and complaint_number values; backfills missing numbers oldest-first.

DELIMITER $$
CREATE PROCEDURE add_complaint_number_if_missing()
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'support_tickets' AND COLUMN_NAME = 'complaint_number'
  ) THEN
    ALTER TABLE support_tickets ADD COLUMN complaint_number VARCHAR(40) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'support_tickets' AND INDEX_NAME = 'uq_support_tickets_complaint_number'
  ) THEN
    ALTER TABLE support_tickets ADD UNIQUE KEY uq_support_tickets_complaint_number (complaint_number);
  END IF;
END$$
DELIMITER ;

CALL add_complaint_number_if_missing();
DROP PROCEDURE add_complaint_number_if_missing;

SET @cmp_seq := COALESCE((
  SELECT MAX(CAST(REPLACE(REPLACE(complaint_number, 'CMP-', ''), 'CMP ', '') AS UNSIGNED))
  FROM support_tickets
  WHERE complaint_number IS NOT NULL AND complaint_number <> ''
), 0);

UPDATE support_tickets st
JOIN (
  SELECT id, (@cmp_seq := @cmp_seq + 1) AS seq
  FROM support_tickets
  WHERE complaint_number IS NULL OR complaint_number = ''
  ORDER BY created_at ASC, id ASC
) ordered ON ordered.id = st.id
SET st.complaint_number = CONCAT('CMP ', LPAD(ordered.seq, 2, '0'));
