<?php

use App\Enums\CurrencySeparators;
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
        Schema::create('currencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique()->index();
            $table->string('iso_code', 3)->unique()->index();
            $table->string('symbol', 5)->nullable();
            $table->smallInteger('precision', false, true)->default(2);
            $table->boolean('active')->default(true);
            $table->enum('thousands_separator', array_column(CurrencySeparators::cases(), 'value'))->nullable();
            $table->enum('decimal_separator', array_filter(array_column(CurrencySeparators::cases(), 'value'), fn ($separator) => strlen($separator) > 0));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
