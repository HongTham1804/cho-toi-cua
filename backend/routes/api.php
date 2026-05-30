<?php

use App\Http\Controllers\ShipperSimulationController;
use Illuminate\Support\Facades\Route;

Route::get('/shippers', [ShipperSimulationController::class, 'index']);
Route::patch('/orders/{id}/assign-shipper', [ShipperSimulationController::class, 'assignShipper']);