import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const Step4AccountCredentials = ({
  formData,
  handleInputChange,
  errorMessage,
  setErrorMessage, // <-- Make sure this is passed as a prop from parent!
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Validation function for enabling Send Code button
  const isFormValidForSendCode = () => {
    // Username must not be empty
    if (!formData.username || formData.username.trim() === "") return false;
    // Email must be valid
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      return false;
    // Password must be at least 8 characters
    if (!formData.password || formData.password.length < 8) return false;
    // Confirm password must match password
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const handleSendCode = () => {
    if (timer > 0) return;

    // Error handling
    if (!formData.username || formData.username.trim() === "") {
      setErrorMessage && setErrorMessage("⚠️ Username is required.");
      return;
    }
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setErrorMessage && setErrorMessage("⚠️ Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setErrorMessage && setErrorMessage("⚠️ Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage && setErrorMessage("⚠️ Passwords do not match.");
      return;
    }

    // If all valid, clear error and proceed
    setErrorMessage && setErrorMessage("");
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // Add code sending logic here
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="">
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <div className="image-container-login">
        <img
          src="msl-logo.png"
          alt="MSL Account Logo"
          className="image-logo-login"
        />
      </div>

      {/* Dynamic Progress Bar for Step 4 */}
      {(() => {
        const requiredFields = [
          "username",
          "password",
          "confirmPassword",
          "email",
          "captcha"
        ];
        const filled = requiredFields.filter(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        ).length;
        // Progress goes from 76% to 100% as fields are filled
        const percent = 76 + Math.round((filled / requiredFields.length) * (100 - 76));

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
              Step 4 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="username" className="label-register">
            Username<span className="required"> *</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="input-field-register"
            placeholder="e.g. Simoun"
            required
          />
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="password" className="label-register">
            Create a password<span className="required"> *</span>
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field-register"
              placeholder="must be 8 characters"
              required
            />
            <button
              type="button"
              className="eye-icon-login"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="confirmPassword" className="label-register">
            Confirm password<span className="required"> *</span>
          </label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input-field-register"
              placeholder="repeat password"
              required
            />
            <button
              type="button"
              className="eye-icon-login"
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="email" className="label-register">
            Email Address<span className="required"> *</span>
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field-register"
              placeholder="e.g. crislbarra@gmail.com"
              required
              style={{ flex: 3, marginRight: 8 }}
            />
            <button
              type="button"
              className="register-btn-sendcode"
              style={{
                  flex: 1,
                  minWidth: 0,
                  background: timer > 0 ? "#fffbe6" : "", // Slightly yellow when counting
                  color: timer > 0 ? "gray" : "",     // Optional: darker yellow text
                  borderColor: timer > 0 ? "#f1c40f" : "", // Optional: yellow border
                  cursor: timer > 0 ? "not-allowed" : "pointer"
                }}
                onClick={handleSendCode}
                disabled={
                  timer > 0 ||
                  !isFormValidForSendCode()
                }
                title={
                  !isFormValidForSendCode()
                    ? "Fill out all fields correctly to enable"
                    : timer > 0
                    ? `Please wait ${timer}s before resending`
                    : ""
                }
              >
              {timer > 0 ? `Resend in ${timer}s` : "Send Code"}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="captcha" className="label-register">
            Code <span className="required"> *</span>
          </label>
          <input
            type="text"
            id="captcha"
            name="captcha"
            value={formData.captcha}
            onChange={handleInputChange}
            className="input-field-register captcha-input"
            placeholder="Enter the code"
            required
            style={{ flex: 3 }}
          />
        </div>
      </div>

    </div>
  );
};

export default Step4AccountCredentials;
