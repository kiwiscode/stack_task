import { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { ThemeContext } from "../../Context/ThemeContext";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { Modal } from "@mui/material";
import animationData from "../../assets/loading-animation/loading-animation.json";
import Lottie from "lottie-react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { AuthenticationModalContext } from "../../Context/AuthenticationModalContext";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Navbar() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const { themeName, toggleTheme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [showAuthModalLogInPage, setShowAuthModalLogInPage] = useState(false);
  const [showAuthModalSignUpPage, setShowAuthModalSignUpPage] = useState(false);
  const {
    authenticationModalOpened,
    setAuthenticationModalOpened,
    showRegisterTab,
    setShowRegisterTab,
  } = useContext(AuthenticationModalContext);
  const authModalRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authenticationError, setAuthenticationError] = useState("");
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    authenticationType: "",
    password: "",
  });

  const handleChangeSignupFormData = (e) => {
    const { name, value } = e.target;

    setSignUpFormData({
      ...signUpFormData,
      [name]: value,
    });
  };
  const handleChangeLoginFormData = (e) => {
    const { name, value } = e.target;

    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleToggle = () => {
    if (themeName === "light-theme") {
      toggleTheme("dark-theme");
    } else {
      toggleTheme("light-theme");
    }
  };

  // login modal scneario
  const openAuthModal = () => {
    setAuthenticationModalOpened(true);
    setShowAuthModalSignUpPage(false);
    setShowAuthModalLogInPage(true);
  };
  const closeAuthModal = () => {
    setShowRegisterTab(false);
    setAuthenticationModalOpened(false);
    setAuthLoading(false);
    setAuthenticationError("");
    setShowAuthModalSignUpPage(false);
    setShowAuthModalLogInPage(false);
    setSignUpFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setLoginFormData({
      authenticationType: "",
      password: "",
    });
  };

  const openRegisterTab = () => {
    setAuthenticationModalOpened(true);
    setShowRegisterTab(true);
    setAuthLoading(false);
    setAuthenticationError("");
    setShowAuthModalSignUpPage(true);
    setShowAuthModalLogInPage(false);
    setSignUpFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setLoginFormData({
      authenticationType: "",
      password: "",
    });
  };
  const openLoginTab = () => {
    setAuthLoading(false);
    setAuthenticationError("");
    setShowAuthModalSignUpPage(false);
    setShowAuthModalLogInPage(true);
    setSignUpFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setLoginFormData({
      authenticationType: "",
      password: "",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const modalContent = authModalRef.current;
      if (modalContent.scrollTop === 0) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }
    };

    const modalContent = authModalRef.current;
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // log in
  const logIn = async (event) => {
    event.preventDefault();
    setAuthLoading(true);

    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        loginFormData,
      });

      const { token, user } = result.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      console.log("result:", result);
      setTimeout(() => {
        updateUser(user);
        setAuthenticationError("");
      }, 400);
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
      setTimeout(() => {
        setAuthLoading(false);
      }, 1000);

      console.log("result:", result);
    } catch (error) {
      console.error("error:", error);
      if (error) {
        setAuthLoading(false);
        setAuthenticationError(error.response.data.error);
      }
    }
  };

  // sign up
  const signUp = async (event) => {
    event.preventDefault();
    // setAuthLoading(true);
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        signUpFormData,
      });

      setAuthLoading(false);
      setAuthenticationError("");
      setShowAuthModalSignUpPage(false);
      setShowAuthModalLogInPage(true);
      setSignUpFormData({
        name: "",
        username: "",
        email: "",
        password: "",
      });
      setLoginFormData({
        authenticationType: "",
        password: "",
      });
    } catch (error) {
      setAuthenticationError(
        error.response.data.error || error.response.data.message
      );
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (authenticationModalOpened && !showRegisterTab) {
      openLoginTab();
    } else if (authenticationModalOpened && showRegisterTab) {
      openRegisterTab();
    } else {
      closeAuthModal();
    }
  }, [authenticationModalOpened]);
  return (
    <>
      {/* login-signup modal */}
      <>
        <Modal
          open={authenticationModalOpened}
          onClose={closeAuthModal}
          sx={{
            "& > .MuiBackdrop-root": {
              opacity: "0.5 !important",
              backgroundColor: "rgb(202, 205, 236)",
              filter: "brightness(2.5)",
              margin: 0,
              padding: 0,
            },
          }}
        >
          <div
            ref={authModalRef}
            className=""
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: width <= 768 ? "98%" : 410,
              maxHeight: "95vh",
              height: width <= 768 && "95vh",
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
              outlineStyle: "none",
              overflowY: "auto",
              borderRadius: "0.25rem",
              boxShadow:
                "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: "0",
                overflow: "hidden",
                zIndex: 2,
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
              }}
              className={
                isScrolling ? `header_modal scroll_active` : `header_modal`
              }
            >
              <button
                onClick={closeAuthModal}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                  width: "58px",
                  height: "50px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  fill={themeName === "dark-theme" ? "white" : "black"}
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                  ></path>
                </svg>
              </button>

              <div
                className="logo-wrapper"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <svg
                  style={{
                    padding: "8px 16px",
                    maxHeight: width <= 768 ? "28px" : "33.5px",
                    flexShrink: 0,
                  }}
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" rx="20" fill="#5558fd" />
                  <rect
                    x="16"
                    y="28"
                    width="68"
                    height="12"
                    rx="6"
                    fill="white"
                  />
                  <rect
                    x="16"
                    y="44"
                    width="68"
                    height="12"
                    rx="6"
                    fill="white"
                  />
                  <rect
                    x="16"
                    y="60"
                    width="68"
                    height="12"
                    rx="6"
                    fill="white"
                  />
                </svg>
                <div
                  className="navbar-brand"
                  style={{
                    color: themeName === "dark-theme" ? "white" : "#161d28",
                  }}
                >
                  Stack Task
                </div>
              </div>
            </div>

            {/* login & signup content */}
            {!showAuthModalSignUpPage && showAuthModalLogInPage ? (
              <div className="login-modal-content">
                <form onSubmit={logIn}>
                  <div className="input-group">
                    <label
                      htmlFor="emailOrUsername"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Email or Username
                    </label>
                    <input
                      name="authenticationType"
                      type="text"
                      id="authenticationType"
                      value={loginFormData.authenticationType}
                      onChange={handleChangeLoginFormData}
                      placeholder="Enter your email or username"
                      required
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      htmlFor="password"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      id="password"
                      value={loginFormData.password}
                      onChange={handleChangeLoginFormData}
                      placeholder="Enter your password"
                      required
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                      }}
                    />
                  </div>

                  {authLoading ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        border: "1px solid rgb(231, 231, 231)",
                      }}
                    >
                      <Lottie
                        style={{
                          width: "32px",
                          height: "32px",
                        }}
                        animationData={animationData}
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className={`login-button ${
                          themeName === "dark-theme"
                            ? "dark-theme"
                            : "light-theme"
                        }`}
                      >
                        <span>Log in</span>
                      </button>
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <span>{"Don't have an Stack Task account?"}</span>{" "}
                        <span
                          onClick={openRegisterTab}
                          style={{
                            cursor: "pointer",
                            color: "#5558fd",
                          }}
                        >
                          Register
                        </span>
                      </div>
                    </>
                  )}
                  {authenticationError && (
                    <span className="error-message">{authenticationError}</span>
                  )}
                </form>
              </div>
            ) : showAuthModalSignUpPage && !showAuthModalLogInPage ? (
              <div className="signup-modal-content">
                <form onSubmit={signUp}>
                  <div className="input-group">
                    <label
                      htmlFor="name"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      id="name"
                      value={signUpFormData.name}
                      onChange={handleChangeSignupFormData}
                      placeholder="Enter your name"
                      required
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                      }}
                    />
                  </div>
                  <div className="input-group">
                    <label
                      htmlFor="name"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Username
                    </label>
                    <input
                      name="username"
                      type="text"
                      id="username"
                      value={signUpFormData.username}
                      onChange={handleChangeSignupFormData}
                      placeholder="Enter your username"
                      required
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                      }}
                    />
                  </div>
                  <div className="input-group">
                    <label
                      htmlFor="name"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      E-Mail
                    </label>
                    <input
                      name="email"
                      type="text"
                      id="email"
                      value={signUpFormData.email}
                      onChange={handleChangeSignupFormData}
                      placeholder="Enter your email"
                      required
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      htmlFor="password"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      id="password"
                      value={signUpFormData.password}
                      onChange={handleChangeSignupFormData}
                      placeholder="Enter your password"
                      required
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                      }}
                    />
                  </div>

                  {authLoading ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        border: "1px solid rgb(231, 231, 231)",
                      }}
                    >
                      <Lottie
                        style={{
                          width: "32px",
                          height: "32px",
                        }}
                        animationData={animationData}
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className={`signup-button ${
                          themeName === "dark-theme"
                            ? "dark-theme"
                            : "light-theme"
                        }`}
                      >
                        <span>Sign up</span>
                      </button>
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <span>{"Already using Stack Task?"}</span>{" "}
                        <span
                          onClick={openLoginTab}
                          style={{
                            cursor: "pointer",
                            color: "#5558fd",
                          }}
                        >
                          Log in
                        </span>
                      </div>
                    </>
                  )}
                  {authenticationError && (
                    <span className="error-message">{authenticationError}</span>
                  )}
                </form>
              </div>
            ) : null}
          </div>
        </Modal>
      </>
      <div
        className={`navbar-links-responsive ${isOpen ? "active" : ""} ${
          themeName === "dark-theme" ? "dark-theme" : "light-theme"
        }`}
      >
        <button
          onClick={openAuthModal}
          className={`navbar-button first ${
            themeName === "dark-theme" ? "dark-theme" : "light-theme"
          }`}
        >
          Log In
        </button>
        <button onClick={openRegisterTab} className="navbar-button second">
          Try for free
        </button>
      </div>
      <nav
        className={`navbar ${
          themeName === "dark-theme" ? "dark-theme" : "light-theme"
        }`}
      >
        <div
          className="logo-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
          }}
        >
          <svg
            style={{
              padding: "8px 16px",
              maxHeight: width <= 768 ? "28px" : "33.5px",
              flexShrink: 0,
            }}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="20" fill="#5558fd" />
            <rect x="16" y="28" width="68" height="12" rx="6" fill="white" />
            <rect x="16" y="44" width="68" height="12" rx="6" fill="white" />
            <rect x="16" y="60" width="68" height="12" rx="6" fill="white" />
          </svg>
          <div
            className="navbar-brand"
            style={{
              color: themeName === "dark-theme" ? "white" : "#161d28",
            }}
          >
            Stack Task
          </div>
        </div>

        <div className="navbar-left-side-wrapper">
          <div className={`navbar-links`}>
            <button
              onClick={openAuthModal}
              className={`navbar-button first btn-style507  ${
                themeName === "dark-theme" ? "dark-theme" : "light-theme"
              }`}
            >
              Log In
            </button>
            <button onClick={openRegisterTab} className="navbar-button second">
              Try for free
            </button>
          </div>

          {width <= 768 && (
            <div>
              {themeName === "dark-theme" ? (
                <svg
                  onClick={handleToggle}
                  width={18}
                  height={18}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                  }}
                  fill={"grey"}
                  className="moon-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path>
                </svg>
              ) : (
                <svg
                  onClick={handleToggle}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                  }}
                  width={18}
                  height={18}
                  fill="rgb(28, 28, 28"
                  className="sun-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"></path>
                </svg>
              )}
            </div>
          )}
          <div
            className={`hamburger ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>

          {width > 768 && (
            <div>
              {themeName === "dark-theme" ? (
                <svg
                  onClick={handleToggle}
                  width={18}
                  height={18}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                  }}
                  fill={"grey"}
                  className="moon-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path>
                </svg>
              ) : (
                <svg
                  onClick={handleToggle}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                  }}
                  width={18}
                  height={18}
                  fill="rgb(28, 28, 28"
                  className="sun-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"></path>
                </svg>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
