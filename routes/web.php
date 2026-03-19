<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Content Generation Routes
    Route::get('/content/create', [ContentController::class, 'create'])->name('content.create');
    Route::post('/content/generate', [ContentController::class, 'store'])->name('content.store');
    Route::get('/content/history', [ContentController::class, 'index'])->name('content.history.index');
    
    // We'll create the history show method later
    Route::get('/content/history/{history}', function(\App\Models\ContentHistory $history) {
        return inertia('Content/Show', ['history' => $history]);
    })->name('content.history.show');

    Route::get('/content/history/{history}/stream', [ContentController::class, 'stream'])->name('content.history.stream');
    Route::post('/content/history/{history}/regenerate', [ContentController::class, 'regenerate'])->name('content.history.regenerate');

    // Billing / Credits Route
    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing/checkout', [\App\Http\Controllers\BillingController::class, 'checkout'])->name('billing.checkout');
    Route::get('/billing/success', [\App\Http\Controllers\BillingController::class, 'success'])->name('billing.success');

    // Custom Tone Routes
    Route::resource('custom-tones', \App\Http\Controllers\CustomToneController::class)->except(['create', 'show', 'edit']);
    Route::post('/custom-tones/{customTone}/default', [\App\Http\Controllers\CustomToneController::class, 'setDefault'])->name('custom-tones.default');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::post('/users/{user}/credits', [\App\Http\Controllers\Admin\UserController::class, 'updateCredits'])->name('users.credits.update');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    
    Route::get('/transactions', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('transactions.index');
});

require __DIR__.'/auth.php';
