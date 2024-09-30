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
			$table->string('ref_id')->index()->unique();
			$table->string('alt_id')->index()->nullable()->unique();
			$table->string('name')->index()->unique();
			$table->string('description')->nullable();
			$table->uuid('currency_id')->references('id')->on('currencies');
			$table->boolean('active')->default(true);
            $table->timestamps();
			$table->softDeletes();
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
