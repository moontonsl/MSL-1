import styles from "./register.module.scss";
import {BadgeCheck} from 'lucide-react';

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, usePage } from '@inertiajs/react';

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

import Step1BasicDetails2 from './components/Step1BasicDetails2.jsx';
import Step2EducationDetails2 from './components/Step2EducationDetails2.jsx';
import Step3GameDetails2 from './components/Step3GameDetails2.jsx';
import Step4AccountCredentials from './components/Step4AccountCredentials.jsx';


const initialFormData = {
    // Step 1
    firstName: '', lastName: '', suffix: '', birthday: '', age: 0, gender: '', contactNo: '', facebookLink: '',
    // Step 2
    yearLevel: '', university: '', island: '', region: '', studentId: '', course: '', proofOfEnrollment: null,
    // Step 3
    userId: '', serverId: '', ign: '', squadName: '', squadAbbreviation: '', rank: '', inGameRole: '', mainHero: '',
    // Step 4
    username: '', password: '', confirmPassword: '', email: '', captcha: ''
};

const fileTypeIsValid = (file, allowedTypes) =>
    file && allowedTypes.includes(file.type);

const Register = () => {
    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));

        // setData(prev => ({
        //     ...prev,
        //     [name]: type === 'file' ? files[0] : value
        // }));
        setData(formData);
    };

    const handleNext = () => {
        if (!isFormValid(currentStep)) return;
        setErrorMessage("");
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handlePrev = () => {
        setErrorMessage("");
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid(currentStep)) return;
        setErrorMessage("");
        // console.log(data);
        // setData(formData);

        post(route('register'), {
            onStart: () => {
                console.log("Starting registration...");
                setErrorMessage(""); // Clear any previous errors
            },
            onSuccess: (response) => {
                console.log("Registration successful:", response);
                setErrorMessage("");
                // Reset form data to initial state
                reset();
                // Reset to first step
                setCurrentStep(1);
                // Optional: Show success message
                alert("Account created successfully!");
                // Optional: Redirect
                // window.location.href = '/login';
            },
            onError: (errors) => {
                console.error("Registration failed:", errors);

                // Handle validation errors
                if (errors) {
                    // If there are specific field errors
                    const errorMessages = Object.values(errors).flat();
                    setErrorMessage(`⚠️ ${errorMessages.join(', ')}`);

                    // Or handle specific errors
                    if (errors.email) {
                        setErrorMessage(`⚠️ Email: Email has already been taken.`);
                    } else if (errors.username) {
                        setErrorMessage(`⚠️ Username: Username has already been taken.`);
                    }else if (errors.userId) {
                        setErrorMessage(`⚠️ ML Account: The ML Account has already been taken.`);
                    } else {
                        setErrorMessage("⚠️ Please check your information and try again.");
                    }
                }
            },
            onFinish: () => {
                console.log("Request finished (success or error)");
                // reset('password', 'confirmPassword'); // Clear sensitive fields
            },
            preserveScroll: true, // Keep scroll position
            preserveState: true,  // Keep form state on errors
        });
        // Optionally reset form or redirect here

        setFormData(initialFormData);

        setCurrentStep(1);
    };

    function isFormValid(step) {
        const requireFields = (fields) =>
            fields.every(f => (formData[f] && formData[f].toString().trim() !== ""));

        switch (step) {
            case 1:
                if (!requireFields(['firstName', 'lastName', 'gender', 'birthday', 'age', 'contactNo', 'facebookLink'])) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                break;
            case 2: {
                const required = ['yearLevel', 'university', 'island', 'region', 'studentId', 'course', 'proofOfEnrollment'];
                if (!requireFields(required)) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
                if (!fileTypeIsValid(formData.proofOfEnrollment, allowedTypes)) {
                    setErrorMessage("⚠️ File must be an image (jpg, jpeg, png) or PDF.");
                    return false;
                }
                break;
            }
            case 3: {
                const required = ['userId', 'serverId', 'rank', 'inGameRole', 'mainHero'];
                if (!requireFields(required)) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                break;
            }
            case 4: {
                const { username, password, confirmPassword, email, captcha } = formData;
                if (!requireFields(['username', 'password', 'confirmPassword', 'email', 'captcha'])) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                if (password.length < 8) {
                    setErrorMessage("⚠️ Password must be at least 8 characters.");
                    return false;
                }
                if (password !== confirmPassword) {
                    setErrorMessage("⚠️ Passwords do not match.");
                    return false;
                }
                if (captcha != verificationCode) {
                    console.log(verificationCode);
                    setErrorMessage("⚠️ Incorrect code.");
                    return false;
                }
                break;
            }
            default:
                setErrorMessage("⚠️ Invalid step.");
                return false;
        }
        setErrorMessage("");
        return true;
    }

    const stepProps = {
        formData,
        handleInputChange,
        errorMessage,
        setErrorMessage,
        handleSubmit,
        verificationCode,
        setVerificationCode
    };

    const stepComponents = {
        1: <Step1BasicDetails2 {...stepProps} />,
        2: <Step2EducationDetails2 {...stepProps} />,
        3: <Step3GameDetails2 {...stepProps} />,
        4: <Step4AccountCredentials {...stepProps} />
    };

    return (
        <>
        <Head title="Register Account" />
            <AuthenticatedLayout>
                    <div className={`w-full max-w-[400px] mx-auto py-10 px-6 my-10 bg-[rgba(10,10,10,0.5)] rounded-[15px_15px_15px_15px] md:rounded-[15px_15px_15px_15px] border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] flex flex-col justify-center items-start transition-all duration-300 ease-in-out overflow-hidden ${errorMessage ? 'rounded-2xl' : ''} md:max-w-[758px] md:min-h-[850px] md:py-12 md:px-12`}>
                    <form onSubmit={handleSubmit} className="form-register w-full">
                        {stepComponents[currentStep]}

                        {errorMessage && (
                        <div className="bg-[#ffdddd] border-l-6 border-l-[#f44336] p-4 mt-4 mb-4 text-red-700 font-medium rounded-md w-full animate-fadeIn">
                            <p>{errorMessage}</p>
                        </div>
                        )}

                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 mb-6">
                        {currentStep > 1 && (
                            <button
                            type="button"
                            onClick={handlePrev}
                            className="bg-[#2c2c2c] text-white text-white py-3 px-6 w-full md:w-2/5 rounded-md text-base cursor-pointer hover:bg-yellow-500 transition-all duration-200"
                            >
                            Prev
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button
                            type="button"
                            onClick={handleNext}
                            className="bg-[#2c2c2c] text-white text-white py-3 px-6 w-full md:w-2/5 rounded-md text-base cursor-pointer hover:bg-yellow-500 transition-all duration-200"
                            >
                            Next
                            </button>
                        ) : (
                            <button
                            type="submit"
                            className="bg-[#2c2c2c] text-white text-white py-3 px-6 w-full md:w-2/5 rounded-md text-base cursor-pointer hover:bg-yellow-500 transition-all duration-200"
                            >
                            Submit
                            </button>
                        )}
                        </div>

                        <div className="mt-4 flex justify-center items-center text-center">
                        <p className="text-white">
                            Already have an account?&nbsp;
                            <a href="/login" className="text-yellow-400 hover:underline">
                            Login here
                            </a>
                        </p>
                        </div>
                    </form>
                    </div>

            </AuthenticatedLayout>
        </>
        )
    }

export default Register;


