<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get page views for the last 7 days
     */
    public function getPageViewsLast7Days()
    {
        // For now, we'll create mock data based on actual database activity
        // In a real implementation, this would fetch from Google Analytics API
        
        $days = [];
        $pageViews = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $days[] = $date->format('D');
            
            // Mock data based on user activity patterns
            $baseViews = 150;
            $weekendBonus = in_array($date->format('D'), ['Sat', 'Sun']) ? 1.3 : 1.0;
            $randomFactor = rand(80, 120) / 100;
            
            $pageViews[] = round($baseViews * $weekendBonus * $randomFactor);
        }
        
        return [
            'days' => $days,
            'pageViews' => $pageViews,
            'total' => array_sum($pageViews),
            'growth' => $this->calculateGrowth($pageViews)
        ];
    }
    
    /**
     * Get key metrics
     */
    public function getKeyMetrics()
    {
        // Get real data from database where possible
        $totalUsers = DB::table('users')->count();
        $activeUsers = DB::table('users')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();
        
        // Mock engagement metrics (in real implementation, these would come from GA)
        $bounceRate = rand(25, 45);
        $avgSessionDuration = rand(180, 420); // seconds
        $pagesPerSession = round(rand(20, 50) / 10, 1);
        
        return [
            'totalViews' => $this->getPageViewsLast7Days()['total'],
            'uniqueVisitors' => $activeUsers,
            'bounceRate' => $bounceRate,
            'avgSessionDuration' => $avgSessionDuration,
            'pagesPerSession' => $pagesPerSession,
            'totalUsers' => $totalUsers
        ];
    }
    
    /**
     * Get top pages
     */
    public function getTopPages()
    {
        // In a real implementation, this would come from Google Analytics
        // For now, we'll create realistic mock data
        return [
            ['page' => 'Homepage', 'views' => 1247],
            ['page' => 'About Us', 'views' => 856],
            ['page' => 'Contact', 'views' => 743],
            ['page' => 'Events', 'views' => 621],
            ['page' => 'News', 'views' => 534]
        ];
    }
    
    /**
     * Calculate growth percentage
     */
    private function calculateGrowth($pageViews)
    {
        if (count($pageViews) < 2) return 0;
        
        $currentWeek = array_sum(array_slice($pageViews, -7));
        $previousWeek = array_sum(array_slice($pageViews, -14, 7));
        
        if ($previousWeek == 0) return 0;
        
        return round((($currentWeek - $previousWeek) / $previousWeek) * 100, 1);
    }
    
    /**
     * Get real-time analytics data
     */
    public function getRealTimeData()
    {
        // Get actual user activity from database
        $activeUsers = DB::table('users')
            ->where('last_seen_at', '>=', Carbon::now()->subMinutes(5))
            ->count();
            
        $recentRegistrations = DB::table('users')
            ->where('created_at', '>=', Carbon::now()->subDays(1))
            ->count();
            
        return [
            'activeUsers' => $activeUsers,
            'recentRegistrations' => $recentRegistrations,
            'lastUpdated' => Carbon::now()->format('H:i:s')
        ];
    }
} 