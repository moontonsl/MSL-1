import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "../Assets/Images/BG.png";
import GMLogo from "../Assets/Images/FF2xMSL_logo.png";
import { User, Mail, School, Hash, Globe, Image } from "lucide-react";
import axios from "axios";

/* ================= TOOLTIP ================= */
const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#fff4d0] cursor-pointer font-bold text-sm">?</span>
        <div className="
        absolute right-0 top-1/2 -translate-y-1/2
        hidden group-hover:block
        bg-black text-[#FFF4D0]
        text-xs px-3 py-2 rounded-lg
        border border-[#FFF4D0]
        shadow-lg w-56 z-50
        ">
        {text}
        </div>
    </div>
    );

export default function GM26Comm() {

    const [form, setForm] = useState({
        fullName: "",
        facebookLink: "",
        email: "",
        community: "MSL Page",
        school: "",
        mlbbId: "",
        mlbbServer: "",
    });

    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

  /* ================= VALIDATION ================= */

    const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
    const isValidFacebook = (url) =>
        /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/i.test(url);
    const isValidMlbbId = (id) => /^\d{7,12}$/.test(id);
    const isValidMlbbServer = (s) => /^\d{4,6}$/.test(s);

    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";

        if (!form.facebookLink.trim())
        newErrors.facebookLink = "Facebook profile link is required.";
        else if (!isValidFacebook(form.facebookLink))
        newErrors.facebookLink = "Enter a valid Facebook profile link.";

        if (!form.email.trim())
        newErrors.email = "Email address is required.";
        else if (!isValidEmail(form.email))
        newErrors.email = "Enter a valid email address.";

        if (!form.school.trim())
        newErrors.school = "School is required.";

        if (!form.mlbbId.trim())
        newErrors.mlbbId = "MLBB UID is required.";
        else if (!isValidMlbbId(form.mlbbId))
        newErrors.mlbbId = "UID must be 7–12 digits.";

        if (!form.mlbbServer.trim())
        newErrors.mlbbServer = "MLBB Server is required.";
        else if (!isValidMlbbServer(form.mlbbServer))
        newErrors.mlbbServer = "Server must be 4–6 digits.";

        if (!photo)
        newErrors.photo = "Proof photo is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= HANDLERS ================= */

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "mlbbId")
        newValue = value.replace(/\D/g, "").slice(0, 12);

        if (name === "mlbbServer")
        newValue = value.replace(/\D/g, "").slice(0, 6);

        setForm((prev) => ({ ...prev, [name]: newValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
        setPhoto(file);
        setErrors((prev) => ({ ...prev, photo: "" }));
        } else {
        setErrors((prev) => ({
            ...prev,
            photo: "Only image files are allowed.",
        }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionMessage("");

        if (!validate()) return;

        try {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("event_name", "GM26Comm");
        Object.keys(form).forEach(key =>
            formData.append(key, form[key])
        );
        formData.append("photo", photo);
        formData.append("consent", agreed);

        const response = await axios.post(
            route("event.registration.store"),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.success) {
            setShowModal(true);
            setForm({
            fullName: "",
            facebookLink: "",
            email: "",
            community: "MSL Page",
            school: "",
            mlbbId: "",
            mlbbServer: "",
            });
            setPhoto(null);
            setAgreed(false);
        }
        } catch (err) {
        setSubmissionMessage("Submission failed. Please try again.");
        } finally {
        setSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
        <Head title="Golden Month Community Registration" />
        <Helmet>
            <title>GM26 Community Registration</title>
        </Helmet>

        <div
            className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
        >

            {/* LOGO */}
            <Link href="/GM26">
            <img
                src={GMLogo}
                alt="Golden Month Logo"
                className="w-64 sm:w-80 drop-shadow-lg mb-6"
            />
            </Link>

            {/* FORM CARD */}
            <div className="p-6 w-full max-w-3xl shadow-lg border-2 backdrop-blur-md bg-black/75"
            style={{ borderColor: "#fff4d0" }}
            >
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="text-center">
                <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#fff4d0]">
                    GM26 Community Registration
                </h2>
                </div>

                <FormInput icon={<User />} label="Full Name"
                name="fullName" value={form.fullName}
                placeholder="Enter your full name"
                onChange={handleChange} error={errors.fullName}
                />

                <FormInput icon={<Globe />} label="Facebook Profile Link"
                name="facebookLink" value={form.facebookLink}
                placeholder="https://facebook.com/yourprofile"
                onChange={handleChange} error={errors.facebookLink}
                />

                <FormInput icon={<Mail />} label="Email Address"
                name="email" value={form.email}
                placeholder="Enter your active email address"
                onChange={handleChange} error={errors.email}
                tooltip="Use an active email address where we can contact you."
                />

                <FormInput icon={<School />} label="School"
                name="school" value={form.school}
                placeholder="Enter your school name"
                onChange={handleChange} error={errors.school}
                />

                <FormInput icon={<Hash />} label="MLBB UID"
                name="mlbbId" value={form.mlbbId}
                placeholder="7–12 digits"
                onChange={handleChange} error={errors.mlbbId}
                tooltip="Found in your MLBB profile. Example: 123456789"
                />

                <FormInput icon={<Globe />} label="MLBB Server ID"
                name="mlbbServer" value={form.mlbbServer}
                placeholder="4–6 digits"
                onChange={handleChange} error={errors.mlbbServer}
                tooltip="The number in parentheses next to your UID. Example: (3024)"
                />

                {/* PHOTO */}
                <div>
                <label className="block mb-1 text-[#fff4d0]">Upload Proof Photo</label>
                <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                    <Image className="text-[#fff4d0] w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange}
                    className="bg-transparent w-full text-white"
                    />
                </div>
                {errors.photo && <p className="text-red-400 text-sm mt-1">{errors.photo}</p>}
                </div>

                {/* DPA */}
                <div className="flex items-start gap-3 mt-4 text-sm text-[#fff4d0]">
                <input type="checkbox" checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#fff4d0]"
                />
                <p>
                    I accept and agree with the{" "}
                    <button type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="underline hover:text-yellow-300">
                    Terms and Conditions
                    </button>.
                </p>
                </div>

                {submissionMessage &&
                <p className="text-red-400 text-center text-sm">{submissionMessage}</p>
                }

                <button type="submit"
                disabled={!agreed || submitting}
                className="w-full mt-4 py-3 rounded-xl font-bold text-[#FFF4D0]
                bg-black border-2 border-[#FFF4D0]
                hover:bg-[#FFF4D0] hover:text-black
                disabled:opacity-40"
                >
                {submitting ? "Submitting..." : "REGISTER"}
                </button>

            </form>
            </div>

            {/* SUCCESS MODAL */}
            {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-black p-8 border border-[#fff4d0] rounded-xl text-center">
                <h2 className="text-xl mb-4">Registration Submitted Successfully!</h2>
                <button onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-[#FFF4D0] text-black font-bold rounded-lg">
                    Close
                </button>
                </div>
            </div>
            )}

            {/* DPA MODAL */}
            {showTermsModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-black p-6 border border-[#fff4d0] rounded-xl max-w-lg">
                <h2 className="text-lg mb-4 text-[#fff4d0]">
                    Golden Month Event – Data Privacy Consent
                </h2>
                <p className="text-sm opacity-90 leading-relaxed">
                    By checking this box, I authorize Moonton Student Leaders (MSL) Philippines
                    to collect and process the personal information provided above for the
                    purpose of verifying my participation and managing the Golden Month Event.
                    <br /><br />
                    I understand that my data will be handled in accordance with the Data Privacy
                    Act of 2012 and will not be shared with unauthorized third parties.
                </p>
                <button onClick={() => setShowTermsModal(false)}
                    className="mt-4 px-6 py-2 bg-[#FFF4D0] text-black rounded-lg font-bold">
                    Close
                </button>
                </div>
            </div>
            )}

        </div>
        </AuthenticatedLayout>
    );
    }

/* ================= REUSABLE INPUT ================= */
function FormInput({ icon, label, name, value, placeholder, onChange, error, tooltip }) {
    return (
        <div>
        <label className="block font-medium mb-1 text-[#fff4d0]">{label}</label>
        <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
            {icon}
            <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-transparent w-full outline-none text-white placeholder:text-white/60"
            />
            {tooltip && <Tooltip text={tooltip} />}
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
}
