<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // ML related fields
            $table->string('ml_id')->nullable();
            $table->string('username')->nullable();
            $table->string('ml_server')->nullable();
            $table->string('ml_ign')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            
            // Personal details
            $table->string('surname')->nullable();
            $table->string('lastName')->nullable();
            $table->string('suffix')->nullable();
            $table->date('birthday')->nullable();
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('contact_number')->nullable();
            $table->string('facebook_link')->nullable();
            
            // Academic details
            $table->string('course')->nullable();
            $table->string('university')->nullable();
            $table->string('year_level')->nullable();
            $table->string('studentId')->nullable();
            $table->string('proofOfEnrollment')->nullable();
            
            // Location details
            $table->string('region')->nullable();
            $table->string('island')->nullable();
            
            // Squad details
            $table->string('squadAbbreviation')->nullable();
            $table->string('squadName')->nullable();
            $table->string('inGameRole')->nullable();
            $table->string('mainHero')->nullable();
            $table->string('rank')->nullable();
            
            // User type
            $table->string('user_type')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                // ML related fields
                'ml_id',
                'username',
                'ml_server',
                'ml_ign',
                'status',
                
                // Personal details
                'surname',
                'lastName',
                'suffix',
                'birthday',
                'age',
                'gender',
                'contact_number',
                'facebook_link',
                
                // Academic details
                'course',
                'university',
                'year_level',
                'studentId',
                'proofOfEnrollment',
                
                // Location details
                'region',
                'island',
                
                // Squad details
                'squadAbbreviation',
                'squadName',
                'inGameRole',
                'mainHero',
                'rank',
                
                // User type
                'user_type'
            ]);
        });
    }
};