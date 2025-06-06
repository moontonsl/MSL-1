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

  return (
    <>
    <Head title="Log in MSL Account" />
    <Header />
      <main>
          <div className="login-main-bg">
            <div className="login-wrapper">
            <div className={`login-container-login ${error ? 'has-error' : ''}`} style={{ flex: 1 }}>
              <div className="form-container-login">
                <h1 className="title-login">LOG IN</h1>
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
                    <div className="mlbb-login-options">
                      <button className="mlbb-btn mlbb-quick-login">
                        <img src="/images/Student Portal/mlbbiconlogin.png" alt="Quick Login" className="mlbb-btn-icon" />or Log in with MLBB
                      </button>
                    </div>
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
