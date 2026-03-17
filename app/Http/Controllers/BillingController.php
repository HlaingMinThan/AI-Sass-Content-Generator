<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Cashier\Checkout;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $transactions = \App\Models\Transaction::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return inertia('Billing/Index', [
            'transactions' => $transactions
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:starter,pro,agency'
        ]);

        $plans = [
            'starter' => [
                'price_id' => config('services.stripe.starter_price_id'),
                'credits'  => 10
            ],
            'pro' => [
                'price_id' => config('services.stripe.pro_price_id'),
                'credits'  => 50
            ],
            'agency' => [
                'price_id' => config('services.stripe.agency_price_id'),
                'credits'  => 200
            ]
        ];

        $plan = $plans[$request->plan];

        if (!$plan['price_id']) {
            return back()->withErrors(['message' => 'Stripe prices are not configured yet.']);
        }

        $checkout = $request->user()
            ->checkout([$plan['price_id'] => 1], [
                'success_url' => route('billing.success') . '?session_id={CHECKOUT_SESSION_ID}&plan=' . $request->plan,
                'cancel_url' => route('billing.index'),
            ]);

        return \Inertia\Inertia::location($checkout->url);
    }

    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');
        $planId = $request->get('plan');

        if (!$sessionId || !$planId) {
            return redirect()->route('billing.index');
        }

        $user = $request->user();

        // Ensure we don't process the same session twice
        $exists = \App\Models\Transaction::where('stripe_id', $sessionId)->exists();
        
        if (!$exists) {
            try {
                // Verify the session actually exists and is paid in Stripe
                $stripe = new \Stripe\StripeClient(config('cashier.secret'));
                $session = $stripe->checkout->sessions->retrieve($sessionId);

                if ($session->payment_status !== 'paid') {
                    return redirect()->route('billing.index')->withErrors(['message' => 'Payment was not successful.']);
                }

            } catch (\Exception $e) {
                return redirect()->route('billing.index')->withErrors(['message' => 'Invalid Stripe session.']);
            }

            $plans = [
                'starter' => ['credits' => 10, 'amount' => 5.00],
                'pro'     => ['credits' => 50, 'amount' => 20.00],
                'agency'  => ['credits' => 200, 'amount' => 75.00],
            ];

            $plan = $plans[$planId] ?? null;

            if ($plan) {
                // Add credits
                $user->increment('available_credits', $plan['credits']);

                // Record transaction
                \App\Models\Transaction::create([
                    'user_id' => $user->id,
                    'stripe_id' => $sessionId,
                    'credits_purchased' => $plan['credits'],
                    'amount' => $plan['amount'],
                    'status' => 'completed'
                ]);
            }
        }

        return redirect()->route('billing.index')->with('success', 'Purchase successful! Credits have been added to your account.');
    }
}
