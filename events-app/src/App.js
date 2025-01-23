
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserLayout from "./layouts/UserLayout"
import HomeLayout from "./layouts/HomeLayout"; 
import UserEventsLayout from "./layouts/UserEventsLayout";
import UserEvents from "./pages/UserEvents"; 
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Events from "./pages/Events";
import UpdateEvent from "./pages/UpdateEvent";
import BookEvent from "./pages/BookEvent";
import UserBookings from "./pages/UserBookings";
import BookingDetails from "./pages/BookingDetails";
import UserCreatedEvents from "./pages/UserCreatedEvents";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
        <Route index element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
        </Route>
        <Route path="/user" element={<UserLayout />}/>
        <Route path="/userEvents" element={<UserEventsLayout/>} >
          <Route path="" element={<UserEvents/>}>
            <Route index element={<Navigate to="userCreatedEvents" replace />} />
            <Route path="userCreatedEvents" element={<UserCreatedEvents />} />
            <Route path="userBookings" element={<UserBookings/>}/>
          </Route>
          <Route path="createEvent" element={<CreateEvent />} />
          <Route path="updateEvent/:id" element={<UpdateEvent /> }/>
          
          <Route path="bookingDetails/:id" element={<BookingDetails/>}/>
        </Route>
        <Route path="/bookEvent/:id" element={<BookEvent />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
