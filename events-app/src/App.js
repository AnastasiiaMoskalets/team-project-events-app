
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signUp"
import SignIn from "./pages/signIn"
import userProfile from "./pages/userProfile"
import './index.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signIn" Component={SignIn}/>
          <Route path="/signUp" Component={SignUp}/>
          <Route path="/userProfile" Component={userProfile}/>
          <Route path="/" exact Component={SignIn}/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
