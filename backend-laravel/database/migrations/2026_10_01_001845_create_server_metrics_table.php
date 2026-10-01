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
        Schema::create('server_metrics', function (Blueprint $table) {
            $table->id();
            $table->timestamp('timestamp'); 
            $table->float('cpu_usage_pct');
            

            $table->unsignedBigInteger('ram_total_mb');
            $table->unsignedBigInteger('ram_used_mb');
            $table->float('ram_usage_pct');
            
            $table->unsignedBigInteger('disk_total_gb');
            $table->unsignedBigInteger('disk_used_gb');
            $table->float('disk_usage_pct');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server_metrics');
    }
};
