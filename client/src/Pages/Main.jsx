import React, { useContext } from "react";
import Navbar from "../Components/Navbar/Navbar";
import { ThemeContext } from "../Context/ThemeContext";
import useWindowDimensions from "../utils/useWindowDimensions";
import landingPageVideo from "../assets/videos/landing-video-1.mp4";
import Marquee from "react-fast-marquee";

function Main() {
  const { themeName } = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  return (
    <div
      style={{
        backgroundColor: themeName === "dark-theme" ? "#091017" : "white",
        height: "100%",
      }}
    >
      <Navbar />
      <div
        style={{
          fontSize: width <= 768 ? "40px" : "48px",
          lineHeight: "1.2em",
          letterSpacing: "-.03em",
          textAlign: "center",
          fontWeight: 900,
          color: themeName === "dark-theme" ? "white" : "#161d28",
          paddingTop: "44px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <div>
          <span>A simple to-do list</span>
        </div>
        <div>
          <span>to keep </span>
          <span>everything in check</span>
        </div>
      </div>
      <div className="mt-20"></div>
      <div
        style={{
          fontSize: width <= 768 ? "20px" : "24px",
          lineHeight: "1.2em",
          letterSpacing: "-.03em",
          textAlign: "center",
          color: themeName === "dark-theme" ? "white" : "#161d28",
        }}
      >
        Achieve more every day—wherever you are.
      </div>
      <div className="mt-20"></div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "0.75rem 1.25rem",
          }}
          className="navbar-button second"
        >
          Try for free{" "}
        </button>
      </div>
      <div className="mt-40"></div>
      <div
        style={{
          padding: width <= 768 && "0px 20px",
        }}
      >
        <div
          className={`video-wrapper ${
            themeName === "dark-theme" ? "dark-theme" : ""
          }`}
          style={{
            marginBottom: "20px",
            width: "100%",
            height: "auto",
            maxWidth: "1200px",
            margin: "0 auto",
            overflow: "hidden",
            borderRadius: "32px",
            filter:
              themeName === "dark-theme"
                ? "drop-shadow(rgb(51, 54, 57) 2px -2px 2px)"
                : "",
            boxShadow:
              themeName === "dark-theme"
                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                : "0 0 15px rgba(101, 119, 134, 0.2), 0 0 5px 3px rgba(101, 119, 134, 0.15)",
            border: "none",
            outlineStyle: "none",
            outline: "none",
          }}
        >
          <video
            src={landingPageVideo}
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              display: "block",
              border: "none",
              outlineStyle: "none",
              outline: "none",
            }}
          />
        </div>
      </div>
      <div className="mt-40"></div>
      <div
        style={{
          fontSize: width <= 768 ? "20px" : "24px",
          lineHeight: "1.2em",
          letterSpacing: "-.03em",
          textAlign: "center",
          fontWeight: 400,
          color: themeName === "dark-theme" ? "white" : "#161d28",
          paddingTop: "44px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <div>
          <span>Join the successful individuals </span>
        </div>
        <div>
          <span>and teams who trust our service globally.</span>
        </div>
      </div>{" "}
      <div className="mt-60"></div>
      {/* marquee img container test */}
      <Marquee
        style={{
          width: "100%",
          maxWidth: "90%",
          margin: "0 auto",
        }}
        className="marquee-container"
      >
        <img
          style={{
            maxWidth: "96px",
            maxHeight: "27px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/HoltCat.png"
          }
          alt="Image 1"
        />
        <img
          style={{
            maxWidth: "96px",
            maxHeight: "23px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/canva.png"
          }
          alt="Image 2"
        />
        <img
          style={{
            maxWidth: "96px",
            maxHeight: "52px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/coca_cola.png"
          }
          alt="Image 3"
        />
        <img
          style={{
            maxWidth: "58px",
            maxHeight: "56px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/oxy.png"
          }
          alt="Image 4"
        />
        <div
          style={{
            fontStyle: "italic",
            fontWeight: "bolder",
            fontSize: "22px",
            maxWidth: "96px",
            height: "100%",
            width: "100%",
            margin: "0px 30px 0px 0px",
            color: themeName === "dark-theme" && "white",
          }}
        >
          LIONSGATE
        </div>
        <img
          style={{
            maxWidth: "70px",
            maxHeight: "56px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/carrefour.png"
          }
          alt="Image 5"
        />
        <img
          style={{
            maxWidth: "96px",
            maxHeight: "45px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/bd.png"
          }
          alt="Image 5"
        />

        <div
          style={{
            fontStyle: "italic",
            fontWeight: "bolder",
            fontSize: "24px",
            maxWidth: "96px",
            height: "100%",
            width: "100%",
            margin: "0px 30px 0px 0px",
            color: themeName === "dark-theme" && "white",
          }}
        >
          Glossier.
        </div>
        <img
          style={{
            maxWidth: "96px",
            maxHeight: "36px",
            height: "100%",
            width: "100%",
            margin: "0px 30px",
          }}
          src={
            "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/universal.png"
          }
          alt="Image 5"
        />
      </Marquee>
      <div className="mt-60"></div>
      {/* user comment cards */}
      <div className="mt-60"></div>
    </div>
  );
}

export default Main;
