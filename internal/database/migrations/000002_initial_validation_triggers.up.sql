-- UP MIGRATION
-- Creates functions and triggers for data validation.

-- Trigger function to ensure conversion rates are not negative.
CREATE FUNCTION check_conversion_rate_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rate < 0 THEN
        RAISE EXCEPTION 'Rate must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attaches the trigger to the 'conversion_rates' table.
CREATE TRIGGER check_conversion_rate_negative_values_trigger
BEFORE INSERT OR UPDATE ON conversion_rates
FOR EACH ROW
EXECUTE PROCEDURE check_conversion_rate_negative_values();

-- Trigger function to ensure entry values are not negative.
CREATE FUNCTION check_entry_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.value < 0 THEN
        RAISE EXCEPTION 'Value must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attaches the trigger to the 'entries' table.
CREATE TRIGGER check_entry_negative_values_trigger
BEFORE INSERT OR UPDATE ON entries
FOR EACH ROW
EXECUTE PROCEDURE check_entry_negative_values();
