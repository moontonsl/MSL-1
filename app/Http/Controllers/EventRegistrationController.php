<?php

namespace App\Http\Controllers;

use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\Log;

class EventRegistrationController extends Controller
{
    /**
     * Store a new event registration and sync with Google Sheets.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'event_name' => 'required|string',
            'fullName' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'venue' => 'required|string|max:255',
            'eventDate' => 'required|date',
            'email' => 'required|email|max:255',
            'mlbbId' => 'required|string|max:255',
            'mlbbServer' => 'required|string|max:255',
        ]);

        // Map frontend keys to database columns
        $dbData = [
            'event_name' => $data['event_name'],
            'full_name' => $data['fullName'],
            'region' => $data['region'],
            'venue' => $data['venue'],
            'event_date' => $data['eventDate'],
            'email' => $data['email'],
            'mlbb_id' => $data['mlbbId'],
            'mlbb_server' => $data['mlbbServer'],
        ];

        // Check if user exists in ml_users table (required by foreign key)
        $userExists = \DB::table('ml_users')
            ->where('ml_id', $dbData['mlbb_id'])
            ->where('server_id', $dbData['mlbb_server'])
            ->exists();

        if (!$userExists) {
            return response()->json([
                'message' => 'The provided MLBB ID and Server were not found in our records. Please ensure you are registered and verified.'
            ], 422);
        }

        // Check for duplicate registration for the same day
        $existing = EventRegistration::where('mlbb_id', $dbData['mlbb_id'])
            ->where('mlbb_server', $dbData['mlbb_server'])
            ->where('event_date', $dbData['event_date'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already registered for this event on this date.'
            ], 422);
        }

        try {
            // 1. Save to Database
            $registration = EventRegistration::create($dbData);

            // 2. Sync with Google Sheets
            $this->syncToGoogleSheet($registration);

            return response()->json([
                'success' => true,
                'message' => 'Registration submitted successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Event registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed. ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Append registration data to Google Sheets.
     */
    private function syncToGoogleSheet(EventRegistration $registration)
    {
        try {
            $spreadsheetId = '1vyfPrcm3hBa1B7vjIv8jmLBp5aDqYJ9pycAs-alQdU0';
            $range = 'Sheet1!A1'; // Adjust sheet name if necessary

            $client = new Google_Client();
            $client->setApplicationName('MSL Event Registration');
            $client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/google/credentials.json'));
            $client->setAccessType('offline');

            $service = new Google_Service_Sheets($client);

            $values = [
                [
                    $registration->event_name,
                    $registration->full_name,
                    $registration->region,
                    $registration->venue,
                    $registration->event_date,
                    $registration->email,
                    $registration->mlbb_id,
                    $registration->mlbb_server,
                    $registration->created_at->toDateTimeString(),
                ]
            ];

            $body = new \Google_Service_Sheets_ValueRange([
                'values' => $values
            ]);

            $params = ['valueInputOption' => 'RAW'];

            $service->spreadsheets_values->append(
                $spreadsheetId,
                $range,
                $body,
                $params
            );

        } catch (\Exception $e) {
            Log::error('Google Sheets sync error: ' . $e->getMessage());
            // We don't fail the whole request if sheet sync fails, but we log it.
        }
    }
}
