<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    public function index()
    {
        // Check which IDs exist in the database
        $deleteIds = [
            26180, 26935, 10653, 25889, 10232, 25930, 12496, 25435, 15373, 26151,
            10160, 25895, 21448, 26087, 11763, 25629, 26918, 13934, 26906, 26992,
            14892, 27187, 11211, 25520, 16056, 25595, 12479, 26343, 21041, 26283,
            11320, 25517, 20470, 25656, 18947, 27233, 10651, 25937, 21434, 27273,
            13311, 25636, 10335, 26855, 20463, 25786, 17308, 27049, 17550, 26568,
            19916, 27182, 10607, 26178, 27027, 27220, 27352, 12248, 26354, 14026,
            26798, 25830, 19600, 26863, 12792, 26403, 25482, 26622, 16809, 27281,
            12340, 26458, 17925, 25912, 26388, 27169, 10447, 27112, 25274, 26982,
            17150, 26047, 13631, 26545, 12598, 25977, 26893, 27006, 21472, 26297,
            11693, 25446, 23126, 26949, 15312, 26747, 25449, 26796, 11784, 26340,
            22579, 25872, 12602, 26177, 17602, 26001, 26600, 26956, 25424, 26338,
            20341, 26093, 26573, 123, 10829, 10767, 10522, 10666, 26580, 26848,
            10645, 25867, 13029, 27061, 10214, 10774, 25441, 27190, 15206, 25423,
            11310, 26167, 11655, 25810, 12291, 27176, 21502, 25929, 23684, 27299,
            12768, 25857, 26999, 27042, 20501, 25835, 19818, 26588, 21231, 26543,
            26446, 27240, 10547, 27086, 11235, 25419, 11238, 26742, 18828, 26941,
            11851, 25840, 25978, 25801, 26705, 15383, 27280, 13545, 26441, 14220,
            25896, 27117, 13792, 26275, 12013, 27331, 29141, 10926, 27150, 24795,
            26488, 12557, 27069, 28328, 10204, 11061, 26169, 26475, 14486, 25436,
            20777, 26498, 23516, 26710, 10662, 10816, 23330, 26370, 10600, 26139,
            29512, 19134, 26115, 14410, 26209, 17448, 27132, 24939, 27330, 18523,
            25917, 25140, 20650, 26815, 11260, 27146, 27192, 12459, 25974, 27790,
            26401, 26667, 16317, 26146, 14682, 26725, 26971, 27263, 20003, 26267
        ];
        
        $existingIds = User::whereIn('id', $deleteIds)->pluck('id')->toArray();
        $missingIds = array_diff($deleteIds, $existingIds);
        
        return view('user-management', [
            'totalTargetIds' => count($deleteIds),
            'existingIds' => count($existingIds),
            'missingIds' => count($missingIds),
            'missingIdsList' => $missingIds
        ]);
    }

    public function getUsers(Request $request)
    {
        $perPage = $request->query('per_page', 20);
        $search = $request->query('search', '');
        $state = $request->query('state', '');
        
        // Predefined IDs to show
        $deleteIds = [
            26180, 26935, 10653, 25889, 10232, 25930, 12496, 25435, 15373, 26151,
            10160, 25895, 21448, 26087, 11763, 25629, 26918, 13934, 26906, 26992,
            14892, 27187, 11211, 25520, 16056, 25595, 12479, 26343, 21041, 26283,
            11320, 25517, 20470, 25656, 18947, 27233, 10651, 25937, 21434, 27273,
            13311, 25636, 10335, 26855, 20463, 25786, 17308, 27049, 17550, 26568,
            19916, 27182, 10607, 26178, 27027, 27220, 27352, 12248, 26354, 14026,
            26798, 25830, 19600, 26863, 12792, 26403, 25482, 26622, 16809, 27281,
            12340, 26458, 17925, 25912, 26388, 27169, 10447, 27112, 25274, 26982,
            17150, 26047, 13631, 26545, 12598, 25977, 26893, 27006, 21472, 26297,
            11693, 25446, 23126, 26949, 15312, 26747, 25449, 26796, 11784, 26340,
            22579, 25872, 12602, 26177, 17602, 26001, 26600, 26956, 25424, 26338,
            20341, 26093, 26573, 123, 10829, 10767, 10522, 10666, 26580, 26848,
            10645, 25867, 13029, 27061, 10214, 10774, 25441, 27190, 15206, 25423,
            11310, 26167, 11655, 25810, 12291, 27176, 21502, 25929, 23684, 27299,
            12768, 25857, 26999, 27042, 20501, 25835, 19818, 26588, 21231, 26543,
            26446, 27240, 10547, 27086, 11235, 25419, 11238, 26742, 18828, 26941,
            11851, 25840, 25978, 25801, 26705, 15383, 27280, 13545, 26441, 14220,
            25896, 27117, 13792, 26275, 12013, 27331, 29141, 10926, 27150, 24795,
            26488, 12557, 27069, 28328, 10204, 11061, 26169, 26475, 14486, 25436,
            20777, 26498, 23516, 26710, 10662, 10816, 23330, 26370, 10600, 26139,
            29512, 19134, 26115, 14410, 26209, 17448, 27132, 24939, 27330, 18523,
            25917, 25140, 20650, 26815, 11260, 27146, 27192, 12459, 25974, 27790,
            26401, 26667, 16317, 26146, 14682, 26725, 26971, 27263, 20003, 26267
        ];
        
        $query = User::select(
            'id', 'name', 'surname', 'email', 'username', 'ml_id', 'ml_server', 
            'university', 'year_level', 'region', 'island', 'role', 'state', 
            'created_at', 'verified_date'
        )->whereIn('id', $deleteIds);

        // Apply search filter
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('surname', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%')
                  ->orWhere('ml_id', 'like', '%' . $search . '%');
            });
        }

        // Apply state filter
        if (!empty($state)) {
            $query->where('state', $state);
        }

        $users = $query->orderByDesc('created_at')->paginate($perPage);
        
        // Add debug information
        $response = response()->json($users);
        $response->headers->set('X-Total-Target-Users', count($deleteIds));
        $response->headers->set('X-Found-Users', $users->total());
        
        return $response;
    }

    public function bulkDeleteUsers(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $userIds = $request->input('user_ids');
        
        try {
            $deletedCount = User::whereIn('id', $userIds)->delete();
            
            return response()->json([
                'success' => true,
                'message' => "Successfully deleted {$deletedCount} users.",
                'deleted_count' => $deletedCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting users: ' . $e->getMessage()
            ], 500);
        }
    }
}
