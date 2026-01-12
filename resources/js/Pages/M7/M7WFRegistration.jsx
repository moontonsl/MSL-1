import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "./BG.png";
import FFLogo from "./FF2xMSL_logo.png";
import { User, Mail, MapPin, Calendar, Globe, Hash, ChevronDown } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Info } from "lucide-react";

const regionsData = {
  "Region 1": ["Region 1 - Venue 1", "Region 1 - Venue 2", "Region 1 - Venue 3"],
  "Region 2": ["Region 2 - Venue 1", "Region 2 - Venue 2"],
  "Region 3": ["Region 3 - Venue 1", "Region 3 - Venue 2", "Region 3 - Venue 3"],
};
const eventDatesData = ["2026-02-20", "2026-03-05", "2026-03-20"];

const Tooltip = ({ text }) => (
  <div className="relative group">
    <Info className="w-4 h-4 text-yellow-300 cursor-pointer" />

    <div className="absolute right-0 top-1/2 -translate-y-1/2 ml-2 w-52 
                    opacity-0 group-hover:opacity-100 transition
                    pointer-events-none z-50">
      <div className="bg-black text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-white">
        {text}
      </div>
    </div>
  </div>
);

export default function M7WFRegistration() {
  const [form, setForm] = useState({
    fullName: "",
    region: "",
    venue: "",
    eventDate: "",
    email: "",
    mlbbId: "",
    mlbbServer: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const [showModal, setShowModal] = useState(false);


  // Update handleChange to reset venue when region changes
  const handleChange = (e) => {
    const { name, value } = e.target;

  let newValue = value;

  // Allow numbers only for MLBB fields
  if (name === "mlbbId" || name === "mlbbServer") {
    newValue = value.replace(/\D/g, "");
  }

  setForm((prev) => {
    if (name === "region") {
      return { ...prev, region: newValue, venue: "" };
    }
    return { ...prev, [name]: newValue };
  });

  setErrors((prev) => ({ ...prev, [name]: "" }));
};

  // Validation helpers
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const isValidMlbbId = (id) => {
    return /^\d{8,12}$/.test(id); // 8 to 12 digits
  };

  const isValidMlbbServer = (s) => {
    return /^\d{4,6}$/.test(s); // 4 to 6 digits
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.region) newErrors.region = "Region is required.";
    if (!form.venue.trim()) newErrors.venue = "Venue is required.";
    if (!form.eventDate) newErrors.eventDate = "Event date is required.";

    if (!form.email.trim()) {
        newErrors.email = "Email address is required.";
        } else if (!isValidEmail(form.email.trim())) {
        newErrors.email = "Please input a valid email address.";
        }

    if (!form.mlbbId.trim()) newErrors.mlbbId = "MLBB User ID is required.";
    else if (!isValidMlbbId(form.mlbbId.trim())) newErrors.mlbbId = "MLBB User ID must be 8 to 12 digits.";

    if (!form.mlbbServer.trim()) newErrors.mlbbServer = "MLBB Server ID is required.";
    else if (!isValidMlbbServer(form.mlbbServer.trim())) newErrors.mlbbServer = "MLBB Server ID must be 4 to 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage("");
    if (!validate()) {
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      region: form.region,
      venue: form.venue.trim(),
      eventDate: form.eventDate,
      email: form.email.trim(),
      mlbbId: form.mlbbId.trim(),
      mlbbServer: form.mlbbServer.trim(),
    };

    try {
      setSubmitting(true);
      console.log("Ready to send to backend:", payload);

      // Simulate a successful server reply (remove simulation when real BE exists)
      await new Promise((res) => setTimeout(res, 700));
      setShowModal(true);
      setForm({
        fullName: "",
        region: "",
        venue: "",
        eventDate: "",
        email: "",
        mlbbId: "",
        mlbbServer: "",
      });
    } catch (err) {
      console.error(err);
      setSubmissionMessage("Submission failed (sample). Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="M7WF Registration" />
      <Helmet>
        <title>M7WF Registration</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div
        className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
      >
        <Link href="/M7WF">
          <img
            src={FFLogo}
            alt="M7WF Logo"
            className="w-64 sm:w-80 drop-shadow-lg mb-6 cursor-pointer"
          />
        </Link>

        <div
          className="rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto border-2 backdrop-blur-md bg-[#1a1f7a]/75"
          style={{
            borderColor: "#fcd821",
            borderWidth: "2px",
          }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="text-center">
              <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#fcd821]">
                M7WF REGISTRATION
              </h2>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Full Name</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <User className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* REGION */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Region</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <MapPin className="text-[#fcd821] w-5 h-5" />
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                >
                  <option value="" disabled className="text-black">Select your region</option>
                    {Object.keys(regionsData).map((region, idx) => (
                    <option key={idx} value={region} className="text-black">
                        {region}
                    </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
              {errors.region && <p className="text-red-400 text-sm mt-1">{errors.region}</p>}
            </div>

            {/* Venue (dependent on selected Region) */}
            <div>
            <label className="block font-medium mb-1 text-sm sm:text-base">Venue</label>
            <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <MapPin className="text-[#fcd821] w-5 h-5" />
                <select
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                disabled={!form.region} // disable until a region is selected
                >
                <option value="" disabled className="text-black">
                    {form.region ? "Select your venue" : "Select a region first"}
                </option>
                {(regionsData[form.region] || []).map((venue, idx) => (
                    <option key={idx} value={venue} className="text-black">
                    {venue}
                    </option>
                ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
            </div>
            {errors.venue && <p className="text-red-400 text-sm mt-1">{errors.venue}</p>}
            </div>

            {/* Event Date (dropdown) */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Event Date</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <Calendar className="text-[#fcd821] w-5 h-5" />
                <select
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                >
                  <option value="" disabled className="text-black">Select event date</option>
                  {eventDatesData.map((dt, idx) => (
                    <option key={idx} value={dt} className="text-black">{dt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
              {errors.eventDate && <p className="text-red-400 text-sm mt-1">{errors.eventDate}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Email Address</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <Mail className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                />
                <Tooltip text="Use an active email address where we can contact you." />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* MLBB ID */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">MLBB User ID</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <Hash className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="mlbbId"
                  value={form.mlbbId}
                  onChange={handleChange}
                  placeholder="Enter MLBB User ID (8-12 digits)"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                />
                <Tooltip text="Found in your MLBB Profile. Example: 123456789" />
              </div>
              {errors.mlbbId && <p className="text-red-400 text-sm mt-1">{errors.mlbbId}</p>}
            </div>

            {/* MLBB Server */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">MLBB Server (Zone) ID</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <Globe className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="mlbbServer"
                  value={form.mlbbServer}
                  onChange={handleChange}
                  placeholder="Enter MLBB Server ID (4-6 digits)"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                />
                <Tooltip text="The number in parentheses next to your UID. Example: (3024)" />
              </div>
              {errors.mlbbServer && <p className="text-red-400 text-sm mt-1">{errors.mlbbServer}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 font-bold py-3 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "REGISTER"}
            </button>

            {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-black text-white p-8 rounded-2xl shadow-xl text-center min-w-64 border border-white">
                <h2 className="text-xl font-semibold mb-4">
                    Registration Submitted Successfully!
                </h2>

                <p className="text-sm opacity-80">
                    Your registration has been recorded.
                </p>

                <button
                    onClick={() => setShowModal(false)}
                    className="mt-6 px-6 py-2 rounded-lg bg-yellow-300 text-gray-800 font-bold cursor-pointer text-base hover:bg-yellow-400 transition"
                >
                    Close
                </button>
                </div>
            </div>
            )}
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
/*FrontEnd by PD Dev - Jaijai*/