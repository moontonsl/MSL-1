<?php

namespace App\Http\Controllers;

use App\Models\MslEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventsController extends Controller
{
    public function index()
    {
        $events = MslEvent::activeAndFeatured()->get();
        return Inertia::render('Events/Events', [
            'events' => $events
        ]);
    }

    public function show($event)
    {
        // If $event is a string (canonical URL), find the event by canonical
        if (is_string($event)) {
            $mslEvent = MslEvent::where('event_canonical', $event)
                ->orWhere('event_canonical', '/' . $event)
                ->first();
            
            if (!$mslEvent) {
                abort(404, 'Event not found');
            }
            
            $event = $mslEvent;
        }
        
        // Check if this is a specific event type and redirect accordingly
        if ($event->event_canonical === 'BattleTrips' || $event->event_name === 'MPL S16 Battletrips') {
            return redirect('/MPLS16Battletrips');
        }
        
        // Redirect Campus Tournament S1 to the Campus Tournament page
        if ($event->event_canonical === 'CampusTournament' || $event->event_name === 'Campus Tournament S1') {
            return redirect('/Tournament/CampusTournament');
        }
        
        // For all other events, redirect to the custom canonical URL
        // This allows the programmer to create the actual event page later
        $canonicalUrl = $event->event_canonical;
        if (!$canonicalUrl) {
            abort(404, 'Event link not configured');
        }
        
        // Ensure the URL starts with /
        if (!str_starts_with($canonicalUrl, '/')) {
            $canonicalUrl = '/' . $canonicalUrl;
        }
        
        return redirect($canonicalUrl);
    }
}
