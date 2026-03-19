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
            if (!Schema::hasColumn('content_histories', 'language')) {
                $table->string('language')->nullable()->after('content_type');
            }
            if (!Schema::hasColumn('content_histories', 'keywords')) {
                $table->string('keywords')->nullable()->after('language');
            }
            if (Schema::hasColumn('content_histories', 'tone_name') && !Schema::hasColumn('content_histories', 'tone')) {
                $table->renameColumn('tone_name', 'tone');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('content_histories', function (Blueprint $table) {
            //
        });
    }
};
