import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "./BG.png";
import FFLogo from "./FF2xMSL_logo.png";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Hash,
  ChevronDown,
  School,
} from "lucide-react";

// Dummy data
const regionsData = ["Region 1", "Region 2", "Region 3"]; 
const schoolsData = ["School A", "School B", "School C"]; 

export default function FF25Attendance() {
  const [hasAccount, setHasAccount] = useState("yes");
  const [form, setForm] = useState({
    region: "",
    school: "",
    date: "",
    username: "",
    fullname: "",
    email: "",
    mlbbid: "",
    mlbbserver: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SEND TO BACKEND:", { hasAccount, ...form });
    alert("Attendance Submitted Successfully");
  };

  return (
    <AuthenticatedLayout>
      <Head title="FF25 Attendance Registration" />
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div
        className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
      >

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <img 
            src={FFLogo} 
            alt="FF25 MSL Logo" 
            className="w-48 sm:w-56 mx-auto mb-4 drop-shadow-lg" 
          />
        </div>

        {/* Form Card */}
          <div
            className="rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto border backdrop-blur-md bg-[#1a1f7a]/75 ]"
            style={{
              borderColor: "#fcd821",
              borderWidth: "2px",
            }}
          >

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#fcd821]">
                ATTENDANCE REGISTRATION
              </h2>
            </div>

            {/* DROPDOWN: Do you have MSL Account? */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Do you have an MSL Account?</label>

              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">

                {/* Left yellow circle */}
                <div className="w-5 h-5 rounded-full bg-[#fcd821]"></div>

                {/* Select */}
                <select
                  name="hasAccount"
                  value={hasAccount}
                  onChange={(e) => setHasAccount(e.target.value)}
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"  
                >
                  <option value="yes" className="text-black">Yes</option>
                  <option value="no" className="text-black">No</option>
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
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
                  {regionsData.map((region, idx) => (
                    <option key={idx} value={region} className="text-black">{region}</option>
                  ))}
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
            </div>


            {/* SCHOOL */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">School</label>

              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <School className="text-[#fcd821] w-5 h-5" />

                <select
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" 
                >
                  <option value="" disabled className="text-black">Select your school</option>
                  {schoolsData.map((school, idx) => (
                    <option key={idx} value={school} className="text-black">{school}</option>
                  ))}
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
            </div>


            {/* MSL Username */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">MSL Username</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <User className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={hasAccount === "no" ? "No Account" : form.username}
                  onChange={hasAccount === "yes" ? handleChange : undefined}
                  readOnly={hasAccount === "no"}
                  placeholder="Enter your MSL username"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" 
                />
              </div>
            </div>


            {/* Extra Fields if NO account */}
            {hasAccount === "no" && (
              <>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Full Name</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <User className="text-[#fcd821] w-5 h-5" />
                    <input type="text" name="fullname" value={form.fullname} onChange={handleChange} required placeholder="Enter your full name" 
                    className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Email Address</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <Mail className="text-[#fcd821] w-5 h-5" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" 
                    className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"  />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">MLBB ID</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <Hash className="text-[#fcd821] w-5 h-5" />
                    <input type="text" name="mlbbid" value={form.mlbbid} onChange={handleChange} required placeholder="Enter MLBB ID" 
                    className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">MLBB Server</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <Globe className="text-[#fcd821] w-5 h-5" />
                    <input type="text" name="mlbbserver" value={form.mlbbserver} onChange={handleChange} required placeholder="Enter MLBB server" 
                    className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"  />
                  </div>
                </div>
              </>
            )}


            {/* DATE */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Date</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <Calendar className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  placeholder="Enter event date"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" 
                />
              </div>
            </div>


            <button type="submit" className="w-full mt-4 font-bold py-3 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors">
              REGISTER
            </button>

          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}