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
        Schema::create('entity_models', function (Blueprint $table) {
            $table->uuid('id')->primary();
			$table->string('ref_id', 64)->unique()->index();
			$table->string('alt_id', 64)->nullable()->index();
			$table->string('name')->unique()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_models');
    }
};
