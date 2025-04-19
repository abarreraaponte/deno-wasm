<?php

namespace App\Models\Abstract;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Ramsey\Uuid\Uuid;

class BasePivot extends Pivot
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
