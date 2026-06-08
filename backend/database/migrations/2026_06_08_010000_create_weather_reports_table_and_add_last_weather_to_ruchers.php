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
        Schema::create('weather_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rucher_id')->constrained()->cascadeOnDelete();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->decimal('temperature', 6, 2)->nullable();
            $table->decimal('apparent_temperature', 6, 2)->nullable();
            $table->decimal('wind_speed', 6, 2)->nullable();
            $table->decimal('humidity', 6, 2)->nullable();
            $table->string('temperature_unit', 20)->default('°C');
            $table->string('apparent_temperature_unit', 20)->default('°C');
            $table->string('wind_speed_unit', 20)->default('km/h');
            $table->string('humidity_unit', 20)->default('%');
            $table->string('source')->default('Open-Meteo');
            $table->timestamp('fetched_at');
            $table->json('raw_response')->nullable();
            $table->timestamps();
        });

        Schema::table('ruchers', function (Blueprint $table) {
            $table->timestamp('last_weather_checked_at')->nullable();
            $table->decimal('last_weather_temperature', 6, 2)->nullable();
            $table->string('last_weather_temperature_unit', 20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruchers', function (Blueprint $table) {
            $table->dropColumn([
                'last_weather_checked_at',
                'last_weather_temperature',
                'last_weather_temperature_unit',
            ]);
        });

        Schema::dropIfExists('weather_reports');
    }
};
