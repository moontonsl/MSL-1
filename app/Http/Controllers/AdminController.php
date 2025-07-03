<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\News;
use App\Models\Event;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function dashboard()
    {
        // Get real analytics data
        $analytics = $this->analyticsService->getKeyMetrics();
        $pageViewsData = $this->analyticsService->getPageViewsLast7Days();
        $topPages = $this->analyticsService->getTopPages();
        $realTimeData = $this->analyticsService->getRealTimeData();

        return Inertia::render('Admin/Dashboard', [
            'pendingUsers' => User::where('email_verified_at', null)->count(),
            'totalNews' => News::count(),
            'upcomingEvents' => Event::where('start_date', '>=', now())->count(),
            'analytics' => [
                'pageViews' => $pageViewsData,
                'metrics' => $analytics,
                'topPages' => $topPages,
                'realTime' => $realTimeData
            ],
            'tournaments' => "1"
        ]);
    }

    public function pendingUsers()
    {
        return Inertia::render('Admin/PendingUsers', [
            'users' => User::where('email_verified_at', null)
                ->select('id', 'name', 'email', 'ml_id', 'created_at')
                ->paginate(10)
        ]);
    }

    public function verifyUser(User $user)
    {
        $user->email_verified_at = now();
        $user->save();

        return back()->with('success', 'User verified successfully');
    }

    public function manageNews()
    {
        return Inertia::render('Admin/News/Index', [
            'news' => News::orderBy('news_published', 'desc')->paginate(10)
        ]);
    }

    public function createNews()
    {
        return Inertia::render('Admin/News/Create');
    }

    public function storeNews(Request $request)
    {
        $validated = $request->validate([
            'news_title' => 'required|string|max:255',
            'news_subtitle' => 'required|string',
            'news_canonical' => 'required|string',
            'news_state' => 'required|string',
            'news_img1' => 'nullable|string',
        ]);

        $validated['news_writer'] = Auth::user()->name;
        $validated['news_published'] = now();

        News::create($validated);

        return redirect()->route('admin.news')->with('success', 'News created successfully');
    }

    public function editNews(News $news)
    {
        return Inertia::render('Admin/News/Edit', [
            'news' => $news
        ]);
    }

    public function updateNews(Request $request, News $news)
    {
        $validated = $request->validate([
            'news_title' => 'required|string|max:255',
            'news_subtitle' => 'required|string',
            'news_canonical' => 'required|string',
            'news_state' => 'required|string',
            'news_img1' => 'nullable|string',
        ]);

        $news->update($validated);

        return redirect()->route('admin.news')->with('success', 'News updated successfully');
    }

    public function deleteNews(News $news)
    {
        $news->delete();
        return back()->with('success', 'News deleted successfully');
    }

    public function manageEvents()
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => Event::with('creator')->latest()->paginate(10)
        ]);
    }

    public function createEvent()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'nullable|string',
        ]);

        $validated['created_by'] = Auth::id();

        Event::create($validated);

        return redirect()->route('admin.events')->with('success', 'Event created successfully');
    }

    public function editEvent(Event $event)
    {
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event
        ]);
    }

    public function updateEvent(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'nullable|string',
        ]);

        $event->update($validated);

        return redirect()->route('admin.events')->with('success', 'Event updated successfully');
    }

    public function deleteEvent(Event $event)
    {
        $event->delete();
        return back()->with('success', 'Event deleted successfully');
    }
}