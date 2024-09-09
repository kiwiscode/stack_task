import { useContext, useEffect, useState } from "react";
import Navbar from "../Components/Navbar/Navbar";
import { ThemeContext } from "../Context/ThemeContext";
import useWindowDimensions from "../utils/useWindowDimensions";
import landingPageVideo from "../assets/videos/landing-video-1.mp4";
import Marquee from "react-fast-marquee";
import Footer from "../Components/Footer/Footer";
import SpotifyLogoData from "../assets/spotify-logo-for-marquee/Spotify New 2024.png";
import { AuthenticationModalContext } from "../Context/AuthenticationModalContext";

function Main() {
  const { themeName } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [translateX, setTranslateX] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndices, setActiveIndices] = useState([0, 1, 2]); // Initial state
  const { setAuthenticationModalOpened, setShowRegisterTab } = useContext(
    AuthenticationModalContext
  );
  const increment = 5.55556;
  const interval = 3000;

  const [isScrolling, setIsScrolling] = useState(false);

  // comments
  const comments = [
    {
      id: 1,
      name: "John Doe",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
      company: "Tech Corp",
      position: "Software Engineer",
      comment:
        "Stack Task has completely transformed the way I manage my daily tasks. The intuitive interface and easy-to-use features make organizing my workload a breeze. I love how it keeps me on track and helps me stay focused on what really matters.",
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
      company: "Creative Inc",
      position: "Product Manager",
      comment:
        "I've been using Stack Task for many months now. It's the only solution I've found that combines a solid todo list, with calendaring, so I can block out time and not take on too much and over commit, and also integrates with the tools the team uses for project management. It's fantastic and has totally changed how I approach my time management. It also keeps getting better and better — great work!",
    },
    {
      id: 3,
      name: "Alice Johnson",
      profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
      company: "Design Studio",
      position: "UX Designer",
      comment:
        "Stack Task has been a game-changer for me. The app’s clean design and user-friendly features make it easy to add, manage, and track my tasks. I can now handle my daily responsibilities with ease, and I love the satisfaction of checking off completed tasks.",
    },
    {
      id: 4,
      name: "Bob Brown",
      profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
      company: "Development Hub",
      position: "Full Stack Developer",
      comment:
        "Using Stack Task has significantly improved my time management skills. The app’s task stacking feature allows me to break down larger projects into manageable steps, making it easier to stay focused and complete tasks on time. Highly recommend for anyone looking to boost their productivity.",
    },
    {
      id: 5,
      name: "Charlie Green",
      profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
      company: "Marketing Experts",
      position: "Marketing Specialist",
      comment:
        "Stack Task has truly revolutionized the way I manage my daily tasks. Before discovering this app, I struggled with keeping track of deadlines and prioritizing my workload. With its intuitive interface and powerful task management features, Stack Task has made organizing my to-do list effortless. The ability to stack tasks and visualize my progress has not only boosted my productivity but also given me a sense of accomplishment. It’s incredibly satisfying to check off completed tasks and see my progress laid out so clearly.",
    },
    {
      id: 6,
      name: "Samantha Roberts",
      profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
      company: "Marketing Genius",
      position: "Digital Marketer",
      comment:
        "I’ve used various task management apps over the years, but none have matched the efficiency and simplicity of Stack Task. The app’s clean design and user-friendly features make it easy to add, manage, and track tasks. What I particularly appreciate is the ability to set priorities and deadlines, which has greatly improved my time management. Stack Task helps me stay focused and organized, allowing me to tackle both personal and professional tasks with ease. If you’re looking for a tool that streamlines your task management and enhances your productivity, this app is a must-have.",
    },
    {
      id: 7,
      name: "Megan Brown",
      profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
      company: "Creative Solutions",
      position: "Project Coordinator",
      comment:
        "Since incorporating Stack Task into my daily routine, my productivity has reached new heights. The app’s task stacking feature allows me to break down larger projects into smaller, more manageable steps, making it easier to stay on track. The ability to categorize tasks and set reminders has been invaluable in ensuring that I meet deadlines and stay organized. I also love the visual layout of the app, which provides a clear overview of my tasks and progress. Stack Task is a fantastic tool for anyone looking to enhance their organizational skills and achieve their goals more efficiently.",
    },
    {
      id: 8,
      name: "Laura White",
      profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
      company: "Market Solutions",
      position: "Marketing Analyst",
      comment:
        "Using Stack Task has been a game-changer for my task management. The app’s clean and intuitive interface makes it simple to organize my tasks and track my progress. I love the ability to stack tasks and set priorities, which helps me focus on what’s most important and stay motivated throughout the day. The integration with my calendar and reminder system has been incredibly helpful in keeping me on schedule. Stack Task has transformed the way I approach my to-do list, making it easier to manage my time and achieve my goals.",
    },
    {
      id: 9,
      name: "David Lee",
      profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
      company: "Marketing Experts",
      position: "Senior Marketer",
      comment:
        "I can't imagine managing my tasks without Stack Task. The app’s clean and user-friendly design makes it easy to stay organized and motivated. The ability to stack tasks and track my progress has been a huge boost to my productivity and overall efficiency.",
    },
    {
      id: 10,
      name: "Sophia Turner",
      profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
      company: "Tech Innovators",
      position: "Project Manager",
      comment:
        "Stack Task has been a game-changer for my project management. The app’s intuitive interface allows me to easily organize and prioritize tasks, ensuring that I stay on top of deadlines. The ability to break down larger projects into manageable steps has significantly improved my productivity.",
    },
    {
      id: 11,
      name: "Liam Johnson",
      profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
      company: "Design Solutions",
      position: "UX Designer",
      comment:
        "Stack Task has quickly become my favorite tool for managing tasks and staying organized. The app’s user-friendly design and powerful features make it easy to add, prioritize, and track tasks. I love how the task stacking feature allows me to break down larger projects into smaller, manageable steps. The ability to set deadlines and receive reminders has been incredibly helpful in keeping me on schedule. Stack Task has not only improved my productivity but also provided me with a greater sense of control over my daily tasks and responsibilities.",
    },
    {
      id: 12,
      name: "Emily Davis",
      profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
      company: "Creative Agency",
      position: "Content Strategist",
      comment:
        "Stack Task has transformed how I manage my workload. The app’s clear design and task management features make it easy to stay on track and meet deadlines. I especially appreciate the ability to set priorities and track my progress, which has greatly enhanced my efficiency and work-life balance.",
    },
    {
      id: 13,
      name: "Mark Evans",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
      company: "Tech Solutions",
      position: "Software Developer",
      comment:
        "Stack Task has completely transformed the way I manage my daily tasks. The intuitive interface and easy-to-use features make organizing my workload a breeze. I love how it keeps me on track and helps me stay focused on what really matters.",
    },
    {
      id: 14,
      name: "Olivia Martin",
      profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
      company: "Creative Agency",
      position: "Product Lead",
      comment:
        "I've tried several task management apps, but Stack Task stands out for its simplicity and efficiency. The ability to prioritize tasks and set deadlines has greatly improved my productivity. It’s the perfect tool for anyone looking to stay organized and on top of their to-do list.",
    },
    {
      id: 15,
      name: "Emma Wilson",
      profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
      company: "Design Innovations",
      position: "UX Researcher",
      comment:
        "Stack Task has been a game-changer for me. The app’s clean design and user-friendly features make it easy to add, manage, and track my tasks. I can now handle my daily responsibilities with ease, and I love the satisfaction of checking off completed tasks.",
    },
  ];

  const handleScroll = () => {
    setIsScrolling(true);
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      setIsScrolling(false);
    }, 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateActiveIndices = (index) => {
      const nextIndices = [
        index,
        (index + 1) % comments.length,
        (index + 2) % comments.length,
      ];
      setActiveIndices(nextIndices);
    };

    const incrementTranslateX = () => {
      setTranslateX((prev) => {
        const newTranslateX = prev + increment;
        if (newTranslateX >= (comments.length - 2) * increment) {
          setActiveIndex(0);
          updateActiveIndices(0);
          return 0;
        } else {
          return newTranslateX;
        }
      });
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % comments.length;
        updateActiveIndices(newIndex);
        return newIndex;
      });
    };

    const intervalId = setInterval(incrementTranslateX, interval);

    return () => clearInterval(intervalId);
  }, [comments.length]);

  // open login modal

  return (
    <>
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
            onClick={() => {
              setShowRegisterTab(true);
              setAuthenticationModalOpened(true);
            }}
            style={{
              padding: "0.75rem 1.25rem",
              width: width <= 768 && "100%",
              margin: width <= 768 && "0px 20px",
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
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
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
            src={SpotifyLogoData}
            alt="Image 5"
          />
        </Marquee>
        {width > 768 && <div className="mt-60"></div>}
        {/* user comment cards start to check*/}
        <section
          className="carousel-parent-section"
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              zIndex: 1,
              paddingTop: width > 768 && "3rem",
              paddingBottom: width > 768 && "3rem",
              position: "relative",
            }}
          >
            <div
              style={{
                padding: "0px !important",
              }}
            >
              <div
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    margin: "0px",
                  }}
                >
                  {/* action starts here for carousel  */}
                  <div
                    className="testimonial-carousel"
                    id="tns1"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      transform: `translate3d(-${translateX}%, 0px, 0px)`,
                    }}
                  >
                    {/* comments action mapping starts here */}
                    {comments.map((eachComment, index) => {
                      return (
                        <div
                          key={eachComment.id}
                          className={`tns-item ${
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }`}
                        >
                          <div
                            className="carousel-content"
                            style={{
                              scale: activeIndices[1] !== index && "0.75",
                              opacity: activeIndices[1] !== index && "0.8",
                              transitionProperty: "all",
                              transitionDuration: ".5s",
                              transitionTiminFunction:
                                "cubic-bezier(.4,0,.2,1)",
                            }}
                          >
                            <div className="testimonal-content-wrapper">
                              <p>{eachComment.comment}</p>
                            </div>
                            <div className="testimonals-content-bottom">
                              <div>
                                <img
                                  width={48}
                                  height={48}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "1rem",
                                    width: "4rem",
                                    height: "4rem",
                                  }}
                                  src={eachComment.profilePic}
                                  alt=""
                                />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <h4
                                  style={{
                                    margin: 0,
                                    color: "#5558fd",
                                  }}
                                >
                                  {eachComment.name}
                                </h4>
                                <div
                                  style={{
                                    marginTop: "5px",
                                    color: "rgb(94 104 123",
                                    fontWeight: "420",
                                  }}
                                >
                                  {eachComment.position} {eachComment.company}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* user comment cards finish to check */}
        {width > 768 && <div className="mt-60"></div>}
        <div className="before-footer-container">
          <div className="before-footer-container-content">
            <div className="community-text-wrapper">
              <span className="community-text">Community</span>
            </div>
            <div className="mt-40">
              <div
                style={{
                  textAlign: "center",
                  fontSize: width <= 768 ? "32px" : "48px",
                  lineHeight: width <= 768 ? "1.2em" : "1.2em",
                  letterSpacing: "-.03em",
                  fontWeight: "650",
                  color: themeName === "dark-theme" && "white",
                }}
              >
                Join our{" "}
                <span
                  style={{
                    color: "#5558fd",
                  }}
                >
                  community of 10,000
                </span>{" "}
                top performers
              </div>
            </div>
            {width > 768 ? (
              <div className="mt-60"></div>
            ) : (
              <div className="mt-30"></div>
            )}
            <div
              style={{
                textAlign: "center",
                fontSize: width <= 768 ? "20px" : "24px",
                lineHeight: "1.2em",
                letterSpacing: "-.03em",
                fontWeight: "420",
                color: themeName === "dark-theme" && "white",
              }}
            >
              Stack Task is the trusted productivity platform for C-suite
              executives, founders, developers, freelancers and researchers
            </div>
            <div className="community-img-wrapper">
              <div className="wrapper">
                <div className="preloader">
                  <div
                    className={`ring ring1 ${isScrolling ? "playing" : ""}`}
                  ></div>
                  <div
                    className={`ring ring2 ${isScrolling ? "playing" : ""}`}
                  ></div>
                  <div
                    className={`ring ring3 ${isScrolling ? "playing" : ""}`}
                  ></div>
                  <div
                    className={`ring ring4 ${isScrolling ? "playing" : ""}`}
                  ></div>
                  <div
                    className={`ring ring5 ${isScrolling ? "playing" : ""}`}
                  ></div>
                  <div
                    className={`ring ring6 ${isScrolling ? "playing" : ""}`}
                  ></div>
                  <div
                    className={`ring ring7 ${isScrolling ? "playing" : ""}`}
                  ></div>
                </div>
              </div>
            </div>
            {width > 768 && <div className="mt-40"></div>}
            {/* before last content */}
            {width > 768 && (
              <div className="grid-container">
                <div
                  className={`grid-item ${
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }`}
                >
                  <svg
                    className="shadow"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    height="75"
                    viewBox="0 0 75 75"
                    width="75"
                  >
                    <filter
                      id="a"
                      colorInterpolationFilters="sRGB"
                      filterUnits="userSpaceOnUse"
                      height="74"
                      width="74"
                      x=".666504"
                      y=".123047"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      />
                      <feMorphology
                        in="SourceAlpha"
                        operator="erode"
                        radius="2"
                        result="effect1_dropShadow_88_463293"
                      />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                      />
                      <feBlend
                        in2="BackgroundImageFix"
                        mode="normal"
                        result="effect1_dropShadow_88_463293"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      />
                      <feMorphology
                        in="SourceAlpha"
                        operator="erode"
                        radius="3"
                        result="effect2_dropShadow_88_463293"
                      />
                      <feOffset dy="5" />
                      <feGaussianBlur stdDeviation="7" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                      />
                      <feBlend
                        in2="effect1_dropShadow_88_463293"
                        mode="normal"
                        result="effect2_dropShadow_88_463293"
                      />
                      <feBlend
                        in="SourceGraphic"
                        in2="effect2_dropShadow_88_463293"
                        mode="normal"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="b">
                      <path d="m27.1665 21.623h21v21h-21z" />
                    </clipPath>
                    <g filter="url(#a)">
                      <rect
                        fill="#fff"
                        height="52"
                        rx="12"
                        width="52"
                        x="11.6665"
                        y="6.12305"
                      />
                      <g
                        clipPath="url(#b)"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      >
                        <path
                          d="m34.8656 21.623c-1.1609.0009-2.1004.9411-2.0995 2.0996-.0009 1.1586.9395 2.0987 2.1003 2.0996h2.1004v-2.0987c.0008-1.1586-.9395-2.0987-2.1012-2.1005.0008 0 .0008 0 0 0zm0 5.6h-5.5992c-1.1609.0009-2.1012.9411-2.1004 2.0996-.0017 1.1586.9387 2.0987 2.0995 2.1004h5.6001c1.1608-.0008 2.1012-.941 2.1003-2.0995.0009-1.1594-.9395-2.0996-2.1003-2.1005z"
                          fill="#36c5f0"
                        />
                        <path
                          d="m48.1661 29.3226c.0009-1.1585-.9395-2.0987-2.1003-2.0996-1.1609.0009-2.1012.9411-2.1004 2.0996v2.1004h2.1004c1.1608-.0008 2.1012-.941 2.1003-2.1004zm-5.6001 0v-5.6c.0009-1.1577-.9386-2.0978-2.0994-2.0996-1.1609.0009-2.1012.9411-2.1004 2.0996v5.6c-.0017 1.1586.9386 2.0987 2.0995 2.1004 1.1609-.0008 2.1012-.941 2.1003-2.1004z"
                          fill="#2eb67d"
                        />
                        <path
                          d="m40.4661 42.6231c1.1608-.0008 2.1012-.941 2.1003-2.0995.0009-1.1586-.9395-2.0988-2.1003-2.0996h-2.1004v2.0996c-.0008 1.1576.9395 2.0978 2.1004 2.0995zm0-5.6008h5.6c1.1609-.0009 2.1012-.9411 2.1004-2.0996.0017-1.1585-.9387-2.0987-2.0995-2.1004h-5.6001c-1.1608.0008-2.1012.941-2.1003 2.0995-.0009 1.1594.9386 2.0996 2.0995 2.1005z"
                          fill="#ecb22e"
                        />
                        <path
                          d="m27.166 34.9228c-.0008 1.1585.9395 2.0987 2.1004 2.0996 1.1608-.0009 2.1012-.9411 2.1003-2.0996v-2.0996h-2.1003c-1.1609.0009-2.1012.9411-2.1004 2.0996zm5.6001 0v5.6c-.0017 1.1586.9386 2.0987 2.0995 2.1005 1.1608-.0009 2.1012-.9411 2.1003-2.0996v-5.5992c.0017-1.1585-.9386-2.0987-2.0995-2.1004-1.1617 0-2.1012.9402-2.1003 2.0987z"
                          fill="#e01e5a"
                        />
                      </g>
                    </g>
                  </svg>
                  <h5
                    style={{
                      margin: 0,
                      marginTop: "10px",
                    }}
                  >
                    Join Our Slack Network
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      marginTop: "10px",
                    }}
                  >
                    Connect with like-minded professionals to share tips, ideas,
                    and strategies for boosting productivity.
                  </p>
                </div>
                <div
                  className={`grid-item ${
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }`}
                >
                  <svg
                    className="shadow"
                    style={{
                      width: "3rem",
                      padding: "8px 16px",
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

                  <h5
                    style={{
                      margin: 0,
                      marginTop: "10px",
                    }}
                  >
                    Collaborate on Our Roadmap
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      marginTop: "10px",
                    }}
                  >
                    Your insights matter! Help us prioritize and build features
                    that make a difference in your productivity.
                  </p>
                </div>
                <div
                  className={`grid-item ${
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }`}
                >
                  <svg
                    className="shadow"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    height="75"
                    viewBox="0 0 75 75"
                    width="75"
                  >
                    <filter
                      id="a"
                      colorInterpolationFilters="sRGB"
                      filterUnits="userSpaceOnUse"
                      height="74"
                      width="74"
                      x=".333008"
                      y=".123047"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      />
                      <feMorphology
                        in="SourceAlpha"
                        operator="erode"
                        radius="2"
                        result="effect1_dropShadow_88_463304"
                      />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                      />
                      <feBlend
                        in2="BackgroundImageFix"
                        mode="normal"
                        result="effect1_dropShadow_88_463304"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      />
                      <feMorphology
                        in="SourceAlpha"
                        operator="erode"
                        radius="3"
                        result="effect2_dropShadow_88_463304"
                      />
                      <feOffset dy="5" />
                      <feGaussianBlur stdDeviation="7" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                      />
                      <feBlend
                        in2="effect1_dropShadow_88_463304"
                        mode="normal"
                        result="effect2_dropShadow_88_463304"
                      />
                      <feBlend
                        in="SourceGraphic"
                        in2="effect2_dropShadow_88_463304"
                        mode="normal"
                        result="shape"
                      />
                    </filter>
                    <g filter="url(#a)">
                      <rect
                        fill="#fff"
                        height="52"
                        rx="12"
                        width="52"
                        x="11.333"
                        y="6.12305"
                      />
                      <path
                        d="m37.3022 42.271c-.5195 0-.9501-.3008-1.2919-.9023l-1.8457-3.107h-3.3428c-1.5176 0-2.6695-.3999-3.4556-1.1997-.7861-.8066-1.1792-1.9482-1.1792-3.4248v-7.7827c0-1.4766.3931-2.6148 1.1792-3.4146.7861-.8066 1.938-1.2099 3.4556-1.2099h13.0224c1.5039 0 2.649.4033 3.4351 1.2099.7861.7998 1.1792 1.938 1.1792 3.4146v7.7827c0 1.4766-.3931 2.6182-1.1792 3.4248-.7861.7998-1.9312 1.1997-3.4351 1.1997h-3.4043l-1.8457 3.107c-.3418.6015-.7724.9023-1.292.9023zm.0206-1.6509 1.7021-3.1582c.1641-.3486.3247-.5776.4819-.687.1573-.1094.4204-.1641.7896-.1641h3.5478c2.0098 0 3.0147-1.0083 3.0147-3.0249v-7.7314c0-1.9824-1.0049-2.9736-3.0147-2.9736h-13.0224c-2.0098 0-3.0147.9912-3.0147 2.9736v7.7314c0 2.0166 1.0049 3.0249 3.0147 3.0249h3.4863c.3828 0 .6528.0547.8101.1641.1572.1094.3247.3384.5024.687z"
                        fill="#5558fd"
                      />
                    </g>
                  </svg>
                  <h5
                    style={{
                      margin: 0,
                      marginTop: "10px",
                    }}
                  >
                    Get to Know Us
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      marginTop: "10px",
                    }}
                  >
                    We’re excited to connect! Reach out to our team directly and
                    explore how we can enhance your productivity experience.
                  </p>
                </div>
              </div>
            )}
            {width > 768 ? (
              <div className="mt-60"></div>
            ) : (
              <div className="mt-20"></div>
            )}
            <div
              className="gradient-wrapper"
              style={{
                position: "relative",
              }}
            >
              <div className="bg-opacity-last-section">
                <div
                  style={{
                    textAlign: "center",
                    fontSize: width <= 768 ? "32px" : "40px",
                    lineHeight: width <= 768 ? "1.2em" : "1.2em",
                    letterSpacing: "-.03em",
                    fontWeight: "650",
                    color: themeName === "dark-theme" && "white",
                  }}
                >
                  <h4>
                    Try Stack Task now for a
                    <span
                      style={{
                        color: "#5558fd",
                      }}
                    >
                      <br />
                      10x productivity boost
                    </span>{" "}
                  </h4>
                </div>{" "}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowRegisterTab(true);
                      setAuthenticationModalOpened(true);
                    }}
                    style={{
                      padding: "0.75rem 1.25rem",
                      width: width <= 768 && "100%",
                      margin: width <= 768 && "0px 20px",
                      fontWeight: 500,
                    }}
                    className="navbar-button second"
                  >
                    Try for free{" "}
                  </button>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                    marginTop: "5px",
                    lineHeight: "24px",
                    letterSpacing: "-.01em",
                    color: themeName === "dark-theme" && "white",
                    fontWeight: "500",
                  }}
                >
                  7-day free trial
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      letterSpacing: "-.01em",
                      fontWeight: "600",
                      color:
                        themeName === "dark-theme"
                          ? "white"
                          : "rgb(94 104 123)",
                    }}
                  >
                    Available for:{" "}
                  </p>
                  <div
                    className="svg-wrapper"
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <svg
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.9367 14.648C20.9258 12.7832 21.7707 11.3777 23.477 10.3414C22.5227 8.97422 21.0789 8.22227 19.1758 8.07734C17.3738 7.93516 15.4023 9.12734 14.6805 9.12734C13.9176 9.12734 12.173 8.12656 10.8004 8.12656C7.96758 8.17031 4.95703 10.3852 4.95703 14.8914C4.95703 16.223 5.20039 17.5984 5.68711 19.0148C6.33789 20.8797 8.68398 25.4488 11.1312 25.375C12.4109 25.3449 13.316 24.4672 14.9812 24.4672C16.5973 24.4672 17.434 25.375 18.8613 25.375C21.3305 25.3395 23.4523 21.1859 24.0703 19.3156C20.759 17.7543 20.9367 14.7438 20.9367 14.648V14.648ZM18.0629 6.3082C19.4492 4.66211 19.3234 3.16367 19.2824 2.625C18.0574 2.69609 16.641 3.45898 15.8344 4.39688C14.9457 5.40313 14.4234 6.64727 14.5355 8.05C15.859 8.15117 17.0676 7.47031 18.0629 6.3082V6.3082Z"
                          fill="#667993"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <svg
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6.48317L12.5832 5.31417L12.5878 13.594L4.00817 13.643L4 6.48317ZM12.5797 14.5483L12.5867 22.8352L4.007 21.6557V14.4923L12.5797 14.5483ZM13.6203 5.16133L25.0012 3.5V13.489L13.6203 13.5788V5.16133V5.16133ZM25.0047 14.6265L25.0012 24.57L13.6203 22.9623L13.604 14.6078L25.0047 14.6265V14.6265Z"
                          fill="#667993"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <svg
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.49984 16.9173C7.49984 17.2267 7.37692 17.5234 7.15813 17.7422C6.93934 17.961 6.64259 18.0839 6.33317 18.0839C6.02375 18.0839 5.72701 17.961 5.50821 17.7422C5.28942 17.5234 5.1665 17.2267 5.1665 16.9173V11.6673C5.1665 11.3579 5.28942 11.0611 5.50821 10.8423C5.72701 10.6235 6.02375 10.5006 6.33317 10.5006C6.64259 10.5006 6.93934 10.6235 7.15813 10.8423C7.37692 11.0611 7.49984 11.3579 7.49984 11.6673V16.9173ZM23.8332 16.9173C23.8332 17.2267 23.7103 17.5234 23.4915 17.7422C23.2727 17.961 22.9759 18.0839 22.6665 18.0839C22.3571 18.0839 22.0603 17.961 21.8415 17.7422C21.6228 17.5234 21.4998 17.2267 21.4998 16.9173V11.6673C21.4998 11.3579 21.6228 11.0611 21.8415 10.8423C22.0603 10.6235 22.3571 10.5006 22.6665 10.5006C22.9759 10.5006 23.2727 10.6235 23.4915 10.8423C23.7103 11.0611 23.8332 11.3579 23.8332 11.6673V16.9173ZM13.3332 23.3334C13.3332 23.6428 13.2103 23.9395 12.9915 24.1583C12.7727 24.3771 12.4759 24.5 12.1665 24.5C11.8571 24.5 11.5603 24.3771 11.3415 24.1583C11.1228 23.9395 10.9998 23.6428 10.9998 23.3334V18.0834C10.9998 17.7739 11.1228 17.4772 11.3415 17.2584C11.5603 17.0396 11.8571 16.9167 12.1665 16.9167C12.4759 16.9167 12.7727 17.0396 12.9915 17.2584C13.2103 17.4772 13.3332 17.7739 13.3332 18.0834V23.3334ZM17.9998 23.3334C17.9998 23.6428 17.8769 23.9395 17.6581 24.1583C17.4393 24.3771 17.1426 24.5 16.8332 24.5C16.5238 24.5 16.227 24.3771 16.0082 24.1583C15.7894 23.9395 15.6665 23.6428 15.6665 23.3334V18.0834C15.6665 17.7739 15.7894 17.4772 16.0082 17.2584C16.227 17.0396 16.5238 16.9167 16.8332 16.9167C17.1426 16.9167 17.4393 17.0396 17.6581 17.2584C17.8769 17.4772 17.9998 17.7739 17.9998 18.0834V23.3334Z"
                          fill="#667993"
                        ></path>
                        <path
                          d="M8.6665 10.5005V19.25C8.6665 19.5594 8.78942 19.8561 9.00821 20.0749C9.22701 20.2937 9.52375 20.4166 9.83317 20.4166H19.1665C19.4759 20.4166 19.7727 20.2937 19.9915 20.0749C20.2103 19.8561 20.3332 19.5594 20.3332 19.25V10.5005H8.6665ZM14.4998 4.66663C10.9998 4.66663 8.86775 6.79288 8.6665 9.33329H20.3332C20.1313 6.79288 17.9998 4.66663 14.4998 4.66663ZM12.1665 7.93213C12.0118 7.93213 11.8634 7.87067 11.754 7.76127C11.6446 7.65188 11.5832 7.5035 11.5832 7.34879C11.5832 7.19408 11.6446 7.04571 11.754 6.93631C11.8634 6.82692 12.0118 6.76546 12.1665 6.76546C12.3212 6.76546 12.4696 6.82692 12.579 6.93631C12.6884 7.04571 12.7498 7.19408 12.7498 7.34879C12.7498 7.5035 12.6884 7.65188 12.579 7.76127C12.4696 7.87067 12.3212 7.93213 12.1665 7.93213ZM16.8332 7.93213C16.6785 7.93213 16.5301 7.87067 16.4207 7.76127C16.3113 7.65188 16.2498 7.5035 16.2498 7.34879C16.2498 7.19408 16.3113 7.04571 16.4207 6.93631C16.5301 6.82692 16.6785 6.76546 16.8332 6.76546C16.9879 6.76546 17.1363 6.82692 17.2456 6.93631C17.355 7.04571 17.4165 7.19408 17.4165 7.34879C17.4165 7.5035 17.355 7.65188 17.2456 7.76127C17.1363 7.87067 16.9879 7.93213 16.8332 7.93213Z"
                          fill="#667993"
                        ></path>
                        <path
                          d="M18 4.08337L17.0282 5.54112M11 4.08337L11.7776 5.29787"
                          stroke="#667993"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-60"></div>
          </div>
        </div>
        {width <= 768 && <div className="mt-60"></div>}
        <div className="flex-container">
          <div
            className={`flex-item ${
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
            }`}
          >
            <svg
              className="shadow"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="none"
              height="75"
              viewBox="0 0 75 75"
              width="75"
            >
              <filter
                id="a"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="74"
                width="74"
                x=".666504"
                y=".123047"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feMorphology
                  in="SourceAlpha"
                  operator="erode"
                  radius="2"
                  result="effect1_dropShadow_88_463293"
                />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="3" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_88_463293"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feMorphology
                  in="SourceAlpha"
                  operator="erode"
                  radius="3"
                  result="effect2_dropShadow_88_463293"
                />
                <feOffset dy="5" />
                <feGaussianBlur stdDeviation="7" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  in2="effect1_dropShadow_88_463293"
                  mode="normal"
                  result="effect2_dropShadow_88_463293"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect2_dropShadow_88_463293"
                  mode="normal"
                  result="shape"
                />
              </filter>
              <clipPath id="b">
                <path d="m27.1665 21.623h21v21h-21z" />
              </clipPath>
              <g filter="url(#a)">
                <rect
                  fill="#fff"
                  height="52"
                  rx="12"
                  width="52"
                  x="11.6665"
                  y="6.12305"
                />
                <g clipPath="url(#b)" clipRule="evenodd" fillRule="evenodd">
                  <path
                    d="m34.8656 21.623c-1.1609.0009-2.1004.9411-2.0995 2.0996-.0009 1.1586.9395 2.0987 2.1003 2.0996h2.1004v-2.0987c.0008-1.1586-.9395-2.0987-2.1012-2.1005.0008 0 .0008 0 0 0zm0 5.6h-5.5992c-1.1609.0009-2.1012.9411-2.1004 2.0996-.0017 1.1586.9387 2.0987 2.0995 2.1004h5.6001c1.1608-.0008 2.1012-.941 2.1003-2.0995.0009-1.1594-.9395-2.0996-2.1003-2.1005z"
                    fill="#36c5f0"
                  />
                  <path
                    d="m48.1661 29.3226c.0009-1.1585-.9395-2.0987-2.1003-2.0996-1.1609.0009-2.1012.9411-2.1004 2.0996v2.1004h2.1004c1.1608-.0008 2.1012-.941 2.1003-2.1004zm-5.6001 0v-5.6c.0009-1.1577-.9386-2.0978-2.0994-2.0996-1.1609.0009-2.1012.9411-2.1004 2.0996v5.6c-.0017 1.1586.9386 2.0987 2.0995 2.1004 1.1609-.0008 2.1012-.941 2.1003-2.1004z"
                    fill="#2eb67d"
                  />
                  <path
                    d="m40.4661 42.6231c1.1608-.0008 2.1012-.941 2.1003-2.0995.0009-1.1586-.9395-2.0988-2.1003-2.0996h-2.1004v2.0996c-.0008 1.1576.9395 2.0978 2.1004 2.0995zm0-5.6008h5.6c1.1609-.0009 2.1012-.9411 2.1004-2.0996.0017-1.1585-.9387-2.0987-2.0995-2.1004h-5.6001c-1.1608.0008-2.1012.941-2.1003 2.0995-.0009 1.1594.9386 2.0996 2.0995 2.1005z"
                    fill="#ecb22e"
                  />
                  <path
                    d="m27.166 34.9228c-.0008 1.1585.9395 2.0987 2.1004 2.0996 1.1608-.0009 2.1012-.9411 2.1003-2.0996v-2.0996h-2.1003c-1.1609.0009-2.1012.9411-2.1004 2.0996zm5.6001 0v5.6c-.0017 1.1586.9386 2.0987 2.0995 2.1005 1.1608-.0009 2.1012-.9411 2.1003-2.0996v-5.5992c.0017-1.1585-.9386-2.0987-2.0995-2.1004-1.1617 0-2.1012.9402-2.1003 2.0987z"
                    fill="#e01e5a"
                  />
                </g>
              </g>
            </svg>

            <h5
              style={{
                margin: 0,
                marginTop: "10px",
              }}
            >
              Join Our Slack Network
            </h5>
            <p
              style={{
                margin: 0,
                marginTop: "10px",
              }}
            >
              Connect with like-minded professionals to share tips, ideas, and
              strategies for boosting productivity.
            </p>
          </div>
          <div
            className={`flex-item ${
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
            }`}
          >
            <svg
              className="shadow"
              style={{
                width: "3rem",
                padding: "8px 16px",
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

            <h5
              style={{
                margin: 0,
                marginTop: "10px",
              }}
            >
              Collaborate on Our Roadmap
            </h5>
            <p
              style={{
                margin: 0,
                marginTop: "10px",
              }}
            >
              Your insights matter! Help us prioritize and build features that
              make a difference in your productivity.
            </p>
          </div>
          <div
            className={`flex-item ${
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
            }`}
          >
            <svg
              className="shadow"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="none"
              height="75"
              viewBox="0 0 75 75"
              width="75"
            >
              <filter
                id="a"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="74"
                width="74"
                x=".333008"
                y=".123047"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feMorphology
                  in="SourceAlpha"
                  operator="erode"
                  radius="2"
                  result="effect1_dropShadow_88_463304"
                />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="3" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_88_463304"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feMorphology
                  in="SourceAlpha"
                  operator="erode"
                  radius="3"
                  result="effect2_dropShadow_88_463304"
                />
                <feOffset dy="5" />
                <feGaussianBlur stdDeviation="7" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  in2="effect1_dropShadow_88_463304"
                  mode="normal"
                  result="effect2_dropShadow_88_463304"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect2_dropShadow_88_463304"
                  mode="normal"
                  result="shape"
                />
              </filter>
              <g filter="url(#a)">
                <rect
                  fill="#fff"
                  height="52"
                  rx="12"
                  width="52"
                  x="11.333"
                  y="6.12305"
                />
                <path
                  d="m37.3022 42.271c-.5195 0-.9501-.3008-1.2919-.9023l-1.8457-3.107h-3.3428c-1.5176 0-2.6695-.3999-3.4556-1.1997-.7861-.8066-1.1792-1.9482-1.1792-3.4248v-7.7827c0-1.4766.3931-2.6148 1.1792-3.4146.7861-.8066 1.938-1.2099 3.4556-1.2099h13.0224c1.5039 0 2.649.4033 3.4351 1.2099.7861.7998 1.1792 1.938 1.1792 3.4146v7.7827c0 1.4766-.3931 2.6182-1.1792 3.4248-.7861.7998-1.9312 1.1997-3.4351 1.1997h-3.4043l-1.8457 3.107c-.3418.6015-.7724.9023-1.292.9023zm.0206-1.6509 1.7021-3.1582c.1641-.3486.3247-.5776.4819-.687.1573-.1094.4204-.1641.7896-.1641h3.5478c2.0098 0 3.0147-1.0083 3.0147-3.0249v-7.7314c0-1.9824-1.0049-2.9736-3.0147-2.9736h-13.0224c-2.0098 0-3.0147.9912-3.0147 2.9736v7.7314c0 2.0166 1.0049 3.0249 3.0147 3.0249h3.4863c.3828 0 .6528.0547.8101.1641.1572.1094.3247.3384.5024.687z"
                  fill="#5558fd"
                />
              </g>
            </svg>
            <h5
              style={{
                margin: 0,
                marginTop: "10px",
              }}
            >
              Get to Know Us
            </h5>
            <p
              style={{
                margin: 0,
                marginTop: "10px",
              }}
            >
              We’re excited to connect! Reach out to our team directly and
              explore how we can enhance your productivity experience.
            </p>
          </div>
        </div>
        <div className="bg-opacity-last-section-mobile">
          <div
            style={{
              textAlign: "center",
              fontSize: width <= 768 ? "32px" : "40px",
              lineHeight: width <= 768 ? "1.2em" : "1.2em",
              letterSpacing: "-.03em",
              fontWeight: "650",
              color: themeName === "dark-theme" && "white",
            }}
          >
            <h4>
              Try Stack Task now for a
              <span
                style={{
                  color: "#5558fd",
                }}
              >
                <br />
                10x productivity boost
              </span>{" "}
            </h4>
          </div>{" "}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => {
                setShowRegisterTab(true);
                setAuthenticationModalOpened(true);
              }}
              style={{
                padding: "0.75rem 1.25rem",
                width: width <= 768 && "100%",
                margin: width <= 768 && "0px 20px",
                fontWeight: 500,
              }}
              className="navbar-button second"
            >
              Try for free{" "}
            </button>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "15px",
              marginTop: "5px",
              lineHeight: "24px",
              letterSpacing: "-.01em",
              color: themeName === "dark-theme" && "white",
              fontWeight: "500",
            }}
          >
            7-day free trial
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-.01em",
                fontWeight: "600",
                color: themeName === "dark-theme" ? "white" : "rgb(94 104 123)",
              }}
            >
              Available for:{" "}
            </p>
            <div
              className="svg-wrapper"
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <div>
                <svg
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.9367 14.648C20.9258 12.7832 21.7707 11.3777 23.477 10.3414C22.5227 8.97422 21.0789 8.22227 19.1758 8.07734C17.3738 7.93516 15.4023 9.12734 14.6805 9.12734C13.9176 9.12734 12.173 8.12656 10.8004 8.12656C7.96758 8.17031 4.95703 10.3852 4.95703 14.8914C4.95703 16.223 5.20039 17.5984 5.68711 19.0148C6.33789 20.8797 8.68398 25.4488 11.1312 25.375C12.4109 25.3449 13.316 24.4672 14.9812 24.4672C16.5973 24.4672 17.434 25.375 18.8613 25.375C21.3305 25.3395 23.4523 21.1859 24.0703 19.3156C20.759 17.7543 20.9367 14.7438 20.9367 14.648V14.648ZM18.0629 6.3082C19.4492 4.66211 19.3234 3.16367 19.2824 2.625C18.0574 2.69609 16.641 3.45898 15.8344 4.39688C14.9457 5.40313 14.4234 6.64727 14.5355 8.05C15.859 8.15117 17.0676 7.47031 18.0629 6.3082V6.3082Z"
                    fill="#667993"
                  ></path>
                </svg>
              </div>
              <div>
                <svg
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6.48317L12.5832 5.31417L12.5878 13.594L4.00817 13.643L4 6.48317ZM12.5797 14.5483L12.5867 22.8352L4.007 21.6557V14.4923L12.5797 14.5483ZM13.6203 5.16133L25.0012 3.5V13.489L13.6203 13.5788V5.16133V5.16133ZM25.0047 14.6265L25.0012 24.57L13.6203 22.9623L13.604 14.6078L25.0047 14.6265V14.6265Z"
                    fill="#667993"
                  ></path>
                </svg>
              </div>
              <div>
                <svg
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.49984 16.9173C7.49984 17.2267 7.37692 17.5234 7.15813 17.7422C6.93934 17.961 6.64259 18.0839 6.33317 18.0839C6.02375 18.0839 5.72701 17.961 5.50821 17.7422C5.28942 17.5234 5.1665 17.2267 5.1665 16.9173V11.6673C5.1665 11.3579 5.28942 11.0611 5.50821 10.8423C5.72701 10.6235 6.02375 10.5006 6.33317 10.5006C6.64259 10.5006 6.93934 10.6235 7.15813 10.8423C7.37692 11.0611 7.49984 11.3579 7.49984 11.6673V16.9173ZM23.8332 16.9173C23.8332 17.2267 23.7103 17.5234 23.4915 17.7422C23.2727 17.961 22.9759 18.0839 22.6665 18.0839C22.3571 18.0839 22.0603 17.961 21.8415 17.7422C21.6228 17.5234 21.4998 17.2267 21.4998 16.9173V11.6673C21.4998 11.3579 21.6228 11.0611 21.8415 10.8423C22.0603 10.6235 22.3571 10.5006 22.6665 10.5006C22.9759 10.5006 23.2727 10.6235 23.4915 10.8423C23.7103 11.0611 23.8332 11.3579 23.8332 11.6673V16.9173ZM13.3332 23.3334C13.3332 23.6428 13.2103 23.9395 12.9915 24.1583C12.7727 24.3771 12.4759 24.5 12.1665 24.5C11.8571 24.5 11.5603 24.3771 11.3415 24.1583C11.1228 23.9395 10.9998 23.6428 10.9998 23.3334V18.0834C10.9998 17.7739 11.1228 17.4772 11.3415 17.2584C11.5603 17.0396 11.8571 16.9167 12.1665 16.9167C12.4759 16.9167 12.7727 17.0396 12.9915 17.2584C13.2103 17.4772 13.3332 17.7739 13.3332 18.0834V23.3334ZM17.9998 23.3334C17.9998 23.6428 17.8769 23.9395 17.6581 24.1583C17.4393 24.3771 17.1426 24.5 16.8332 24.5C16.5238 24.5 16.227 24.3771 16.0082 24.1583C15.7894 23.9395 15.6665 23.6428 15.6665 23.3334V18.0834C15.6665 17.7739 15.7894 17.4772 16.0082 17.2584C16.227 17.0396 16.5238 16.9167 16.8332 16.9167C17.1426 16.9167 17.4393 17.0396 17.6581 17.2584C17.8769 17.4772 17.9998 17.7739 17.9998 18.0834V23.3334Z"
                    fill="#667993"
                  ></path>
                  <path
                    d="M8.6665 10.5005V19.25C8.6665 19.5594 8.78942 19.8561 9.00821 20.0749C9.22701 20.2937 9.52375 20.4166 9.83317 20.4166H19.1665C19.4759 20.4166 19.7727 20.2937 19.9915 20.0749C20.2103 19.8561 20.3332 19.5594 20.3332 19.25V10.5005H8.6665ZM14.4998 4.66663C10.9998 4.66663 8.86775 6.79288 8.6665 9.33329H20.3332C20.1313 6.79288 17.9998 4.66663 14.4998 4.66663ZM12.1665 7.93213C12.0118 7.93213 11.8634 7.87067 11.754 7.76127C11.6446 7.65188 11.5832 7.5035 11.5832 7.34879C11.5832 7.19408 11.6446 7.04571 11.754 6.93631C11.8634 6.82692 12.0118 6.76546 12.1665 6.76546C12.3212 6.76546 12.4696 6.82692 12.579 6.93631C12.6884 7.04571 12.7498 7.19408 12.7498 7.34879C12.7498 7.5035 12.6884 7.65188 12.579 7.76127C12.4696 7.87067 12.3212 7.93213 12.1665 7.93213ZM16.8332 7.93213C16.6785 7.93213 16.5301 7.87067 16.4207 7.76127C16.3113 7.65188 16.2498 7.5035 16.2498 7.34879C16.2498 7.19408 16.3113 7.04571 16.4207 6.93631C16.5301 6.82692 16.6785 6.76546 16.8332 6.76546C16.9879 6.76546 17.1363 6.82692 17.2456 6.93631C17.355 7.04571 17.4165 7.19408 17.4165 7.34879C17.4165 7.5035 17.355 7.65188 17.2456 7.76127C17.1363 7.87067 16.9879 7.93213 16.8332 7.93213Z"
                    fill="#667993"
                  ></path>
                  <path
                    d="M18 4.08337L17.0282 5.54112M11 4.08337L11.7776 5.29787"
                    stroke="#667993"
                    strokeWidth="2"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-60"></div>
        <Footer />
      </div>
    </>
  );
}

export default Main;
