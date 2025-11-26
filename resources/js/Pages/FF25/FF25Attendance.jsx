import React, { useState, useEffect, useMemo, useRef } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import axios from "axios";
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

// Simple debounce helper
function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const FEATURED_SCHOOLS = [
  { name: "Ateneo de Davao University", region: "11 - Davao Region", island: "Mindanao" },
  { name: "Batangas State University-Alangilan", region: "04 - CALABARZON", island: "Luzon" },
  { name: "Talisay City College", region: "07 - Central Visayas", island: "Visayas" },
  { name: "City College of San Fernando", region: "03 - Central Luzon", island: "Luzon" },
  { name: "Laguna State Polytechnic University-Los Baños", region: "04 - CALABARZON", island: "Luzon" },
  { name: "La Salle University", region: "10 - Northern Mindanao", island: "Mindanao" },
  { name: "Mindanao State University - Iligan Institute of Technology", region: "10 - Northern Mindanao", island: "Mindanao" },
  { name: "PHINMA St. Jude College", region: "13 - Nat. Capital Region", island: "Luzon" },
  { name: "University of the Philippines-Diliman", region: "13 - Nat. Capital Region", island: "Luzon" },
  { name: "University of San Carlos - Cebu", region: "07 - Central Visayas", island: "Visayas" },
];

const FEATURED_REGION_NAMES = Array.from(new Set(FEATURED_SCHOOLS.map((school) => school.region)));

