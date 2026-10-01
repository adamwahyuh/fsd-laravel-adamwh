<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServerMetricController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/ping", function(){
    return response()->json([
        "success" => true,
        "message" => "Hitted at ". now()
    ], 200);
});

Route::post("/metrics", [ServerMetricController::class, 'store']);

Route::post("/login", [AuthController::class, 'login']);

Route::middleware("auth:sanctum")->group(function(){
    Route::get("/me", [AuthController::class, 'me']);
    Route::post("logout", [AuthController::class, 'logout']);
    Route::get("/metrics", [ServerMetricController::class, 'index']);
});
