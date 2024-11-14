import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post('http://localhost:5000/api/users/signin', data,{
        withCredentials: true // Include credentials (cookies) with the request
    });
      console.log(response.data)
      console.log(response.status)
      if(response.status === 200){
        navigate('/user');
        console.log("User registered successfully");
      }
    } catch(error){
      if(error.response) {
        console.log(error.response)
        setError(error.response.data.error || 'Failed to register. Please try again.' )
      } else {
        console.log(error)
        setError('An error occurred. Please try again later.');
      }
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
