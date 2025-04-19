<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Abstract\BaseModel;

class Organization extends BaseModel
{
    use HasFactory;

	public function users(): BelongsToMany
	{
		return $this->belongsToMany(User::class, 'organization_users')
			->using(OrganizationUser::class)
			->withTimestamps();
	}
}
