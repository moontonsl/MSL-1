import { useState } from "react";

const universityData = {
  "University of the Philippines": { island: "Luzon", region: "NCR" },
  "University of San Carlos": { island: "Visayas", region: "Region VII" },
  "Ateneo de Davao University": { island: "Mindanao", region: "Region XI" },
};

const Step2EducationDetails = ({
  formData,
  handleInputChange,
  handleSubmit,
  setErrorMessage,
}) => {
  const [localError, setLocalError] = useState("");

  const handleUniversityChange = (e) => {
    const { value } = e.target;
    handleInputChange(e); // update university

    if (universityData[value]) {
      const { island, region } = universityData[value];
      handleInputChange({ target: { name: "island", value: island } });
      handleInputChange({ target: { name: "region", value: region } });
    } else {
      handleInputChange({ target: { name: "island", value: "" } });
      handleInputChange({ target: { name: "region", value: "" } });
    }
  };

  const handleAnyInputChange = (e) => {
    handleInputChange(e);
    // Validate after every change, clear error if valid
    if (localError) {
      if (validateForm()) {
        setLocalError('');
        if (setErrorMessage) setErrorMessage('');
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "yearLevel",
      "university",
      "island",
      "region",
      "studentId",
      "course",
      "proofOfEnrollment",
    ];
    for (let field of requiredFields) {
      if (
        !formData[field] ||
        (field !== "proofOfEnrollment" && formData[field].toString().trim() === "")
      ) {
        setLocalError("⚠️ Please fill in all the required fields.");
        return false;
      }
    }
    const file = formData.proofOfEnrollment;
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setLocalError("⚠️ File must be an image (jpg, jpeg, png) or PDF.");
        return false;
      }
    } else {
      setLocalError("⚠️ Please upload your proof of enrollment.");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLocalError("");
      if (setErrorMessage) setErrorMessage("");
      handleSubmit(e);
    }
  };

  const handleAnyInputBlur = () => {
  validateForm();
};

  return (
    <div className="">
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <h2 className="subtitle-register">SCHOOL DETAILS</h2>

      {/* Dynamic Progress Bar for Step 2 */}
      {(() => {
        const requiredFields = [
          "yearLevel",
          "university",
          "island",
          "region",
          "studentId",
          "course",
          "proofOfEnrollment",
        ];
        const filled = requiredFields.filter(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        ).length;
        // Progress goes from 26% to 50% as fields are filled
        const percent = 26 + Math.round((filled / requiredFields.length) * (50 - 26));

        return (
          <div style={{ margin: "16px 0" }}>
            <div style={{
              height: "12px",
              background: "#eee",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "4px"
            }}>
              <div style={{
                width: `${percent}%`,
                height: "100%",
                background: "#f1c40f",
                transition: "width 0.3s"
              }} />
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Step 2 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}

      <form className="form-register" onSubmit={handleFormSubmit}>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="yearLevel" className="label-register">
              Year Level<span className="required"> *</span>
            </label>
            <select
              id="yearLevel"
              name="yearLevel"
              value={formData.yearLevel}
              onChange={handleAnyInputChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register year-level-select"
              required
            >
              <option value="" disabled>Select Year Level</option>
              <option value="Grade 11 SHS">Grade 11 SHS</option>
              <option value="Grade 12 SHS">Grade 12 SHS</option>
              <option value="Freshmen (1st Yr)">Freshmen (1st Yr)</option>
              <option value="Sophomore (2nd Yr)">Sophomore (2nd Yr)</option>
              <option value="Junior (3rd Yr)">Junior (3rd Yr)</option>
              <option value="Senior (4th Yr Up)">Senior (4th Yr Up)</option>
              <option value="Alumni">Alumni</option>
              <option value="Masters">Masters</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="university" className="label-register">
              University / College / Institute<span className="required"> *</span>
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleUniversityChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register"
              placeholder="e.g. University of XYZ"
              required
            />
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="island" className="label-register">
              Island<span className="required"> *</span>
            </label>
            <input
              type="text"
              id="island"
              name="island"
              value={formData.island}
              className="input-field-register"
              readOnly
            />
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="region" className="label-register">
              Region<span className="required"> *</span>
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              className="input-field-register"
              readOnly
            />
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="studentId" className="label-register">
              Student ID<span className="required"> *</span>
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleAnyInputChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register"
              placeholder="e.g. 12345678"
              required
            />
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="course" className="label-register">
              Course or Program<span className="required"> *</span>
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleAnyInputChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register course-select"
              required
            >
              <option value="" disabled>Select Course or Program</option>
              <option value="BS Computer Science">BS Computer Science</option>
              <option value="BS Information Technology">BS Information Technology</option>
              <option value="BS Accountancy">BS Accountancy</option>
              <option value="BS Business Administration">BS Business Administration</option>
              <option value="BS Psychology">BS Psychology</option>
              <option value="BS Civil Engineering">BS Civil Engineering</option>
              <option value="BS Nursing">BS Nursing</option>
              <option value="BS Architecture">BS Architecture</option>
              <option value="BA Communication">BA Communication</option>
              <option value="BS Biology">BS Biology</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register full-width-register">
            <label htmlFor="proofOfEnrollment" className="label-register">
              Proof of Enrolment / School ID with Validation<span className="required"> *</span>
            </label>
            <input
              type="file"
              id="proofOfEnrollment"
              name="proofOfEnrollment"
              onChange={handleAnyInputChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register file-input"
              accept=".jpg,.jpeg,.png,.pdf"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step2EducationDetails;
