<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomTone;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CustomToneController extends Controller
{
    public function index()
    {
        return Inertia::render('CustomTones/Index', [
            'customTones' => Auth::user()->customTones()->latest()->get(),
            'preferredTone' => Auth::user()->preference?->preferred_tone
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sample_content' => 'nullable|string',
        ]);

        Auth::user()->customTones()->create($validated);

        return back()->with('success', 'Custom tone created successfully!');
    }

    public function update(Request $request, CustomTone $customTone)
    {
        if ($customTone->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sample_content' => 'nullable|string',
        ]);

        $customTone->update($validated);

        return back()->with('success', 'Custom tone updated successfully!');
    }

    public function destroy(CustomTone $customTone)
    {
        if ($customTone->user_id !== Auth::id()) {
            abort(403);
        }

        $customTone->delete();

        return back()->with('success', 'Custom tone deleted successfully!');
    }

    public function setDefault(Request $request, CustomTone $customTone)
    {
        if ($customTone->user_id !== Auth::id()) {
            abort(403);
        }

        Auth::user()->preference()->updateOrCreate(
            ['user_id' => Auth::id()],
            ['preferred_tone' => "custom-{$customTone->id}"]
        );

        return back()->with('success', "{$customTone->name} set as default tone!");
    }
}
