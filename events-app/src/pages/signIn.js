import React , {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./signIn.css"
function SignIn(){
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.prevebtDefault();
        if (email === 'user@example.com' && password === 'password123') {
            // Redirect to the user profile
            navigate('/userProfile');
            console.log("redirected to user dashboard")
          } else {
            setError('Invalid credentials. Please try again.');
          }
    };
    

    return(
        <div class = "main-form-container">
          <div class = "form-container">
            <h3 id='app-name'>
              Event app
            </h3>
            <h1 id='sign-in-header'>
              Sign in to our app
            </h1>
            <form id='sign-in-form'>
              <div class="input-container">
                <label for="user-email" class="form-label">Your Email</label>
                <input type="email" id="user-email" name="email" class = "form-input" />
              </div>
              <div class="input-container">
                <label for="user-password" class="form-label">Password</label>
                <input type="password" id="user-password" name="password" class = "form-input"/>
              </div>
            </form>
            <button id="sign-in-submit">
              Sign In
            </button>
          </div>
          <div class = "switch-container">
            <h1 id = "switch-header">Hello, new to us?</h1>
            <p id= "switch-text">Enter your data and start your journey with us</p>
            <button id = "sign-up">
              Sign Up
            </button>
          </div>
          
        </div>
        
    )

}

export default SignIn