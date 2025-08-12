import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBattleTrips.jsx";
import { Helmet } from "react-helmet";
import styles from "./MPLS16Battletrips.module.scss";

const SCHOOL_AREAS = ["Luzon", "Visayas", "Mindanao"];
const COMMUNITIES = ["Moonton Student Leader", "Community Heroes"];

const MPL16Battletrips = () => {
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    email: "",
    contactNumber: "",
    fbLink: "",
    mlbbId: "",
    mlbbServer: "",
    schoolName: "",
    schoolArea: "",
    validIdLink: "",
    community: "",
    smartSubscriber: "",
    smartAnswer: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (showError) {
      setErrorVisible(true);
      const timer = setTimeout(() => setShowError(false), 3000); // Auto-hide after 3s
      return () => clearTimeout(timer);
    }
  }, [showError]);

  useEffect(() => {
    if (!showError) {
      const timer = setTimeout(() => setErrorVisible(false), 500); // Match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e, field) => {
    const val = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.smartSubscriber !== "Yes" && form.smartSubscriber !== "No") {
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append("entry.1221870114", form.fullName);
    formData.append("entry.633497335", form.age);
    formData.append("entry.23075109", form.email);
    formData.append("entry.9346476", form.contactNumber);
    formData.append("entry.740517787", form.fbLink);
    formData.append("entry.698807122", form.mlbbId);
    formData.append("entry.1253661770", form.mlbbServer);
    formData.append("entry.1432545897", form.schoolName);
    formData.append("entry.295064081", form.schoolArea);
    formData.append("entry.1099317544", form.validIdLink);
    formData.append("entry.110160603", form.community);
    formData.append("entry.2019885045", form.smartSubscriber);

    fetch(
      "https://docs.google.com/forms/d/1KKpGYy7xF5lAJ7NUV_w_FyMxEh6Pyewz6uVEeYWSTqM/formResponse",
      {
        method: "POST",
        body: formData,
        mode: "no-cors",
      }
    )
      .then(() => {
        setShowModal(true);
        setForm({
          fullName: "",
          age: "",
          email: "",
          contactNumber: "",
          fbLink: "",
          mlbbId: "",
          mlbbServer: "",
          schoolName: "",
          schoolArea: "",
          validIdLink: "",
          community: "",
          smartSubscriber: "",
          smartAnswer: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  return (
    <>
      <Head title="MPLS16 Battle Trips" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[70vh] md:min-h-screen px-2 md:px-4">
          <div className="w-full max-w-[365px] md:max-w-2xl text-center relative z-20 -mt-16 mb-10 px-4">
            <img
              src="/BTLogo.png"
              alt="Battle Trips Logo"
              className="w-[250px] h-[200px] md:w-[400px] md:h-[320px] mt-6 md:mt-5 block mx-auto object-contain"
            />

            <div className="text-black mt-[-50px] mb-4 text-lg md:text-xl font-medium pt-4 md:pt-0">
              The MPL Battle Trips is an 8-week event where fans of MLBB from
              around the Philippines will be given a chance to visit the MPL PH
              venue and enjoy the MLBB Events.
            </div>

            <img
              src="/mcclogo.png"
              alt="Second Image Description"
              className="w-[200px] h-auto md:w-[300px] mx-auto mb-6 object-contain"
            />

            <div className="rounded-xl pt-4 px-4 pb-10 md:rounded-3xl md:p-10 shadow-lg md:shadow-2xl border border-black bg-white">
              <div className="text-black font-bold text-lg md:text-3xl mb-4 md:mb-6">
                MPL Battle Trips Mini Game!
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => handleNumericChange(e, "age")}
                  required
                  className={styles.inputField}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={form.contactNumber}
                  onChange={(e) => handleNumericChange(e, "contactNumber")}
                  required
                  className={styles.inputField}
                />
                <input
                  type="url"
                  name="fbLink"
                  placeholder="Facebook Link"
                  value={form.fbLink}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="mlbbId"
                  placeholder="MLBB ID (ie. 9923103)"
                  value={form.mlbbId}
                  onChange={(e) => handleNumericChange(e, "mlbbId")}
                  required
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="mlbbServer"
                  placeholder="ML Server (ie. 5932)"
                  value={form.mlbbServer}
                  onChange={(e) => handleNumericChange(e, "mlbbServer")}
                  required
                  className={styles.inputField}
                />
                <input
                  type="text"
                  name="schoolName"
                  placeholder="Your School Name or CH Area"
                  value={form.schoolName}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />

                <select
                  name="schoolArea"
                  value={form.schoolArea}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                >
                  <option value="" disabled>
                    Select School Area
                  </option>
                  {SCHOOL_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>

                <input
                  type="url"
                  name="validIdLink"
                  placeholder="Drive Link of your valid ID"
                  value={form.validIdLink}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />

                <select
                  name="community"
                  value={form.community}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                >
                  <option value="" disabled>
                    Select Community
                  </option>
                  {COMMUNITIES.map((com) => (
                    <option key={com} value={com}>
                      {com}
                    </option>
                  ))}
                </select>

                <div className="text-black font-semibold mb-2">
                  Are you a Smart Subscriber?
                </div>
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        smartAnswer: "Yes",
                        smartSubscriber: "Yes",
                      }))
                    }
                    className={`px-6 py-2 rounded-lg border ${
                      form.smartAnswer === "Yes"
                        ? "bg-yellow-400 text-black"
                        : "bg-black text-white border-white"
                    } hover:bg-yellow-400 hover:text-black`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        smartAnswer: "No",
                        smartSubscriber: "No",
                      }))
                    }
                    className={`px-6 py-2 rounded-lg border ${
                      form.smartAnswer === "No"
                        ? "bg-yellow-400 text-black"
                        : "bg-black text-white border-white"
                    } hover:bg-yellow-400 hover:text-black`}
                  >
                    No
                  </button>
                </div>

                {errorVisible && (
                  <p
                    className={`text-red-500 text-sm mb-2 transition-opacity duration-500 ease-in-out ${
                      showError ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Please select either "Yes" or "No" for Smart Subscriber.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-3/5 mx-auto mt-2 py-3 rounded-lg bg-yellow-400 text-black font-bold border border-black text-sm md:text-base cursor-pointer transition-all duration-200 hover:bg-yellow-500 hover:border-yellow-600 hover:text-white"
                >
                  Submit Answer
                </button>
              </form>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black text-white p-8 rounded-2xl shadow-xl text-center min-w-64 border border-white">
              <h2 className="text-xl font-semibold mb-4">
                Registration Submitted Successfully!
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-6 py-2 rounded-lg border-none bg-yellow-300 text-gray-800 font-bold cursor-pointer text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AuthenticatedLayout>
    </>
  );
};

export default MPL16Battletrips;
