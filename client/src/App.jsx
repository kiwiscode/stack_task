import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import Dashboard from "../src/Pages/Dashboard";
import { useContext, useEffect } from "react";
import Main from "./Pages/Main";

function App() {
  const { userInfo, getToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (token) {
      // Eğer token varsa user aktiftir, dashboarda yönlendir
      navigate("/dashboard");
    } else {
      // Eğer token yoksa ana sayfaya yönlendir
      navigate("/");
    }
  }, [navigate]);

  return (
    <div
      className="App"
      style={{
        colorScheme: "dark",
      }}
    >
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/dashboard"
          element={
            userInfo && userInfo.active ? <Dashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
