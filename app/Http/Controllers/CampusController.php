<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    public function index()
    {
        return Inertia::render('campus/Campus');
    }
}
