<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Sheets;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class GoogleSheetMCCS2Controller extends Controller
{
    public function exportMCCS2PredictionsToGoogleSheet()
    {
        // 1. Load Google Client
        $client = new Google_Client();
        $client->setApplicationName('Laravel Google Sheets Export');
        $client->setScopes([
            Google_Service_Sheets::SPREADSHEETS,
            Google_Service_Sheets::DRIVE
        ]);
        $client->setAuthConfig(storage_path('app/google/credentials.json'));
        $client->setAccessType('offline');

        $service = new Google_Service_Sheets($client);

        // 2. Spreadsheet ID and Sheet Name
        $spreadsheetId = '1vbR9YcFm-wobfzsf8sgBbUnivHpb4SPMaYN-Bhr4MV0'; 
        $range = 'MCCS2Predictions'; 

        // 3. Run SQL Query
        $results = DB::table('mccs2_predictions')
            ->join('ml_users', 'mccs2_predictions.ml_id', '=', 'ml_users.ml_id')
            ->select(
                'mccs2_predictions.ml_id', 
                'ml_users.server_id', 
                'ml_users.ign',
                'mccs2_predictions.selected_teams',
                'mccs2_predictions.selected_players',
                'mccs2_predictions.created_at'
            )
            ->get();

        // 4. Prepare values for Google Sheets
        $values = [];

        // Add header row
        $values[] = [
            'ML ID', 
            'Server ID', 
            'IGN', 
            'Selected Teams', 
            'Selected Players (GOLD)', 
            'Selected Players (JUNGLER)', 
            'Selected Players (EXP)', 
            'Selected Players (MIDDLE)', 
            'Selected Players (ROAMER)', 
            'Vote Date'
        ];

        foreach ($results as $row) {
            // Decode JSON data
            $selectedTeams = json_decode($row->selected_teams, true);
            $selectedPlayers = json_decode($row->selected_players, true);

            // Format teams
            $teamsString = '';
            if ($selectedTeams) {
                $teamNames = array_map(function($team) {
                    return $team['name'] ?? 'Unknown';
                }, $selectedTeams);
                $teamsString = implode(', ', $teamNames);
            }

            // Format players by role
            $goldPlayers = '';
            $junglerPlayers = '';
            $expPlayers = '';
            $middlePlayers = '';
            $roamerPlayers = '';

            if ($selectedPlayers) {
                if (isset($selectedPlayers['GOLD'])) {
                    $goldPlayers = implode(', ', array_map(function($player) {
                        return $player['name'] ?? 'Unknown';
                    }, $selectedPlayers['GOLD']));
                }
                if (isset($selectedPlayers['JUNGLER'])) {
                    $junglerPlayers = implode(', ', array_map(function($player) {
                        return $player['name'] ?? 'Unknown';
                    }, $selectedPlayers['JUNGLER']));
                }
                if (isset($selectedPlayers['EXP'])) {
                    $expPlayers = implode(', ', array_map(function($player) {
                        return $player['name'] ?? 'Unknown';
                    }, $selectedPlayers['EXP']));
                }
                if (isset($selectedPlayers['MIDDLE'])) {
                    $middlePlayers = implode(', ', array_map(function($player) {
                        return $player['name'] ?? 'Unknown';
                    }, $selectedPlayers['MIDDLE']));
                }
                if (isset($selectedPlayers['ROAMER'])) {
                    $roamerPlayers = implode(', ', array_map(function($player) {
                        return $player['name'] ?? 'Unknown';
                    }, $selectedPlayers['ROAMER']));
                }
            }

            $values[] = [
                $row->ml_id,
                $row->server_id,
                $row->ign,
                $teamsString,
                $goldPlayers,
                $junglerPlayers,
                $expPlayers,
                $middlePlayers,
                $roamerPlayers,
                $row->created_at
            ];
        }

        // Clear existing data
        $service->spreadsheets_values->clear($spreadsheetId, $range, new \Google_Service_Sheets_ClearValuesRequest());

        // 5. Push to Google Sheets
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $values
        ]);

        $params = ['valueInputOption' => 'RAW'];

        $service->spreadsheets_values->update(
            $spreadsheetId,
            $range,
            $body,
            $params
        );

        return response()->json([
            'success' => true,
            'message' => '✅ MCCS2Predictions data exported to Google Sheets!',
            'total_votes' => count($results)
        ]);
    }
}
