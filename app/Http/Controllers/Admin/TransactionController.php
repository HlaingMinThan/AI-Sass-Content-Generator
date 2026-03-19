<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('user')
            ->latest()
            ->paginate(20);
            
        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions
        ]);
    }
}