export default function FF25Attendance() {
  const { flash, errors } = usePage().props;
  const [hasAccount, setHasAccount] = useState("yes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState([]);
  const [regionId, setRegionId] = useState("");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [isSchoolValid, setIsSchoolValid] = useState(true);
  const [usernameStatus, setUsernameStatus] = useState({ message: "", type: "" });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  const dropdownRef = useRef(null);
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

  // Load regions on mount
  useEffect(() => {
    axios.get("/regions")
      .then((response) => {
        const limitedRegions = response.data.filter((region) =>
          FEATURED_REGION_NAMES.includes(region.name)
        );
        setRegions(limitedRegions);
      })
      .catch((error) => {
        console.error("Error fetching regions:", error);
      });
  }, []);

  const debouncedUsernameCheck = useMemo(
    () =>
      debounce(async ({ username, region, school }) => {
        try {
          setIsCheckingUsername(true);
          const response = await axios.get("/ff25/check-username", {
            params: { username, region, school },
          });
          const data = response.data;

          if (data.exists && data.matches?.region && data.matches?.school) {
            setUsernameStatus({
              message: data.message || "Username matches the selected region and school.",
              type: "success",
            });
            
            // Auto-populate user data if available
            if (data.user_data) {
              setForm((prev) => ({
                ...prev,
                fullname: data.user_data.full_name || prev.fullname,
                email: data.user_data.email || prev.email,
                mlbbid: data.user_data.mlbb_id || prev.mlbbid,
                mlbbserver: data.user_data.mlbb_server || prev.mlbbserver,
              }));
            }
          } else if (data.exists) {
            setUsernameStatus({
              message: data.message || "Username found but details do not match.",
              type: "error",
            });
          } else {
            setUsernameStatus({
              message: data.message || "Username not found.",
              type: "error",
            });
          }
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Unable to verify username right now. Please try again.";
          setUsernameStatus({ message, type: "error" });
        } finally {
          setIsCheckingUsername(false);
        }
      }, 500),
    []
  );

  const triggerUsernameValidation = (usernameValue, currentFormState = form) => {
    if (hasAccount !== "yes") {
      setUsernameStatus({ message: "", type: "" });
      return;
    }

    const trimmedUsername = (usernameValue || "").trim();
    if (!trimmedUsername) {
      setUsernameStatus({ message: "", type: "" });
      return;
    }

    if (!currentFormState.region || !currentFormState.school) {
      setUsernameStatus({
        message: "Select your region and school first.",
        type: "warning",
      });
      return;
    }

    if (!isSchoolValid) {
      setUsernameStatus({
        message: "Please choose a valid school from the list.",
        type: "warning",
      });
      return;
    }

    setUsernameStatus({ message: "Checking username...", type: "info" });
    debouncedUsernameCheck({
      username: trimmedUsername,
      region: currentFormState.region,
      school: currentFormState.school,
    });
  };

  useEffect(() => {
    if (hasAccount !== "yes") {
      setUsernameStatus({ message: "", type: "" });
      return;
    }

    if (form.username.trim()) {
      triggerUsernameValidation(form.username, form);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccount, form.region, form.school]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Keep dropdown open on click outside for better UX
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "username") {
        triggerUsernameValidation(value, updated);
      }
      return updated;
    });
  };

  const handleRegionChange = (e) => {
    const selectedRegionId = e.target.value;
    const selectedRegion = regions.find(r => r.id.toString() === selectedRegionId);
    
    setRegionId(selectedRegionId);
    setForm((prev) => ({ 
      ...prev, 
      region: selectedRegion ? selectedRegion.name : "",
      school: "" // Clear school when region changes
    }));
    setSchoolQuery("");
    setFilteredSchools([]);
  };

  const filterSchools = (value, selectedRegionName) => {
    if (!value || value.trim() === "") {
      setFilteredSchools([]);
      setIsSchoolValid(true);
      return;
    }

    const normalizedValue = value.toLowerCase();
    let schools = FEATURED_SCHOOLS.filter((school) =>
      school.name.toLowerCase().includes(normalizedValue)
    );

    if (selectedRegionName) {
      schools = schools.filter((school) => school.region === selectedRegionName);
    }

    setFilteredSchools(schools);
    const isValid = schools.some(
      (school) => school.name.toLowerCase() === normalizedValue
    );
    setIsSchoolValid(isValid);
  };

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setSchoolQuery(value);
    setForm((prev) => ({ ...prev, school: value }));
    const selectedRegion = regions.find((r) => r.id.toString() === regionId);
    filterSchools(value, selectedRegion ? selectedRegion.name : "");
  };

  const handleSchoolSelect = (school) => {
    setForm((prev) => ({ ...prev, school: school.name }));
    setSchoolQuery(school.name);
    setFilteredSchools([]);
    setIsSchoolValid(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate school selection - if school is entered but not valid, prevent submission
    if (form.school.trim() && !isSchoolValid) {
      alert("Please select a valid school from the dropdown list.");
      return;
    }
    
    // Validate MSL username when account is yes
    if (hasAccount === "yes" && !form.username.trim()) {
      alert("Please enter your MSL username.");
      return;
    }
    
    setIsSubmitting(true);

    const payload = {
      has_msl_account: hasAccount,
      region: form.region,
      school: form.school,
      event_date: form.date,
      msl_username: hasAccount === "no" ? "No Account" : form.username,
      full_name: hasAccount === "no" ? form.fullname : (form.fullname || null),
      email: hasAccount === "no" ? form.email : (form.email || null),
      mlbb_id: hasAccount === "no" ? form.mlbbid : (form.mlbbid || null),
      mlbb_server: hasAccount === "no" ? form.mlbbserver : (form.mlbbserver || null),
    };

    router.post(route("ff25.attendance.store"), payload, {
      preserveScroll: true,
      onSuccess: () => {
        setForm({
          region: "",
          school: "",
          date: "",
          username: "",
          fullname: "",
          email: "",
          mlbbid: "",
          mlbbserver: "",
        });
        setHasAccount("yes");
        setRegionId("");
        setSchoolQuery("");
        setFilteredSchools([]);
        setIsSchoolValid(true);
        setModalInfo({
          open: true,
          type: "success",
          title: "Registration Success",
          message: "Your attendance has been recorded successfully.",
        });
      },
      onError: (serverErrors) => {
        const errorMessage =
          serverErrors?.username ||
          serverErrors?.fullname ||
          "Something went wrong. Please check your inputs and try again.";

        setModalInfo({
          open: true,
          type: "error",
          title: "Registration Failed",
          message: errorMessage,
        });
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const closeModal = () => {
    setModalInfo((prev) => ({ ...prev, open: false }));
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
            {flash?.success && (
              <div className="rounded-xl border border-green-500 bg-green-500/20 px-4 py-3 text-center text-sm font-semibold text-green-100">
                {flash.success}
              </div>
            )}
            {errors?.username && (
              <div className="rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-center text-sm font-semibold text-red-100">
                {errors.username}
              </div>
            )}
            {errors?.fullname && (
              <div className="rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-center text-base font-bold text-red-100">
                {errors.fullname}
              </div>
            )}
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
                  value={regionId}
                  onChange={handleRegionChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" 
                >
                  <option value="" disabled className="text-black">Select your region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id} className="text-black">{region.name}</option>
                  ))}
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
            </div>


            {/* SCHOOL */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">School</label>
              <div className="relative" ref={dropdownRef}>
                <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                  <School className="text-[#fcd821] w-5 h-5" />
                  <input
                    type="text"
                    name="school"
                    value={schoolQuery}
                    onChange={handleSchoolChange}
                    required
                    placeholder="Type to search your school"
                    className={`bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border ${
                      isSchoolValid ? 'border-white/50' : 'border-red-500'
                    }`}
                  />
                </div>
                
                {/* School Dropdown */}
                {filteredSchools.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-[#1a1f7a]/95 rounded-xl border border-[#fcd821]/50 max-h-60 overflow-y-auto">
                    {filteredSchools.map((school) => (
                      <div
                        key={school.id}
                        onClick={() => handleSchoolSelect(school)}
                        className="px-4 py-2 hover:bg-[#fcd821]/20 cursor-pointer text-white border-b border-white/10 last:border-b-0"
                      >
                        <div className="font-medium">{school.name}</div>
                        {(school.region || school.island) && (
                          <div className="text-xs text-white/70">
                            {school.region && <span>{school.region}</span>}
                            {school.region && school.island && <span> • </span>}
                            {school.island && <span>{school.island}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {!isSchoolValid && schoolQuery && (
                  <p className="mt-1 text-xs text-red-400">Please select a school from the dropdown</p>
                )}
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
                  required={hasAccount === "yes"}
                  placeholder="Enter your MSL username"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" 
                />
              </div>
              {hasAccount === "yes" && usernameStatus.message && (
                <p
                  className={`mt-1 text-base font-semibold ${
                    {
                      success: "text-green-400",
                      error: "text-red-400",
                      warning: "text-yellow-300",
                      info: "text-white/70",
                    }[usernameStatus.type] || "text-white/70"
                  }`}
                >
                  {isCheckingUsername ? "Checking username..." : usernameStatus.message}
                </p>
              )}
              {hasAccount === "yes" && errors?.username && (
                <p className="mt-1 text-sm font-semibold text-red-400">
                  {errors.username}
                </p>
              )}
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
                  {errors?.fullname && (
                    <p className="mt-1 text-base font-semibold text-red-300">
                      {errors.fullname}
                    </p>
                  )}
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
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" 
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 font-bold py-3 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "REGISTER"}
            </button>

          </form>
        </div>

        {modalInfo.open && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#1a1f7a] border border-[#fcd821] p-6 text-center shadow-2xl">
              <h3
                className={`text-2xl font-bold mb-3 ${
                  modalInfo.type === "success" ? "text-[#fcd821]" : "text-red-400"
                }`}
              >
                {modalInfo.title}
              </h3>
              <p className="text-white text-base mb-6">{modalInfo.message}</p>
              <button
                onClick={closeModal}
                className={`w-full py-2 rounded-xl font-semibold ${
                  modalInfo.type === "success"
                    ? "bg-[#fcd821] text-[#1a1f7a]"
                    : "bg-red-500 text-white"
                }`}
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