<?php

namespace App\Models;

use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uom extends Model
{
    public function canBeDeleted(): bool
    {
        // For now allow deletion.
        return true;
    }

    use HasFactory, IsIdSearchable;
}
