<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ledgers', function (Blueprint $table) {
            $table->uuid('id')->primary();
			$table->string('ref_id', 64)->unique()->index();
			$table->string('alt_id', 64)->nullable()->index();
			$table->string('name')->unique()->index();
			$table->string('description')->nullable();
			$table->uuid('currency_id');
			$table->boolean('active')->default(true);
            $table->timestamps();

			$table->foreign('currency_id')->references('id')->on('currencies')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledgers');
    }
};
