<?php

namespace App\Models;

use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntityModel extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function entities()
    {
        return $this->hasMany(Entity::class);
    }
}
