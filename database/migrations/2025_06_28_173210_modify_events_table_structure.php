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
        Schema::table('events', function (Blueprint $table) {
            // Drop existing columns
            $table->dropColumn([
                'event_name',
                'event_state', 
                'event_canonical',
                'event_logo',
                'event_title',
                'event_subtitle'
            ]);

            // Add new columns that match the Event model
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('location')->nullable();
            $table->foreignId('created_by')->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Drop new columns
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'title',
                'description',
                'start_date',
                'end_date',
                'location',
                'created_by'
            ]);

            // Restore original columns
            $table->string('event_name');
            $table->string('event_state');
            $table->string('event_canonical');
            $table->string('event_logo');
            $table->string('event_title');
            $table->text('event_subtitle');
        });
    }
};
