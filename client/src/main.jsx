import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./Context/UserContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { AuthenticationModalProvider } from "./Context/AuthenticationModalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <ThemeProvider>
          <AuthenticationModalProvider>
            <App />
          </AuthenticationModalProvider>
        </ThemeProvider>
      </UserProvider>
    </Router>
  </React.StrictMode>
);
