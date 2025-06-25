-- DOWN MIGRATION
-- Removes the triggers and functions in the reverse order of creation.

-- Drop the trigger from the 'entries' table.
DROP TRIGGER IF EXISTS check_entry_negative_values_trigger ON entries;

-- Drop the associated function.
DROP FUNCTION IF EXISTS check_entry_negative_values();

-- Drop the trigger from the 'conversion_rates' table.
DROP TRIGGER IF EXISTS check_conversion_rate_negative_values_trigger ON conversion_rates;

-- Drop the associated function.
DROP FUNCTION IF EXISTS check_conversion_rate_negative_values();
