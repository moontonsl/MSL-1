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
        if (!Schema::hasTable('mccs2_predictions')) {
            Schema::create('mccs2_predictions', function (Blueprint $table) {
                $table->id();
                $table->string('ml_id')->unique();
                $table->json('selected_teams');
                $table->json('selected_players');
                $table->timestamps();
                $table->foreign('ml_id')->references('ml_id')->on('ml_users')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mccs2_predictions');
    }
}; 