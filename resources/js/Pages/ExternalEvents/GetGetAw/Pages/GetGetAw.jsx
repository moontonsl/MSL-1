import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";
import { User, School, Hash, Globe, Link2 } from "lucide-react";

import BG from "../../MPLS17BattleTrips/Assets/Images/BTMPLS17-BG.png";
import Logo from "../../MPLS17BattleTrips/Assets/Images/BTLogo.png";

/* ================= TOOLTIP ================= */

const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#e59639] cursor-pointer font-bold text-sm">?</span>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-lg shadow-lg w-56 z-50 border border-[#e59639]">
            {text}
        </div>
    </div>
);

export default function GetGetAw() {
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
    const [showTerms, setShowTerms] = useState(false);
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
            <Head title="GetGetAw" />
            <Helmet>
                <title>GetGetAw</title>
            </Helmet>

            <div
                className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
            >
                <img src={Logo} alt="Event Logo" className="w-64 sm:w-80 mb-4" />

                <div className="text-black text-center max-w-2xl mt-4 mb-6 text-[11px] md:text-lg font-medium leading-tight md:leading-normal [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">
                    GetGetAw registration uses the same event structure and styling for now.
                    We will update the assets and copy later, so this page is a direct visual
                    baseline for the new submission flow.
                </div>

                <div className="text-black text-center mb-4 text-sm md:text-3xl lg:text-4xl font-bold tracking-widest [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">
                    GETGETAW
                </div>

                <div className="p-8 w-full max-w-3xl rounded-xl border border-[#e59639] shadow-xl bg-white text-black">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold mb-2">GetGetAw Submission</h2>

                            <div className="border border-[#e59639] p-4 rounded-lg bg-gray-50">
                                Please fill out the submission details below.
                            </div>
                        </div>

                        <FormInput
                            icon={<User />}
                            label="Name"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <FormInput
                            icon={<School />}
                            label="School"
                            name="school"
                            placeholder="Enter your school"
                            value={form.school}
                            onChange={handleChange}
                            error={errors.school}
                        />

                        <FormInput
                            icon={<Hash />}
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
                            icon={<Globe />}
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
                            icon={<Globe />}
                            label="Facebook Profile Link"
                            name="facebookProfileLink"
                            placeholder="https://facebook.com/yourprofile"
                            value={form.facebookProfileLink}
                            onChange={handleChange}
                            tooltip="Paste your Facebook profile link."
                            error={errors.facebookProfileLink}
                        />

                        <FormInput
                            icon={<Link2 />}
                            label="Post link"
                            name="postLink"
                            placeholder="https://facebook.com/your-post"
                            value={form.postLink}
                            onChange={handleChange}
                            tooltip="Paste the link to your post."
                            error={errors.postLink}
                        />

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
                                    By clicking this box, I agree to the Terms and Conditions.
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

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg font-bold text-white bg-[#e59639] hover:bg-[#d47f20]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            {showTerms && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div
                        className="bg-white p-6 rounded-2xl max-w-lg w-full text-black shadow-xl border-2"
                        style={{ borderColor: "#e59639" }}
                    >
                        <h2 className="text-lg font-bold mb-3">Terms and Conditions</h2>

                        <div className="text-sm text-gray-700 space-y-3 max-h-[250px] overflow-y-auto pr-2">
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

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-2xl p-8 text-center w-full max-w-md shadow-2xl border-2"
                        style={{ borderColor: "#e59639" }}
                    >
                        <div className="text-5xl mb-3">SUCCESS</div>

                        <h2 className="text-xl font-bold mb-2">Submission Successful!</h2>

                        <p className="text-gray-600 text-sm mb-6">
                            Thank you for submitting your GetGetAw registration details.
                        </p>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                setForm(initialForm);
                                setAgreed(false);
                                setMlbbUid("");
                                setMlbbServer("");
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

            {showVerifyModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                
                    <div
                        className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border-2"
                        style={{ borderColor: "#e59639" }}
                    >
                        <div className="text-5xl mb-3">🎮</div>

                        <h2 className="text-gray-600 text-xl font-bold mb-2">
                            Verify MLBB Account
                        </h2>

                        <p className="text-gray-600 text-sm mb-6">
                            You will be redirected to log in and verify your Mobile Legends account.
                            This step confirms your MLBB profile before submitting your entry.
                        </p>

                        <div className="flex justify-center gap-3">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg border text-gray-600 border-gray-300"
                            >
                                Cancel
                            </Link>

                            <button
                                onClick={() => {
                                    const sampleUID = "123456789";
                                    const sampleServer = "3024";

                                    setMlbbUid(sampleUID);
                                    setMlbbServer(sampleServer);
                                    setShowVerifyModal(false);
                                    setErrors((prev) => ({
                                        ...prev,
                                        uid: "",
                                        server: "",
                                    }));
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
        </AuthenticatedLayout>
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
                    readOnly={disabled}
                    inputMode={inputMode}
                    pattern={pattern}
                    className="w-full outline-none text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                {tooltip && <Tooltip text={tooltip} />}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
