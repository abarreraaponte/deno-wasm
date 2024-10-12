<?php

namespace App\Models\Contracts;

/**
 * Interface CanBeDeleted
 * Validates if a record can be deleted. The actual condition is defined in the implementing class.
 */
interface DeletionProtected
{
    public function canBeDeleted(): bool;
}
