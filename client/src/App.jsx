import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import Dashboard from "../src/Pages/Dashboard";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/Login";
import { useContext } from "react";

function App() {
  const { userInfo, getToken } = useContext(UserContext);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/dashboard"
          element={
            userInfo && userInfo.active ? <Dashboard /> : <Navigate to="/" />
          }
        />
        <Route path="/" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
