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
            $table->string('content_type')->nullable()->after('tone_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('content_histories', function (Blueprint $table) {
            $table->dropColumn('content_type');
        });
    }
};
