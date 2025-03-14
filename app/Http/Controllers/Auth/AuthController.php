<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // For now, exclusively use the Cognito login.
        return redirect('/auth/cognito/redirect');
    }
}
