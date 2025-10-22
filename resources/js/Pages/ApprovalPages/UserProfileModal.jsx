import React from 'react';
import { X } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const handleViewAttachment = async (proofOfEnrollment) => {
        if (!proofOfEnrollment) {
            alert('No proof of enrollment available');
            return;
        }

        try {
            const response = await fetch(`/api/view-attachment/${proofOfEnrollment}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                alert('Error viewing attachment');
            }
        } catch (error) {
            console.error('Error viewing attachment:', error);
            alert('Error viewing attachment');
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gradient-to-br from-[#000] via-gray-800 to-black text-white p-2 sm:p-8 min-h-[600px] max-h-[90vh] overflow-y-auto relative rounded-md w-full max-w-6xl">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-200 text-gray-300 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 h-fit">
                            {/* Avatar Section */}
                            <div className="text-center mb-2">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                    <div className="relative rounded-full border-4 border-yellow-400 p-2 bg-gradient-to-tr from-yellow-400 to-yellow-300">
                                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {user.name || '-'} {user.surname || '-'}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="text-gray-400 text-sm">@{user.username || '-'}</p>
                                        <div className="inline-flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${user.state === 'Verified' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                                            <span className={`font-semibold text-xs uppercase tracking-wider ${user.state === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {user.state}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">School</div>
                                        <div className="font-medium text-white">{user.university || '-'}</div>
                                    </div>
                                    
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Year Level</div>
                                        <div className="font-medium text-white">{user.year_level || '-'}</div>
                                    </div>
                                    
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Course</div>
                                        <div className="font-medium text-white">{user.course || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <h4 className="text-lg font-semibold text-white mb-6 border-b border-gray-700/50 pb-3">Student Information</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* MLBB Information */}
                                <div className="space-y-4">
                                    <h5 className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Mobile Legends</h5>
                                    <div className="space-y-3">
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">MLBB ID</div>
                                            <div className="font-medium text-white">{user.ml_id || '-'}</div>
                                        </div>
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Server</div>
                                            <div className="font-medium text-white">{user.ml_server || '-'}</div>
                                        </div>
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">IGN</div>
                                            <div className="font-medium text-white">{user.ml_ign || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h5 className="text-sm font-medium text-blue-400 uppercase tracking-wider">Contact Details</h5>
                                    <div className="space-y-3">
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Email</div>
                                            <div className="font-medium text-white break-words">{user.email || '-'}</div>
                                        </div>
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Phone</div>
                                            <div className="font-medium text-white">{user.contact_number || '-'}</div>
                                        </div>
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Student ID</div>
                                            <div className="font-medium text-white">{user.studentId || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="space-y-4 md:col-span-2">
                                    <h5 className="text-sm font-medium text-green-400 uppercase tracking-wider">Location</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Region</div>
                                            <div className="font-medium text-white">{user.region || '-'}</div>
                                        </div>
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Island</div>
                                            <div className="font-medium text-white">{user.island || '-'}</div>
                                        </div>
                                        <div className="bg-gray-700/20 rounded-lg p-3">
                                            <div className="text-gray-400 text-xs mb-1">Joined</div>
                                            <div className="font-medium text-white">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Details */}
                                {(user.verified_by || user.verified_date) && (
                                    <div className="space-y-4 md:col-span-2">
                                        <h5 className="text-sm font-medium text-purple-400 uppercase tracking-wider">Verification Details</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {user.verified_by && (
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Verified By</div>
                                                    <div className="font-medium text-white">
                                                        {user.verifier_name ? `${user.verifier_name} ${user.verifier_surname}` : 'Unknown'}
                                                    </div>
                                                </div>
                                            )}
                                            {user.verified_date && (
                                                <div className="bg-gray-700/20 rounded-lg p-3">
                                                    <div className="text-gray-400 text-xs mb-1">Verified On</div>
                                                    <div className="font-medium text-white">
                                                        {new Date(user.verified_date).toLocaleDateString()} at {new Date(user.verified_date).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Blocked Reason */}
                                {user.state === 'Blocked' && user.blocked_reason && (
                                    <div className="md:col-span-2">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                <span className="font-semibold text-red-400 text-sm uppercase tracking-wider">Blocked Reason</span>
                                            </div>
                                            <div className="text-red-300">{user.blocked_reason}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Attachment Warning */}
                                {!user.proofOfEnrollment && (user.state === 'New' || user.state === 'Renew') && (
                                    <div className="md:col-span-2">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-semibold text-red-400">No Proof of Enrollment Uploaded</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons - Only View Attachment */}
                            <div className="mt-8 pt-6 border-t border-gray-700/50">
                                <div className="flex justify-center">
                                    <button 
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            user.proofOfEnrollment 
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewAttachment(user.proofOfEnrollment);
                                        }}
                                        disabled={!user.proofOfEnrollment}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                            {user.proofOfEnrollment ? 'View Attachment' : 'No Attachment'}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
