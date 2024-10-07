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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ref_id', 64)->unique()->index();
            $table->string('alt_id', 64)->nullable()->index();
            $table->uuid('transaction_model_id');
            $table->string('name')->unique()->index();
            $table->jsonb('meta')->nullable();
            $table->timestamps();

            $table->foreign('transaction_model_id')->references('id')->on('transaction_models')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
