<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->uuid('id')->primary();
			$table->uuid('from_currency_id');
			$table->uuid('to_currency_id');
			$table->decimal('rate', 36, 12);
			$table->date('date');
            $table->timestamps();

			$table->foreign('from_currency_id')->references('id')->on('currencies')->onDelete(('cascade'));
			$table->foreign('to_currency_id')->references('id')->on('currencies')->onDelete(('cascade'));
        });

		// Check negative values
		DB::unprepared("
			CREATE OR REPLACE FUNCTION check_exchange_rate_negative_values() RETURNS TRIGGER AS $$
			BEGIN
				IF NEW.rate < 0 THEN
					RAISE EXCEPTION 'Rate must be greater than or equal to zero';
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
					WHERE tgname = 'check_exchange_rate_negative_values_trigger'
				) THEN
					CREATE TRIGGER check_exchange_rate_negative_values_trigger
					BEFORE INSERT OR UPDATE ON exchange_rates
					FOR EACH ROW
					EXECUTE PROCEDURE check_exchange_rate_negative_values();
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
		DB::unprepared('DROP TRIGGER IF EXISTS check_exchange_rate_negative_values_trigger ON exchange_rates');
		DB::unprepared('DROP FUNCTION IF EXISTS check_exchange_rate_negative_values() CASCADE');
        Schema::dropIfExists('exchange_rates');
    }
};
