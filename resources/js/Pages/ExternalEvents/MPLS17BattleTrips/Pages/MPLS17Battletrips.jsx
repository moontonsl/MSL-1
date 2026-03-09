import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";

import BG from "../Assets/Images/MPLS16_BG.png";
import Logo from "../Assets/Images/BTLogo.png";

import { User, Mail, School, Hash, Globe, Phone, Calendar } from "lucide-react";

/* ================= TOOLTIP ================= */

const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#e59639] cursor-pointer font-bold text-sm">?</span>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-lg shadow-lg w-56 z-50 border border-[#e59639]">
        {text}
        </div>
    </div>
    );

/* ================= MAIN COMPONENT ================= */

export default function MPL17Battletrips() {
    const COMMUNITIES = ["Moonton Student Leader", "Community Heroes"];

        const initialForm = {
            answer: "",
            name: "",
            birthdate: "",
            region: "",
            contact: "",
            facebook: "",
            email: "",
            validId: "",
            community: "",
            smartSubscriber: "",
        };

        const [form, setForm] = useState(initialForm);

        const [errors, setErrors] = useState({});
        const [agreed, setAgreed] = useState(false);
        const [showTerms, setShowTerms] = useState(false);
        const [showModal, setShowModal] = useState(false);

        const [showVerifyModal, setShowVerifyModal] = useState(false);

        /* ================= VALIDATION ================= */

        const is16Plus = (birthdate) => {
            const today = new Date();
            const birth = new Date(birthdate);
                let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }

            return age >= 16;
            };

        const validate = () => {
            let e = {};

            if (!form.answer.trim()) e.answer = "Please enter your answer.";
            if (!form.name.trim()) e.name = "Name is required.";

            if (!form.birthdate) e.birthdate = "Birthdate is required.";
            else if (!is16Plus(form.birthdate))
                e.birthdate = "You must be at least 16 years old.";

            if (!form.region.trim()) e.region = "Region / School is required.";
            if (!form.contact.trim()) e.contact = "Contact number is required.";
            if (!form.facebook.trim()) e.facebook = "Facebook profile link required.";
            if (!form.email.trim()) e.email = "Email address required.";
            if (!form.validId.trim()) e.validId = "Google Drive link required.";
            if (!form.community) e.community = "Please select a community.";
            if (!agreed) e.consent = "Please agree to the Data Privacy Consent.";
            if (!form.smartSubscriber) e.smartSubscriber = "Please select Yes or No.";

            setErrors(e);

            return Object.keys(e).length === 0;
        };

        /* ================= HANDLERS ================= */

        const handleChange = (e) => {
            const { name, value } = e.target;

            let v = value;

            if (name === "mlbbId") v = value.replace(/\D/g, "").slice(0, 12);
            if (name === "mlbbServer") v = value.replace(/\D/g, "").slice(0, 6);

            setForm((prev) => ({ ...prev, [name]: v }));

            setErrors((prev) => ({ ...prev, [name]: "" }));
        };

            const handleSubmit = (e) => {
            e.preventDefault();

            if (!validate()) return;

            setShowModal(true);
            };

        const handleSendCode = () => {
            if (cooldown > 0) return;

            // call backend API here later
            console.log("Send verification code");

            setCooldown(60);

            const timer = setInterval(() => {
                setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
                });
            }, 1000);
        };

        const handleVerifyCode = async () => {
            // backend verification will happen here
            console.log("Verifying code:", verificationCode);

            // simulate success
            setIgn("SampleIGN");
                setVerified(true);

            setErrors((prev) => ({
            ...prev,
            ign: ""
            }))
        };

        /* ================= UI ================= */

    return (
        <>
            <Head title="MPL17 Battle Trips" />
            <Helmet>
                <title>MPLS17 Battle Trips</title>
            </Helmet>

            <AuthenticatedLayout>
                <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}>
                <img src={Logo} alt="Battle Trips Logo" className="w-64 sm:w-80 mb-6" />

                {/* FORM CARD */}
                <div className="p-8 w-full max-w-3xl rounded-xl border border-[#e59639] shadow-xl bg-white text-black">
                    <form onSubmit={handleSubmit} className="space-y-4">

                    {/* QUESTION */}
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold mb-2">
                        MPL Battle Trips Mini Game
                        </h2>

                        <div className="border border-[#e59639] p-4 rounded-lg bg-gray-50">
                        Which MPL PH Team has won the most championships?
                        </div>
                    </div>

                    {/* Answer the Question */}
                    <FormInput icon={<Hash />} label="Answer the Question" name="answer" placeholder="Type your answer here" value={form.answer} onChange={handleChange} error={errors.answer} />
                    
                    {/* Full Name */}
                    <FormInput icon={<User />} label="Full Name" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} error={errors.name} />

                    {/* Birthdate */}
                    <FormInput icon={<Calendar />} type="date" label="Birthdate" name="birthdate" value={form.birthdate} onChange={handleChange} error={errors.birthdate} />

                    {/* Region / Area / School */}
                    <FormInput icon={<School />} label="Region / Area / School" name="region" placeholder="Enter your region or school" value={form.region} onChange={handleChange} error={errors.region} />

                    {/* Contact Number */}
                    <FormInput icon={<Phone />} label="Contact Number" name="contact" placeholder="09XXXXXXXXX" value={form.contact} onChange={handleChange} error={errors.contact} />

                    {/* Facebook */}
                    <FormInput icon={<Globe />} label="Facebook Profile Link" name="facebook" placeholder="https://facebook.com/yourprofile" value={form.facebook} onChange={handleChange} tooltip="Paste your Facebook profile link" error={errors.facebook} />

                    {/* Valid Email Address */}
                    <FormInput icon={<Mail />} label="Valid Email Address" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} tooltip="Use an active email address" error={errors.email} />

                    {/* MLBB VERIFICATION PLACEHOLDER */}
                    <div className="border border-[#e59639] p-4 rounded-lg bg-gray-50 text-center">
                        
                        <div className="font-semibold mb-2">
                            Verify your MLBB Account
                        </div>

                        <button
                            type="button"
                            className="px-6 py-3 rounded-lg font-bold text-white bg-[#e59639] hover:bg-[#d47f20]"
                            onClick={() => setShowVerifyModal(true)}
                        >
                            Verify your MLBB Account
                        </button>

                        <p className="text-xs text-gray-500 mt-2 text-center mx-auto">
                            You will be asked to log in and verify your MLBB account.
                        </p>

                    </div>
                
                    {/* VALID ID */}
                    <FormInput icon={<Globe />} label="Valid ID (Google Drive Link)" name="validId" placeholder="Paste Google Drive link here" value={form.validId} onChange={handleChange} tooltip="Set sharing to Anyone with the link" error={errors.validId} />

                    {/* COMMUNITY */}
                    <div>
                        <label className="font-semibold mb-1 block">
                            Select Community
                        </label>

                        <select
                            name="community"
                            value={form.community}
                            onChange={handleChange}
                            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
                            >
                            <option value="">Select Community</option>

                            {COMMUNITIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>

                        {errors.community && (
                        <p className="text-red-500 text-sm">{errors.community}</p>
                        )}
                    </div>

                    {/* SMART */}
                    <div className="text-center">
                        <div className="font-semibold mb-2">
                            Are you a Smart Subscriber?
                        </div>
                        <div className="flex justify-center gap-6">
                            <button
                                type="button"
                                onClick={() => {
                                setForm((prev) => ({ ...prev, smartSubscriber: "Yes" }));
                                setErrors((prev) => ({ ...prev, smartSubscriber: "" }));
                                }}
                                className={`px-6 py-2 rounded-full border ${
                                form.smartSubscriber === "Yes"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-100"
                                }`}
                                >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                setForm((prev) => ({ ...prev, smartSubscriber: "No" }));
                                setErrors((prev) => ({ ...prev, smartSubscriber: "" }));
                                }}
                                className={`px-6 py-2 rounded-full border ${
                                form.smartSubscriber === "No"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-100"
                                }`}
                                >
                                No
                            </button>
                        </div>

                        {errors.smartSubscriber && (
                            <p className="text-red-500 text-sm mt-2 text-center max-w-xs mx-auto">
                            {errors.smartSubscriber}
                            </p>
                        )}
                    </div>

                    {/* DATA PRIVACY */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={() => {
                                    setShowTerms(true);
                                    setErrors((prev) => ({ ...prev, consent: "" }));
                                }}
                                className="mt-1"
                            />
                            <span>
                                By ticking this box, I agree to the Data Privacy Consent.
                                <button
                                type="button"
                                className="underline ml-1"
                                onClick={() => setShowTerms(true)}
                                >
                                View Terms
                                </button>
                            </span>
                        </label>

                        {errors.consent && (
                        <p className="text-red-500 text-sm">{errors.consent}</p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-bold text-white bg-[#e59639] hover:bg-[#d47f20]"
                    >
                        Submit Answer
                    </button>
            </form>
        </div>
                </div>
            </AuthenticatedLayout>

            {/* TERMS MODAL */}
            {showTerms && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-white p-6 rounded-2xl max-w-lg w-full text-black shadow-xl border-2" style={{ borderColor: "#e59639" }}>
                    <h2 className="text-lg font-bold mb-3">
                        Data Privacy Consent
                    </h2>

                    <div className="text-sm text-gray-700 space-y-3 max-h-[250px] overflow-y-auto pr-2">
                        <p>
                            By ticking this box, I hereby grant my free, prior, and informed consent
                            to MSL, CH, and MPL Philippines to collect, store, and process my personal data.
                        </p>
                        <p>
                            The information provided will only be used for event registration,
                            participant verification, and coordination related to this activity.
                        </p>
                        <p>
                            I understand that my personal data will be handled in accordance with
                            the Data Privacy Act of 2012 and the organization’s privacy policy.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShowTerms(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                            setAgreed(true);
                            setShowTerms(false);
                            setErrors((prev) => ({ ...prev, consent: "" }));
                            }}
                            className="px-6 py-2 rounded-lg font-bold text-white"
                            style={{ backgroundColor: "#e59639" }}
                        >
                            I Agree
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* SUCCESS MODAL */}
            {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white rounded-2xl p-8 text-center w-full max-w-md shadow-2xl border-2"
                    style={{ borderColor: "#e59639" }}
                >
                <div className="text-5xl mb-3">🎉</div>

                <h2 className="text-xl font-bold mb-2">
                Submission Successful!
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                Thank you for joining the MPL Battle Trips Mini Game.  
                Our team will verify your details soon.
                </p>

                <button
                onClick={() => {
                    setShowModal(false);
                    setForm(initialForm);
                    setVerificationCode("");
                    setVerified(false);
                    setIgn("");
                    setAgreed(false);
                }}
                className="px-6 py-3 rounded-lg font-bold text-white transition hover:scale-105"
                style={{ backgroundColor: "#e59639" }}
                >
                Close
                </button>
            </div>
        </div>
            )}

            {/* MLBB VERIFY MODAL */}
            {showVerifyModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                
                <div
                    className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border-2"
                    style={{ borderColor: "#e59639" }}
                >

                    <div className="text-5xl mb-3">🎮</div>

                    <h2 className="text-xl font-bold mb-2">
                        Verify MLBB Account
                    </h2>

                    <p className="text-gray-600 text-sm mb-6">
                        You will be redirected to log in and verify your Mobile Legends account.
                        This step confirms your MLBB profile before submitting your entry.
                    </p>

                    <div className="flex justify-center gap-3">

                        <button
                            onClick={() => setShowVerifyModal(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                console.log("Trigger MLBB verification flow");
                                setShowVerifyModal(false);
                            }}
                            className="px-6 py-2 rounded-lg font-bold text-white"
                            style={{ backgroundColor: "#e59639" }}
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </div>
            )}
        </>
    );
}

/* ================= REUSABLE INPUT ================= */

function FormInput({
    icon,
    label,
    name,
    value,
    placeholder,
    onChange,
    error,
    tooltip,
    type = "text",
    disabled = false
    }) {

    return (
        <div>
            <label className="font-semibold mb-1 block">{label}</label>

            <div className="flex items-center gap-3 border border-[#e59639] px-4 py-3 rounded-md bg-white">
            <div className="text-[#e59639]">{icon}</div>

            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
                className="w-full outline-none text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            {tooltip && <Tooltip text={tooltip} />}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

// FrontEnd by PD - Jaijai