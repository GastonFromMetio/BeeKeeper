<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('ruches', 'nom') && ! Schema::hasColumn('ruches', 'name')) {
            DB::statement('ALTER TABLE ruches CHANGE nom name VARCHAR(255) NOT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('ruches', 'name') && ! Schema::hasColumn('ruches', 'nom')) {
            DB::statement('ALTER TABLE ruches CHANGE name nom VARCHAR(255) NOT NULL');
        }
    }
};
