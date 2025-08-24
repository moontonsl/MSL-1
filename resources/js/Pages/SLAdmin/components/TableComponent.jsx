import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Facebook } from 'lucide-react';
import avatar from '../assets/42ca9ea53c9f0acd1d273d2864b58719215b59f4.png';
import Modal from '@/Components/Modal.jsx';
import Toast from '@/Components/Toast.jsx';

const TableComponent = ({ stateFilter, searchQuery, user }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [fileExists, setFileExists] = useState(true);
    const [showNoAttachmentAlert, setShowNoAttachmentAlert] = useState(false);
    const ITEMS_PER_PAGE = 20;

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            let url = `/api/sladmin/users?page=${page}&per_page=${ITEMS_PER_PAGE}`;
            if (stateFilter) {
                url += `&state=${encodeURIComponent(stateFilter)}`;
            }
            if (searchQuery && searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery.trim())}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            console.log('Fetched users data:', data);
            if (data.data && data.data.length > 0) {
                console.log('First user sample:', data.data[0]);
            }
            setUsers(data.data || []);
            setTotalPages(data.last_page || 1);
            setCurrentPage(data.current_page || 1);
            setTotalUsers(data.total || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchUsers(1);
        }
        
    }, [searchQuery, stateFilter]);

    useEffect(() => {
        fetchUsers(currentPage);
        
    }, [currentPage]);

    useEffect(() => {
        if (showModal && selectedUser) {
            console.log('Selected user:', selectedUser);
            console.log('User name:', selectedUser.name);
            console.log('User surname:', selectedUser.surname);
            console.log('User email:', selectedUser.email);
        }
    }, [showModal, selectedUser]);

    //Prevent modal close
    useEffect(() => {
        if (showAttachmentModal) {
        
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showAttachmentModal]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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

    const handleViewAttachment = async (proofOfEnrollment) => {
        if (proofOfEnrollment) {
            const fullUrl = `/storage/${proofOfEnrollment}`;
            
            // Check if file exists on server
            try {
                const response = await fetch(fullUrl, { method: 'HEAD' });
                if (response.ok) {
                    setFileExists(true);
                    setAttachmentUrl(fullUrl);
                    setShowAttachmentModal(true);
                } else {
                    setFileExists(false);
                    setAttachmentUrl(fullUrl);
                    setShowAttachmentModal(true);
                }
            } catch (error) {
                console.error('Error checking file:', error);
                setFileExists(false);
                setAttachmentUrl(fullUrl);
                setShowAttachmentModal(true);
            }
        }
    };

    const closeAttachmentModal = () => {
        setShowAttachmentModal(false);
        setAttachmentUrl('');
        // Reset zoom and pan when closing modal
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
        setIsDragging(false);
        setFileExists(true);
    };

    // Zoom and Pan handlers for images
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        setZoomLevel(prev => {
            const newZoom = Math.max(0.5, Math.min(3, prev + delta));
            return newZoom;
        });
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const hideToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    const handleVerifyAttempt = (user) => {
        if (!user.proofOfEnrollment) {
            setShowNoAttachmentAlert(true);
            return false;
        }
        return true;
    };

    const handleAction = async (action, userId, reason = null) => {
        setActionLoading(true);
        setError('');
        
        try {
            let url;
            let method;
            let body = {};
            
            switch (action) {
                case 'verify':
                    // Additional check for proof of enrollment before making the API call
                    const targetUser = users.find(u => u.id === userId);
                    if (targetUser && !targetUser.proofOfEnrollment) {
                        throw new Error('Cannot verify user without proof of enrollment. The user must upload their proof of enrollment document first.');
                    }
                    url = `/api/sladmin/users/${userId}/verify`;
                    method = 'PATCH';
                    break;
                case 'block':
                    url = `/api/sladmin/users/${userId}/block`;
                    method = 'PATCH';
                    body = { reason: reason };
                    break;
                case 'renew':
                    url = `/api/sladmin/users/${userId}/renew`;
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
                body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
            });
            
            // Check if response is JSON before trying to parse it
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // If not JSON, get the text to see what the server returned
                const textResponse = await response.text();
                console.error('Server returned non-JSON response:', textResponse);
                throw new Error('Server returned an invalid response. Please try again or contact support.');
            }
            
            if (!response.ok) {
                // Special handling for verification without attachment
                if (action === 'verify' && response.status === 400 && data.error && data.error.includes('proof of enrollment')) {
                    throw new Error('Verification failed: User must upload proof of enrollment before verification.');
                }
                throw new Error(data.error || data.message || 'Action failed');
            }
            
            //Close modal and refresh user list
            setShowModal(false);
            setShowBlockModal(false);
            setSelectedUser(null);
            setBlockReason('');
            fetchUsers(currentPage);
            
            //success toast
            const actionMessages = {
                'verify': 'User verified successfully',
                'block': 'User blocked successfully',
                'renew': data.message || 'User renewed successfully',
                'delete': 'User deleted successfully'
            };
            showToast(actionMessages[action] || 'Action completed successfully', 'success');
            
        } catch (err) {
            console.error('Action error:', err);
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockUser = () => {
        if (!selectedUser) {
            setError('No user selected for blocking.');
            return;
        }
        if (!blockReason.trim()) {
            setError('Please provide a reason for blocking the user.');
            return;
        }
        const userId = selectedUser.id; // Store the ID before calling handleAction
        handleAction('block', userId, blockReason.trim());
    };

    return (
        <>
            {/* Summary Section */}
            {users.length > 0 && (
                <div className="mb-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-white">
                                <span className="font-semibold">Students:</span> {totalUsers}
                            </div>
                            {(() => {
                                const usersWithoutAttachment = users.filter(user => !user.proofOfEnrollment && (user.state === 'New' || user.state === 'Renew'));
                                return usersWithoutAttachment.length > 0 ? (
                                    <div className="text-red-400">
                                        <span className="font-semibold">Users Missing Attachments (Current Page):</span> {usersWithoutAttachment.length}
                                    </div>
                                ) : null;
                            })()}
                        </div>
                        <div className="text-sm text-gray-400">
                            Users without proof of enrollment cannot be verified • Showing page {currentPage} of {totalPages}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-[#1a1a1a] text-white shadow custom-scrollbar">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400">
                    <tr>
                        <th className="px-4 py-3 text-left">MSL Account</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">School / Institution</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Year Level</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                        <th className="px-4 py-3 text-center">Details</th>
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
                                    <div className="text-xs text-gray-200 font-bold">{item.name} {item.surname}</div>
                                    <div className="text-xs text-gray-400">IGN: {item.ml_ign}</div>
                                    <div className="flex-col items-center gap-2 md:flex-row">
                                        <div className="text-xs text-gray-400">{item.ml_id} ({item.ml_server})</div>
                                        <span className="text-xs text-blue-400 cursor-pointer">Facebook</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">{item.university}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{item.year_level}</td>
                            <td className="px-4 py-3 hidden md:table-cell">
                                <div className="flex flex-col gap-1">
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
                                    {!item.proofOfEnrollment && (item.state === 'New' || item.state === 'Renew') && (
                                        <span className="rounded px-2 py-1 text-xs font-medium bg-red-600/10 text-red-400 border border-red-500/30">
                                            ⚠️ No Attachment
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <button className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 whitespace-nowrap" onClick={() => openModal(item)}>
                                        View Profile
                                    </button>
                                </div>
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
                    <div className="bg-black text-white p-4 sm:p-4 flex flex-col md:flex-row gap-4 md:gap-4 min-h-[400px] max-h-[80vh] overflow-y-auto relative">
                        <button 
                            onClick={closeModal}
                            className="bg-black rounded-md p-1 absolute top-4 right-4 text-white hover:text-gray-300 text-xl z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
                            </svg>
                        </button>
                        <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-4 md:mb-0 bg-[#1a1a1a] rounded-lg px-10">
                            <span className={`absolute left-0 -translate-x-0 bg-black font-bold px-6 py-1 rounded-lg text-lg whitespace-nowrap shadow ${selectedUser.state === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`}>{selectedUser.state}</span>
                            <br />
                            <div className="relative mt-10 mb-6 flex flex-col items-center w-full justify-center">
                                <div className="rounded-full border-4 border-yellow-400 p-1 bg-gradient-to-tr from-[#D4AF37] to-[#FFFACD] mx-auto">
                                    <img src={avatar} alt="avatar" className="w-28 h-28 sm:w-56 sm:h-56 rounded-full object-cover" />
                                </div>
                            </div>
                            <div className="mt-2 w-full">
                                <div className="text-gray-600 text-sm">Full Name:</div>
                                <div className="font-bold text-lg mb-2 break-words">{selectedUser.name || '-'} {selectedUser.surname || '-'}</div>
                                <div className="text-gray-600 text-sm">School Name:</div>
                                <div className="font-bold text-lg mb-2 break-words">{selectedUser.university || '-'}</div>
                                <div className="text-gray-600 text-sm">Year Level:</div>
                                <div className="font-bold text-lg break-words">{selectedUser.year_level || '-'}</div>
                                <br />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between w-full md:w-2/3 bg-[#1a1a1a] rounded-lg p-4">
                            <div>
                                <div className="text-gray-600 text-sm">Username:</div>
                                <div className="font-bold text-lg mb-2 break-words">{selectedUser.username || '-'}</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                                <div>
                                    <div className="text-gray-600 text-sm">MLBB ID:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.ml_id || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">MLBB Server:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.ml_server || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">MLBB IGN:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.ml_ign || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Email:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.email || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Contact Number:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.contact_number || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Course:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.course || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Student ID:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.studentId || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Region:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.region || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Island:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.island || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm">Date Joined:</div>
                                    <div className="font-bold text-lg mb-2 break-words">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '-'}</div>
                                </div>
                                {selectedUser.verified_by && (
                                    <div>
                                        <div className="text-gray-600 text-sm">Verified By:</div>
                                        <div className="font-bold text-lg mb-2 break-words">
                                            {selectedUser.verifier_name ? `${selectedUser.verifier_name} ${selectedUser.verifier_surname}` : 'Unknown'}
                                        </div>
                                    </div>
                                )}
                                {selectedUser.verified_date && (
                                    <div>
                                        <div className="text-gray-600 text-sm">Verified Date:</div>
                                        <div className="font-bold text-lg mb-2 break-words">
                                            {new Date(selectedUser.verified_date).toLocaleDateString()} at {new Date(selectedUser.verified_date).toLocaleTimeString()}
                                        </div>
                                    </div>
                                )}
                                {selectedUser.state === 'Blocked' && selectedUser.blocked_reason && (
                                    <div className="col-span-2">
                                        <div className="text-gray-600 text-sm">Blocked Reason:</div>
                                        <div className="font-bold text-lg mb-2 break-words text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                                            {selectedUser.blocked_reason}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Attachment Warning */}
                                {!selectedUser.proofOfEnrollment && (selectedUser.state === 'New' || selectedUser.state === 'Renew') && (
                                    <div className="col-span-2 mb-4">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-red-400">Student has not uploaded proof of enrollment</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex flex-col sm:flex-row flex-wrap justify-between items-center gap-2 sm:gap-4 mt-4">
                                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
                                    <button 
                                        className="bg-white text-black px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewAttachment(selectedUser.proofOfEnrollment);
                                        }}
                                        disabled={!selectedUser.proofOfEnrollment}
                                    >
                                        {selectedUser.proofOfEnrollment ? 'View Attachment' : 'No Attachment'}
                                    </button>
                                    {(stateFilter === 'Verified' || stateFilter === 'Renew' ||stateFilter === 'New') && (
                                        <button 
                                            className="bg-white text-black px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                            onClick={() => handleAction('renew', selectedUser.id)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Processing...' : 'Renew'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                                    {(stateFilter === 'New' || stateFilter === 'Renew') && (
                                    <button 
                                        className={`px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50 ${
                                            !selectedUser.proofOfEnrollment 
                                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                        }`}
                                        onClick={() => {
                                            if (handleVerifyAttempt(selectedUser)) {
                                                handleAction('verify', selectedUser.id);
                                            }
                                        }}
                                        disabled={actionLoading || !selectedUser.proofOfEnrollment}
                                        title={!selectedUser.proofOfEnrollment ? 'Cannot verify without proof of enrollment' : 'Verify this student'}
                                    >
                                        {actionLoading ? 'Processing...' : 'Verify'}
                                    </button>
                                    )}
                                    <button 
                                        className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                        onClick={() => {
                                            setShowBlockModal(true);
                                            setBlockReason('');
                                            setError('');
                                        }}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : 'Block'}
                                    </button>
                                    {user?.role === 'Super Admin' && (
                                        <button 
                                            className="bg-red-600 text-white px-4 py-2 rounded font-semibold w-full sm:w-auto disabled:opacity-50"
                                            onClick={() => handleAction('delete', selectedUser.id)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Processing...' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {error && (
                                <div className="w-full mt-4 p-3 bg-red-600 text-white rounded text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Block User Modal */}
            {showBlockModal && createPortal(
                <div className="fixed inset-0 z-[70] bg-[#fff]/50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div 
                        className="absolute inset-0 bg-black/50" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowBlockModal(false);
                        }}
                    ></div>
                    <div 
                        className="relative bg-black text-white p-6 rounded-lg max-w-md w-full mx-4" 
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Block User</h3>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBlockModal(false);
                                }}
                                className="text-white hover:text-gray-300 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        {selectedUser && (
                            <div className="mb-6">
                                <p className="text-gray-300 mb-2">
                                    You are about to block <span className="font-semibold text-white">{selectedUser.name} {selectedUser.surname}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    This action will prevent the user from accessing the platform. Please provide a reason for blocking.
                                </p>
                            </div>
                        )}
                        
                        <div className="mb-6">
                            <label htmlFor="blockReason" className="block text-sm font-medium text-gray-300 mb-2">
                                Reason for Blocking *
                            </label>
                            <textarea
                                id="blockReason"
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2a2a2a] border border-neutral-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter the reason for blocking this user..."
                                rows={4}
                                maxLength={1000}
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                {blockReason.length}/1000 characters
                            </div>
                        </div>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-600 text-white rounded text-center">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBlockModal(false);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBlockUser();
                                }}
                                className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-500 disabled:opacity-50"
                                disabled={actionLoading || !blockReason.trim()}
                            >
                                {actionLoading ? 'Processing...' : 'Block User'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* Attachment Modal  */}
            {showAttachmentModal && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80" onClick={closeAttachmentModal}></div>
                    <div className="relative bg-black text-white p-4 rounded-lg max-w-[95vw] w-[800px] max-h-[90vh] overflow-auto border border-neutral-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Proof of Enrollment</h3>
                            <div className="flex items-center gap-2">
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg px-3 py-1 border border-neutral-700">
                                    <button 
                                        onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                                        className="text-white hover:text-blue-400 transition-colors p-1 rounded hover:bg-neutral-700"
                                        title="Zoom Out"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                        </svg>
                                    </button>
                                    <span className="text-sm text-gray-300 min-w-[3rem] text-center">
                                        {Math.round(zoomLevel * 100)}%
                                    </span>
                                    <button 
                                        onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                                        className="text-white hover:text-blue-400 transition-colors p-1 rounded hover:text-blue-400 transition-colors p-1 rounded hover:bg-neutral-700"
                                        title="Zoom In"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => setZoomLevel(1)}
                                        className="text-white hover:text-green-400 transition-colors p-1 rounded hover:bg-neutral-700 text-xs"
                                        title="Reset Zoom"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <button 
                                    onClick={closeAttachmentModal}
                                    className="text-white hover:text-gray-300 text-2xl font-bold ml-4"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center overflow-hidden w-full">
                            {!fileExists ? (
                                // File not found message
                                <div className="text-center p-8 text-red-400 bg-red-500/10 rounded-lg border border-red-500/30 w-full">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-xl font-semibold mb-2">File Not Found</p>
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-red-300">The proof of enrollment file could not be located on the server.</p>
                                    </div>
                                </div>
                            ) : attachmentUrl.toLowerCase().endsWith('.pdf') ? (
                                // PDF Viewer with Zoom
                                <div className="relative w-full h-[75vh] overflow-auto">
                                    <iframe
                                        src={`${attachmentUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=${Math.round(zoomLevel * 100)}`}
                                        className="w-full h-full rounded-lg border border-neutral-700"
                                        title="Proof of Enrollment PDF"
                                        style={{
                                            transform: `scale(${zoomLevel})`,
                                            transformOrigin: 'top left',
                                            width: `${100 / zoomLevel}%`,
                                            height: `${100 / zoomLevel}%`
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                </div>
                            ) : (
                                // Image Viewer with Zoom and Pan
                                <div 
                                    className="relative overflow-hidden rounded-lg border border-neutral-700 w-full"
                                    style={{ 
                                        height: '75vh',
                                        cursor: isDragging ? 'grabbing' : 'grab'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onWheel={handleWheel}
                                >
                                    <img 
                                        src={attachmentUrl} 
                                        alt="Proof of Enrollment" 
                                        className="transition-transform duration-200 ease-out"
                                        style={{
                                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                                            transformOrigin: 'center',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* File not found message */}
                            <div 
                                className="hidden text-center p-8 text-red-400 bg-red-500/10 rounded-lg border border-red-500/30"
                                style={{ display: 'none' }}
                            >
                                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-xl font-semibold mb-2">File Not Found</p>
                                <p className="text-sm text-red-300">The proof of enrollment file could not be located on the server.</p>
                                <p className="text-xs text-red-400 mt-2">Path: {attachmentUrl}</p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* No Attachment Alert Modal */}
            {showNoAttachmentAlert && createPortal(
                <div className="fixed inset-0 z-[80] bg-[#fff]/50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div 
                        className="absolute inset-0 bg-black/50" 
                        onClick={() => setShowNoAttachmentAlert(false)}
                    ></div>
                    <div 
                        className="relative bg-black text-white p-6 rounded-lg max-w-md w-full mx-4 border border-neutral-700" 
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-red-400">⚠️ Verification Blocked</h3>
                            <button 
                                onClick={() => setShowNoAttachmentAlert(false)}
                                className="text-white hover:text-gray-300 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <div className="text-center mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-300 mb-3 text-center">
                                <span className="font-semibold text-white">{selectedUser?.name} {selectedUser?.surname}</span> cannot be verified at this time.
                            </p>
                            <p className="text-red-300 text-sm text-center">
                                <strong>Reason:</strong> No proof of enrollment document has been uploaded.
                            </p>
                            <p className="text-gray-400 text-sm text-center mt-3">
                                The student must upload their proof of enrollment before they can be verified.
                            </p>
                        </div>
                        
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setShowNoAttachmentAlert(false)}
                                className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={hideToast}
                duration={4000}
            />
        </>
    );
};

export default TableComponent;
