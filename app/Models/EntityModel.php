<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\IsIdSearchable;

class EntityModel extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function entities()
    {
        return $this->hasMany(Entity::class);
    }
}
