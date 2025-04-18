<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // For now, exclusively use the Auth0 login.
        return redirect('/auth/auth0/redirect');
    }
}
