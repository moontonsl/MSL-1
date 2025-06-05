<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ml_id')->nullable();
            $table->string('username')->nullable();
            $table->string('ml_server')->nullable();
            $table->string('ml_ign')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('surname')->nullable();
            $table->string('suffix')->nullable();
            $table->date('birthday')->nullable();
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('contact_number')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'ml_id',
                'ml_server',
                'ml_ign',
                'status',
                'surname',
                'suffix',
                'birthday',
                'age',
                'gender',
                'contact_number',
            ]);
        });
    }
};