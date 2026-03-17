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
        'tone_name',
        'content_type',
        'generated_content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
