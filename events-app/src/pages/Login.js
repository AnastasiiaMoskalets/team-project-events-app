import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === 'user@gmail.com' && password === '1234') {
      // Redirect to the user profile
      navigate('/user');
      console.log("redirected to user profile");
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  return (
    <div className="form-container sign-in-container">
      <div className='sub-form-container'>
        <h3 className="app-name">Event app</h3>
        <h1 className="form-header">Sign in to our app</h1>
        <form className="onboarding-form" id="sign-in-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="user-email" className="form-label">Your Email</label>
            <input
              type="email"
              id="user-email"
              name="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="user-password" className="form-label">Password</label>
            <input
              type="password"
              id="user-password"
              name="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="submit" id="sign-in-submit" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
