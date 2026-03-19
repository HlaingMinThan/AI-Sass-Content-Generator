<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentHistory extends Model
{
    protected $fillable = [
        'user_id',
        'model_used',
        'prompt',
        'topic',
        'tone',
        'content_type',
        'language',
        'keywords',
        'last_refinement',
        'generated_content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
