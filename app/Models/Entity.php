<?php

namespace App\Models;

use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entity extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function model(): BelongsTo
    {
        return $this->belongsTo(EntityModel::class, 'entity_model_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Entity::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Entity::class, 'parent_id');
    }
}
