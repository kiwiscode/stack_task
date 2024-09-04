import React, { useContext, useState } from "react";
import "./Navbar.css";
import { ThemeContext } from "../../Context/ThemeContext";
import useWindowDimensions from "../../utils/useWindowDimensions";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { themeName, toggleTheme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
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

  return (
    <>
      <div
        className={`navbar-links-responsive ${isOpen ? "active" : ""} ${
          themeName === "dark-theme" ? "dark-theme" : ""
        }`}
      >
        <button
          className={`navbar-button first ${
            themeName === "dark-theme" ? "dark-theme" : ""
          }`}
        >
          Login
        </button>
        <button className="navbar-button second">Try for free </button>
      </div>
      <nav
        className={`navbar ${themeName === "dark-theme" ? "dark-theme" : ""}`}
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
              maxHeight: "33.5px",
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
              className={`navbar-button first ${
                themeName === "dark-theme" ? "dark-theme" : ""
              }`}
            >
              Login
            </button>
            <button className="navbar-button second">Try for free</button>
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
                  class="moon-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path>
                </svg>
              ) : (
                <svg
                  onClick={handleToggle}
                  style={{
                    cursor: "pointer",
                    display: "initial",
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
                  class="moon-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path>
                </svg>
              ) : (
                <svg
                  onClick={handleToggle}
                  style={{
                    cursor: "pointer",
                    display: "initial",
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
