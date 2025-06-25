import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import styles from './login.module.scss';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'react-feather';
import axios from 'axios';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
const Login = () => {
    const { post, data, setData } = useForm({
    username: '',
    password: '',
    remember: false,
});

const [formData, setFormData] = useState({
username: '',
password: '',
});
const [passwordVisible, setPasswordVisible] = useState(false);
const [error, setError] = useState('');

const [showLoginForm, setShowLoginForm] = useState(false);
const [showMLBBModal, setShowMLBBModal] = useState(false);

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({
    ...prev,
    [name]: value,
}));

setData({
    ...data,
    [name]: value,
});
setError(''); // Clear error on input change

};

const handleSubmit = (e) => {
e.preventDefault();
if (!formData.username || !formData.password) {
    setError('⚠️Please enter account details.');
    return;
}
post(route('login'), {
    onFinish: () => reset('password'),
    onError: (errors) => {
        // errors is an object with validation or custom error messages from the backend
        // For example: { username: "The username field is required." }
        // Or: { message: "The provided credentials do not match our records." }
        if (errors.message) {
            setError(errors.message); // Show custom error
        } else if (errors.username || errors.password) {
            setError(errors.username || errors.password); // Show validation error
        } else {
            setError('⚠️ Wrong username or password.');
        }
    },
});
// Simulate login error for demonstration
// if (formData.username !== 'admin' || formData.password !== 'admin') {
//   setError('⚠️Wrong username or password.');
//   return;
setError('');
console.log(formData);
};
    // Main "choose login" state
    if (!showLoginForm && !showMLBBModal) {
        return (
            <AuthenticatedLayout>
            <Head title="Log in MSL Account" />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
                <div className="login-wrapper w-full max-w-sm mx-auto flex flex-col md:flex-row items-start md:items-stretch justify-center gap-0 m-0 p-0 h-auto md:max-w-full">
                    {/* Login Container */}
                <div className="login-container-login w-full h-auto p-6 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_0_0] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start md:w-[500px] md:h-full md:p-12 md:rounded-[15px_0_0_15px]">
                    <div className="choose-login-container p-0 flex flex-col items-stretch min-w-[unset] max-w-[unset] md:min-w-[340px] md:max-w-[400px]">
                        <h2 className={`${styles['choose-login-title']} text-[#ffffff] text-xl font-bold mb-6 leading-tight w-full md:text-2xl md:mb-8`}>
                            Where Student Gamers Become Campus Legends.
                        </h2>
                        <button
                            className="choose-login-btn flex items-center justify-start bg-gradient-to-r from-[#232323] from-60% to-[#232323cc] border border-[#444] rounded-lg text-white w-full text-sm font-medium py-3 px-4 mb-3 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-center last:mb-0 hover:bg-gradient-to-r hover:from-[#e0b90f] hover:from-60% hover:to-[#ffe066] hover:border-[#e0b90f] hover:text-[#232323] md:text-base md:py-3.5 md:px-5 md:mb-4"
                            onClick={() => setShowLoginForm(true)}
                        >
                            <span className="choose-login-btn-icon flex items-center mr-4 md:mr-5">
                                <img src="/android-chrome-192x192.png" alt="MSL" className="w-[30px] h-[30px] rounded-[6px] md:w-[35px] md:h-[35px]" />
                            </span>
                            <span className='md:text-[1.1rem]'>SIGN IN WITH MSL ACCOUNT</span>
                        </button>
                        <button
                            className="choose-login-btn flex items-center justify-start bg-gradient-to-r from-[#232323] from-60% to-[#232323cc] border border-[#444] rounded-lg text-white w-full text-sm font-medium py-3 px-4 mb-3 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-center last:mb-0 hover:bg-gradient-to-r hover:from-[#e0b90f] hover:from-60% hover:to-[#ffe066] hover:border-[#e0b90f] hover:text-[#232323] md:text-base md:py-3.5 md:px-5 md:mb-4"
                            onClick={() => setShowMLBBModal(true)}
                        >
                            <span className="choose-login-btn-icon flex items-center mr-4 md:mr-5">
                                {/* Changed img src to placeholder for demonstration */}
                                <img src="/images/Student Portal/mlbbiconlogin.png" alt="MLBB" className="w-[30px] h-[30px] rounded-[6px] md:w-[35px] md:h-[35px]" />
                            </span>
                            <span className='md:text-[1.1rem]'>SIGN IN WITH MLBB ACCOUNT</span>
                        </button>
                        <button
                            className="choose-login-btn flex items-center justify-start bg-gradient-to-r from-[#232323] from-60% to-[#232323cc] border border-[#444] rounded-lg text-white w-full text-sm font-medium py-3 px-4 mb-0 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-center last:mb-0 hover:bg-gradient-to-r hover:from-[#e0b90f] hover:from-60% hover:to-[#ffe066] hover:border-[#e0b90f] hover:text-[#232323] md:text-base md:py-3.5 md:px-5 md:mb-4"
                            onClick={() => window.location.href = '/register'}
                        >
                            <span className="choose-login-btn-icon flex items-center mr-4 md:mr-5">
                                <svg width="30" height="30" fill="none" viewBox="0 0 24 24"><path d="M12 12v6m0 0v-6m0 6H6m6 0h6M6 6h12M6 6v12M6 6H3m3 0h12m0 0v12m0-12h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            <span className='md:text-[1.1rem]'>CREATE AN ACCOUNT</span>
                        </button>
                    </div>
                </div>

                {/* Video Container */}
                <div className="video-container-login relative flex items-stretch justify-center w-full md:w-[680px] bg-black rounded-[0_0_15px_15px] md:rounded-[0_15px_15px_0] overflow-hidden h-[250px] min-h-[180px] md:h-auto md:min-h-0">
                    <div className="video-foreground relative w-full h-full flex items-stretch justify-center">
                        <iframe src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                        title="MSL Video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full aspect-auto border-none bg-black block"
                        ></iframe>
                    </div>
                </div>
            </div>
            </div>
            </AuthenticatedLayout>
        );
    }

    // MLBB modal state (just a placeholder)
    if (showMLBBModal) {
    return (
        <AuthenticatedLayout>
            <Head title="Log in MSL Account" />
            <div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
            <div className="login-wrapper w-full max-w-sm mx-auto flex flex-col items-start justify-center gap-0 m-0 p-0 h-auto">
                {/* Login Container (for MLBB Account Login) */}
                <div className="login-container-login w-full h-auto p-6 bg-[rgba(10,10,10,0.5)] rounded-[15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start">
                <div className="choose-login-container p-0 flex flex-col items-stretch w-full">
                    <h2 className={`${styles['choose-login-title']} text-[#ffffff] text-xl font-bold mb-6 leading-tight text-center`}>
                    MLBB ACCOUNT LOGIN
                    </h2>
                    <div className="text-white text-center my-8">
                    This is still in progress, please wait for the next update.
                    <br />
                    <br />
                    <span className="text-[0.8rem] text-[#ccc]">
                        If you have any questions, please contact the SERP Web Dev
                    </span>
                    </div>
                    <button
                    className="choose-login-btn flex items-center justify-center bg-gradient-to-r from-[#232323] from-60% to-[#232323cc] border border-[#444] rounded-lg text-white w-full text-sm font-medium py-3 px-4 mb-0 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-center hover:bg-gradient-to-r hover:from-[#e0b90f] hover:from-60% hover:to-[#ffe066] hover:border-[#e0b90f] hover:text-[#232323]"
                    onClick={() => setShowMLBBModal(false)}
                    >
                    <span>Back</span>
                    </button>
                </div>
                </div>
            </div>
            </div>

        </AuthenticatedLayout>
        );
    }

    // Default: show the original login form
    return (
        <AuthenticatedLayout>
            <Head title="Log in MSL Account" />
<div className="min-h-screen flex items-center justify-center p-4 md:p-0 bg-transparent">
    <div className="login-wrapper w-full max-w-full flex flex-col md:flex-row items-start md:items-stretch justify-center gap-0 m-0 p-0 h-auto">
        
        {/* Login Container */}
        <div className="login-container-login w-full md:w-[500px] h-auto md:h-full p-6 md:p-12 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_0_0] md:rounded-[15px_0_0_15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start">
            <div className="choose-login-container p-0 flex flex-col items-stretch w-full max-w-[400px] mx-auto md:min-w-[340px] md:max-w-[400px]">
                <h2 className={`${styles['choose-login-title']} text-[#ffffff] text-xl font-bold mb-6 leading-tight w-full md:text-2xl md:mb-8`}>
                    Unlock your path in student esports and leadership.
                </h2>

                {/* Login Form */}
                <form className="form-login flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Username Input Group */}
                    <div className="input-group-login mb-4">
                        <label htmlFor="username" className="label-login flex flex-col items-start min-w-[300px] text-white gap-[var(--sds-size-space-200)] self-stretch">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="eg. Simeon"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border border-[#242424] rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 focus:outline-none focus:border-[#e0b90f] focus:ring-0"
                        />
                    </div>

                    {/* Password Input Group */}
                    <div className="input-group-login mb-4">
                        <label htmlFor="password" className="label-login flex flex-col items-start min-w-[300px] text-white gap-[var(--sds-size-space-200)] self-stretch">
                            Password
                        </label>
                        <div className="password-container-login relative w-full">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="input-field-login w-full text-white py-3 px-3.5 bg-[rgba(0,0,0,0.3)] border border-[#242424] rounded-lg text-base mt-1 placeholder:text-[#888] placeholder:opacity-100 pr-10 focus:outline-none focus:border-[#e0b90f] focus:ring-0"
                            />
                            <button
                                type="button"
                                className="eye-icon-login absolute right-4 top-1/2 -translate-y-1/2 text-white bg-none border-none cursor-pointer p-1"
                                onClick={() => setPasswordVisible((v) => !v)}
                                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                            >
                                {passwordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="error-message-login bg-[#ffdddd] border-l-6 border-l-[#f44336] p-3 mb-4 text-[#a94442] font-medium rounded animate-fadeIn w-full mx-auto">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Footer Container with Login Button and Links */}
                    <div className="footer-container-login flex flex-col items-center">
                        <button
                            type="submit"
                            className="login-btn-login w-full py-4 bg-[#2c2c2c] text-white rounded-lg border-none cursor-pointer transition-colors duration-300 block mx-auto text-base md:py-3"
                        >
                            Login
                        </button>
                        <p className="footer-text-login text-white text-center mt-4 text-sm">
                            <a href="/forgotpassword" className="forgot-password-link-login text-[#f1c40f] no-underline hover:underline">
                                Forgot Password
                            </a>
                            <br />
                            Don't have an account?{' '}
                            <a href="/register" className="sign-in-link-login text-[#f1c40f] no-underline hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>

        {/* Video Container */}
        <div className="video-container-login relative flex items-stretch justify-center w-full md:w-[680px] bg-black rounded-[0_0_15px_15px] md:rounded-[0_15px_15px_0] overflow-hidden h-[250px] min-h-[180px] md:h-auto md:min-h-0">
            <div className="video-foreground relative w-full h-full flex items-stretch justify-center">
                <iframe
                    src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                    title="MSL Video"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full aspect-auto border-none bg-black block"
                ></iframe>
            </div>
        </div>
    </div>
</div>

        </AuthenticatedLayout>
    );
}


export default Login;