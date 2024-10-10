<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait IsIdSearchable {
	public static function IdExists(string $id): bool
	{
		$record = self::where(function (Builder $query) use ($id) {

			$isUuid = Str::isUuid($id);

			if ($isUuid) {
				$query->where('id', $id)
					->orWhere('ref_id', $id)
					->orWhere('alt_id', $id);
			} else {
				$query->where('ref_id', $id)->orWhere('alt_id', $id);
			}

		})
			->where('active', true)
			->first();

		return $record ? true : false;
	}

	public static function findById(string $id): Model|null
	{
		$record = self::where(function (Builder $query) use ($id) {

			$isUuid = Str::isUuid($id);

			if ($isUuid) {
				$query->where('id', $id)
					->orWhere('ref_id', $id)
					->orWhere('alt_id', $id);
			} else {
				$query->where('ref_id', $id)->orWhere('alt_id', $id);
			}

		})
			->where('active', true)
			->first();

		return $record;
	}
}