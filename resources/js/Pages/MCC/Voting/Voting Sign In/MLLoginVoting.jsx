import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MLLoginVoting = forwardRef(({ onLoginSuccess }, ref) => {
  const instanceRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.web.moontontech.com/lib/mtstatic/ml-login/1.0.2/index.js';
    script.onload = () => {
      const options = {
        baseUrl: 'https://api.mobilelegends.com/base/',
        lang: 'en',
        params: {
          adjust_campaign: '',
          adjust_adgroup: 'ml',
        },
        referer: '',
        loginSuccessTip: false,
        logoutSuccessTip: false,
      };

      const instance = new window.$autologin(options);
      instanceRef.current = instance;

      const LoginEvent = {
        LOGIN_SUCCESS: 'loginSucc',
        LOGIN_CLOSE: 'closeLogin',
        LOGIN_FAIL: 'loginFail',
        LOGOUT_SUCCESS: 'logoutSucc',
      };

      const LangCode = { en: 101 };

      instance.on(LoginEvent.LOGIN_SUCCESS, async (loginRes) => {
        const token = loginRes.data.data.jwt;
        try {
          // Get user info from Moonton
          const infoResponse = await fetch('https://api.mobilelegends.com/base/getBaseInfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Authorization': 'Bearer ' + token,
            },
          });
          
          const info = await infoResponse.json();
          
          if (info.data) {
            // Log the info we're getting from Moonton
            console.log('Moonton user info:', info.data);

            // Extract user info from the token payload
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', tokenPayload);

            // Prepare login data for our backend using the correct fields
            const loginData = {
              ml_id: tokenPayload.Ext.roleId.toString(), // roleId is the ML ID
              server_id: tokenPayload.Ext.zoneId.toString(), // zoneId is the server ID
              ign: info.data.name, // name is the IGN
              token: token
            };

            // Log the data we're sending to our backend
            console.log('Sending to backend:', loginData);

            // Send to our backend
            const response = await axios.post('/ml/login', loginData);
            
            if (response.data.success) {
              toast.success('Login successful!');
              if (onLoginSuccess) onLoginSuccess();
              // Redirect to predictions page
              window.location.href = response.data.redirect;
            } else {
              toast.error(response.data.message || 'Login failed');
            }
          } else {
            console.error('Invalid Moonton response:', info);
            toast.error('Invalid response from Mobile Legends. Please try again.');
          }
        } catch (error) {
          console.error('Login error:', error);
          
          // Handle validation errors
          if (error.response?.status === 422) {
            const validationErrors = error.response.data.errors;
            if (validationErrors) {
              // Show each validation error
              Object.entries(validationErrors).forEach(([field, messages]) => {
                toast.error(`${field}: ${messages.join(', ')}`);
              });
            } else {
              toast.error(error.response.data.message || 'Validation failed. Please check your information.');
            }
          } else {
            toast.error('Failed to login. Please try again.');
          }
        }
      });

      instance.on(LoginEvent.LOGIN_CLOSE, () => {
        console.log('Login closed');
      });

      instance.on(LoginEvent.LOGIN_FAIL, () => {
        console.error('Login failed');
        toast.error('Login failed. Please try again.');
      });

      instance.on(LoginEvent.LOGOUT_SUCCESS, async () => {
        try {
          await axios.post('/ml/logout');
          toast.success('Logged out successfully');
          window.location.href = '/ml/login';
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Failed to logout properly');
        }
      });

      instance.changeLang(LangCode.en);
    };

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [onLoginSuccess]);

  useImperativeHandle(ref, () => ({
    triggerLogin: () => {
      if (instanceRef.current) {
        instanceRef.current.loadIframe();
      }
    },
  }));

  return null;
});

export default MLLoginVoting; 