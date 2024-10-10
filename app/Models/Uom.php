<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\IsIdSearchable;

class Uom extends Model
{
    use HasFactory, IsIdSearchable;
}
