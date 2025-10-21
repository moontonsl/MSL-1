import React, { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsWatchFest.jsx";
import ModalMechanics from "./ModalMechanics.jsx";
import { User, Users, CheckCircle } from "lucide-react";
import msllogo from "./msl-logo.png";
import oppologo from "./oppo-white-logo.png";

export default function OPPOxMSLRoadShowTournament() {
  const [form, setForm] = useState({
    teamName: "",
    captain: "",
    player2: "",
    player3: "",
    player4: "",
    player5: "",
    agree: false,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMechanics, setShowMechanics] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validatingUsernames, setValidatingUsernames] = useState({});
  const timeoutRefs = useRef({});

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  const validateUsername = async (username, fieldName) => {
    if (!username.trim()) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: "" }));
      return;
    }

    setValidatingUsernames(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      const response = await fetch(`/school-players?search=${encodeURIComponent(username)}&university=${encodeURIComponent("First Asia Institute of Technology and Humanities")}`);
      const data = await response.json();
      
        if (data && data.length > 0) {
          const user = data.find(u => u.username.toLowerCase() === username.toLowerCase());
          if (user) {
            setValidationErrors(prev => ({ ...prev, [fieldName]: "VALID" }));
          } else {
            setValidationErrors(prev => ({ 
              ...prev, 
              [fieldName]: "Username not found in First Asia Institute of Technology and Humanities" 
            }));
          }
        } else {
          setValidationErrors(prev => ({ 
            ...prev, 
            [fieldName]: "Username not found in First Asia Institute of Technology and Humanities" 
          }));
        }
    } catch (error) {
      console.error("Error validating username:", error);
      setValidationErrors(prev => ({ 
        ...prev, 
        [fieldName]: "Error validating username. Please try again." 
      }));
    } finally {
      setValidatingUsernames(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validate username fields
    if (name === "captain" || name.startsWith("player")) {
      // Clear previous error
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
      
      // Clear existing timeout
      if (timeoutRefs.current[name]) {
        clearTimeout(timeoutRefs.current[name]);
      }
      
      // Debounce validation
      timeoutRefs.current[name] = setTimeout(() => {
        validateUsername(value, name);
      }, 500);
    }
  };

  const handleAgreeFromModal = () => {
    setForm((prev) => ({ ...prev, agree: true }));
    setShowMechanics(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors (excluding VALID status)
    const hasErrors = Object.values(validationErrors).some(error => error !== "" && error !== "VALID");
    if (hasErrors) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    // Check if all usernames are validated
    const usernameFields = ["captain", "player2", "player3", "player4", "player5"];
    const allUsernamesValid = usernameFields.every(field => {
      const username = form[field];
      return username.trim() === "" || validationErrors[field] === "VALID";
    });

    if (!allUsernamesValid) {
      alert("Please wait for username validation to complete.");
      return;
    }

    const googleFormURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSdbHbI2DnJB3d0DcdoSR1nmTt_T5Af0MaN4w2MivO5k8ieEtg/formResponse";

    const formBody = new FormData();
    formBody.append("entry.2008089998", "First Asia Institute of Technology and Humanities");
    formBody.append("entry.1615860502", form.teamName);
    formBody.append("entry.2087994405", form.captain);
    formBody.append("entry.1748019360", form.player2);
    formBody.append("entry.805126702", form.player3);
    formBody.append("entry.1460557887", form.player4);
    formBody.append("entry.1273012540", form.player5);
    formBody.append("entry.1231196655", form.agree ? "Yes" : "No");

    try {
      await fetch(googleFormURL, {
        method: "POST",
        body: formBody,
        mode: "no-cors",
      });

      setShowConfirmModal(true);
      setForm({
        teamName: "",
        captain: "",
        player2: "",
        player3: "",
        player4: "",
        player5: "",
        agree: false,
      });
      setValidationErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="OPPO x MSL Roadshow Tournament" />
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
            Oppo x MSL Roadshow
          </h2>
          <h3 className="text-white text-[16px] sm:text-[22px] lg:text-[26px] font-extrabold leading-relaxed break-words">
            First Asia Institute of Technology and Humanities
          </h3>
        </div>

        {/* Form Container */}
        <div className="bg-black/80 text-white rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-gray-200 text-base sm:text-lg font-bold leading-relaxed">
              Tournament Registration
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Name */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Team Name
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3">
                <Users className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  name="teamName"
                  value={form.teamName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your team name"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Team Captain */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Team Captain Username
              </label>
              <div className={`flex items-center rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3 ${
                validationErrors.captain === "VALID" 
                  ? 'bg-green-500/10 border border-green-500' 
                  : validationErrors.captain 
                    ? 'bg-red-500/10 border border-red-500' 
                    : 'bg-white/5'
              }`}>
                {validatingUsernames.captain ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F2C21A]"></div>
                ) : validationErrors.captain === "VALID" ? (
                  <CheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <User className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <input
                  type="text"
                  name="captain"
                  value={form.captain}
                  onChange={handleChange}
                  required
                  placeholder="Enter team captain username"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              {validationErrors.captain && validationErrors.captain !== "VALID" && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.captain}</p>
              )}
              {validationErrors.captain === "VALID" && (
                <p className="text-green-400 text-xs mt-1">Username is valid!</p>
              )}
            </div>

            {/* Players 2–5 */}
            {[2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label className="block font-medium mb-1 text-sm sm:text-base">{`Player ${num} Username`}</label>
                <div className={`flex items-center rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3 ${
                  validationErrors[`player${num}`] === "VALID" 
                    ? 'bg-green-500/10 border border-green-500' 
                    : validationErrors[`player${num}`] 
                      ? 'bg-red-500/10 border border-red-500' 
                      : 'bg-white/5'
                }`}>
                  {validatingUsernames[`player${num}`] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F2C21A]"></div>
                  ) : validationErrors[`player${num}`] === "VALID" ? (
                    <CheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <User className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <input
                    type="text"
                    name={`player${num}`}
                    value={form[`player${num}`]}
                    onChange={handleChange}
                    required
                    placeholder={`Enter player ${num} username`}
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
                {validationErrors[`player${num}`] && validationErrors[`player${num}`] !== "VALID" && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors[`player${num}`]}</p>
                )}
                {validationErrors[`player${num}`] === "VALID" && (
                  <p className="text-green-400 text-xs mt-1">Username is valid!</p>
                )}
              </div>
            ))}

            {/* Agreement */}
            <div className="flex items-start gap-2 mt-3 sm:mt-4">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                readOnly // prevents manual checking
                className="mt-1 accent-[#F2C21A] cursor-pointer"
              />
              <label className="text-xs sm:text-sm leading-snug">
                {form.agree ? (
                  <>
                    I have read and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowMechanics(true)}
                      className="text-[#F2C21A] underline hover:text-yellow-400 transition-colors"
                    >
                      tournament mechanics
                    </button>.
                  </>
                ) : (
                  <>
                    Please read the{" "}
                    <button
                      type="button"
                      onClick={() => setShowMechanics(true)}
                      className="text-[#F2C21A] underline hover:text-yellow-400 transition-colors"
                    >
                      tournament mechanics
                    </button>{" "}
                    first.
                  </>
                )}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!form.agree || Object.values(validationErrors).some(error => error !== "" && error !== "VALID")}
              className={`w-full mt-4 font-bold py-3 rounded-xl transition-colors text-sm sm:text-base ${
                form.agree && !Object.values(validationErrors).some(error => error !== "" && error !== "VALID")
                  ? "bg-[#F2C21A] hover:bg-[#ddb518] text-black cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              Submit Registration
            </button>


            {/* Logos */}
            <div className="flex flex-row justify-center items-center mt-6 space-x-4 sm:space-x-6">
            <img
                src={oppologo}
                alt="OPPO Logo"
                className="h-12 sm:h-20 w-auto"
            />
            <img
                src={msllogo}
                alt="MSL Logo"
                className="h-10 sm:h-16 w-auto"
            />
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

        {/* Mechanics Modal */}
        {showMechanics && (
          <ModalMechanics
            onClose={() => setShowMechanics(false)}
            onAgree={handleAgreeFromModal}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}