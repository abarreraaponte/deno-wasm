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
        Schema::create('branches', function (Blueprint $table) {
            $table->uuid('id')->primary();
			$table->foreignUuid('organization_id');
			$table->foreignUuid('parent_id')->nullable();
			$table->string('name');
            $table->dateTime('created_at')->nullable();
			$table->dateTime('updated_at')->nullable();

			$table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
        });

		Schema::table('branches', function (Blueprint $table) {
			$table->foreign('parent_id')->references('id')->on('branches')->onDelete('cascade');
		});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
