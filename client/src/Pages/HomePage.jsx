import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { useContext, useState } from "react";
import Calendar from "../Components/Calendar";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version ???
function HomePage() {
  const today = new Date();
  const dayNum = today.getDay(); // string
  const monthNum = today.getMonth() + 1; // string
  const date = today.getDate(); // number
  const [taskWindow, setTaskWindow] = useState("hide");
  const [dateAndTime, setdateAndTime] = useState("");
  const [category, setCategory] = useState("");
  const [task, setTask] = useState("");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDayStr = () => {
    const lengthSet = dayNum;
    let dayStr = days[lengthSet];
    return dayStr;
  };

  const getMonthStr = () => {
    const lengthSet = monthNum - 1;
    const monthStr = month[lengthSet];

    return monthStr;
  };

  function formatAMPM(date) {
    let hours = date.getHours();
    if (hours <= 11 && hours >= 6) {
      return "Good Morning";
    }
    if (hours >= 12 && hours <= 18) {
      return "Good Afternoon";
    }
    if ((hours > 18 && hours <= 24) || (hours <= 12 && hours < 6)) {
      return "Good Night";
    }
  }

  const navigate = useNavigate();
  const { userInfo, logout } = useContext(UserContext);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post(`${API_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        userInfo.active = false;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("order");
        logout();
        navigate("/");
      })
      .catch((error) => {
        error;
      });
  };

  const showTaskWindow = () => {
    setTaskWindow("");
  };

  const closeTaskWindow = () => {
    setTaskWindow("hide");
  };

  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      setTaskWindow("hide");
    }
  });

  const handleTask = (e) => {
    setTask(e.target.value);
  };

  const handleTaskSubmit = () => {
    console.log(dateAndTime.getDate());
    console.log(dateAndTime.getMonth() + 1);
    console.log(dateAndTime.getFullYear());
    console.log(dateAndTime);
    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/task`,
        {
          category,
          task,
          dateAndTime: {
            year: dateAndTime.getFullYear(),
            day: dateAndTime.getDate(),
            month: dateAndTime.getMonth() + 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        console.log("Task posted and saved to user todo-list array.");
        setCategory("");
        setTask("");
      })
      .catch((error) => {
        console.log("Error occured while posting task ! ", error);
      });
  };

  const handleCheckboxChange = (selectedCategory) => {
    if (category === selectedCategory) {
      setCategory("");
    } else {
      setCategory(selectedCategory);
    }
  };

  console.log(dateAndTime);
  return (
    <>
      <div className="main-container">
        {!userInfo.active && (
          <div>
            <h1>TODO APP</h1>
            <NavLink to="/login">
              <button>Login</button>
            </NavLink>

            <NavLink to="/signup">
              <button>Signup</button>
            </NavLink>
          </div>
        )}
        {userInfo.active && (
          <nav className="nav-bar">
            <form className="example">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search a task here"
                  name="search"
                  className="search-input"
                />
                <button>
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>
            <button className="new-task-btn btn" onClick={showTaskWindow}>
              ⁺ New task
            </button>
            <div className="button-container">
              <button className="drop-btn">⌄</button>
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">
                  Option 1
                </a>
                <a href="#" className="dropdown-item">
                  Option 2
                </a>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
        {userInfo.active && (
          <div>
            <div>
              <p>
                {getDayStr()},{getMonthStr()} {date}
              </p>
              <p>
                {formatAMPM(today)},{userInfo.name}
              </p>
              <p>{"34"} tasks completed</p>
            </div>
            <div className="tasks-container">
              <div className="tasks-info todo">
                <div className="message-icon">
                  <i className="fa fa-envelope"></i>
                </div>
                <p className="title-p">To do</p>
                <p className="number-p">{"50"} tasks</p>
              </div>

              <div className="tasks-info in-progress">
                <div className="bolt-icon">
                  <i className="fa fa-bolt"></i>
                </div>
                <p className="title-p">In Progress</p>
                <p className="number-p">{"4"} tasks</p>
              </div>

              <div className="tasks-info completed">
                <div className="star-icon">
                  <i className="fa fa-star"></i>
                </div>
                <p className="title-p">Completed</p>
                <p className="number-p">{"100"} tasks</p>
              </div>
            </div>

            <div className={`task-window  ${taskWindow}`}>
              <div>
                <div className="category-checkbox">
                  <button onClick={handleTaskSubmit}>Save</button>

                  <label>
                    <input
                      type="checkbox"
                      value="work"
                      checked={category === "work"}
                      onChange={() => handleCheckboxChange("work")}
                    />
                    Work
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      value="personal"
                      checked={category === "personal"}
                      onChange={() => handleCheckboxChange("personal")}
                    />
                    Personal
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      value="family"
                      checked={category === "family"}
                      onChange={() => handleCheckboxChange("family")}
                    />
                    Family
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      value="pet"
                      checked={category === "pet"}
                      onChange={() => handleCheckboxChange("pet")}
                    />
                    Pet
                  </label>

                  <p>{dateAndTime.toString()}</p>
                </div>
              </div>
              <input
                type="text"
                value={task}
                placeholder="New task"
                className="task-input"
                id="task"
                name="task"
                onChange={handleTask}
              />

              <Calendar
                changeTimeAndDate={(currDateAndTimeFromChild) =>
                  setdateAndTime(currDateAndTimeFromChild)
                }
              />

              <div onClick={closeTaskWindow}>&times;</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default HomePage;
