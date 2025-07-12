import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Search from "./Search";
import OnBoarding from "./OnBoarding";
import "./App.css";
import Profile from "./Profile";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/OnBoarding" element={<OnBoarding />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />

          <Route
            path="/OnBoarding"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route path="/" element={<Navigate to="/OnBoarding" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
