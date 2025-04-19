<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Core\OrganizationManager;

class OrganizationController extends Controller
{
    public function store(Request $request) 
	{
		$name = $request->input('name');

		$request->validate([
			'name' => 'required|string|max:255',
		]);

		$manager = new OrganizationManager;

		$organization = $manager->create($request->user(), $name);

		return $organization
			? redirect()->route('dashboard', ['organization_id' => $organization->id])
			: redirect()->back()->withErrors(['error' => 'Failed to create organization.']);
	}
}
