import { useState } from 'react';
import { Header, Footer } from '@/Components';
import './login.css';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'react-feather';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showMLBBModal, setShowMLBBModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('⚠️Please enter account details.');
      return;
    }
    // Simulate login error for demonstration
    if (formData.username !== 'admin' || formData.password !== 'admin') {
      setError('⚠️Wrong username or password.');
      return;
    }
    setError('');
    // Proceed with login logic here
    console.log(formData);
  };

  // Main "choose login" state
  if (!showLoginForm && !showMLBBModal) {
    return (
      <>
        <Head title="Log in MSL Account" />
        <Header />
        <main>
          <div className="login-main-bg">
              <div className="login-wrapper" >
                {/* Login options on the left */}
                <div className="login-container-login">
                  <h2 
                      className="choose-login-title" 
                      style={{ textAlign: 'left' }}
                    >
                      Where Student Gamers Become Campus Legends.
                    </h2>
                    <button
                    className="choose-login-btn"
                    onClick={() => setShowLoginForm(true)}
                  >
                    <span className="choose-login-btn-icon">
                      <img src="/apple-touch-icon.png" alt="MSL" style={{ width: 45, height: 28, borderRadius: 6 }} />
                    </span>
                    <span>SIGN IN WITH MSL ACCOUNT</span>
                    <span className="choose-login-btn-arrow">&#8594;</span>
                  </button>
                  <button
                    className="choose-login-btn"
                    onClick={() => setShowMLBBModal(true)}
                  >
                    <span className="choose-login-btn-icon">
                      <img src="/images/Student Portal/mlbbiconlogin.png" alt="MLBB" style={{ width: 45, height: 25, borderRadius: 6 }} />
                    </span>
                    <span>SIGN IN WITH YOUR MLBB ACCOUNT</span>
                    <span className="choose-login-btn-arrow">&#8594;</span>
                  </button>
                  <button
                    className="choose-login-btn"
                    onClick={() => window.location.href = '/register'}
                  >
                    <span className="choose-login-btn-icon">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 12v6m0 0v-6m0 6H6m6 0h6M6 6h12M6 6v12M6 6H3m3 0h12m0 0v12m0-12h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span>CREATE AN ACCOUNT</span>
                    <span className="choose-login-btn-arrow">&#8594;</span>
                  </button>
                </div>
                {/* Video on the right */}
                <div className="video-container-login">
                  <video
                    className="video-bg-blur"
                    src="/loginvideo.mp4"
                    type="video/mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="video-foreground">
                    <iframe
                      src="https://www.youtube.com/embed/b6A3EToebqE?autoplay=1&loop=1&playlist=b6A3EToebqE&mute=1&controls=0&rel=0&modestbranding=1"
                      title="MSL Video"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>                
                  </div>
                </div>
            </div>
          </div>
        </main>
        <Footer />
        <style>{`
          .choose-login-container {
            background: rgba(10,10,10,0.7);
            border-radius: 16px;
            padding: 2rem 2rem 2.5rem 2rem;
            box-shadow: 0 4px 24px #0008;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            min-width: 340px;
            max-width: 400px;
            margin: 0 auto;
          }
          .choose-login-title {
            color: #fff;
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 2rem;
            letter-spacing: 1px;
          }
          .choose-login-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(90deg, #232323 60%, #232323cc 100%);
            border: 1px solid #444;
            border-radius: 10px;
            color: #fff;
            font-size: 1.1rem;
            font-weight: 500;
            padding: 0.9rem 1.2rem;
            margin-bottom: 1.1rem;
            cursor: pointer;
            transition: background 0.2s, border 0.2s;
            box-shadow: 0 2px 8px #0003;
            gap: 1rem;
          }
          .choose-login-btn:last-child {
            margin-bottom: 0;
          }
          .choose-login-btn:hover {
            background: linear-gradient(90deg, #1e90ff 60%, #00c6ff 100%);
            border: 1px solid #1e90ff;
            color: #fff;
          }
          .choose-login-btn-icon {
            display: flex;
            align-items: center;
            margin-right: 1rem;
          }
          .choose-login-btn-arrow {
            font-size: 1.5rem;
            margin-left: 1rem;
            color: #fff;
            opacity: 0.7;
          }
        `}</style>
      </>
    );
  }

  // MLBB modal state (just a placeholder)
  if (showMLBBModal) {
    return (
      <>
        <Head title="Log in MSL Account" />
        <Header />
        <main>
          <div className="login-main-bg">
            <div className="login-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="choose-login-container">
                <h2 className="choose-login-title">MLBB ACCOUNT LOGIN</h2>
                <div style={{ color: "#fff", textAlign: "center", margin: "2rem 0" }}>
                  This is the modal for the MLBB account.
                </div>
                <button
                  className="choose-login-btn"
                  onClick={() => setShowMLBBModal(false)}
                >
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Default: show the original login form
  return (
    <>
    <Head title="Log in MSL Account" />
    <Header />
      <main>
          <div className="login-main-bg">
            <div className="login-wrapper">
            <div className={`login-container-login ${error ? 'has-error' : ''}`} style={{ flex: 1 }}>
              <div className="form-container-login">
                <h1 className="title-login" style={{ textAlign: 'left' }}>Unlock your path in student esports and leadership.</h1>
                {/* <div className="image-container-login">
                  <img
                    src="msl-logo.png"
                    alt="MSL Account Logo"
                    className="image-logo-login"
                  />
                </div> */}
                
                <form className="form-login" onSubmit={handleSubmit}>
                  <div className="input-group-login">
                    <label htmlFor="username" className="label-login">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="eg. Simeon"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input-field-login"
                    />
                  </div>
                  <div className="input-group-login">
                    <label htmlFor="password" className="label-login">
                      Password
                    </label>
                    <div className="password-container-login">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-field-login"
                      />
                      <button
                        type="button"
                        className="eye-icon-login"
                        onClick={() => setPasswordVisible((v) => !v)}
                        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                      >
                        {passwordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                    </div>
                  </div>
                  
                  {error && (
                            <div className="error-message-login">
                                <p>{error}</p>
                            </div>
                        )}

                  <div className="footer-container-login">
                    <button type="submit" className="login-btn-login">
                      Login
                    </button>
                    {/* <div className="mlbb-login-options">
                      <button className="mlbb-btn mlbb-quick-login">
                        or Log in with MLBB
                      </button>
                    </div> */}
                    <p className="footer-text-login">
                      <a href="/forgot-password" className="forgot-password-link-login">
                        Forgot Password
                      </a>
                      <br />
                      Already have an account?{' '}
                      <a href="/register" className="sign-in-link-login">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            <div className="video-container-login">
              <video
                    className="video-bg-blur"
                    src="/loginvideo.mp4"
                    type="video/mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                  </video>
                  <div className="video-foreground">
                    
                    <iframe
                      src="https://www.youtube.com/embed/b6A3EToebqE?autoplay=1&loop=1&playlist=b6A3EToebqE&mute=1&controls=0&rel=0&modestbranding=1"
                      title="MSL Video"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                   
                  </div>
            </div>
          </div>
        </div>
      </main>
    <Footer />
    </>
  );
};

export default Login;
