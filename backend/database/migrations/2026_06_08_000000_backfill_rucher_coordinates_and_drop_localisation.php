<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const CALAIS_LATITUDE = 50.9513;
    private const CALAIS_LONGITUDE = 1.8587;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('ruchers')
            ->whereNull('latitude')
            ->orWhereNull('longitude')
            ->update([
                'latitude' => self::CALAIS_LATITUDE,
                'longitude' => self::CALAIS_LONGITUDE,
            ]);

        Schema::table('ruchers', function (Blueprint $table) {
            $table->dropColumn('localisation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruchers', function (Blueprint $table) {
            $table->string('localisation')->after('name');
        });
    }
};
