import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import Dashboard from "../src/Pages/Dashboard";
import { useContext } from "react";
import Main from "./Pages/Main";

function App() {
  const { userInfo } = useContext(UserContext);

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
