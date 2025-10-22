import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsWatchFest.jsx";
import { User, Mail, MapPin, Calendar, Globe, Hash } from "lucide-react";
import msllogo from "./msl-logo.png";
import oppologo from "./oppo-white-logo.png";

export default function OPPOxMSLRoadShowAttendance() {
  const [form, setForm] = useState({
    fullname: "",
    region: "Luzon",
    venue: "First Asia Institute of Technology and Humanities",
    date: "November 03, 2025",
    email: "",
    mlbbid: "",
    mlbbserver: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const googleFormURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSegLw_p164UuZanT6oO_P3IA9vw34jn6VOvvhgHvpHgzt7MmA/formResponse";

    const formBody = new FormData();
    formBody.append("entry.1221870114", form.fullname);
    formBody.append("entry.633497335", form.region);
    formBody.append("entry.23075109", form.venue);
    formBody.append("entry.9346476", form.date);
    formBody.append("entry.740517787", form.email);
    formBody.append("entry.698807122", form.mlbbid);
    formBody.append("entry.1253661770", form.mlbbserver);

    try {
      await fetch(googleFormURL, {
        method: "POST",
        body: formBody,
        mode: "no-cors",
      });

      setShowConfirmModal(true);
      setForm({
        fullname: "",
        region: "Luzon",
        venue: "First Asia Institute of Technology and Humanities",
        date: "November 03, 2025",
        email: "",
        mlbbid: "",
        mlbbserver: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="OPPO x MSL Roadshow Registration" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-10 sm:pt-20 font-['Montserrat']">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#F2C21A] leading-tight">
            OPPO x MSL Roadshow
          </h2>
          <h3 className="text-white text-[16px] sm:text-[22px] lg:text-[26px] font-extrabold leading-relaxed">
            First Asia Institute of Technology and Humanities
          </h3>
        </div>

        {/* Form Container */}
        <div className="bg-black/80 text-white rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-gray-200 text-base sm:text-lg font-bold leading-relaxed">
              Roadshow Registration
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Full Name
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <User className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Region Dropdown */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Region
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <MapPin className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="text"
                  name="region"
                  value={form.region}
                  readOnly
                  className="bg-transparent flex-1 outline-none text-gray-400 text-sm sm:text-base cursor-not-allowed"
                  />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Venue
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <Globe className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="text"
                  name="venue"
                  value={form.venue}
                  readOnly
                  className="bg-transparent flex-1 outline-none text-gray-400 text-sm sm:text-base cursor-not-allowed"
                />
              </div>
            </div>

            {/* Date Dropdown */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Date
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <Calendar className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  readOnly
                  className="bg-transparent flex-1 outline-none text-gray-400 text-sm sm:text-base cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Email Address
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <Mail className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* MLBB ID */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                MLBB ID
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <Hash className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="text"
                  name="mlbbid"
                  value={form.mlbbid}
                  onChange={handleChange}
                  required
                  placeholder="Enter your MLBB ID"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* MLBB Server */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                MLBB Server
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-3">
                <Globe className="text-[#F2C21A] w-5 h-5" />
                <input
                  type="text"
                  name="mlbbserver"
                  value={form.mlbbserver}
                  onChange={handleChange}
                  required
                  placeholder="Enter your MLBB server"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 font-bold py-3 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors text-sm sm:text-base"
            >
              Submit Registration
            </button>

            {/* Logos */}
            <div className="flex flex-row justify-center items-center mt-6 space-x-4 sm:space-x-6">
              <img src={oppologo} alt="OPPO Logo" className="h-12 sm:h-20 w-auto" />
              <img src={msllogo} alt="MSL Logo" className="h-10 sm:h-16 w-auto" />
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              className="bg-black text-white border border-[#F2C21A] p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#F2C21A]">
                Registration Submitted!
              </h2>
              <p className="mb-4 text-sm sm:text-base">
                Thank you for registering for the{" "}
                <strong>OPPO x MSL Roadshow Tournament!</strong>
                <br /> We’ll contact you soon with further details.
              </p>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-[#F2C21A] hover:bg-[#ddb518] text-black font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
