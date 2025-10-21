<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\News;
use App\Models\Event;
use App\Services\AnalyticsService;
use App\Services\GoogleAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Generate a URL-friendly slug from a title
     */
    private function generateSlug($title)
    {
        // Convert to lowercase and replace spaces with hyphens
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug); // Remove special characters
        $slug = preg_replace('/[\s-]+/', '-', $slug); // Replace spaces and multiple hyphens with single hyphen
        $slug = trim($slug, '-'); // Remove leading/trailing hyphens
        
        // Limit length to 100 characters
        $slug = substr($slug, 0, 100);
        
        return $slug;
    }
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function dashboard()
    {
        // Get real analytics data (with Google Analytics if available)
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
            'news_author' => 'required|string|max:255',
            'news_state' => 'required|string',
            'news_img1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['news_writer'] = $validated['news_author'];
        $validated['news_published'] = now();

        // Set default values for image fields
        $validated['news_img2'] = '';
        $validated['news_img3'] = '';
        $validated['news_content'] = $validated['news_canonical']; // Map content to canonical field
        
        // Generate proper canonical URL slug from title
        $validated['news_canonical'] = $this->generateSlug($validated['news_title']);

        // Handle image upload
        if ($request->hasFile('news_img1')) {
            $image = $request->file('news_img1');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/MCC/IndivNews'), $imageName);
            $validated['news_img1'] = $imageName;
        } else {
            $validated['news_img1'] = '';
        }

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
            'news_author' => 'required|string|max:255',
            'news_state' => 'required|string',
            'news_img1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['news_writer'] = $validated['news_author'];

        // Set default values for image fields if not provided
        if (!isset($validated['news_img2'])) {
            $validated['news_img2'] = $news->news_img2 ?: '';
        }
        if (!isset($validated['news_img3'])) {
            $validated['news_img3'] = $news->news_img3 ?: '';
        }
        if (!isset($validated['news_content'])) {
            $validated['news_content'] = $validated['news_canonical'];
        }
        
        // Generate proper canonical URL slug from title if it's being updated
        if (isset($validated['news_title'])) {
            $validated['news_canonical'] = $this->generateSlug($validated['news_title']);
        }

        // Handle image upload
        if ($request->hasFile('news_img1')) {
            // Delete old image if it exists
            if ($news->news_img1 && file_exists(public_path('images/MCC/IndivNews/' . $news->news_img1))) {
                unlink(public_path('images/MCC/IndivNews/' . $news->news_img1));
            }
            
            $image = $request->file('news_img1');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/MCC/IndivNews'), $imageName);
            $validated['news_img1'] = $imageName;
        } else {
            $validated['news_img1'] = $news->news_img1 ?: '';
        }

        $news->update($validated);

        return redirect()->route('admin.news')->with('success', 'News updated successfully');
    }

    public function deleteNews(News $news)
    {
        $news->delete();
        return back()->with('success', 'News deleted successfully');
    }

    public function manageCarousel()
    {
        return Inertia::render('Admin/Carousel/Index', [
            'carousels' => \App\Models\Carousel::ordered()->get()
        ]);
    }

    public function storeCarousel(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB max
            'order' => 'integer|min:0'
        ]);

        // Get image dimensions for validation
        $image = $request->file('image');
        $imageInfo = getimagesize($image->getPathname());
        $width = $imageInfo[0];
        $height = $imageInfo[1];

        // Validate dimensions (you can adjust these values)
        $requiredWidth = 1920;
        $requiredHeight = 1080;
        
        if ($width !== $requiredWidth || $height !== $requiredHeight) {
            return back()->withErrors([
                'image' => "Image must be exactly {$requiredWidth}x{$requiredHeight} pixels. Your image is {$width}x{$height} pixels."
            ]);
        }

        // Store image
        $imageName = time() . '_' . $image->getClientOriginalName();
        $image->move(public_path('images/Carousel'), $imageName);

        // Get next order number
        $order = $validated['order'] ?? (\App\Models\Carousel::max('order') + 1);

        \App\Models\Carousel::create([
            'title' => $validated['title'],
            'image_path' => $imageName,
            'order' => $order,
            'is_active' => true
        ]);

        return back()->with('success', 'Carousel image added successfully');
    }

    public function updateCarousel(Request $request, \App\Models\Carousel $carousel)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'order' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        // Handle image update if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageInfo = getimagesize($image->getPathname());
            $width = $imageInfo[0];
            $height = $imageInfo[1];

            // Validate dimensions
            $requiredWidth = 1920;
            $requiredHeight = 1080;
            
            if ($width !== $requiredWidth || $height !== $requiredHeight) {
                return back()->withErrors([
                    'image' => "Image must be exactly {$requiredWidth}x{$requiredHeight} pixels. Your image is {$width}x{$height} pixels."
                ]);
            }

            // Delete old image
            if ($carousel->image_path && file_exists(public_path('images/Carousel/' . $carousel->image_path))) {
                unlink(public_path('images/Carousel/' . $carousel->image_path));
            }

            // Store new image
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/Carousel'), $imageName);
            $validated['image_path'] = $imageName;
        }

        $carousel->update($validated);
        return back()->with('success', 'Carousel updated successfully');
    }

    public function deleteCarousel(\App\Models\Carousel $carousel)
    {
        // Delete image file
        if ($carousel->image_path && file_exists(public_path('images/Carousel/' . $carousel->image_path))) {
            unlink(public_path('images/Carousel/' . $carousel->image_path));
        }

        $carousel->delete();
        return back()->with('success', 'Carousel image deleted successfully');
    }

    public function reorderCarousel(Request $request)
    {
        $validated = $request->validate([
            'carousels' => 'required|array',
            'carousels.*.id' => 'required|integer|exists:carousels,id',
            'carousels.*.order' => 'required|integer|min:0'
        ]);

        foreach ($validated['carousels'] as $carouselData) {
            \App\Models\Carousel::where('id', $carouselData['id'])
                ->update(['order' => $carouselData['order']]);
        }

        return back()->with('success', 'Carousel order updated successfully');
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