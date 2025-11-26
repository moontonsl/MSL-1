<?php

namespace App\Http\Controllers;

use App\Models\FF25Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FF25AttendanceController extends Controller
{
    /**
     * Store a new FF25 attendance record and forward it to Google Forms.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'has_msl_account' => ['required', 'in:yes,no'],
            'region' => ['required', 'string', 'max:255'],
            'school' => ['required', 'string', 'max:255'],
            'msl_username' => ['nullable', 'string', 'max:255', 'required_if:has_msl_account,yes'],
            'full_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mlbb_id' => ['nullable', 'string', 'max:255'],
            'mlbb_server' => ['nullable', 'string', 'max:255'],
            'event_date' => ['required', 'string', 'max:255'],
        ]);

        if ($data['has_msl_account'] === 'no') {
            $request->validate([
                'full_name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'mlbb_id' => ['required', 'string', 'max:255'],
                'mlbb_server' => ['required', 'string', 'max:255'],
            ]);
        }

        // Check for duplicate entries
        if ($data['has_msl_account'] === 'yes') {
            // Check if username already exists
            $existingAttendance = FF25Attendance::where('msl_username', $data['msl_username'])
                ->first();
            
            if ($existingAttendance) {
                return back()->withErrors([
                    'username' => 'This username has already registered for attendance.'
                ])->withInput();
            }
        } else {
            // Check if full name already exists
            $existingAttendance = FF25Attendance::where('full_name', $data['full_name'])
                ->first();
            
            if ($existingAttendance) {
                return back()->withErrors([
                    'fullname' => 'This name has already registered for attendance.'
                ])->withInput();
            }
        }

        $attendance = FF25Attendance::create($data);

        // Use the formResponse endpoint - use /d/ format (matches user's provided URL)
        $formId = '1ypUnSkxeB1b_Krxp2d_3H1R6IQ9guliP16Yj--pv3tk';
        $googleFormUrl = "https://docs.google.com/forms/d/{$formId}/formResponse";

        $payload = [
            'entry.1763855285' => $data['has_msl_account'] === 'yes' ? 'Yes' : 'No',
            'entry.1771720280' => $data['region'],
            'entry.1292845292' => $data['school'],
            'entry.585684091' => $data['msl_username'] ?? '',
            'entry.1651511427' => $data['full_name'] ?? '',
            'entry.985879935' => $data['email'] ?? '',
            'entry.1669502927' => $data['mlbb_id'] ?? '',
            'entry.1384804081' => $data['event_date'],
        ];

        try {
            // Google Forms accepts POST with form data
            // Use followRedirects to handle any redirects Google might send
            $response = Http::asForm()
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer' => "https://docs.google.com/forms/d/{$formId}/viewform",
                    'Origin' => 'https://docs.google.com',
                ])
                ->timeout(15)
                ->post($googleFormUrl, $payload);

            $responseBody = $response->body();
            $statusCode = $response->status();
            
            // Google Forms typically returns:
            // - 200 with success message in body
            // - 302 redirect on success
            // - 401/403 if authentication required
            // - 404 if form not found
            $isSuccess = ($statusCode === 200 || $statusCode === 302)
                && (str_contains($responseBody, 'Your response has been recorded') 
                    || str_contains($responseBody, 'response has been recorded')
                    || str_contains($responseBody, 'Form submitted')
                    || str_contains($responseBody, 'formResponse')
                    || str_contains($responseBody, 'Thank you'));

            if ($isSuccess) {
                Log::info('FF25 Google Form submission successful.', [
                    'attendance_id' => $attendance->id,
                    'status' => $statusCode,
                ]);
            } else {
                // If 401/403, the form might require authentication or need to be set to public
                if ($statusCode === 401 || $statusCode === 403) {
                    Log::warning('FF25 Google Form requires authentication. Form may need to be set to "Anyone with the link can respond".', [
                        'attendance_id' => $attendance->id,
                        'status' => $statusCode,
                        'payload' => $payload,
                    ]);
                } else {
                    Log::warning('FF25 Google Form submission may have failed.', [
                        'attendance_id' => $attendance->id,
                        'status' => $statusCode,
                        'response_preview' => substr($responseBody, 0, 300),
                        'payload' => $payload,
                    ]);
                }
            }
        } catch (\Throwable $exception) {
            Log::error('FF25 Google Form submission error.', [
                'attendance_id' => $attendance->id,
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);
        }

        return back()->with('success', 'Attendance submitted successfully!');
    }
}

