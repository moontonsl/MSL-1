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

    public function show(MslEvent $event)
    {
        // Check if this is a specific event type and redirect accordingly
        if ($event->event_canonical === 'BattleTrips' || $event->event_name === 'MPL S16 Battletrips') {
            return redirect('/MPLS16Battletrips');
        }
        
        // Redirect Campus Tournament S1 to the Campus Tournament page
        if ($event->event_canonical === 'CampusTournament' || $event->event_name === 'Campus Tournament S1') {
            return redirect('/Tournament/CampusTournament');
        }
        
        // For other events, show the generic event page
        return Inertia::render('Events/EventShow', [
            'event' => $event
        ]);
    }
}
