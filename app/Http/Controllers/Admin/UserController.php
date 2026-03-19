<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->latest()->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'is_admin' => 'required|boolean',
        ]);

        $user->update($request->only(['name', 'email', 'is_admin']));

        return back()->with('success', 'User updated successfully!');
    }

    public function updateCredits(Request $request, User $user)
    {
        $request->validate([
            'amount' => 'required|integer',
            'type' => 'required|in:add,subtract',
        ]);

        if ($request->type === 'add') {
            $user->increment('available_credits', $request->amount);
        } else {
            $user->decrement('available_credits', max(0, min($user->available_credits, $request->amount)));
        }

        return back()->with('success', 'Credits updated successfully!');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete yourself!']);
        }

        $user->delete();
        return back()->with('success', 'User deleted successfully!');
    }
}
