
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserLayout from "./layouts/UserLayout"
import HomeLayout from "./layouts/HomeLayout"; 
import UserEventsLayout from "./layouts/UserEventsLayout";
import UserEvents from "./pages/UserEvents"; 
import CreateEvent from "./pages/CreateEvent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/user" element={<UserLayout />} />
        <Route path="/events" element={<UserEventsLayout/>} />
        <Route path="/userEvent" element={<UserEvents />} />
        <Route path="/createEvent" element={<CreateEvent />} />
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
