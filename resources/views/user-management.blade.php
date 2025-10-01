<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>User Management Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <style>
        .target-user {
            background-color: #fef3c7 !important;
            border-left: 4px solid #f59e0b !important;
        }
        .target-user:hover {
            background-color: #fde68a !important;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white shadow-lg rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h1 class="text-2xl font-bold text-gray-900">Target Users Management Panel</h1>
                    <p class="text-sm text-gray-600 mt-1">Showing only users with predefined IDs for deletion</p>
                    <div class="mt-2 text-sm text-gray-500">
                        <span class="font-medium">Total Target IDs:</span> {{ $totalTargetIds }} | 
                        <span class="font-medium">Found in Database:</span> {{ $existingIds }} | 
                        <span class="font-medium">Missing:</span> {{ $missingIds }}
                        @if($missingIds > 0)
                            <span class="text-red-600">({{ $missingIds }} IDs don't exist in database)</span>
                        @endif
                    </div>
                </div>

                <div class="p-6" x-data="userManagement()">
                    @if($missingIds > 0)
                        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <h3 class="text-sm font-medium text-red-800 mb-2">Missing User IDs ({{ $missingIds }} IDs not found in database):</h3>
                            <div class="text-xs text-red-700 max-h-32 overflow-y-auto">
                                @foreach(array_chunk($missingIdsList, 10) as $chunk)
                                    <div class="mb-1">{{ implode(', ', $chunk) }}</div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                    <!-- Controls -->
                    <div class="mb-6 flex flex-wrap gap-4 items-center">
                        <button 
                            @click="deleteSelected()"
                            :disabled="selectedUsers.length === 0"
                            :class="selectedUsers.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'"
                            class="text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Delete Selected (<span x-text="selectedUsers.length"></span>)
                        </button>
                        <div class="flex gap-2 ml-auto">
                            <input 
                                x-model="searchTerm"
                                @input="debounceSearch()"
                                type="text" 
                                placeholder="Search users..." 
                                class="border border-gray-300 rounded-md px-3 py-2 w-64 text-sm"
                            >
                            <select 
                                x-model="stateFilter"
                                @change="fetchUsers()"
                                class="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">All States</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="blocked">Blocked</option>
                            </select>
                            <select 
                                x-model="perPage"
                                @change="fetchUsers()"
                                class="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div x-show="loading" class="text-center py-8">
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p class="mt-2 text-gray-600">Loading users...</p>
                    </div>

                    <!-- Table -->
                    <div x-show="!loading" class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input 
                                            type="checkbox" 
                                            :checked="selectedUsers.length === users.length && users.length > 0"
                                            @change="toggleSelectAll()"
                                            class="rounded border-gray-300"
                                        >
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ML ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <template x-for="user in users" :key="user.id">
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <input 
                                                type="checkbox" 
                                                :checked="selectedUsers.includes(user.id)"
                                                @change="toggleUser(user.id)"
                                                class="rounded border-gray-300"
                                            >
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" x-text="user.id"></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="user.name + ' ' + user.surname"></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="user.email"></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="user.username"></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="user.ml_id"></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="user.university"></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="user.role"></td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span 
                                                :class="getStateClass(user.state)"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                x-text="user.state"
                                            ></span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" x-text="formatDate(user.created_at)"></td>
                                    </tr>
                                </template>
                                <tr x-show="users.length === 0">
                                    <td colspan="10" class="px-6 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="!loading && totalPages > 1" class="mt-6 flex items-center justify-between">
                        <div class="text-sm text-gray-700">
                            Showing <span x-text="((currentPage - 1) * perPage) + 1"></span> to 
                            <span x-text="Math.min(currentPage * perPage, totalUsers)"></span> of 
                            <span x-text="totalUsers"></span> results
                        </div>
                        <div class="flex gap-2">
                            <button 
                                @click="changePage(currentPage - 1)"
                                :disabled="currentPage === 1"
                                class="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Previous
                            </button>
                            <span class="px-3 py-1 text-sm">
                                Page <span x-text="currentPage"></span> of <span x-text="totalPages"></span>
                            </span>
                            <button 
                                @click="changePage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                class="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function userManagement() {
            return {
                users: [],
                selectedUsers: [],
                loading: true,
                searchTerm: '',
                stateFilter: '',
                currentPage: 1,
                totalPages: 1,
                totalUsers: 0,
                perPage: 20,
                searchTimeout: null,

                // Predefined target user IDs
                targetIds: [
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
                ],

                init() {
                    this.fetchUsers();
                },

                async fetchUsers() {
                    this.loading = true;
                    try {
                        const params = new URLSearchParams({
                            page: this.currentPage,
                            per_page: this.perPage,
                            ...(this.searchTerm && { search: this.searchTerm }),
                            ...(this.stateFilter && { state: this.stateFilter })
                        });

                        const response = await fetch(`/user-management/api?${params}`);
                        const data = await response.json();
                        
                        this.users = data.data || [];
                        this.totalPages = data.last_page || 1;
                        this.totalUsers = data.total || 0;
                    } catch (error) {
                        console.error('Error fetching users:', error);
                        alert('Failed to fetch users');
                    } finally {
                        this.loading = false;
                    }
                },

                debounceSearch() {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        this.currentPage = 1;
                        this.fetchUsers();
                    }, 500);
                },

                changePage(page) {
                    if (page >= 1 && page <= this.totalPages) {
                        this.currentPage = page;
                        this.fetchUsers();
                    }
                },

                toggleSelectAll() {
                    if (this.selectedUsers.length === this.users.length) {
                        this.selectedUsers = [];
                    } else {
                        this.selectedUsers = this.users.map(user => user.id);
                    }
                },

                toggleUser(userId) {
                    const index = this.selectedUsers.indexOf(userId);
                    if (index > -1) {
                        this.selectedUsers.splice(index, 1);
                    } else {
                        this.selectedUsers.push(userId);
                    }
                },

                async deleteSelected() {
                    if (this.selectedUsers.length === 0) {
                        alert('Please select users to delete');
                        return;
                    }

                    if (!confirm(`Are you sure you want to delete ${this.selectedUsers.length} users? This action cannot be undone.`)) {
                        return;
                    }

                    try {
                        const response = await fetch('/user-management/delete', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            },
                            body: JSON.stringify({
                                user_ids: this.selectedUsers
                            })
                        });

                        const result = await response.json();
                        
                        if (result.success) {
                            alert(result.message);
                            this.selectedUsers = [];
                            this.fetchUsers();
                        } else {
                            alert(result.message);
                        }
                    } catch (error) {
                        console.error('Error deleting users:', error);
                        alert('Failed to delete users');
                    }
                },

                getStateClass(state) {
                    switch (state) {
                        case 'verified': return 'bg-green-100 text-green-800';
                        case 'pending': return 'bg-yellow-100 text-yellow-800';
                        case 'blocked': return 'bg-red-100 text-red-800';
                        default: return 'bg-gray-100 text-gray-800';
                    }
                },

                formatDate(dateString) {
                    return new Date(dateString).toLocaleDateString();
                }
            }
        }
    </script>
</body>
</html>
