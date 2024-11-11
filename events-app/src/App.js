
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserLayout from "./layouts/UserLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Route for the UserPage */}
        <Route path="/user" element={<UserLayout />} />
      {/*  <Route path="/" element={<Navigate to="/auth/register" />} />*/}
        {/* Routes under the /auth path */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
