import React, { useState } from 'react';
import '../styles/register.css';
import Step1BasicDetails from "@/pages/Accounts/components/Step1BasicDetails.jsx";
import Step2EducationDetails from "@/pages/Accounts/components/Step2EducationDetails.jsx";
import Step3GameDetails from "@/pages/Accounts/components/Step3GameDetails.jsx";
import Step4AccountCredentials from "@/pages/Accounts/components/Step4AccountCredentials.jsx";

const initialFormData = {
    // Step 1
    firstName: '', lastName: '', suffix: '', birthday: '', age: '', gender: '', contactNo: '', facebookLink: '',
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
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleNext = () => {
        if (!isFormValid(currentStep)) return;
        setErrorMessage("");
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handlePrev = () => {
        setErrorMessage(""); // Clear error when going to previous step
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid(currentStep)) return;
        setErrorMessage("");
        window.alert("Account created successfully");
        // Optionally reset form or redirect here
    };

    function isFormValid(step) {
        // Helper for required fields
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
                if (captcha !== "1234") {
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
        handleSubmit
    };

    const stepComponents = {
        1: <Step1BasicDetails {...stepProps} />,
        2: <Step2EducationDetails {...stepProps} />,
        3: <Step3GameDetails {...stepProps} />,
        4: <Step4AccountCredentials {...stepProps} />
    };

    return (
        <main>
            <div className="register-main-bg">
                <div className={
                    currentStep === 4
                        ? `form-container-register-step4${errorMessage ? ' has-error' : ''}`
                        : `form-container-register${errorMessage ? ' has-error' : ''}`
                }>
                    <form onSubmit={handleSubmit} className="form-register">
                        {stepComponents[currentStep]}

                        {errorMessage && (
                            <div className="error-message">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <div className="navigation-buttons">
                            {currentStep > 1 && (
                                <button type="button" onClick={handlePrev} className="register-btn">
                                    Prev
                                </button>
                            )}
                            {currentStep < 4 ? (
                                <button type="button" onClick={handleNext} className="register-btn">
                                    Next
                                </button>
                            ) : (
                                <button type="submit" className="register-btn">
                                    Submit
                                </button>
                            )}
                        </div>

                        <div className="footer-container-register">
                            <p className="footer-text-register">
                                Already have an account? <a href="/login" className="sign-in-link-login">Login here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Register;