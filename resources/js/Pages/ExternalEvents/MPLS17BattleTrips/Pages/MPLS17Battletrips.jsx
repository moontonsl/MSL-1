import React, { useState, useRef } from "react";
import MLLogin from "@/Pages/MLLoginApi/MLLogin";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";

import BG from "../Assets/Images/BTMPLS17-BG.png";
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

export default function MPL17Battletrips({ regionTitle, miniGameQuestion }) {
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
            likeMPLPage: "",
            likeMSLPage: "",
            likeCHPage: "",
            joinMPLGroup: "",
        };

        const [form, setForm] = useState(initialForm);

        const [errors, setErrors] = useState({});
        const [agreed, setAgreed] = useState(false);
        const [showTerms, setShowTerms] = useState(false);
        const [showModal, setShowModal] = useState(false);

        const [showVerifyModal, setShowVerifyModal] = useState(true);

        const [mlbbId, setMlbbId] = useState("");
        const [mlbbServer, setMlbbServer] = useState("");
        const [verified, setVerified] = useState(false);
        
        const [activeModal, setActiveModal] = useState(null);
        const mlLoginRef = useRef(null);

        const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error'
        const [showStatusModal, setShowStatusModal] = useState(false);
        const [tempMlData, setTempMlData] = useState(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

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

            const phoneRegex = /^09\d{9}$/;

            if (!form.contact.trim())
                e.contact = "Contact number is required.";
            else if (!phoneRegex.test(form.contact))
                e.contact = "Enter a valid PH number (09XXXXXXXXX).";

            if (!form.facebook.trim()) e.facebook = "Facebook profile link required.";
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!form.email.trim())
                e.email = "Email address required.";
            else if (!emailRegex.test(form.email))
                e.email = "Please enter a valid email address.";
            
            if (!form.validId.trim()) e.validId = "Google Drive link required.";
            if (!mlbbId) e.mlbbId = "MLBB UID verification required.";
            if (!mlbbServer) e.mlbbServer = "MLBB Server verification required.";
            if (!form.community) e.community = "Please select a community.";
            if (!agreed) e.consent = "Please agree to the Data Privacy Consent.";
            if (!form.smartSubscriber) e.smartSubscriber = "Please select Yes or No.";

            if (form.likeMPLPage !== "Yes")
                e.likeMPLPage = "Please follow the page before selecting Yes.";

            if (form.likeMSLPage !== "Yes")
                e.likeMSLPage = "Please follow the page before selecting Yes.";

            if (form.likeCHPage !== "Yes")
                e.likeCHPage = "Please follow the page before selecting Yes.";

            if (form.joinMPLGroup !== "Yes")
                e.joinMPLGroup = "Please join the group before selecting Yes.";

            setErrors(e);

            return Object.keys(e).length === 0;
        };

        /* ================= HANDLERS ================= */

        const handleChange = (e) => {
            const { name, value } = e.target;

            let v = value;

            if (name === "contact") {
                v = value.replace(/\D/g, "").slice(0, 11);
            }

            if (name === "mlbbId") v = value.replace(/\D/g, "").slice(0, 12);
            if (name === "mlbbServer") v = value.replace(/\D/g, "").slice(0, 6);

            if (name === "joinMPLGroup" && value === "No") {
                setActiveModal({
                title: "Join the MPL Facebook Community",
                link: "https://www.facebook.com/groups/mplphilippinesofficial/?ref=share&mibextid=NSMWBT",
                });

                v = "";
            }

            if (name === "likeMPLPage" && value === "No") {
                setActiveModal({
                title: "Like the MPL Page",
                link: "https://www.facebook.com/share/171Rpf73QJ/",
                });

                v = "";
            }

            if (name === "likeMSLPage" && value === "No") {
                setActiveModal({
                title: "Like the MSL Page",
                link: "https://www.facebook.com/share/1ZrTg5hGG6/",
                });

                v = "";
            }

            if (name === "likeCHPage" && value === "No") {
                setActiveModal({
                title: "Like the CH Page",
                link: "https://www.facebook.com/share/1LAUXewtSG/",
                });

                v = "";
            }

            setForm((prev) => ({ ...prev, [name]: v }));

            setErrors((prev) => ({ ...prev, [name]: "" }));
        };

             const handleSubmit = async (e) => {
                e.preventDefault();

                if (!validate()) return;

                setIsSubmitting(true);

                const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/175DKq9yO06Z2Pw5qeLI9-6wjbyg8npvavssjWhg8H6Y/formResponse";
                
                const formBody = new FormData();
                formBody.append("entry.1345442810", regionTitle || "ALL REGIONS");
                formBody.append("entry.1954274932", `Q: ${miniGameQuestion || "Which MPL PH Team has won the most championships?"} | A: ${form.answer}`);
                formBody.append("entry.913757275", form.name);
                formBody.append("entry.267578799", form.birthdate);
                formBody.append("entry.381276010", form.region);
                formBody.append("entry.1873824738", form.contact);
                formBody.append("entry.1871396629", form.facebook);
                formBody.append("entry.96358973", form.email);
                formBody.append("entry.1332239123", mlbbId);
                formBody.append("entry.1258292429", mlbbServer);
                formBody.append("entry.611813938", form.validId);
                formBody.append("entry.617516356", form.community);
                formBody.append("entry.1885783994", form.likeMPLPage);
                formBody.append("entry.165580188", form.likeMSLPage);
                formBody.append("entry.22777953", form.likeCHPage);
                formBody.append("entry.890072815", form.joinMPLGroup);
                formBody.append("entry.2111417879", form.smartSubscriber);
                formBody.append("entry.71135010", agreed ? "I agree to the Data Privacy Consent" : "No");

                try {
                    await fetch(GOOGLE_FORM_ACTION_URL, {
                        method: "POST",
                        body: formBody,
                        mode: "no-cors",
                    });

                    setShowModal(true);
                } catch (error) {
                    console.error("Error submitting to GSheet:", error);
                    alert("There was an error submitting your entry. Please try again.");
                } finally {
                    setIsSubmitting(false);
                }
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

        const handleLoginInfo = (info) => {
            console.log("MLBB Login Info:", info);
            
            // Moonton API usually returns { code: 0, data: { uid, server_id, ... } }
            // Or { success: true, data: { ... } } if from our backend
            const data = info.data || info;
            
            if (info && info.data) {
                const uid = data.uid || data.roleId;
                const server = data.server_id || data.zoneId;
                const ign = data.nick_name || data.name || "Player";

                setTempMlData({ uid, server, ign });
                setVerificationStatus('success');
                setShowStatusModal(true);
            } else {
                setVerificationStatus('error');
                setShowStatusModal(true);
            }
        };

        const confirmVerification = () => {
            if (tempMlData) {
                setMlbbId(tempMlData.uid);
                setMlbbServer(tempMlData.server);
                setVerified(true);

                setErrors((prev) => ({
                    ...prev,
                    mlbbId: "",
                    mlbbServer: ""
                }));

                setShowVerifyModal(false);
                setShowStatusModal(false);
                setTempMlData(null);
            }
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
                <img src={Logo} alt="Battle Trips Logo" className="w-64 sm:w-80 mb-4" />

                <div className="text-black text-center max-w-2xl mt-4 mb-6 text-[11px] md:text-lg font-medium leading-tight md:leading-normal [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">

                    The MPL Battle Trips is an 8-week event where fans of MLBB from
                    around the Philippines will be given a chance to visit the MPL PH
                    venue and enjoy the MLBB Events.

                </div>

                <div className="text-black text-center mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)] uppercase">
                    {regionTitle || "ALL REGIONS"}
                </div>

                {/* FORM CARD */}
                <div className="p-4 sm:p-6 md:p-8 w-full max-w-3xl rounded-xl border border-solid border-[#e59639] shadow-xl bg-white text-black">
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

                    {/* QUESTION */}
                    <div className="text-center mb-4">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 whitespace-nowrap">
                        MPL Battle Trips Mini Game
                        </h2>

                        <div className="border border-solid border-[#e59639] p-4 rounded-lg bg-gray-50">
                        {miniGameQuestion || "Which MPL PH Team has won the most championships?"}
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
                    <FormInput icon={<Phone />} label="Contact Number" name="contact" placeholder="09XXXXXXXXX" inputMode="numeric" pattern="[0-9]*" value={form.contact} onChange={handleChange} error={errors.contact} />

                    {/* Facebook */}
                    <FormInput icon={<Globe />} label="Facebook Profile Link" name="facebook" placeholder="https://facebook.com/yourprofile" value={form.facebook} onChange={handleChange} tooltip="Paste your Facebook profile link" error={errors.facebook} />

                    {/* Valid Email Address */}
                    <FormInput icon={<Mail />} label="Valid Email Address" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} tooltip="Use an active email address" error={errors.email} />

                    {/* MLBB ACCOUNT (AUTO VERIFIED) */}
                    <FormInput verified={verified} icon={<Hash />} label="MLBB UID" name="mlbbId" value={mlbbId} disabled={true} error={errors.mlbbId} />

                    <FormInput verified={verified} icon={<Globe />} label="MLBB Server" name="mlbbServer" value={mlbbServer} disabled={true} error={errors.mlbbServer} />
                
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
                            <option disabled value="">Select Community</option>

                            {COMMUNITIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>

                        {errors.community && (
                        <p className="text-red-500 text-sm">{errors.community}</p>
                        )}
                    </div>

                    {/* MPL SOCIAL REQUIREMENTS */}
                    <YesNoQuestion label="Have you already followed the MPL Page?" name="likeMPLPage" value={form.likeMPLPage} onChange={handleChange} error={errors.likeMPLPage} />

                    <YesNoQuestion label="Have you already followed the MSL Page?" name="likeMSLPage" value={form.likeMSLPage} onChange={handleChange} error={errors.likeMSLPage} />

                    <YesNoQuestion label="Have you already followed the CH Page?" name="likeCHPage" value={form.likeCHPage} onChange={handleChange} error={errors.likeCHPage} />
                    
                    <YesNoQuestion label="Are you a member of the MPL Official Group?" name="joinMPLGroup" value={form.joinMPLGroup} onChange={handleChange} error={errors.joinMPLGroup} />

                    {/* SMART */}
                    <div className="border border-solid border-[#e59639] p-4 rounded-lg bg-gray-50">
                        <label className="font-semibold block mb-2 text-center">
                            Are you a Smart Subscriber?
                        </label>

                        <select
                            name="smartSubscriber"
                            value={form.smartSubscriber}
                            onChange={handleChange}
                            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
                        >
                            <option disabled value="">Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>

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
                                By clicking this box, I agree to the Data Privacy Consent.
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
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e59639] hover:bg-[#d47f20]'}`}
                    >
                        {isSubmitting && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Answer"}
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
                            By clicking this box, I hereby grant my free, prior, and informed consent
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

                    // reset form
                    setForm(initialForm);
                    setAgreed(false);

                    // reset MLBB verification
                    setMlbbId("");
                    setMlbbServer("");
                    setVerified(false);

                    // reopen verification modal
                    setShowVerifyModal(true);
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
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => mlLoginRef.current?.triggerLogin()}
                            className="px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all hover:scale-105"
                            style={{ backgroundColor: "#e59639" }}
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </div>
            )}

            <MLLogin 
                ref={mlLoginRef} 
                onLoginInfo={handleLoginInfo}
            />

            {/* VERIFICATION STATUS MODAL */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border-t-8 border-[#e59639]">
                        {verificationStatus === 'success' ? (
                            <>
                                <div className="text-4xl mb-4 text-green-500">✅</div>
                                <h2 className="text-xl font-bold mb-2">Account Linked!</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We found your account: <br/>
                                    <span className="font-bold text-black text-base">{tempMlData?.ign}</span>
                                </p>
                                
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-dashed border-gray-300">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 font-semibold">UID:</span>
                                        <span className="font-mono text-black">{tempMlData?.uid}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-semibold">Server:</span>
                                        <span className="font-mono text-black">{tempMlData?.server}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={confirmVerification}
                                    className="w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                                    style={{ backgroundColor: "#e59639" }}
                                >
                                    Confirm Account
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl mb-4">❌</div>
                                <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We couldn't retrieve your MLBB profile. Please try logging in again.
                                </p>
                                <button 
                                    onClick={() => setShowStatusModal(false)}
                                    className="w-full py-3 rounded-lg font-bold text-white"
                                    style={{ backgroundColor: "#e59639" }}
                                >
                                    Retry
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                
                <div
                className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border-2"
                style={{ borderColor: "#e59639" }}
                >

                <div className="text-4xl mb-3">📢</div>

                <h2 className="text-lg font-bold mb-3">
                    {activeModal.title}
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                    Please follow/join the page before selecting Yes.
                </p>

                <div className="flex justify-center gap-3">

                    <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300"
                    >
                    Close
                    </button>

                    <a
                    href={activeModal.link}
                    target="_blank"
                    className="px-6 py-2 rounded-lg font-bold text-white"
                    style={{ backgroundColor: "#e59639" }}
                    >
                    Open Page
                    </a>

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
    disabled = false,
    verified = false
    }) {

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1">
                <label className="font-semibold block">{label}</label>
                {verified && (
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                         Verified Account
                    </span>
                )}
            </div>

            <div className={`flex items-center gap-3 border border-solid px-4 py-3 rounded-md bg-white transition-all ${verified ? 'border-green-500 bg-green-50' : 'border-[#e59639]'}`}>
                <div className={`${verified ? 'text-green-500' : 'text-[#e59639]'}`}>{icon}</div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full outline-none text-black disabled:bg-transparent disabled:text-black disabled:cursor-not-allowed font-medium"
                />

                {verified && (
                    <div className="text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                )}

                {tooltip && <Tooltip text={tooltip} />}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function YesNoQuestion({ label, name, value, onChange, error }) {
    return (
        <div className="border border-solid border-[#e59639] p-3 sm:p-4 rounded-lg bg-gray-50">

        <label className="font-semibold block mb-2 text-center text-sm sm:text-base">
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
        >
            <option disabled value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>

        {error && (
            <p className="text-red-500 text-sm mt-2 text-center max-w-xs mx-auto">
            {error}
            </p>
        )}

        </div>
    );
}

// FrontEnd by PD - Jaijai