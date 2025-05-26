import React, { useState, useEffect } from "react";
import "../../../../../2025NewRepo/client/src/styles/MPLWatchFestS15.css";

const regionVenueMap = {
  Luzon: [
    "Philippine Normal University",
    "PNU Sulo",
    "Still Finalizing"
  ],
  Visayas: [
    "Southwestern University PHINMA",
    "Cobra Esports",
    "PHINMA Hall  Building"
  ],
  Mindanao: [
    "Father Saturnino Urios University",
    "The Urian Arena Vanguards",
    "SM Butuan"
  ]
};

const MPLWatchFestS15 = () => {
  const [form, setForm] = useState({
    fullName: "",
    region: "Luzon",
    venue: "",
    birthday: "",
    email: "",
    mlbbId: "",
    mlbbServer: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // Reset venue if region changes
      if (name === "region") {
        return { ...prev, region: value, venue: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleNumericChange = (e, field) => {
    const val = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("entry.1221870114", form.fullName);
    formData.append("entry.633497335", form.region);
    formData.append("entry.23075109", form.venue);
    formData.append("entry.9346476", form.birthday);
    formData.append("entry.740517787", form.email);
    formData.append("entry.698807122", form.mlbbId);
    formData.append("entry.1253661770", form.mlbbServer);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLScaB3t_V5iznVt9y2W2pOz35BDEzcrnTqyje1D3D08hMwsLmQ/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: formData,
    }).then(() => {
      setShowModal(true);
      setForm({
        fullName: "",
        region: "Luzon",
        venue: "",
        birthday: "",
        email: "",
        mlbbId: "",
        mlbbServer: "",
      });
    });
  };

  return (
    <div className="mplwf-bg">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img src="MPLWFLOGO.png" alt="MPL Logo" className="mplwf-logo" />
        <div className="mplwf-form-container">
          <div className="mplwf-title">REGISTRATION DETAILS</div>
          <form onSubmit={handleSubmit} className="mplwf-form">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className="mplwf region-select"
              required
            >
              <option value="Luzon">Luzon</option>
              <option value="Visayas">Visayas</option>
              <option value="Mindanao">Mindanao</option>
            </select>
            <select
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className="mplwf venue-select"
              required
            >
              <option value="" disabled>
                Select Venue
              </option>
              {regionVenueMap[form.region].map((venue) => (
                <option key={venue} value={venue}>
                  {venue}
                </option>
              ))}
            </select>
            <div className="mplwf-date-wrapper">
              <select
                id="birthday"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                className="mplwf date-select"
                required
              >
                <option value="" disabled>
                  Please select a date
                </option>
                <option value="2025-05-31">May 31, 2025</option>
                <option value="2025-06-01">June 1, 2025</option>
              </select>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Valid Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="mlbbId"
              placeholder="MLBB ID (ie. 9923103)"
              value={form.mlbbId}
              onChange={e => handleNumericChange(e, "mlbbId")}
              required
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="mlbbServer"
              placeholder="MLBB Server (ie. 5932)"
              value={form.mlbbServer}
              onChange={e => handleNumericChange(e, "mlbbServer")}
              required
            />
            <button type="submit">
              Submit Registration
            </button>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="mplwf-modal-overlay">
          <div className="mplwf-modal">
            <h2>Registration Submitted Successfully!</h2>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPLWatchFestS15;
