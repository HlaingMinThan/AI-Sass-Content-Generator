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
        Schema::table('content_histories', function (Blueprint $table) {
            $table->text('topic')->nullable()->after('prompt');
            $table->string('tone_name')->nullable()->after('topic');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('content_histories', function (Blueprint $table) {
            $table->dropColumn(['topic', 'tone_name']);
        });
    }
};
