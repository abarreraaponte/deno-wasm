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
        Schema::create('entities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ref_id', 64)->unique()->index();
            $table->string('alt_id', 64)->nullable()->index();
            $table->uuid('entity_model_id');
            $table->uuid('parent_id')->nullable();
            $table->string('name')->unique()->index();
            $table->jsonb('meta')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->foreign('entity_model_id')->references('id')->on('entity_models')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entities');
    }
};
