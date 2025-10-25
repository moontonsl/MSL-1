import { useState, useEffect, useMemo, useRef } from "react";
import { AlertTriangle, Search, X } from "lucide-react";
import { router } from "@inertiajs/react";
import MSLModal from "@/Components/MSLModal.jsx";

// Debounce function
function debounce(func, delay) {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const AccountModificationModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [modificationType, setModificationType] = useState("");
    const [wrongFirstName, setWrongFirstName] = useState("");
    const [wrongLastName, setWrongLastName] = useState("");
    const [correctFirstName, setCorrectFirstName] = useState("");
    const [correctLastName, setCorrectLastName] = useState("");
    const [wrongValue, setWrongValue] = useState("");
    const [correctValue, setCorrectValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // School and Course dropdown states
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [activeSchoolField, setActiveSchoolField] = useState(null); // 'wrong' or 'correct'
    const [showMSLModal, setShowMSLModal] = useState(false);
    const [modalData, setModalData] = useState({});

    // Caching and debounced search for schools
    const schoolCache = useRef({});
    const courseCache = useRef({});
    
    const debouncedSchoolSearch = useMemo(() =>
        debounce(async (value) => {
            if (schoolCache.current[value]) {
                setFilteredSchools(schoolCache.current[value]);
                return;
            }
            try {
                const response = await fetch(`/schools/search?query=${encodeURIComponent(value)}`);
                const schools = await response.json();
                schoolCache.current[value] = schools;
                setFilteredSchools(schools);
            } catch (error) {
                console.error("Error fetching schools", error);
            }
        }, 300), []
    );

    const debouncedCourseSearch = useMemo(() =>
        debounce(async (value) => {
            if (courseCache.current[value]) {
                setFilteredCourses(courseCache.current[value]);
                return;
            }
            try {
                const response = await fetch(`/api/courses/search?query=${encodeURIComponent(value)}`);
                const courses = await response.json();
                courseCache.current[value] = courses;
                setFilteredCourses(courses);
            } catch (error) {
                console.error("Error fetching courses", error);
            }
        }, 300), []
    );

    // Search users when username changes
    useEffect(() => {
        const searchUsers = async () => {
            if (username.length < 2) {
                setUserSearchResults([]);
                setShowSearchResults(false);
                return;
            }

            // Clear selected user if user is typing something different
            if (selectedUser && username !== `${selectedUser.name} ${selectedUser.surname} (${selectedUser.username})`) {
                setSelectedUser(null);
                setWrongFirstName("");
                setWrongLastName("");
                setWrongValue("");
                setCorrectFirstName("");
                setCorrectLastName("");
                setCorrectValue("");
            }

            setIsSearching(true);
            try {
                const response = await fetch(`/api/users/search?search=${encodeURIComponent(username)}`);
                const users = await response.json();
                setUserSearchResults(users);
                setShowSearchResults(true);
            } catch (error) {
                console.error('Error searching users:', error);
                setUserSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [username, selectedUser]);

    // Reset dropdown states when modal opens or modification type changes
    useEffect(() => {
        if (isOpen) {
            setShowSchoolDropdown(false);
            setShowCourseDropdown(false);
            setActiveSchoolField(null);
            setFilteredSchools([]);
            setFilteredCourses([]);
        }
    }, [isOpen, modificationType]);

    if (!isOpen) return null;

    const resetForm = () => {
        setUsername("");
        setSelectedUser(null);
        setUserSearchResults([]);
        setShowSearchResults(false);
        setModificationType("");
        setWrongFirstName("");
        setWrongLastName("");
        setCorrectFirstName("");
        setCorrectLastName("");
        setWrongValue("");
        setCorrectValue("");
    };

    // School and Course handlers
    const handleSchoolChange = (e) => {
        const value = e.target.value;
        setWrongValue(value);
        setActiveSchoolField('wrong');
        
        if (value.trim() === "") {
            setFilteredSchools([]);
            setShowSchoolDropdown(false);
            return;
        }
        
        setShowSchoolDropdown(true);
        debouncedSchoolSearch(value);
    };

    const handleCorrectSchoolChange = (e) => {
        const value = e.target.value;
        setCorrectValue(value);
        setActiveSchoolField('correct');
        
        if (value.trim() === "") {
            setFilteredSchools([]);
            setShowSchoolDropdown(false);
            return;
        }
        
        setShowSchoolDropdown(true);
        debouncedSchoolSearch(value);
    };

    const handleSchoolSelect = (school) => {
        if (activeSchoolField === 'correct') {
            setCorrectValue(school.name);
        } else {
            setWrongValue(school.name);
        }
        setFilteredSchools([]);
        setShowSchoolDropdown(false);
        setActiveSchoolField(null);
    };

    const handleCourseChange = (e) => {
        const value = e.target.value;
        setCorrectValue(value);
        
        if (value.trim() === "") {
            setFilteredCourses([]);
            setShowCourseDropdown(false);
            return;
        }
        
        setShowCourseDropdown(true);
        debouncedCourseSearch(value);
    };

    const handleCourseSelect = (course) => {
        setCorrectValue(course.program);
        setFilteredCourses([]);
        setShowCourseDropdown(false);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setUsername(`${user.name} ${user.surname} (${user.username})`);
        setShowSearchResults(false);
        
        // Auto-fill wrong values based on modification type
        if (modificationType === "Full Name") {
            setWrongFirstName(user.name);
            setWrongLastName(user.surname);
        } else if (modificationType === "School") {
            setWrongValue(user.university || "");
        } else if (modificationType === "Course") {
            setWrongValue(user.course || "");
        }
    };

    const handleModificationTypeChange = (type) => {
        setModificationType(type);
        
        // Reset all values
        setWrongFirstName("");
        setWrongLastName("");
        setCorrectFirstName("");
        setCorrectLastName("");
        setWrongValue("");
        setCorrectValue("");
        
        // Auto-fill wrong values if user is selected
        if (selectedUser) {
            if (type === "Full Name") {
                setWrongFirstName(selectedUser.name);
                setWrongLastName(selectedUser.surname);
            } else if (type === "School") {
                setWrongValue(selectedUser.university || "");
            } else if (type === "Course") {
                setWrongValue(selectedUser.course || "");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedUser) {
            setModalData({
                title: 'Validation Error',
                message: 'Please select a user first',
                type: 'warning',
                confirmText: 'OK',
                showCancel: false,
                onConfirm: () => setShowMSLModal(false)
            });
            setShowMSLModal(true);
            return;
        }

        if (!modificationType) {
            setModalData({
                title: 'Validation Error',
                message: 'Please select a modification type',
                type: 'warning',
                confirmText: 'OK',
                showCancel: false,
                onConfirm: () => setShowMSLModal(false)
            });
            setShowMSLModal(true);
            return;
        }

        setIsSubmitting(true);

        try {
            let wrongValue, correctValue;

            if (modificationType === "Full Name") {
                if (!correctFirstName || !correctLastName) {
                    setModalData({
                        title: 'Validation Error',
                        message: 'Please enter both correct first and last name',
                        type: 'warning',
                        confirmText: 'OK',
                        showCancel: false,
                        onConfirm: () => setShowMSLModal(false)
                    });
                    setShowMSLModal(true);
                    return;
                }
                wrongValue = `${wrongFirstName} ${wrongLastName}`;
                correctValue = `${correctFirstName} ${correctLastName}`;
            } else {
                // Get the current values from the form inputs instead of state
                const wrongInput = document.querySelector('input[placeholder*="wrong"]');
                const correctInput = document.querySelector('input[placeholder*="correct"]');
                const currentWrongValue = wrongInput ? wrongInput.value : wrongValue;
                const currentCorrectValue = correctInput ? correctInput.value : correctValue;
                
                if (!currentCorrectValue || currentCorrectValue.trim() === '') {
                    setModalData({
                        title: 'Validation Error',
                        message: `Please enter the correct ${modificationType.toLowerCase()}`,
                        type: 'warning',
                        confirmText: 'OK',
                        showCancel: false,
                        onConfirm: () => setShowMSLModal(false)
                    });
                    setShowMSLModal(true);
                    return;
                }
                
                // Use the current input values for submission
                wrongValue = currentWrongValue;
                correctValue = currentCorrectValue;
            }

            const response = await fetch('/api/modification-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    user_id: selectedUser.id,
                    modification_type: modificationType,
                    wrong_value: wrongValue,
                    correct_value: correctValue,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setModalData({
                    title: 'Success',
                    message: 'Modification request submitted successfully!',
                    type: 'success',
                    confirmText: 'OK',
                    showCancel: false,
                    onConfirm: () => {
                        setShowMSLModal(false);
                        resetForm();
                        onClose();
                        window.location.reload();
                    }
                });
                setShowMSLModal(true);
            } else {
                setModalData({
                    title: 'Error',
                    message: 'Error submitting request: ' + (data.error || 'Unknown error'),
                    type: 'error',
                    confirmText: 'OK',
                    showCancel: false,
                    onConfirm: () => setShowMSLModal(false)
                });
                setShowMSLModal(true);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            setModalData({
                title: 'Error',
                message: 'Error submitting request. Please try again.',
                type: 'error',
                confirmText: 'OK',
                showCancel: false,
                onConfirm: () => setShowMSLModal(false)
            });
            setShowMSLModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
            resetForm();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-lg mx-4 border border-[#242424] shadow-lg backdrop-blur-[10px] max-h-[90vh] overflow-y-auto msl-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                            <AlertTriangle className="w-6 h-6 text-[#facc15]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            MSL Account Modification Request Form
                        </h3>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-gray-300 mb-4 text-sm">
                    Make sure that the username is correct for you to receive an email after action is made on the modification request.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    
                    {/* Username Search */}
                    <div className="relative">
                        <label className="block text-gray-300 mb-1">
                            MSL Account Username
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                placeholder="Search by username, name, or email..."
                                required
                            />
                            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                        
                        {/* Search Results Dropdown */}
                        {showSearchResults && !selectedUser && (
                            <div className="absolute z-10 w-full mt-1 bg-[rgba(15,15,15,0.95)] border border-[#FACC15]/30 rounded-lg shadow-2xl max-h-48 overflow-y-auto backdrop-blur-sm msl-scrollbar">
                                {isSearching ? (
                                    <div className="p-3 text-center">
                                        <div className="inline-flex items-center gap-2 text-[#FACC15]">
                                            <div className="w-3 h-3 border-2 border-[#FACC15] border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm">Searching...</span>
                                        </div>
                                    </div>
                                ) : userSearchResults.length > 0 ? (
                                    userSearchResults.map((user, index) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleUserSelect(user)}
                                            className="w-full px-3 py-2 text-left text-white hover:bg-[rgba(250,204,21,0.1)] transition-colors border-b border-[rgba(250,204,21,0.1)] last:border-b-0"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-gradient-to-br from-[#FACC15] to-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xs">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-white text-sm">
                                                        {user.name} {user.surname}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        @{user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-gray-400 text-sm">
                                        No users found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected User Info */}
                    {selectedUser && (
                        <div className="p-3 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md">
                            <div className="text-green-400 text-sm font-medium">Selected User:</div>
                            <div className="text-white">{selectedUser.name} {selectedUser.surname}</div>
                            <div className="text-gray-400 text-xs">@{selectedUser.username} • {selectedUser.university}</div>
                        </div>
                    )}

                    {/* Modification Type */}
                    <div>
                        <label className="block text-gray-300 mb-1">
                            What modifications do you want to apply?
                        </label>
                        <select
                            value={modificationType}
                            required
                            onChange={(e) => handleModificationTypeChange(e.target.value)}
                            className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                        >
                            <option value="" disabled>Select</option>
                            <option value="Full Name">Full Name</option>
                            <option value="School">School</option>
                            <option value="Course">Course</option>
                        </select>
                    </div>

                    {/* Full Name Fields */}
                    {modificationType === "Full Name" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 mb-1">Wrong First Name</label>
                                <input
                                    type="text"
                                    value={wrongFirstName}
                                    onChange={(e) => setWrongFirstName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter wrong first name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Wrong Last Name</label>
                                <input
                                    type="text"
                                    value={wrongLastName}
                                    onChange={(e) => setWrongLastName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter wrong last name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Correct First Name</label>
                                <input
                                    type="text"
                                    value={correctFirstName}
                                    onChange={(e) => setCorrectFirstName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter correct first name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Correct Last Name</label>
                                <input
                                    type="text"
                                    value={correctLastName}
                                    onChange={(e) => setCorrectLastName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder="Enter correct last name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* School/Course Fields */}
                    {(modificationType === "School" || modificationType === "Course") && (
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-gray-300 mb-1">Wrong {modificationType}</label>
                                <input
                                    type="text"
                                    value={wrongValue}
                                    onChange={modificationType === "School" ? handleSchoolChange : (e) => setWrongValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder={`Enter wrong ${modificationType.toLowerCase()}`}
                                    required
                                />
                                {modificationType === "School" && showSchoolDropdown && activeSchoolField === 'wrong' && wrongValue.trim() !== "" && (
                                    <div className="absolute z-10 w-full mt-1 bg-[rgba(15,15,15,0.95)] border border-[#FACC15]/30 rounded-lg shadow-2xl max-h-48 overflow-y-auto backdrop-blur-sm msl-scrollbar">
                                        {filteredSchools.length > 0 ? (
                                            filteredSchools.map((school) => (
                                                <button
                                                    key={school.id}
                                                    type="button"
                                                    onClick={() => handleSchoolSelect(school)}
                                                    className="w-full px-3 py-2 text-left text-white hover:bg-[rgba(250,204,21,0.1)] transition-colors border-b border-[rgba(250,204,21,0.1)] last:border-b-0"
                                                >
                                                    <div className="font-medium text-sm">{school.name}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-gray-400 text-sm">
                                                No schools found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-300 mb-1">Correct {modificationType}</label>
                                <input
                                    type="text"
                                    value={correctValue}
                                    onChange={modificationType === "Course" ? handleCourseChange : modificationType === "School" ? handleCorrectSchoolChange : (e) => setCorrectValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                                    placeholder={`Enter correct ${modificationType.toLowerCase()}`}
                                    required
                                />
                                {modificationType === "School" && showSchoolDropdown && activeSchoolField === 'correct' && correctValue.trim() !== "" && (
                                    <div className="absolute z-10 w-full mt-1 bg-[rgba(15,15,15,0.95)] border border-[#FACC15]/30 rounded-lg shadow-2xl max-h-48 overflow-y-auto backdrop-blur-sm msl-scrollbar">
                                        {filteredSchools.length > 0 ? (
                                            filteredSchools.map((school) => (
                                                <button
                                                    key={school.id}
                                                    type="button"
                                                    onClick={() => handleSchoolSelect(school)}
                                                    className="w-full px-3 py-2 text-left text-white hover:bg-[rgba(250,204,21,0.1)] transition-colors border-b border-[rgba(250,204,21,0.1)] last:border-b-0"
                                                >
                                                    <div className="font-medium text-sm">{school.name}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-gray-400 text-sm">
                                                No schools found
                                            </div>
                                        )}
                                    </div>
                                )}
                                {modificationType === "Course" && showCourseDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-[rgba(15,15,15,0.95)] border border-[#FACC15]/30 rounded-lg shadow-2xl max-h-48 overflow-y-auto backdrop-blur-sm msl-scrollbar">
                                        {filteredCourses.length > 0 ? (
                                            filteredCourses.map((course) => (
                                                <button
                                                    key={course.id}
                                                    type="button"
                                                    onClick={() => handleCourseSelect(course)}
                                                    className="w-full px-3 py-2 text-left text-white hover:bg-[rgba(250,204,21,0.1)] transition-colors border-b border-[rgba(250,204,21,0.1)] last:border-b-0"
                                                >
                                                    <div className="font-medium text-sm">{course.program}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-gray-400 text-sm">
                                                No courses found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#facc15] text-black rounded-md hover:bg-[#e6b800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
            
            <MSLModal
                isOpen={showMSLModal}
                onClose={() => setShowMSLModal(false)}
                {...modalData}
            />
        </div>
    );
};

export default AccountModificationModal;