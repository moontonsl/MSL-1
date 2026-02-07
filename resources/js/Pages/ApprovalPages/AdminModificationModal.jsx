import React, { useState } from 'react';
import { X, Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminModificationModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [searchUsername, setSearchUsername] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Form State
    const [modificationType, setModificationType] = useState('Full Name');
    const [correctValue, setCorrectValue] = useState('');
    const [wrongValue, setWrongValue] = useState(''); // Will be pre-filled

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;

        setLoading(true);
        setError(null);
        setSearchedUser(null);

        try {
            const response = await fetch(`/api/users/lookup?username=${encodeURIComponent(searchUsername)}`);
            const data = await response.json();

            if (response.ok) {
                setSearchedUser(data);
                setStep(2);
                // Reset form fields
                setModificationType('Full Name');
                setCorrectValue('');
                // Set initial wrong value based on user data
                setWrongValue(`${data.name} ${data.surname}`.trim());
            } else {
                setError(data.error || 'User not found');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (type) => {
        setModificationType(type);
        setCorrectValue('');

        // Update wrong value based on type
        if (searchedUser) {
            if (type === 'Full Name') {
                setWrongValue(`${searchedUser.name} ${searchedUser.surname}`.trim());
            } else if (type === 'School') {
                setWrongValue(searchedUser.school || 'N/A');
            } else if (type === 'Course') {
                setWrongValue(searchedUser.course || 'N/A');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!searchedUser) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/modification-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: searchedUser.id,
                    modification_type: modificationType,
                    wrong_value: wrongValue,
                    correct_value: correctValue,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Modification successful!');
                setTimeout(() => {
                    onClose();
                    if (onSuccess) onSuccess();
                    resetState();
                }, 2000);
            } else {
                setError(data.error || 'Failed to submit modification');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setStep(1);
        setSearchUsername('');
        setSearchedUser(null);
        setError(null);
        setSuccessMessage(null);
        setModificationType('Full Name');
        setCorrectValue('');
        setWrongValue('');
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetState, 300); // Reset after animation
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"
                onClick={handleClose}
            />

            <div className="relative z-20 w-full max-w-lg bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden font-montserrat">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white">
                        {step === 1 ? 'Find User' : 'Create Modification'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {successMessage ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-green-400">
                            <CheckCircle className="w-16 h-16 mb-4" />
                            <p className="text-xl font-semibold">{successMessage}</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleSearch}>
                                    <p className="text-white/70 text-sm mb-4">
                                        Enter the exact username of the user you want to modify.
                                    </p>
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchUsername}
                                                onChange={(e) => setSearchUsername(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#F2C21A] transition-colors"
                                                placeholder="e.g. user123"
                                                autoFocus
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading || !searchUsername.trim()}
                                            className="flex items-center gap-2 bg-[#F2C21A] text-black font-semibold rounded-lg px-6 py-2.5 hover:bg-[#d4a817] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Search User
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {/* User Info (Read-Only) */}
                                    <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-[#F2C21A]/20 flex items-center justify-center text-[#F2C21A] font-bold">
                                                {searchedUser?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">{searchedUser?.name} {searchedUser?.surname}</div>
                                                <div className="text-white/50 text-xs">@{searchedUser?.username}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                                            <div>
                                                <span className="text-white/40 block">School</span>
                                                <span className="text-white/80">{searchedUser?.school || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40 block">Course</span>
                                                <span className="text-white/80">{searchedUser?.course || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                Modification Type
                                            </label>
                                            <select
                                                value={modificationType}
                                                onChange={(e) => handleTypeChange(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F2C21A]"
                                            >
                                                <option value="Full Name" className="text-black">Full Name</option>
                                                <option value="School" className="text-black">School</option>
                                                <option value="Course" className="text-black">Course</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                Current Value (Wrong)
                                            </label>
                                            <input
                                                type="text"
                                                value={wrongValue}
                                                readOnly
                                                className="w-full bg-black/20 border border-white/5 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                New Value (Correct)
                                            </label>
                                            <input
                                                type="text"
                                                value={correctValue}
                                                onChange={(e) => setCorrectValue(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#F2C21A]"
                                                placeholder={`Enter new ${modificationType.toLowerCase()}`}
                                                required
                                            />
                                            {modificationType === 'School' && (
                                                <p className="text-yellow-500/80 text-xs mt-1">
                                                    Note: Please enter the exact registered school name.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-white/60 hover:text-white px-4 py-2 text-sm transition-colors"
                                        >
                                            Back to Search
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !correctValue.trim()}
                                            className="flex items-center gap-2 bg-[#F2C21A] text-black font-semibold rounded-lg px-6 py-2.5 hover:bg-[#d4a817] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Apply Changes
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
