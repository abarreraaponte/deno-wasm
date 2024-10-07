<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ref_id', 64)->unique()->index();
            $table->string('alt_id', 64)->nullable()->index();
            $table->uuid('ledger_id');
            $table->uuid('transaction_id');
            $table->uuid('product_id')->nullable();
            $table->uuid('uom_id')->nullable();
            $table->uuid('debit_account_id');
            $table->uuid('credit_account_id');
            $table->decimal('quantity', 36, 12);
            $table->decimal('amount', 36, 12);
            $table->jsonb('dimensions')->nullable();
            $table->timestamps();
        });

        // Check negative values
        DB::unprepared("
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
		");

        DB::unprepared("
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
		");

        // Check product_id when quantity > 0
        DB::unprepared("
			CREATE OR REPLACE FUNCTION check_entry_product_id() RETURNS TRIGGER AS $$
			BEGIN
				IF NEW.quantity > 0 AND (NEW.product_id IS NULL OR NEW.product_id = '') THEN
					RAISE EXCEPTION 'Quantity must be zero if product_id is null or empty';
				END IF;
				RETURN NEW;
			END;
			$$ LANGUAGE plpgsql;
		");

        DB::unprepared("
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
		");

        // Check uom_id when quantity > 0
        DB::unprepared("
			CREATE OR REPLACE FUNCTION check_entry_uom_id() RETURNS TRIGGER AS $$
			BEGIN
				IF NEW.quantity > 0 AND (NEW.uom_id IS NULL OR NEW.uom_id = '') THEN
					RAISE EXCEPTION 'Quantity must be zero if uom_id is null or empty';
				END IF;
				RETURN NEW;
			END;
			$$ LANGUAGE plpgsql;
		");

        DB::unprepared("
			DO $$
			BEGIN
				IF NOT EXISTS (
					SELECT 1 
					FROM pg_trigger 
					WHERE tgname = 'check_entry_uom_id_trigger'
				) THEN
					CREATE TRIGGER check_entry_uom_id_trigger
					BEFORE INSERT OR UPDATE ON entries
					FOR EACH ROW
					EXECUTE PROCEDURE check_entry_uom_id();
				END IF;
			END;
			$$;
		");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS check_entry_negative_values_trigger ON entries;');
        DB::unprepared('DROP FUNCTION IF EXISTS check_entry_negative_values();');
        DB::unprepared('DROP TRIGGER IF EXISTS check_entry_product_id_trigger ON entries;');
        DB::unprepared('DROP FUNCTION IF EXISTS check_entry_product_id();');
        DB::unprepared('DROP TRIGGER IF EXISTS check_entry_uom_id_trigger ON entries;');
        DB::unprepared('DROP FUNCTION IF EXISTS check_entry_uom_id();');
        Schema::dropIfExists('entries');
    }
};
