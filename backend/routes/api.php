<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RucherController;
// use App\Http\Controllers\Api\RucheController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        // Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::delete('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ruchers', [RucherController::class, 'index']);
    Route::get('/ruchers/{rucher}', [RucherController::class, 'show']);
    Route::post('/ruchers', [RucherController::class, 'store']);
    Route::put('/ruchers/{rucher}', [RucherController::class, 'update']);
    Route::delete('/ruchers/{rucher}', [RucherController::class, 'destroy']);

    // Route::get('/ruches', [RucheController::class, 'index']);
    // Route::get('/ruches/{ruche}', [RucheController::class, 'show']);
    // Route::post('/ruches', [RucheController::class, 'store']);
    // Route::put('/ruches/{ruche}', [RucheController::class, 'update']);
    // Route::delete('/ruches/{ruche}', [RucheController::class, 'destroy']);
});