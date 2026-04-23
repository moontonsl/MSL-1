import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";
import { User, School, Hash, Globe, Link2 } from "lucide-react";

const Hero = "/FRAME_ 2.png";
const PRIMARY = "#d71920";

const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#d71920] cursor-pointer font-bold text-sm">?</span>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-xl shadow-lg w-48 sm:w-56 z-50 border border-[#d71920]">
            {text}
        </div>
    </div>
);

const checkboxStyle = (checked) => ({
    appearance: "none",
    WebkitAppearance: "none",
    width: "16px",
    height: "16px",
    marginTop: "4px",
    borderRadius: "4px",
    border: "2px solid #d71920",
    backgroundColor: checked ? "#d71920" : "#ffffff",
    backgroundImage: checked
        ? 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%273 11 8 16 17 5%27/%3E%3C/svg%3E")'
        : "none",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "12px 12px",
    cursor: "pointer",
});

export default function JBFlex() {
    const initialForm = {
        name: "",
        school: "",
        uid: "",
        server: "",
        facebookProfileLink: "",
        postLink: "",
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [agreed, setAgreed] = useState(false);
    const [agreedMechanics, setAgreedMechanics] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showMechanics, setShowMechanics] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(true);
    const [mlbbUid, setMlbbUid] = useState("");
    const [mlbbServer, setMlbbServer] = useState("");

    const isValidUrl = (value) => /^https?:\/\/\S+/i.test(value);

    const validate = () => {
        const nextErrors = {};

        if (!form.name.trim()) nextErrors.name = "Name is required.";
        if (!form.school.trim()) nextErrors.school = "School is required.";

        if (!mlbbUid.trim()) nextErrors.uid = "MLBB UID is required.";
        else if (!/^\d{7,12}$/.test(mlbbUid))
            nextErrors.uid = "UID must be 7-12 digits.";

        if (!mlbbServer.trim()) nextErrors.server = "MLBB Server is required.";
        else if (!/^\d{3,6}$/.test(mlbbServer))
            nextErrors.server = "Server must be 3-6 digits.";

        if (!form.facebookProfileLink.trim())
            nextErrors.facebookProfileLink = "Facebook profile link is required.";
        else if (!isValidUrl(form.facebookProfileLink))
            nextErrors.facebookProfileLink = "Enter a valid Facebook profile link.";

        if (!form.postLink.trim()) nextErrors.postLink = "Post link is required.";
        else if (!isValidUrl(form.postLink))
            nextErrors.postLink = "Enter a valid post link.";

        if (!agreedMechanics)
            nextErrors.mechanics = "Please agree to the game mechanics.";

        if (!agreed) nextErrors.consent = "Please agree to the Terms and Conditions.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let nextValue = value;

        if (name === "uid" || name === "server") {
            nextValue = value.replace(/\D/g, "");
        }

        if (name === "uid" || name === "server") {
            return;
        }

        setForm((prev) => ({ ...prev, [name]: nextValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        setShowModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="MLBB x Jollibee" />
            <Helmet>
                <title>MLBB x Jollibee</title>
            </Helmet>

            <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 py-8 sm:p-6 font-['Montserrat'] bg-white">
                <img src={Hero} alt="Jollibee Joy mascot" className="w-32 sm:w-48 md:w-64 mb-4 drop-shadow-xl" />

                <div className="text-black text-center mb-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-normal [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">
                    #FlexYourWowBida Challenge
                </div>

                <div className="p-5 sm:p-8 w-full max-w-3xl rounded-xl border border-[#d71920] shadow-xl bg-[#d71920] text-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-6 flex flex-col items-center">
                            <h2 className="text-lg sm:text-xl font-bold mb-2">
                                Flex your Pabida Emote Submission
                            </h2>

                            <p className="text-[#ffd0d2] text-xs sm:text-sm text-center">
                                Please fill out the submission details below for the MLBB x Jollibee event.
                            </p>
                        </div>

                        <FormInput
                            icon={<User size={20} />}
                            label="Name"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <FormInput
                            icon={<School size={20} />}
                            label="School"
                            name="school"
                            placeholder="Enter your school"
                            value={form.school}
                            onChange={handleChange}
                            error={errors.school}
                        />

                        <FormInput
                            icon={<Hash size={20} />}
                            label="MLBB UID"
                            name="uid"
                            placeholder="Backend verified UID"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={mlbbUid}
                            onChange={handleChange}
                            disabled={true}
                            error={errors.uid}
                        />

                        <FormInput
                            icon={<Globe size={20} />}
                            label="MLBB Server"
                            name="server"
                            placeholder="Backend verified server"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={mlbbServer}
                            onChange={handleChange}
                            disabled={true}
                            error={errors.server}
                        />

                        <FormInput
                            icon={<Globe size={20} />}
                            label="Facebook Profile Link"
                            name="facebookProfileLink"
                            placeholder="https://facebook.com/yourprofile"
                            value={form.facebookProfileLink}
                            onChange={handleChange}
                            tooltip="Paste your Facebook profile link."
                            error={errors.facebookProfileLink}
                        />

                        <FormInput
                            icon={<Link2 size={20} />}
                            label="Post link"
                            name="postLink"
                            placeholder="https://facebook.com/your-post"
                            value={form.postLink}
                            onChange={handleChange}
                            tooltip="Paste the link to your post."
                            error={errors.postLink}
                        />

                        <div className="border border-[#ffd0d2] p-3 sm:p-4 rounded-xl bg-white">
                            <label className="flex items-start gap-3 text-black text-sm sm:text-base">
                                <input
                                    type="checkbox"
                                    checked={agreedMechanics}
                                    onChange={() => {
                                        setShowMechanics(true);
                                        setErrors((prev) => ({ ...prev, mechanics: "" }));
                                    }}
                                    className="shrink-0 mt-1"
                                    style={checkboxStyle(agreedMechanics)}
                                />
                                <span className="leading-relaxed">
                                    By clicking this box, I agree with the game mechanics.
                                    <button
                                        type="button"
                                        className="underline ml-1 text-[#d71920] font-semibold"
                                        onClick={() => setShowMechanics(true)}
                                    >
                                        View Mechanics
                                    </button>
                                </span>
                            </label>

                            {errors.mechanics && (
                                <p className="text-red-600 text-xs mt-1 font-medium">{errors.mechanics}</p>
                            )}
                        </div>

                        <div className="border border-[#ffd0d2] p-3 sm:p-4 rounded-xl bg-white">
                            <label className="flex items-start gap-3 text-black text-sm sm:text-base">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => {
                                        setShowTerms(true);
                                        setErrors((prev) => ({ ...prev, consent: "" }));
                                    }}
                                    className="shrink-0 mt-1"
                                    style={checkboxStyle(agreed)}
                                />
                                <span className="leading-relaxed">
                                    By clicking this box, I agree to the Terms and Conditions.
                                    <button
                                        type="button"
                                        className="underline ml-1 text-[#d71920] font-semibold"
                                        onClick={() => setShowTerms(true)}
                                    >
                                        View Terms
                                    </button>
                                </span>
                            </label>

                            {errors.consent && (
                                <p className="text-red-600 text-xs mt-1 font-medium">{errors.consent}</p>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!mlbbUid || !mlbbServer}
                            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                                !mlbbUid || !mlbbServer
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-white text-[#d71920] hover:bg-[#fff4f4] shadow-lg"
                            }`}
                        >
                            Submit Entry
                        </button>
                    </form>
                </div>
            </div>

            {showTerms && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
                    <div
                        className="bg-white p-6 rounded-xl max-w-lg w-full text-black shadow-xl border-2"
                        style={{ borderColor: PRIMARY }}
                    >
                        <h2 className="text-lg font-bold mb-3">Terms and Conditions</h2>

                        <div className="text-sm text-gray-700 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            <p>
                                By clicking this box, I hereby grant my free, prior, and informed consent
                                to the event organizers to collect, store, and process my personal data.
                            </p>
                            <p>
                                The information provided will only be used for event registration,
                                participant verification, and coordination related to this activity.
                            </p>
                            <p>
                                I understand that my personal data will be handled in accordance with
                                the Data Privacy Act of 2012 and the organization&apos;s privacy policy.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowTerms(false)}
                                className="order-2 sm:order-1 px-4 py-2 rounded-xl border border-gray-300 font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setAgreed(true);
                                    setShowTerms(false);
                                    setErrors((prev) => ({ ...prev, consent: "" }));
                                }}
                                className="order-1 sm:order-2 px-6 py-2 rounded-xl font-bold text-white shadow-md"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMechanics && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[10000]">
                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-gray-50 text-black shadow-2xl animate-in fade-in zoom-in duration-200">
                        
                        <div className="px-6 py-6 bg-white border-b border-gray-100 flex flex-col items-center text-center relative">
                            <div className="inline-block px-3 py-1 rounded-full bg-[#fff4f4] text-[#d71920] text-[10px] font-bold uppercase tracking-wider mb-2">
                                Event Guidelines
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                                How to Join #FlexYourWowBida Challenge
                            </h2>

                            <p className="w-full text-gray-500 text-xs sm:text-sm mt-2 px-4">
                                Follow these steps to qualify for the MLBB x Jollibee event
                            </p>
                        </div>

                        <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
                            <div className="grid gap-4">
                                <MechanicCard
                                    num="1"
                                    title="Claim the Emote"
                                    body="Claim the official 'Wow Bida' emote in-game through the Jollibee event interface."
                                />
                                <MechanicCard
                                    num="2"
                                    title="Record Gameplay"
                                    body="Record a video using the emote during a match (e.g., after a kill, a clutch escape, or a victory)."
                                />
                                <MechanicCard
                                    num="3"
                                    title="Upload Socials"
                                    body="Post your video on Facebook or TikTok. Ensure your post privacy is set to Public."
                                />
                            </div>

                            <div className="rounded-2xl bg-[#d71920] p-4 text-white text-center shadow-inner">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">
                                    Required Hashtags
                                </h3>
                                <p className="font-mono text-xs sm:text-sm font-bold break-words leading-relaxed">
                                    #MSLPhilippines #MLBBWowBida #MLBBxJollibee #MSLFlexYourWowBida
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 p-6 bg-white border-t border-gray-100">
                            <button
                                onClick={() => setShowMechanics(false)}
                                className="order-2 sm:order-1 flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>

                            <button
                                onClick={() => {
                                    setAgreedMechanics(true);
                                    setShowMechanics(false);
                                    setErrors((prev) => ({ ...prev, mechanics: "" }));
                                }}
                                className="order-1 sm:order-2 flex-[2] px-6 py-3 rounded-2xl font-bold text-white shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                    <div
                        className="bg-white rounded-xl p-6 sm:p-8 text-center w-full max-w-md shadow-2xl border-2"
                        style={{ borderColor: PRIMARY }}
                    >
                        <div className="text-5xl mb-3">🎉</div>

                        <h2 className="text-black text-xl font-bold mb-2">
                            Submission Successful!
                        </h2>

                        <p className="text-gray-600 text-sm mb-6">
                            Thank you for submitting your MLBB x Jollibee submission details.
                        </p>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                setForm(initialForm);
                                setAgreed(false);
                                setAgreedMechanics(false);
                                setMlbbUid("");
                                setMlbbServer("");
                                setShowVerifyModal(true);
                            }}
                            className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-white transition hover:scale-105"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showVerifyModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
                    <div
                        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl border-2"
                        style={{ borderColor: PRIMARY }}
                    >
                        <div className="text-5xl mb-3">🎮</div>

                        <h2 className="text-gray-800 text-xl font-bold mb-2">
                            Verify MLBB Account
                        </h2>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            You will be redirected to log in and verify your Mobile Legends account.
                            This step confirms your MLBB profile before submitting your entry.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link
                                href="/"
                                className="order-2 sm:order-1 px-4 py-2 rounded-xl border text-gray-600 border-gray-300 font-bold"
                            >
                                Cancel
                            </Link>

                            <button
                                onClick={() => {
                                    const sampleUID = "123456789";
                                    const sampleServer = "1234";

                                    setMlbbUid(sampleUID);
                                    setMlbbServer(sampleServer);
                                    setShowVerifyModal(false);
                                    setErrors((prev) => ({
                                        ...prev,
                                        uid: "",
                                        server: "",
                                    }));
                                }}
                                className="order-1 sm:order-2 px-8 py-2 rounded-xl font-bold text-white shadow-md"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function MechanicCard({ num, title, body }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff4f4] text-[#d71920] text-[10px] font-bold mt-0.5 border border-[#ffd0d2]">
                    {num}
                </span>
                
                <div className="min-w-0">
                    <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug uppercase tracking-wide">
                        {title}
                    </h3>
                    
                    <div className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {body}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
    inputMode,
    pattern,
}) {
    return (
        <div>
            <label className="font-semibold mb-1 block text-white text-sm sm:text-base">{label}</label>

            <div className={`flex items-center gap-3 border border-[#ffd0d2] px-4 py-3 rounded-xl bg-white ${disabled ? 'opacity-90' : ''}`}>
                <div className="text-[#d71920] shrink-0">{icon}</div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    readOnly={disabled}
                    inputMode={inputMode}
                    pattern={pattern}
                    className="w-full outline-none text-black text-sm sm:text-base placeholder:text-gray-400 disabled:bg-transparent disabled:cursor-not-allowed"
                />

                {tooltip && <Tooltip text={tooltip} />}
            </div>

            {error && <p className="text-white text-xs sm:text-sm mt-1 font-medium">{error}</p>}
        </div>
    );
}