<?php

use App\Enums\BalanceTypes;
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
        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ref_id', 64)->unique()->index();
            $table->string('alt_id', 64)->nullable()->index();
            $table->string('name')->unique()->index();
            $table->enum('balance_type', array_column(BalanceTypes::cases(), 'value'));
            $table->uuid('ledger_id');
            $table->uuid('parent_id')->nullable();
            $table->boolean('active')->default(true);
            $table->jsonb('meta')->nullable();
            $table->timestamps();

            $table->foreign('ledger_id')->references('id')->on('ledgers')->onDelete('restrict');

        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('accounts')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
