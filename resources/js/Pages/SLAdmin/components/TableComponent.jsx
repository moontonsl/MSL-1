import React, { useState, useEffect } from 'react';
import { Facebook } from 'lucide-react';
import avatar from '../assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png';
import Modal from '@/Components/Modal.jsx';

const TableComponent = ({ stateFilter }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const ITEMS_PER_PAGE = 20;

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            let url = `/api/sladmin/users?page=${page}&per_page=${ITEMS_PER_PAGE}`;
            if (stateFilter) {
                url += `&state=${encodeURIComponent(stateFilter)}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data.data || []);
            setTotalPages(data.last_page || 1);
            setCurrentPage(data.current_page || 1);
        } catch (error) {
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
        // eslint-disable-next-line
    }, [currentPage, stateFilter]);

    useEffect(() => {
        if (showModal && selectedUser) {
            console.log('Selected user:', selectedUser);
        }
    }, [showModal, selectedUser]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Helper to generate truncated pagination
    const getPagination = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let left = Math.max(2, currentPage - 2);
            let right = Math.min(totalPages - 1, currentPage + 2);
            if (left > 2) pages.push('left-ellipsis');
            for (let i = left; i <= right; i++) pages.push(i);
            if (right < totalPages - 1) pages.push('right-ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleAction = async (action, userId) => {
        setActionLoading(true);
        setError('');
        
        try {
            let url;
            let method;
            
            switch (action) {
                case 'verify':
                    url = `/api/sladmin/users/${userId}/verify`;
                    method = 'PATCH';
                    break;
                case 'block':
                    url = `/api/sladmin/users/${userId}/block`;
                    method = 'PATCH';
                    break;
                case 'delete':
                    url = `/api/sladmin/users/${userId}`;
                    method = 'DELETE';
                    break;
                default:
                    throw new Error('Invalid action');
            }
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Action failed');
            }
            
            // Close modal and refresh user list
            setShowModal(false);
            setSelectedUser(null);
            fetchUsers(currentPage);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-[#1a1a1a] text-white shadow custom-scrollbar">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400">
                    <tr>
                        <th className="px-4 py-3 text-left">MSL Account</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Fullname</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">School / Institution</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Year Level</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                        <th className="px-4 py-3 text-left">Details</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {loading ? (
                        <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8">No users found.</td></tr>
                    ) : users.map((item, index) => (
                        <tr key={item.id} className="hover:bg-[#2f2f2f] transition-colors">
                            <td className="flex items-center gap-3 px-4 py-3">
                                <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] p-[2px] rounded-full">
                                    <div className="bg-neutral-900 rounded-full">
                                        <img
                                            src={avatar}
                                            alt={item.name}
                                            className="h-[32px] w-[32px] rounded-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium text-white">{item.name} {item.surname}</div>
                                    <div className="text-xs text-gray-400">IGN: {item.ml_ign}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs text-gray-400">{item.ml_id} ({item.ml_server}) |</div>
                                        <span className="text-xs text-blue-400 cursor-pointer">Facebook</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">{item.name} {item.surname}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{item.university}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{item.year_level}</td>
                            <td className="px-4 py-3 hidden md:table-cell">
                  <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                          item.state === 'Verified'
                              ? 'bg-green-600/10 text-green-400'
                              : item.state === 'Blocked'
                                  ? 'bg-red-600/10 text-red-400'
                                  : 'bg-yellow-600/10 text-yellow-400'
                      }`}
                  >
                    {item.state}
                  </span>
                            </td>
                            <td className="px-4 py-3">
                                <button className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 whitespace-nowrap" onClick={() => openModal(item)}>
                                    View Profile
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 gap-2 text-sm text-white">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {getPagination().map((page, idx) =>
                        page === 'left-ellipsis' || page === 'right-ellipsis' ? (
                            <span key={page + idx} className="px-2">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === page ? 'bg-white text-black font-bold' : 'bg-neutral-800'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* User Details Modal */}
            <Modal show={showModal} maxWidth="70vw" onClose={closeModal}>
                {selectedUser && (
                    <div className="bg-black text-white p-4 sm:p-4 flex flex-col md:flex-row gap-4 md:gap-4 min-h-[400px] max-h-[80vh] overflow-y-auto">
                        {/* Left: Avatar and basic info */}
                        <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-4 md:mb-0 bg-[#1a1a1a] rounded-lg px-10">
                            <span className="top-2 left-1/2 -translate-x-1/2 bg-black text-yellow-400 font-bold px-6 py-1 rounded-lg text-lg whitespace-nowrap shadow">{selectedUser.state}</span>
                            <div className="relative mb-6 flex flex-col items-center w-full justify-center">
                                <div className="rounded-full border-4 border-yellow-400 p-1 bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] mx-auto">
                                    <img src={avatar} alt="avatar" className="w-28 h-28 sm:w-56 sm:h-56 rounded-full object-cover" />
                                </div>
                            </div>
                            <div className="mt-2 w-full">
                                <div className="text-gray-600 text-sm">Full Name:</div>
                                <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.name) ? selectedUser.name.join('') : selectedUser.name || '-'} {Array.isArray(selectedUser.surname) ? selectedUser.surname.join('') : selectedUser.surname || '-'}</div>
                                <div className="text-gray-600 text-sm">School Name:</div>
                                <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.university) ? selectedUser.university.join('') : selectedUser.university || '-'}</div>
                                <div className="text-gray-600 text-sm">Year Level:</div>
                                <div className="font-bold text-lg break-words">{Array.isArray(selectedUser.year_level) ? selectedUser.year_level.join('') : selectedUser.year_level || '-'}</div>
                            </div>
                        </div>
                        {/* Right: Details in two-column grid */}
                        <div className="flex-1 flex flex-col justify-between w-full md:w-2/3 bg-[#1a1a1a] rounded-lg p-4">
                            <div>
                                <div className="text-gray-600 text-sm">Username:</div>
                                <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.username) ? selectedUser.username.join('') : selectedUser.username || '-'}</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                                <div>
                                    <div className="text-gray-600 text-sm">MLBB ID:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.ml_id) ? selectedUser.ml_id.join('') : selectedUser.ml_id || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">MLBB Server:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.ml_server) ? selectedUser.ml_server.join('') : selectedUser.ml_server || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">MLBB IGN:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.ml_ign) ? selectedUser.ml_ign.join('') : selectedUser.ml_ign || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Email:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.email) ? selectedUser.email.join('') : selectedUser.email || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Contact Number:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.contact_number) ? selectedUser.contact_number.join('') : selectedUser.contact_number || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Course:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.course) ? selectedUser.course.join('') : selectedUser.course || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Student ID:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.studentId) ? selectedUser.studentId.join('') : selectedUser.studentId || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Region:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.region) ? selectedUser.region.join('') : selectedUser.region || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Island:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{Array.isArray(selectedUser.island) ? selectedUser.island.join('') : selectedUser.island || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Date Joined:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '-'}</div>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="w-full flex flex-col sm:flex-row flex-wrap justify-between items-center gap-2 sm:gap-4 mt-4">
                                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
                                    <button className="bg-white text-black px-4 py-2 rounded font-semibold w-full sm:w-auto">Attachment</button>
                                    <button className="bg-white text-black px-4 py-2 rounded font-semibold w-full sm:w-auto">Renew</button>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                                    <button 
                                        className="bg-green-500 text-white px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                        onClick={() => handleAction('verify', selectedUser.id)}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : 'Verify'}
                                    </button>
                                    <button 
                                        className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                        onClick={() => handleAction('block', selectedUser.id)}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : 'Block'}
                                    </button>
                                    <button 
                                        className="bg-red-600 text-white px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                        onClick={() => handleAction('delete', selectedUser.id)}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Error message */}
                            {error && (
                                <div className="w-full mt-4 p-3 bg-red-600 text-white rounded text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default TableComponent;
