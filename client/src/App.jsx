import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import HomePage from "../src/Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignUpPage";
function App() {
  return (
    <UserProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
