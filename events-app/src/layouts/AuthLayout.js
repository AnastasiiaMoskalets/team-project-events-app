import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import "./styles.css";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`container ${
        location.pathname === "/auth/login" ? "" : "right-panel-active"
      }`}
      id="container"
    >
      
      <Outlet />

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <div className="sub-overlay-left">
              <h1 className="switch-header">Welcome Back!</h1>
              <p className="switch-text">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => navigate("/auth/login")}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="overlay-panel overlay-right">
            <div className="sub-overlay-right">
              <h1 className="switch-header">New to us?</h1>
              <p className="switch-text">Enter your personal details and start journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => navigate("/auth/register")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
