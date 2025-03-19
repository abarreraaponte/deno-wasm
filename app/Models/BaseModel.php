<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BaseModel extends Model
{
    use HasUuids;

	/**
     * Get a new unique identifier.
     *
     * @throws UnsupportedOperationException
     */
    public function newUniqueId(): string
    {
        return Uuid::uuid7()->toString();
    }
}
