-- Custom SQL migration file, put you code below! ---- Custom SQL migration file, put you code below!

-- Add a trigger to check if the rate is greater than or equal to zero
CREATE OR REPLACE FUNCTION check_exchange_rate_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rate < 0 THEN
        RAISE EXCEPTION 'Rate must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'check_exchange_rate_negative_values_trigger'
    ) THEN
        CREATE TRIGGER check_exchange_rate_negative_values_trigger
        BEFORE INSERT OR UPDATE ON exchange_rates
        FOR EACH ROW
        EXECUTE PROCEDURE check_exchange_rate_negative_values();
    END IF;
END;
$$;

-- Add a trigger to check if the UOM conversion rate is greater than or equal to zero
CREATE OR REPLACE FUNCTION check_uom_rate_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rate < 0 THEN
        RAISE EXCEPTION 'Rate must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'check_uom_rate_negative_values_trigger'
    ) THEN
        CREATE TRIGGER check_uom_rate_negative_values_trigger
        BEFORE INSERT OR UPDATE ON uoms
        FOR EACH ROW
        EXECUTE PROCEDURE check_uom_rate_negative_values();
    END IF;
END;
$$;

-- Add a trigger to check if the amount and quantity are greater than or equal to zero
CREATE OR REPLACE FUNCTION check_entry_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.amount < 0 THEN
        RAISE EXCEPTION 'Amount must be greater than or equal to zero';
    END IF;
    IF NEW.quantity < 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'check_entry_negative_values_trigger'
    ) THEN
        CREATE TRIGGER check_entry_negative_values_trigger
        BEFORE INSERT OR UPDATE ON entries
        FOR EACH ROW
        EXECUTE PROCEDURE check_entry_negative_values();
    END IF;
END;
$$;

-- Add a trigger to check if the product_id is not null or empty when quantity is greater than zero
CREATE OR REPLACE FUNCTION check_entry_product_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity > 0 AND (NEW.product_id IS NULL OR NEW.product_id = '') THEN
        RAISE EXCEPTION 'Quantity must be zero if product_id is null or empty';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'check_entry_product_id_trigger'
    ) THEN
        CREATE TRIGGER check_entry_product_id_trigger
        BEFORE INSERT OR UPDATE ON entries
        FOR EACH ROW
        EXECUTE PROCEDURE check_entry_product_id();
    END IF;
END;
$$;