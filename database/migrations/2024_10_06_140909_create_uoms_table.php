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
        Schema::create('uoms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ref_id', 64)->unique()->index();
            $table->string('alt_id', 64)->nullable()->index();
            $table->uuid('uom_type_id');
            $table->string('name')->unique()->index();
            $table->string('symbol')->unique()->index();
            $table->boolean('active')->default(true);
            $table->decimal('conversion_rate', 24, 12)->default(1);
            $table->timestamps();

            $table->foreign('uom_type_id')->references('id')->on('uom_types')->onDelete('restrict');
        });

        DB::unprepared("
			CREATE OR REPLACE FUNCTION check_uom_rate_negative_values() RETURNS TRIGGER AS $$
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
					WHERE tgname = 'check_uom_rate_negative_values_trigger'
				) THEN
					CREATE TRIGGER check_uom_rate_negative_values_trigger
					BEFORE INSERT OR UPDATE ON uoms
					FOR EACH ROW
					EXECUTE PROCEDURE check_uom_rate_negative_values();
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
        Schema::dropIfExists('uoms');
        DB::unprepared('DROP TRIGGER IF EXISTS check_uom_rate_negative_values_trigger ON uoms');
        DB::unprepared('DROP FUNCTION IF EXISTS check_uom_rate_negative_values');
    }
};
