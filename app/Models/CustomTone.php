<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomTone extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'sample_content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
