<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Http\JsonResponse;

class SpreadSheetAutomationController extends Controller
{
    /**
     * Export users data to Google Spreadsheet
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function exportUsersToSpreadsheet(Request $request)
    {
        set_time_limit(0);
        try {
           
            $spreadsheetId = "1TaVpFzFjGWKidQ1sjfJzYOlo2OQ4UpkOqC459Ca-FXY";
            $range = "Sheet1!A1";

            // 1. Get users data
            $users = User::all();
            
            // 2. Prepare data for spreadsheet
            $data = [];
            
            // Add header row with all user fields
            $data[] = [
                'ID',
                'Name',
                'Surname',
                'Suffix',
                'Email',
                'Username',
                'ML ID',
                'ML Server',
                'ML IGN',
                'Status',
                'User Type',
                'Facebook Link',
                'Birthday',
                'Age',
                'Gender',
                'Contact Number',
                'Course',
                'University',
                'Year Level',
                'Region',
                'Island',
                'Squad Abbreviation',
                'Squad Name',
                'In Game Role',
                'Main Hero',
                'Rank',
                'Student ID',
                'Proof of Enrollment',
                'Email Verified At',
                'Created At',
                'Updated At',
            ];
            
            // Add user data rows
            foreach ($users as $user) {
                $data[] = [
                    $user->id ?? 'N/A',
                    $user->name ?? 'N/A',
                    $user->surname ?? 'N/A',
                    $user->suffix ?? 'N/A',
                    $user->email ?? 'N/A',
                    $user->username ?? 'N/A',
                    $user->ml_id ?? 'N/A',
                    $user->ml_server ?? 'N/A',
                    $user->ml_ign ?? 'N/A',
                    $user->status ?? 'N/A',
                    $user->user_type ?? 'N/A',
                    $user->facebook_link ?? 'N/A',
                    $user->birthday ?? 'N/A',
                    $user->age ?? 'N/A',
                    $user->gender ?? 'N/A',
                    $user->contact_number ?? 'N/A',
                    $user->course ?? 'N/A',
                    $user->university ?? 'N/A',
                    $user->year_level ?? 'N/A',
                    $user->region ?? 'N/A',
                    $user->island ?? 'N/A',
                    $user->squadAbbreviation ?? 'N/A',
                    $user->squadName ?? 'N/A',
                    $user->inGameRole ?? 'N/A',
                    $user->mainHero ?? 'N/A',
                    $user->rank ?? 'N/A',
                    $user->studentId ?? 'N/A',
                    $user->proofOfEnrollment ?? 'N/A',
                    $user->email_verified_at ?? 'N/A',
                    $user->created_at ?? 'N/A',
                    $user->updated_at ?? 'N/A'
                ];
            }

            // 3. Load Google Client
            $client = new Google_Client();
            $client->setApplicationName('Laravel Google Sheets Export');
            $client->setScopes([
                Google_Service_Sheets::SPREADSHEETS,
                Google_Service_Sheets::DRIVE
            ]);
            $client->setAuthConfig(storage_path('app/googlecred/laravel-sheet-key.json'));
            $client->setAccessType('offline');

            $service = new Google_Service_Sheets($client);

            // 4. Clear existing data
            $service->spreadsheets_values->clear($spreadsheetId, $range, new \Google_Service_Sheets_ClearValuesRequest());

            // 5. Write data
            $body = new \Google_Service_Sheets_ValueRange([
                'values' => $data
            ]);

            $params = ['valueInputOption' => 'RAW'];

            $result = $service->spreadsheets_values->update(
                $spreadsheetId,
                $range,
                $body,
                $params
            );
                                                

            return response()->json([
                'success' => true,
                'message' => 'Users data exported successfully',
                'total_users' => count($users),
                'total_columns' => count($data[0]),
                'updated_cells' => $result->getUpdatedCells()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error exporting users data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
