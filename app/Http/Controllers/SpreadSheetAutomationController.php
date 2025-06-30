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
           
            $spreadsheetId = "1Cg5qtopDU6GbSAmkgwdWIIomDa9LuyTxEkh3ZBqFnbU";
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
                'Last Name',
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
                'Updated At'
            ];
            
            // Add user data rows
            foreach ($users as $user) {
                $data[] = [
                    $user->id,
                    $user->name,
                    $user->surname,
                    $user->lastName,
                    $user->suffix,
                    $user->email,
                    $user->username,
                    $user->ml_id,
                    $user->ml_server,
                    $user->ml_ign,
                    $user->status,
                    $user->user_type,
                    $user->facebook_link,
                    $user->birthday,
                    $user->age,
                    $user->gender,
                    $user->contact_number,
                    $user->course,
                    $user->university,
                    $user->year_level,
                    $user->region,
                    $user->island,
                    $user->squadAbbreviation,
                    $user->squadName,
                    $user->inGameRole,
                    $user->mainHero,
                    $user->rank,
                    $user->studentId,
                    $user->proofOfEnrollment,
                    $user->email_verified_at,
                    $user->created_at,
                    $user->updated_at
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
