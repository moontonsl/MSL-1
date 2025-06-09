<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Inertia\Inertia;


class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getArticles()
    {
        $articles = News::orderByDesc('news_published')
        ->select(
            'news_state as category',
            'news_title as title',
            'news_writer as author',
            'news_published as date',
            'news_img1 as image',
            'news_content as content'
        )
        ->take(4)
        ->get();

        return response()->json($articles);
    }
    public function index()
    {
        $news = News::all();
        return Inertia::render('News/Index', ['news' => $news]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
