<?php

namespace App\Models;

use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UomType extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;
}
