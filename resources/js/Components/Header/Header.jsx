import { useState, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu, Trash2, AlertTriangle } from 'lucide-react';
import styles from './Header.module.scss';
import { MdAccountCircle } from "react-icons/md";
import AccountModificationModal from "./AccountModificationModal";



// Navigation links array (only main nav links)
const navLinks = [
    { name: 'Events', href: '/Events' },
    { name: 'Program', href: '/Programs' },
    { name: 'Resources', href: '/soon' },
    { name: 'News', href: '/news' },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
    const [deletePassword, setDeletePassword] = useState(''); // State for password input
    const [deleteError, setDeleteError] = useState(''); // State for delete errors

    const [showModificationModal, setShowModificationModal] = useState(false);//For the Account Modification Modal
    
    const { auth } = usePage().props;
    const user = auth.user;
    const passwordInputRef = useRef(null);

    // Click handler for the account icon
    const handleAccountIconClick = (e) => {
        // Prevent Inertia.js from trying to navigate if user is logged in
        // and we want to open the dropdown instead.
        if (user) {
            e.preventDefault(); // Stop the default Link behavior (navigation)
            setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
        } else {
            // If not logged in, the Link href="/login" will handle navigation
            // and we still want to close the mobile menu if it's open.
            setIsMenuOpen(false);
        }
    };

    const handleLogout = () => {
        console.log("Attempting to log out...");

        // Close the dropdown immediately for better UX
        setIsDropdownOpen(false);

        // This is the crucial change:
        // Send a POST request to your backend's logout route.
        // Assuming your backend has a route like `/logout` that invalidates the session.
        router.post('/logout', {}, { // The second argument is data, which is empty for a simple logout
            onSuccess: () => {
                console.log("Successfully logged out (server-side). Redirected to login.");
                // Inertia.js automatically handles redirection after a successful logout,
                // typically to the login page if configured in your backend.
            },
            onError: (errors) => {
                console.error("Logout error:", errors);
                // Handle any errors during logout (e.g., network issues)
            },
            onFinish: () => {
                // This will always run after the request is finished, regardless of success or failure.
                console.log("Logout request finished.");
            },
            replace: true, // Replace the current history entry so user can't go back to a 'logged in' state
        });
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
        setIsDropdownOpen(false); // Close dropdown when opening modal
        setDeletePassword(''); // Reset password field
        setDeleteError(''); // Reset any previous errors
        // Focus password input after modal opens
        setTimeout(() => passwordInputRef.current?.focus(), 100);
    };

    const confirmDeleteAccount = () => {
        if (!deletePassword.trim()) {
            setDeleteError('Password is required');
            passwordInputRef.current?.focus();
            return;
        }

        setDeleteError(''); // Clear any previous errors

        // Close modal and redirect to delete account route
        setShowDeleteModal(false);
        
        console.log("Sending delete account request...");
        
        // Show success modal immediately after password validation
        // This ensures it shows before any server redirect
        setShowSuccessModal(true);
        
        // Use fetch API instead of Inertia router to have full control
        fetch('/profile', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ password: deletePassword }),
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Account deleted successfully", data);
            // Success modal is already showing
            // Force logout and redirect after a short delay
            setTimeout(() => {
                // Force logout by clearing any stored auth data
                localStorage.clear();
                sessionStorage.clear();
                // Redirect to login page
                window.location.href = '/login';
            }, 2000); // Give user 2 seconds to read success message
        })
        .catch(error => {
            console.error("Delete account error:", error);
            // Hide success modal and show error
            setShowSuccessModal(false);
            setShowDeleteModal(true);
            setDeleteError('Failed to delete account. Please try again.');
        });
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletePassword('');
        setDeleteError('');
    };

    const handleSuccessOkay = () => {
        setShowSuccessModal(false);
        console.log("Success modal closed, redirecting to login...");
        
        // Use a more direct approach to ensure redirect works
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    };

    return (
        <header className={`${styles.header} text-white`}>
            <div className={styles.container}>

                <div className={styles.menuButtons}>
                    {/* Menu button for mobile view */}
                    <button
                        className={styles.menuButton}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-expanded={isMenuOpen}
                        aria-controls="main-navigation"
                    >
                        <Menu size={24} />
                    </button>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/msl-logo.png" alt="MSL Logo" />
                        </Link>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav
                    id="main-navigation"
                    className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}
                >
                    <ul className={`${styles.navList} uppercase sm:text-sm`}>
                        {navLinks.map(({ name, href }) => (
                            <li key={name}>
                                <Link
                                    href={href}
                                    onClick={() => {
                                        setIsMenuOpen(false); // Close mobile menu
                                        setIsDropdownOpen(false); // Close dropdown if open
                                    }}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Account/Login Icon and Dropdown */}
                <div className={styles.authIcon}>
                    <div className={styles.accountContainer}> {/* Wrapper for positioning dropdown */}
                        <Link
                            // Use href="/login" if not logged in. If logged in, use '#' and prevent default.
                            href={user ? "#" : "/login"}
                            className={user ? styles.headerAuth : styles.signInIcon}
                            onClick={handleAccountIconClick} // New handler for icon click
                            // Optional: If you strictly want no navigation and only onClick, use as="button"
                            // as={user ? "button" : "a"}
                        >
                            {/* Make icon bigger */}
                            <MdAccountCircle size={40} />
                        </Link>

                        {user && isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link
                                    href="/studentportal"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsDropdownOpen(false)} 
                                >
                                    Profile
                                </Link>
                                {(user.role === 'SL' || user.role === 'Super Admin' || user.role === 'Regional Admin') && (
                                    <Link
                                        href="/sl-admin"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        SL Admin
                                    </Link>
                                )}
                                {/* {user.role === 'Super Admin' && (
                                    <Link
                                        href="/admin/user-regions"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        User Regions
                                    </Link>
                                )} */}
                                {/* <button
                                    onClick={() => {
                                        setShowModificationModal(true);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={styles.dropdownItem}
                                    >
                                    Modify Account
                                </button> */}
                                <button
                                    onClick={handleDeleteAccount}
                                    className={`${styles.dropdownItem} text-red-500 hover:text-red-400`}
                                >
                                    Delete Account
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={styles.dropdownItem}
                                >
                                    Log out 
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-md mx-4 border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                                <AlertTriangle className="w-6 h-6 text-[#facc15]" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Delete Account
                            </h3>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                        </p>
                        
                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Enter your password to confirm
                            </label>
                            <input
                                ref={passwordInputRef}
                                type="password"
                                id="deletePassword"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all duration-200"
                                placeholder="Enter your password"
                                onKeyPress={(e) => e.key === 'Enter' && confirmDeleteAccount()}
                            />
                            {deleteError && (
                                <p className="text-red-400 text-sm mt-1">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-gray-300 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md hover:bg-[rgba(20,20,20,0.8)] hover:border-[#facc15] transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="px-4 py-2 text-black bg-[#facc15] rounded-md hover:bg-[#e0b90f] transition-all duration-200 flex items-center space-x-2 border border-[#facc15] hover:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-md mx-4 border border-[#facc15] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[rgba(250,204,21,0.2)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                                <div className="w-6 h-6 text-[#facc15] text-2xl font-bold">✓</div>
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Account Deleted Successfully
                            </h3>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Your account has been permanently deleted. You will be redirected to the login page.
                        </p>
                        
                        <div className="flex justify-center">
                            <button
                                onClick={handleSuccessOkay}
                                className="px-6 py-2 text-black bg-[#facc15] rounded-md hover:bg-[#e0b90f] transition-all duration-200 border border-[#facc15] hover:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}

             {/* Modify Account Modal */}
            {showModificationModal && (
            <AccountModificationModal
                isOpen={showModificationModal}
                onClose={() => setShowModificationModal(false)}
            />
            )}
        </header>
    );
};

export default Header;