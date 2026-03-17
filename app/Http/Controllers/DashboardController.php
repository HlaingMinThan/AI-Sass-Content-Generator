<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\ContentHistory;
use App\Models\CustomTone;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $stats = [
            'total_generations' => ContentHistory::where('user_id', $user->id)->count(),
            'total_tones' => CustomTone::where('user_id', $user->id)->count(),
            'available_credits' => $user->available_credits,
        ];

        $recentHistory = ContentHistory::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentHistory' => $recentHistory,
        ]);
    }
}
