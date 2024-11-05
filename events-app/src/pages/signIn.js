import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signIn.css";

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (email === 'user@example.com' && password === 'password123') {
            // Redirect to the user profile
            navigate('/userProfile');
            console.log("redirected to user profile");
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="main-form-container">
          <div className="form-container">
            <h3 id="app-name">Event app</h3>
            <h1 id="sign-in-header">Sign in to our app</h1>
            <form id="sign-in-form" onSubmit={handleSubmit}>
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
              <button id="sign-in-submit" type="submit">
                Sign In
              </button>
            </form>
          </div>
          <div className="switch-container">
            <h1 id="switch-header">Hello, new to us?</h1>
            <p id="switch-text">Enter your data and start your journey with us</p>
            <button id="sign-up">
              Sign Up
            </button>
          </div>
        </div>
    );
}

export default SignIn;
