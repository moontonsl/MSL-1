import React, { useState } from "react";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    squadName: user.squadName || "",
    year_level: user.year_level || "",
    ml_ign: user.ml_ign || "",
    ml_id: user.ml_id || "",
    ml_server: user.ml_server || "",
    email: user.email || "",
    contact_number: user.contact_number || "",
    facebook: user.facebook || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Saving data:", formData);
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-2"
      onClick={onClose}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* Modal Box */}
      <div
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 
                  rounded-2xl shadow-2xl w-[90%] max-w-xs md:max-w-5xl 
                  p-6 border border-yellow-500/30 z-10
                  max-h-[70vh] overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800 mt-12 md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400 transition"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4 md:mb-6 border-b border-yellow-500/30 pb-2">
          ✨ Edit Profile
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-5">
            <div>
              <label className="text-sm text-gray-300">Squad Name</label>
              <input
                type="text"
                name="squadName"
                value={formData.squadName}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Year Level</label>
              <input
                type="text"
                name="year_level"
                value={formData.year_level}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">MLBB IGN</label>
              <input
                type="text"
                name="ml_ign"
                value={formData.ml_ign}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">MLBB ID</label>
                <input
                  type="text"
                  name="ml_id"
                  value={formData.ml_id}
                  onChange={handleChange}
                  className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Server</label>
                <input
                  type="text"
                  name="ml_server"
                  value={formData.ml_server}
                  onChange={handleChange}
                  className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-5">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
              <p className="text-xs text-yellow-400 mt-1 md:mt-2">
                ⚠️ Changing your email may require re-verification.
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Facebook Account</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 md:gap-4 mt-6 md:mt-8">
          <button
            className="px-4 md:px-5 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition text-sm md:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 md:px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition shadow-lg text-sm md:text-base"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}