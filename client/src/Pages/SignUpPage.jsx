import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version ???

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password) || password.length < 6) {
      setError(
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }
    axios
      .post(`${API_URL}/auth/signup`, {
        name,
        username,
        email,
        password,
      })
      .then(() => {
        setError("");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message === "Request failed with status code 501") {
          setError(
            "Username and email need to be unique.Provide a valid username or email"
          );
        }
        if (error.message === "Request failed with status code 402") {
          setError("Your password needs to be at least 6 characters long");
        }
        if (error.message === "Request failed with status code 500") {
          setError(
            "All fields are mandatory.Please provide username,email and password"
          );
        }
      });
  };

  return (
    <div className="sign-up-container">
      <h2 className="signup-title">Create account</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="signup-input"
        style={{ fontFamily: "Space Grotesk", fontSize: "16px" }} // Font ve boyut ayarları
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="signup-input"
        style={{ fontFamily: "Space Grotesk", fontSize: "16px" }} // Font ve boyut ayarları
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        title="Please provide a valid email address"
        className="signup-input"
        style={{ fontFamily: "Space Grotesk", fontSize: "16px" }} // Font ve boyut ayarları
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="signup-input"
        style={{ fontFamily: "Space Grotesk", fontSize: "16px" }} // Font ve boyut ayarları
      />
      {error && <p>{error}</p>}

      <button onClick={handleSignup} className="signup-button">
        Signup
      </button>
    </div>
  );
}

export default SignupPage;
