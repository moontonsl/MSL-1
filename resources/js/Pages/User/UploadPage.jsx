import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import UserStateLayout from "@/Layouts/UserStateLayout.jsx";
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

const UploadPage = () => {
    const { user } = usePage().props;
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please select a valid file type (JPEG, PNG, GIF, or PDF)');
                setFile(null);
                return;
            }
            
            // Validate file size (2MB limit)
            if (selectedFile.size > 2 * 1024 * 1024) {
                setError('File size must be less than 2MB');
                setFile(null);
                return;
            }
            
            setFile(selectedFile);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('proofOfEnrollment', file);
        formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');

        try {
            const response = await fetch('/api/user/upload-proof', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Document uploaded successfully! Redirecting to waiting page...');
                setFile(null);
                // Reset file input
                const fileInput = document.getElementById('file-input');
                if (fileInput) fileInput.value = '';
                
                // Redirect to waiting page after 2 seconds
                setTimeout(() => {
                    router.visit('/user/waiting');
                }, 2000);
            } else {
                console.error('Upload failed:', data);
                setError(data.error || 'Upload failed. Please try again.');
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError('');
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    };

    return (
        <UserStateLayout>
            <Head title="Upload Proof of Enrollment" />
            
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#000] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center h-20 w-20 bg-gray-500/20 rounded-2xl">
                                <img src="/MSL_LOGO.png" alt="MSL Logo" className="h-20 w-20"/>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 mt-6">
                                Account Renewal Required
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Please upload your proof of enrollment to continue
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
                            <div className="flex items-start space-x-4">
                                <AlertCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                                        Action Required
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Your account has been marked for renewal. To regain access to the MSL platform, 
                                        please upload a current proof of enrollment document.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-white/5 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Full Name</p>
                                    <p className="text-white font-medium">{user.name} {user.surname}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Username</p>
                                    <p className="text-white font-medium">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-white font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">School/Institution</p>
                                    <p className="text-white font-medium">{user.university}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">MLBB IGN</p>
                                    <p className="text-white font-medium">{user.ml_ign}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Current Status</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                        Renewal Required
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Upload Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Upload Area */}
                            <div className="bg-white/5 rounded-xl p-6 border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
                                <div className="text-center">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Upload Proof of Enrollment
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Please upload a clear image or PDF of your current proof of enrollment
                                    </p>
                                    
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('file-input').click()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    
                                    <p className="text-xs text-gray-500 mt-2">
                                        Accepted formats: JPEG, PNG, GIF, PDF (Max 2MB)
                                    </p>
                                </div>
                            </div>

                            {/* Selected File Display */}
                            {file && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            <div>
                                                <p className="text-white font-medium">{file.name}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <p className="text-red-400">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <p className="text-green-400">{success}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
                            >
                                {uploading ? 'Uploading...' : 'Submit for Review'}
                            </button>
                        </form>

                        {/* Instructions */}
                        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                                        What happens after upload?
                                    </h3>
                                    <ul className="text-gray-300 space-y-2">
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>Your document will be reviewed by our team</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>You'll receive an email notification once verified</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>You'll regain access to all MSL platform features</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserStateLayout>
    );
};

export default UploadPage; 