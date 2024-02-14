import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { useContext, useState, useEffect } from "react";
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
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [calendarDate, setCalendarDate] = useState("");
  const [time, setTime] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedFullDate, setCompletedFullDate] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [clearButton, setClearButton] = useState("");
  const [completedTask, setCompletedTask] = useState([]);
  const [showCompleted, setShowCompleted] = useState("hide");
  const [showList, setShowList] = useState("");
  const [clearCompletedTasksButton, setclearCompletedTasksButton] =
    useState("hide");

  const [query, setQuery] = useState("");

  const getFilteredItems = (query, items) => {
    if (!query) {
      return items;
    }

    return taskList.filter((task) => task.task.includes(query));
  };

  const filteredItems = getFilteredItems(query, taskList);
  useState("hide");
  useState("hide");
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

  const capitalize = function (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

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

  const { getToken, userInfo, logout } = useContext(UserContext);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post(`${API_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("order");
        localStorage.removeItem("list");
        localStorage.removeItem("active");
        logout();
        navigate("/");
      })
      .catch((error) => {
        error;
      });
  };

  const showTaskWindow = () => {
    setTaskWindow("");
    setClearButton("hide");
    setclearCompletedTasksButton("hide");
    setShowList("");
    setError("");
  };

  const closeTaskWindow = () => {
    setTaskWindow("hide");
    setClearButton("");
    setShowCompleted("hide");
  };

  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      setTaskWindow("hide");
    }
  });

  const handleTask = (e) => {
    setTask(e.target.value);
  };

  const handleTime = (e) => {
    setTime(e.target.value);
  };

  const handleTaskSubmit = () => {
    const getSubmitDayStr = () => {
      const lengthSet = calendarDate.getDay();
      let dayStr = days[lengthSet];
      return dayStr;
    };

    const getSubmitMonthStr = () => {
      const lengthSet = calendarDate.getMonth();
      const monthStr = month[lengthSet];

      return monthStr;
    };

    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/task`,
        {
          category,
          task,
          calendarDate: {
            year: calendarDate.getFullYear(),
            day: getSubmitDayStr(calendarDate.getDate()),
            month: getSubmitMonthStr(calendarDate.getMonth()),
            // day: calendarDate.getDate(),
            // month: calendarDate.getMonth() + 1,
            dateNum: calendarDate.getDate(),
          },
          time,
          isCompleted,
          completedFullDate,
          taskList: taskList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const newTask = {
          category,
          task,
          calendarDate: {
            year: calendarDate.getFullYear(),
            day: getSubmitDayStr(calendarDate.getDate()),
            month: getSubmitMonthStr(calendarDate.getMonth()),
            // day: calendarDate.getDate(),
            // month: calendarDate.getMonth() + 1,
            dateNum: calendarDate.getDate(),
          },
          time,
          isCompleted,
        };

        if (response.status === 200) {
          setError("");
        }

        const updatedTaskList = [...taskList, newTask];
        setTaskList(updatedTaskList);
        setCategory("");
        setTask("");
        setTime("");
        setCalendarDate("");
        const updatedUserInfo = {
          ...userInfo,
          list: updatedTaskList,
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        fetchCurrListData();
      })
      .catch((error) => {
        if (error.message === "Request failed with status code 403") {
          setError(
            "All fields are mandatory. Please provide category, task, date and time."
          );
        }

        if (error.message === "Request failed with status code 500") {
          setError(
            "All fields are mandatory. Please provide category, task, date and time."
          );
        }

        if (error.message === "Request failed with status code 400") {
          setError(
            "Cannot add duplicate tasks. A task with the same name already exists."
          );
        }
      });
  };

  const handleDeleteAll = () => {
    axios
      .delete(`${API_URL}/task/delete-all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        data: {
          taskList: taskList,
        },
      })
      .then(() => {
        setTaskList([]);

        fetchCurrListData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteTask = (taskToDelete) => {
    const taskToDeleteIndex = taskList.findIndex(
      (task) => task.task === taskToDelete
    );

    if (taskToDeleteIndex !== -1) {
      const updatedTaskList = [...taskList];
      updatedTaskList[taskToDeleteIndex].isDeleting = true;
      setTaskList(updatedTaskList);

      axios
        .delete(`${API_URL}/task/delete-task`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          data: {
            task: taskToDelete,
          },
        })
        .then(() => {
          setTimeout(() => {
            const updatedTaskList = taskList.filter(
              (task) => task.task !== taskToDelete
            );
            setTaskList(updatedTaskList);

            const updatedUserInfo = {
              ...userInfo,
              list: updatedTaskList,
            };
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
          }, 300);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteAllCompletedTasks = () => {
    axios
      .delete(`${API_URL}/task/delete-all-completed-tasks`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        data: {
          completedTask: completedTask,
        },
      })
      .then(() => {
        setCompletedTask([]);

        fetchCurrListData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteCompleteTask = (taskToDelete) => {
    const taskToDeleteIndex = completedTask.findIndex(
      (task) => task.task === taskToDelete
    );

    if (taskToDeleteIndex !== -1) {
      const updatedTaskList = [...completedTask];
      updatedTaskList[taskToDeleteIndex].isDeleting = true;
      setCompletedTask(updatedTaskList);

      axios
        .delete(`${API_URL}/task/delete-completed-task`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          data: {
            task: taskToDelete,
          },
        })
        .then(() => {
          setTimeout(() => {
            const updatedTaskList = completedTask.filter(
              (task) => task.task !== taskToDelete
            );
            setCompletedTask(updatedTaskList);

            const updatedUserInfo = {
              ...userInfo,
              list: updatedTaskList,
            };
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
          }, 300);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCheckboxChange = (selectedCategory) => {
    if (category === selectedCategory) {
      setCategory("");
    } else {
      setCategory(selectedCategory);
    }
  };

  const fetchCurrListData = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const updatedCompletedTasks = response.data.filter(
          (task) => task.isCompleted
        );

        const taskNotCompleted = response.data.filter(
          (task) => !task.isCompleted
        );
        setTaskList(taskNotCompleted);

        setCompletedTask(updatedCompletedTasks);
      })
      .catch((error) => {
        console.error("Error fetching list:", error);
      });
  };

  useEffect(() => {
    fetchCurrListData();
  }, []);

  const handleTaskComplete = (taskToComplete) => {
    taskToComplete.isCompleted = true;

    const toStrHours = today.getHours().toString();
    const toStrMinutes = today.getMinutes().toString();

    const completedTimeStr =
      (toStrHours < 10 ? "0" + toStrHours : toStrHours) +
      ":" +
      (toStrMinutes < 10 ? "0" + toStrMinutes : toStrMinutes);

    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/task/task-completed`,
        {
          data: {
            taskToComplete: taskToComplete,
            completedFullDate: {
              completedDay: getDayStr(),
              completedMonth: getMonthStr(),
              completedYear: today.getFullYear(),
              completedDate: date,
              completedTime: completedTimeStr,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        if (!completedTask.includes(taskToComplete)) {
          setCompletedTask([...completedTask, taskToComplete]);
        }
        const newCompletedTasks = taskList.filter((task) => task.isCompleted);
        setCompletedTask(newCompletedTasks);

        fetchCurrListData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showCompletedTasks = () => {
    setShowCompleted("");
    setclearCompletedTasksButton("");
    setShowList("hide");
    setClearButton("hide");
  };

  const showTodos = () => {
    setShowCompleted("hide");
    setclearCompletedTasksButton("hide");
    setShowList("");
    setClearButton("");
  };

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
                  onChange={(e) => setQuery(e.target.value)}
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
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
        {userInfo.active && (
          <div>
            <div className="info-container">
              <p>
                {getDayStr()},{getMonthStr()} {date}
              </p>
              <p className="greet">
                {formatAMPM(today)},{userInfo.name}
              </p>

              <p>{completedTask.length} tasks completed</p>
            </div>
            <div className="tasks-container">
              <div className="tasks-info todo">
                <div className="message-icon">
                  <i className="fa fa-envelope"></i>
                </div>
                <p className="title-p">To do</p>
                <p className="number-p">{taskList.length} tasks</p>
              </div>

              <div className="tasks-info in-progress">
                <div className="bolt-icon">
                  <i className="fa fa-bolt"></i>
                </div>
                <p className="title-p">In Progress</p>
                <p className="number-p">{taskList.length} tasks</p>
              </div>

              <div className="tasks-info completed">
                <div className="star-icon">
                  <i className="fa fa-star"></i>
                </div>
                <p className="title-p">Completed</p>
                <p className="number-p">{completedTask.length} tasks</p>
              </div>
            </div>
            {taskWindow && (
              <div className="my-tasks">
                <div className="task-header">
                  <p className="show-todos" onClick={() => showTodos()}>
                    My tasks
                  </p>
                  <p
                    className="show-completed"
                    onClick={() => showCompletedTasks()}
                  >
                    Show completed
                  </p>
                </div>
                <div>
                  <div className={`show-completed task-list ${showCompleted}`}>
                    {completedTask.map((task) => (
                      <div key={task.id}>
                        <hr />
                        <div className={`task-details task-details-completed`}>
                          <button
                            className={`task-button add-to-completed completed`}
                          >
                            <i>✅</i>
                          </button>

                          <div className="task completed-task">
                            {task.task}
                            <div className="details">
                              <p>
                                Marked as completed on :{" "}
                                {task.completedFullDate[0].completedDay},
                                {task.completedFullDate[0].completedMonth}{" "}
                                {task.completedFullDate[0].completedDate}{" "}
                                {task.completedFullDate[0].completedYear} -{" "}
                                {task.completedFullDate[0].completedTime}
                              </p>

                              <p className="deadline-message">
                                The planned date was set for :{" "}
                                {task.calendarDate.day < 10
                                  ? "0" + task.calendarDate.day
                                  : task.calendarDate.day}
                                ,
                                {task.calendarDate.month < 10
                                  ? "0" + task.calendarDate.month
                                  : task.calendarDate.month}
                                {""} {task.calendarDate.dateNum}{" "}
                                {task.calendarDate.year} - {task.time}
                              </p>
                              <p>
                                If you completed this before the deadline, well
                                done!
                              </p>
                            </div>
                          </div>

                          <div className="task-details-2">
                            {task.category === "work" && (
                              <div
                                style={{
                                  backgroundColor: "#fcefb8",
                                  color: "black",
                                }}
                                className="category-label work"
                              >
                                {capitalize(task.category)}
                              </div>
                            )}

                            {task.category === "personal" && (
                              <div
                                style={{
                                  backgroundColor: "#f4d0e6",
                                  color: "black",
                                }}
                                className="category-label personal"
                              >
                                {capitalize(task.category)}
                              </div>
                            )}
                            {task.category === "family" && (
                              <div
                                style={{
                                  backgroundColor: "#b0d0e9",
                                  color: "black",
                                }}
                                className="category-label family"
                              >
                                {capitalize(task.category)}
                              </div>
                            )}
                            {task.category === "pet" && (
                              <div
                                style={{
                                  backgroundColor: "#92e0cf",
                                  color: "black",
                                }}
                                className="category-label pet"
                              >
                                {capitalize(task.category)}
                              </div>
                            )}
                            <div
                              className={`task-button delete-task ${
                                task.isDeleting ? "slide-up" : ""
                              }`}
                            >
                              <button
                                className="task-button delete-task"
                                onClick={() =>
                                  handleDeleteCompleteTask(task.task)
                                }
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`task-list ${showList}`}>
                  {filteredItems.map((task) => (
                    <div
                      key={task.id}
                      className={`task ${task.isDeleting ? "fade-out" : ""} ${
                        task.isCompleted ? "fade-out-completed" : ""
                      }`}
                    >
                      <hr />
                      <div
                        className={`task-details ${
                          task.isCompleted ? "slide-up-completed" : ""
                        }`}
                      >
                        <div className="flip-button">
                          <div className="flip-button-inner">
                            <div className={`flip-button-front`}>
                              <button
                                className={`task-button add-to-completed`}
                                onClick={() => handleTaskComplete(task)}
                              >
                                <i className="fas fa-check front"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="task">
                          {task.task}
                          <br />
                          {task.calendarDate.day < 10
                            ? "0" + task.calendarDate.day
                            : task.calendarDate.day}{" "}
                          {task.calendarDate.month < 10
                            ? "0" + task.calendarDate.month
                            : task.calendarDate.month}{" "}
                          {task.calendarDate.dateNum}, {task.calendarDate.year}
                          <br />
                          {task.time}
                        </div>

                        <div className="task-details-2">
                          {task.category === "work" && (
                            <div
                              style={{
                                backgroundColor: "#fcefb8",
                                color: "black",
                              }}
                              className="category-label work"
                            >
                              {capitalize(task.category)}
                            </div>
                          )}

                          {task.category === "personal" && (
                            <div
                              style={{
                                backgroundColor: "#f4d0e6",
                                color: "black",
                              }}
                              className="category-label personal"
                            >
                              {capitalize(task.category)}
                            </div>
                          )}
                          {task.category === "family" && (
                            <div
                              style={{
                                backgroundColor: "#b0d0e9",
                                color: "black",
                              }}
                              className="category-label family"
                            >
                              {capitalize(task.category)}
                            </div>
                          )}
                          {task.category === "pet" && (
                            <div
                              style={{
                                backgroundColor: "#92e0cf",
                                color: "black",
                              }}
                              className="category-label pet"
                            >
                              {capitalize(task.category)}
                            </div>
                          )}
                          <div
                            className={`task-button delete-task ${
                              task.isDeleting ? "slide-up" : ""
                            }`}
                          >
                            <button
                              className="task-button delete-task"
                              onClick={() => handleDeleteTask(task.task)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              {taskList.length > 0 && (
                <button
                  onClick={() => handleDeleteAll()}
                  className={`clear-all-tasks ${clearButton}`}
                >
                  Clear
                </button>
              )}
            </div>
            <div>
              {completedTask.length > 0 && (
                <button
                  onClick={() => handleDeleteAllCompletedTasks()}
                  className={`clear-all-tasks ${clearCompletedTasksButton}`}
                >
                  Clear Completed
                </button>
              )}
            </div>
            <div className={`task-window  ${taskWindow}`}>
              <div onClick={closeTaskWindow} className="close-task-window">
                <button className="close-button">&times;</button>
              </div>
              <div className="task-input-container">
                <input
                  type="text"
                  value={task}
                  placeholder="New task"
                  className="task-input"
                  id="task"
                  name="task"
                  onChange={handleTask}
                />
              </div>
              <div>
                <div className="category-checkbox">
                  <label>
                    <input
                      id="cb1"
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
                      id="cb2"
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
                      id="cb3"
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
                      id="cb4"
                      type="checkbox"
                      value="pet"
                      checked={category === "pet"}
                      onChange={() => handleCheckboxChange("pet")}
                    />
                    Pet
                  </label>
                </div>
              </div>

              <Calendar
                changeTimeAndDate={(currDateAndTimeFromChild) =>
                  setCalendarDate(currDateAndTimeFromChild)
                }
              />
              <input
                type="text"
                value={time}
                placeholder="Enter the time (e.g. 3:30 PM, afternoon 3:30)"
                className="time-input"
                id="time"
                name="time"
                onChange={handleTime}
              />

              <button
                style={{ backgroundColor: "#4f52ed" }}
                className="task-submit"
                type="submit"
                onClick={handleTaskSubmit}
              >
                Save
              </button>
              <div>{error}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default HomePage;
