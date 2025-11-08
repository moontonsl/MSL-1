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
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('email_change_token', 'email_verification_code');
            $table->renameColumn('email_change_token_expires_at', 'email_verification_code_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('email_verification_code', 'email_change_token');
            $table->renameColumn('email_verification_code_expires_at', 'email_change_token_expires_at');
        });
    }
};
