import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Header, Footer } from "@/Components";
import { router } from '@inertiajs/react';
import style from "@/Components/CSS/Campus.module.css";

export default function Campus({ schools, islands, provinces, selectedIslandId, selectedProvinceId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [islandFilter, setIslandFilter] = useState(selectedIslandId || '');
    const [provinceFilter, setProvinceFilter] = useState(selectedProvinceId || '');

    const handleFilterChange = () => {
        const params = new URLSearchParams();
        if (islandFilter) params.append('island_id', islandFilter);
        if (provinceFilter) params.append('province_id', provinceFilter);
        
        router.get('/campus', Object.fromEntries(params), {
            preserveState: true,
            replace: true
        });
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams();
        if (islandFilter) params.append('island_id', islandFilter);
        if (provinceFilter) params.append('province_id', provinceFilter);
        params.append('page', page);
        
        router.get('/campus', Object.fromEntries(params), {
            preserveState: true,
            replace: true
        });
    };

    const filteredSchools = schools.data.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.municipality?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.region?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative z-10">
                <Header />
            </div>

            <main
                className="relative z-0 min-h-screen py-8 md:py-16 flex items-center justify-center overflow-hidden"
                style={{
                    backgroundImage: "url('/images/MCC/MCC2_BG.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                }}
            >
                <div className="w-full max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">School Directory</h1>
                        <p className="text-gray-300">Browse schools across the Philippines</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Search */}
                            <div className="flex-1 min-w-64">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Search Schools
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by school name, municipality, or region..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Island Filter */}
                            <div className="min-w-48">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Filter by Island
                                </label>
                                <select
                                    value={islandFilter}
                                    onChange={(e) => setIslandFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Islands</option>
                                    {islands.map(island => (
                                        <option key={island.id} value={island.id}>
                                            {island.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Province Filter */}
                            <div className="min-w-48">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Filter by Province
                                </label>
                                <select
                                    value={provinceFilter}
                                    onChange={(e) => setProvinceFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Provinces</option>
                                    {provinces.map(province => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Apply Filter Button */}
                            <button
                                onClick={handleFilterChange}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">School Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Municipality</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Province</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Region</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Island</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredSchools.map((school) => (
                                        <tr key={school.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-white font-medium">
                                                {school.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {school.municipality?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {school.municipality?.province?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {school.region?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {school.region?.island?.name || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {schools.from || 0} to {schools.to || 0} of {schools.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(schools.current_page - 1)}
                                    disabled={!schools.prev_page_url}
                                    className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, schools.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        const isCurrentPage = page === schools.current_page;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                    isCurrentPage
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(schools.current_page + 1)}
                                    disabled={!schools.next_page_url}
                                    className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                            </div>

                    {/* Philippines Map */}
                    <div className="mt-8 bg-black/50 backdrop-blur-sm rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">Philippines Map</h2>
                        <div className="flex justify-center">
                            <div className="text-center">
                                <div className="text-gray-400 mb-4">
                                    <p>Interactive Philippines Map</p>
                                    <p className="text-sm">Map visualization will be added here</p>
                                </div>
                                <div className="w-96 h-64 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center">
                                    <span className="text-gray-500">Map Placeholder</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}