-- DOWN MIGRATION
-- Drops functions and triggers for data validation.

-- Drop triggers
DROP TRIGGER IF EXISTS check_conversion_rate_negative_values_trigger ON conversion_rates;
DROP TRIGGER IF EXISTS check_entry_negative_values_trigger ON entries;

-- Drop functions
DROP FUNCTION IF EXISTS check_conversion_rate_negative_values();
DROP FUNCTION IF EXISTS check_entry_negative_values();
