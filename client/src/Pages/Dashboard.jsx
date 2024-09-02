import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import useWindowDimensions from "../utils/useWindowDimensions";
import { Modal, Popover } from "@mui/material";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Lottie from "lottie-react";
import animationData from "../assets/loading-animation/loading-animation.json";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import completedTaskSound from "../sounds/todo-completed-sound.mp3";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version ???
function Dashboard() {
  const { getToken, userInfo, logout, updateUser } = useContext(UserContext);
  const { showTaskDeletedMessage, showTaskCompletedMessage, contextHolder } =
    useAntdMessageHandler();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const audio = new Audio(completedTaskSound);
  const today = new Date();
  const dayNum = today.getDay();
  const monthNum = today.getMonth() + 1;
  const date = today.getDate();

  // min date
  const todaysDate = new Date().toISOString().split("T")[0];
  const [newTaskInputValue, setNewTaskInputValue] = useState("");

  const handleTaskChangeFromInput = (e) => {
    setNewTaskInputValue(e.target.value);
  };

  const [newTaskFormData, setNewTaskFormData] = useState({
    task: "",
    status: "todo",
    category: "work",
    startDate: "",
    endDate: "",
  });

  // tasks
  const [taskList, setTaskList] = useState([]);
  const [inProgressTaskList, setInProgressTaskList] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);

  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // completion percentage
  const completionPercentage =
    taskList?.length === 0
      ? 0
      : ((completedTask.length / taskList?.length) * 100).toFixed(2);

  // in-progress percentage
  const inProgressPercentage =
    taskList?.length === 0
      ? 0
      : ((inProgressTaskList.length / taskList?.length) * 100).toFixed(2);

  // left side navigation bar hover effect
  const [myTaskHeadHovered, setMyTaskHeadHovered] = useState(false);
  const [inboxHeadHovered, setInboxHeadHovered] = useState(false);
  const [meetingsHeadHovered, setMeetingsHeadHovered] = useState(false);
  const [settingsHeadHovered, setSettingsHeadHovered] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  // add new task modal status
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const addTaskModalRef = useRef(null);

  // filter from left navigation bar my tasks
  const [showMyTasks, setShowMyTasks] = useState("all");

  // filter from search a task here input
  const [filterString, setFilterString] = useState("");

  // hovered task item
  const [hoveredTodoTaskMoreBtn, setHoveredTodoTaskMoreBtn] = useState(null);

  const [anchorElLogoutPopover, setAnchorElLogoutPopover] = useState(null);
  const [showLogoutPopover, setShowLogoutPopover] = useState(false);
  const [changingProfilePictureBar, setChangingProfilePictureBar] =
    useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [toRemoveTask, setToRemoveTask] = useState(null);
  const [completedBtnAnimationActive, setCompletedBtnAnimationActive] =
    useState(false);

  const handleShowLogoutPopover = (event) => {
    setAnchorElLogoutPopover(event.currentTarget);
    setShowLogoutPopover(!showLogoutPopover);
  };

  const handleCloseLogoutPopover = () => {
    setAnchorElLogoutPopover(null);
    setShowLogoutPopover(!showLogoutPopover);
  };

  const filteredTasks = taskList
    .filter((task) => {
      if (showMyTasks === "all") {
        return true;
      }
      return task.category.toLowerCase() === showMyTasks.toLowerCase();
    })
    .filter((task) => {
      return task.task.toLowerCase().includes(filterString.toLowerCase());
    });

  const closeAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const toggleExpand = (item) => {
    setExpandedItem((prevItem) => (prevItem === item ? null : item));
  };

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

  // get all tasks
  const getAllTasks = async () => {
    try {
      const result = await axios.get(`${API_URL}/task/all-tasks`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setTaskList(result.data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  // get all in-progress tasks
  const getAllInProgressTasks = async () => {
    try {
      const result = await axios.get(`${API_URL}/task/in-progress`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setInProgressTaskList(result.data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  // get all completed tasks
  const getAllCompletedTasks = async () => {
    try {
      const result = await axios.get(`${API_URL}/task/completed`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setCompletedTask(result.data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  // complete the task softly
  const taskSoftCompletion = async (taskToDelete, index, task) => {
    audio.play();
    setCompletedBtnAnimationActive(index);
    try {
      await axios.patch(
        `${API_URL}/task/complete/${taskToDelete}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setTimeout(() => {
        getAllTasks();
        getAllInProgressTasks();
        getAllCompletedTasks();
      }, 300);

      const undoCompleted = async (req, res) => {
        try {
          await axios.patch(
            `${API_URL}/task/uncomplete/${taskToDelete}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          getAllTasks();
          getAllInProgressTasks();
          getAllCompletedTasks();
        } catch (error) {
          console.error("error:", error);
        }
      };

      setTimeout(() => {
        setCompletedBtnAnimationActive(null);
      }, 300);
      showTaskCompletedMessage("Task completed", 3, undoCompleted);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (userInfo.active) {
      getAllTasks();
      getAllInProgressTasks();
      getAllCompletedTasks();
    }
  }, []);

  // add new task from modal
  const handleTaskModalInputsChange = (e) => {
    const { name, value } = e.target;

    setNewTaskFormData({
      ...newTaskFormData,
      [name]: value,
    });
  };

  const addTask = async (addTaskAgainData) => {
    try {
      await axios.post(
        `${API_URL}/task`,
        { newTaskFormData },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setNewTaskFormData({
        task: "",
        status: "todo",
        category: "work",
        startDate: "",
        endDate: "",
      });
      closeAddTaskModal();
      setNewTaskInputValue("");
      getAllTasks();
      getAllInProgressTasks();
      getAllCompletedTasks();
    } catch (error) {
      console.error("error:", error);
    }
  };

  const openAllTasks = () => {
    setShowCompletedTasks(false);
  };

  const openCompletedTasks = () => {
    setShowCompletedTasks(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowAddTaskModal(true);
      setNewTaskFormData({
        ...newTaskFormData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // tool tip for priorities light theme
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  // tool tip for priorities dark theme
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  // handle logout
  const handleLogout = async () => {
    try {
      const result = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      logout();
      navigate("/");
      console.log("result after logout:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  // change profile picture
  const handleChangeProfileImage = (e) => {
    const file = e.target.files[0];
    handleChangeProfileImageSetFileToBase(file);
  };

  const handleChangeProfileImageSetFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
  };

  const changeProfileImage = async () => {
    setChangingProfilePictureBar(true);

    try {
      const result = await axios.post(
        `${API_URL}/users/${userInfo?._id}/change_profile_image`,
        {
          image: profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("result after changing image:", result.data.imageInfo.url);
      updateUser({ profilePicture: result.data.imageInfo.url });
      setProfileImage("");
      if (result.data.imageInfo.url) {
        setChangingProfilePictureBar(false);
      }
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (profileImage) {
      changeProfileImage();
    }
  }, [profileImage]);

  // delete task
  const taskSoftDeletion = async (taskToDelete, task) => {
    try {
      await axios.patch(
        `${API_URL}/task/delete/${taskToDelete}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      getAllTasks();

      const undoTask = async (req, res) => {
        try {
          await axios.patch(
            `${API_URL}/task/undo/${taskToDelete}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          getAllTasks();
        } catch (error) {
          console.error("error:", error);
        }
      };

      showTaskDeletedMessage("Task deleted", 3, undoTask);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <>
      {contextHolder}
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
        {/* add task modal */}
        <Modal
          open={showAddTaskModal}
          onClose={closeAddTaskModal}
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
            ref={addTaskModalRef}
            style={{
              borderRadius: "5px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: width <= 768 ? "98%" : 600,
              maxHeight: "95vh",
              height: width <= 768 && "95vh",
              backgroundColor: "white",
              outlineStyle: "none",
              overflowY: "auto",
              boxShadow:
                "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
            }}
          >
            <div>
              {/* Add new task content */}
              <div className="add-new-task-modal-content">
                <div className="task-modal-content-header">
                  <div>Create new task</div>
                  <div
                    style={{
                      height: "58px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={closeAddTaskModal}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "3px",
                        border: "1px solid rgb(231,231,231)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "4px",
                      }}
                    >
                      <svg widths={12} height={12} viewBox="0 0 512 512">
                        <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <span>Task</span>

                  <input
                    value={newTaskFormData.task}
                    name="task"
                    onChange={handleTaskModalInputsChange}
                    className="mt-5 enter-task-modal"
                    type="text"
                    placeholder="Enter task"
                  />
                </div>
                <div className="mt-20"></div>
                <div>
                  <span>Status</span>
                  <div className="mt-5"></div>
                  <select
                    value={newTaskFormData.status}
                    name="status"
                    onChange={handleTaskModalInputsChange}
                    className="new-task-modal-status-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="mt-20"></div>
                <div>
                  <span>Category</span>
                  <div className="mt-5"></div>
                  <select
                    value={newTaskFormData.category}
                    name="category"
                    onChange={handleTaskModalInputsChange}
                    className="new-task-modal-category-select"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="pet">Pet</option>
                  </select>
                </div>
                <div className="mt-20"></div>
                <div className="date-wrapper-task-modal">
                  <div>
                    <span>Start Date</span>
                    <input
                      value={newTaskFormData.startDate}
                      name="startDate"
                      onChange={handleTaskModalInputsChange}
                      className="mt-5"
                      type="date"
                      min={todaysDate}
                    />
                  </div>
                  <div>
                    <span>End Date</span>
                    <input
                      value={newTaskFormData.endDate}
                      name="endDate"
                      onChange={handleTaskModalInputsChange}
                      className="mt-5"
                      type="date"
                      min={todaysDate}
                    />
                  </div>
                </div>
                <div className="mt-40"></div>
                <div className="btn-wrapper-add-new-task-modal">
                  <button onClick={closeAddTaskModal}>Cancel</button>
                  <button onClick={addTask}>Add task</button>
                </div>
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Modal>

        {/* left side navigation bar */}
        <div className="navigation-bar-left-side">
          <div className="left-side-nav-bar-content">
            <div className="mt-10"></div>
            <div className="logo">Logo</div>
            <div className="mt-30"></div>
            <div className="nav-items-expandable">
              <div className="expandable-nav-my-tasks">
                <div
                  onClick={() => toggleExpand("my-tasks")}
                  onMouseEnter={() => setMyTaskHeadHovered(true)}
                  onMouseLeave={() => setMyTaskHeadHovered(false)}
                  className="task-header hover-bg-effect-task-header"
                  style={{
                    cursor: "pointer",
                    backgroundColor: myTaskHeadHovered && "#f7f6ff",
                    color: myTaskHeadHovered && "#5757ff",
                    transition:
                      "background-color 0.25s ease 0s, color 0.25s ease 0s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={"none"}
                        height="18"
                        viewBox="0 0 24 24"
                        width="18"
                      >
                        <path
                          style={{
                            transition: "stroke 0.25s ease 0s",
                          }}
                          d="M10 9V14C10 15.1046 10.8954 16 12 16V16C13.1046 16 14 15.1046 14 14V7C14 4.79086 12.2091 3 10 3V3C7.79086 3 6 4.79086 6 7V15C6 18.3137 8.68629 21 12 21V21C15.3137 21 18 18.3137 18 15V5"
                          stroke={myTaskHeadHovered ? "#5757ff" : "black"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    <span>My Tasks</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      style={{
                        transition: "fill 0.25s ease 0s",
                      }}
                      fill={myTaskHeadHovered ? "#5757ff" : "black"}
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 96 96"
                    >
                      <title />
                      <path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z" />
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    padding: "0px 30px",
                    maxHeight: expandedItem === "my-tasks" ? "200px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.25s ease-out",
                    marginBottom: expandedItem === "my-tasks" && "20px",
                  }}
                >
                  <div
                    onClick={() => {
                      if (showMyTasks === "work") {
                        setShowMyTasks("all");
                      } else {
                        setShowMyTasks("work");
                      }
                    }}
                    className="my-task-parent-individual-div"
                  >
                    <div className="left-side-nav-box work-box">
                      {showMyTasks === "work" && (
                        <svg height="10px" viewBox="0 0 18 15" width="10px">
                          <title />
                          <desc />
                          <defs />
                          <g
                            fill="none"
                            fillRule="evenodd"
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g
                              fill="#5558fd"
                              id="Core"
                              transform="translate(-423.000000, -47.000000)"
                            >
                              <g
                                id="check"
                                transform="translate(423.000000, 47.500000)"
                              >
                                <path
                                  d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z"
                                  id="Shape"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                    </div>
                    <span>Work</span>
                  </div>
                  <div
                    onClick={() => {
                      if (showMyTasks === "personal") {
                        setShowMyTasks("all");
                      } else {
                        setShowMyTasks("personal");
                      }
                    }}
                    className="my-task-parent-individual-div"
                  >
                    <div className="left-side-nav-box personal-box">
                      {showMyTasks === "personal" && (
                        <svg height="10px" viewBox="0 0 18 15" width="10px">
                          <title />
                          <desc />
                          <defs />
                          <g
                            fill="none"
                            fillRule="evenodd"
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g
                              fill="#5558fd"
                              id="Core"
                              transform="translate(-423.000000, -47.000000)"
                            >
                              <g
                                id="check"
                                transform="translate(423.000000, 47.500000)"
                              >
                                <path
                                  d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z"
                                  id="Shape"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                    </div>
                    <span>Personal</span>
                  </div>
                  <div
                    onClick={() => {
                      if (showMyTasks === "family") {
                        setShowMyTasks("all");
                      } else {
                        setShowMyTasks("family");
                      }
                    }}
                    className="my-task-parent-individual-div"
                  >
                    <div className="left-side-nav-box family-box">
                      {" "}
                      {showMyTasks === "family" && (
                        <svg height="10px" viewBox="0 0 18 15" width="10px">
                          <title />
                          <desc />
                          <defs />
                          <g
                            fill="none"
                            fillRule="evenodd"
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g
                              fill="#5558fd"
                              id="Core"
                              transform="translate(-423.000000, -47.000000)"
                            >
                              <g
                                id="check"
                                transform="translate(423.000000, 47.500000)"
                              >
                                <path
                                  d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z"
                                  id="Shape"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                    </div>
                    <span>Family</span>
                  </div>
                  <div
                    onClick={() => {
                      if (showMyTasks === "pet") {
                        setShowMyTasks("all");
                      } else {
                        setShowMyTasks("pet");
                      }
                    }}
                    className="my-task-parent-individual-div"
                  >
                    <div className="left-side-nav-box pet-box">
                      {" "}
                      {showMyTasks === "pet" && (
                        <svg height="10px" viewBox="0 0 18 15" width="10px">
                          <title />
                          <desc />
                          <defs />
                          <g
                            fill="none"
                            fillRule="evenodd"
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g
                              fill="#5558fd"
                              id="Core"
                              transform="translate(-423.000000, -47.000000)"
                            >
                              <g
                                id="check"
                                transform="translate(423.000000, 47.500000)"
                              >
                                <path
                                  d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z"
                                  id="Shape"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                    </div>
                    <span>Pet</span>
                  </div>
                </div>
              </div>
              <div className="expandable-nav-inbox">
                <div
                  onClick={() => toggleExpand("inbox")}
                  onMouseEnter={() => setInboxHeadHovered(true)}
                  onMouseLeave={() => setInboxHeadHovered(false)}
                  className="task-header hover-bg-effect-task-header"
                  style={{
                    cursor: "pointer",
                    backgroundColor: inboxHeadHovered && "#f7f6ff",
                    color: inboxHeadHovered && "#5757ff",
                    transition:
                      "background-color 0.25s ease 0s, color 0.25s ease 0s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        style={{
                          transition: "fill 0.25s ease 0s",
                        }}
                        fill={inboxHeadHovered ? "#5757ff" : "black"}
                        width={18}
                        height={18}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M448 64H64C28.65 64 0 92.65 0 128v256c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64V128C512 92.65 483.3 64 448 64zM64 112h384c8.822 0 16 7.178 16 16v22.16l-166.8 138.1c-23.19 19.28-59.34 19.27-82.47 .0156L48 150.2V128C48 119.2 55.18 112 64 112zM448 400H64c-8.822 0-16-7.178-16-16V212.7l136.1 113.4C204.3 342.8 229.8 352 256 352s51.75-9.188 71.97-25.98L464 212.7V384C464 392.8 456.8 400 448 400z" />
                      </svg>
                    </span>
                    <span>Inbox</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      style={{
                        transition: "fill 0.25s ease 0s",
                      }}
                      fill={inboxHeadHovered ? "#5757ff" : "black"}
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 96 96"
                    >
                      <title />
                      <path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z" />
                    </svg>
                  </div>
                </div>

                <div
                  style={{
                    padding: "0px 12px",
                    maxHeight: expandedItem === "inbox" ? "200px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.25s ease-out",
                    marginBottom: expandedItem === "inbox" && "20px",
                  }}
                >
                  <div className="inbox-parent-individual-div">inbox</div>
                  <div className="inbox-parent-individual-div">inbox</div>
                  <div className="inbox-parent-individual-div">inbox</div>
                  <div className="inbox-parent-individual-div">inbox</div>
                  <div className="inbox-parent-individual-div">inbox</div>
                </div>
              </div>
              <div className="expandable-nav-meetings">
                <div
                  onClick={() => toggleExpand("meetings")}
                  onMouseEnter={() => setMeetingsHeadHovered(true)}
                  onMouseLeave={() => setMeetingsHeadHovered(false)}
                  className="task-header hover-bg-effect-task-header"
                  style={{
                    cursor: "pointer",
                    backgroundColor: meetingsHeadHovered && "#f7f6ff",
                    color: meetingsHeadHovered && "#5757ff",
                    transition:
                      "background-color 0.25s ease 0s, color 0.25s ease 0s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        style={{
                          transition: "fill 0.25s ease 0s",
                        }}
                        fill={meetingsHeadHovered ? "#5757ff" : "black"}
                        width={18}
                        height={18}
                        xmlns="http://www.w3.org/2000/svg"
                        id="Icons"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20,2H19V1a1,1,0,0,0-2,0V2H7V1A1,1,0,0,0,5,1V2H4A4,4,0,0,0,0,6V20a4,4,0,0,0,4,4H20a4,4,0,0,0,4-4V6A4,4,0,0,0,20,2Zm2,18a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H5V5A1,1,0,0,0,7,5V4H17V5a1,1,0,0,0,2,0V4h1a2,2,0,0,1,2,2Z" />
                        <path d="M19,7H5A1,1,0,0,0,5,9H19a1,1,0,0,0,0-2Z" />
                        <path d="M7,12H5a1,1,0,0,0,0,2H7a1,1,0,0,0,0-2Z" />
                        <path d="M7,17H5a1,1,0,0,0,0,2H7a1,1,0,0,0,0-2Z" />
                        <path d="M13,12H11a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z" />
                        <path d="M13,17H11a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z" />
                        <path d="M19,12H17a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z" />
                        <path d="M19,17H17a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z" />
                      </svg>
                    </span>
                    <span>Meetings</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      style={{
                        transition: "fill 0.25s ease 0s",
                      }}
                      fill={meetingsHeadHovered ? "#5757ff" : "black"}
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 96 96"
                    >
                      <title />
                      <path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z" />
                    </svg>
                  </div>
                </div>

                <div
                  style={{
                    padding: "0px 12px",
                    maxHeight: expandedItem === "meetings" ? "200px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.25s ease-out",
                    marginBottom: expandedItem === "meetings" && "20px",
                  }}
                >
                  <div className="meetings-parent-individual-div">meeting</div>
                  <div className="meetings-parent-individual-div">meeting</div>
                  <div className="meetings-parent-individual-div">meeting</div>
                  <div className="meetings-parent-individual-div">meeting</div>
                  <div className="meetings-parent-individual-div">meeting</div>
                </div>
              </div>
              <div className="expandable-nav-settings">
                <div
                  onClick={() => toggleExpand("settings")}
                  onMouseEnter={() => setSettingsHeadHovered(true)}
                  onMouseLeave={() => setSettingsHeadHovered(false)}
                  className="task-header hover-bg-effect-task-header"
                  style={{
                    cursor: "pointer",
                    backgroundColor: settingsHeadHovered && "#f7f6ff",
                    color: settingsHeadHovered && "#5757ff",
                    transition:
                      "background-color 0.25s ease 0s, color 0.25s ease 0s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        style={{
                          transition: "fill 0.25s ease 0s",
                        }}
                        fill={settingsHeadHovered ? "#5757ff" : "black"}
                        width={18}
                        height={18}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <title />
                        <g data-name="1" id="_1">
                          <path d="M293.9,450H233.53a15,15,0,0,1-14.92-13.42l-4.47-42.09a152.77,152.77,0,0,1-18.25-7.56L163,413.53a15,15,0,0,1-20-1.06l-42.69-42.69a15,15,0,0,1-1.06-20l26.61-32.93a152.15,152.15,0,0,1-7.57-18.25L76.13,294.1a15,15,0,0,1-13.42-14.91V218.81A15,15,0,0,1,76.13,203.9l42.09-4.47a152.15,152.15,0,0,1,7.57-18.25L99.18,148.25a15,15,0,0,1,1.06-20l42.69-42.69a15,15,0,0,1,20-1.06l32.93,26.6a152.77,152.77,0,0,1,18.25-7.56l4.47-42.09A15,15,0,0,1,233.53,48H293.9a15,15,0,0,1,14.92,13.42l4.46,42.09a152.91,152.91,0,0,1,18.26,7.56l32.92-26.6a15,15,0,0,1,20,1.06l42.69,42.69a15,15,0,0,1,1.06,20l-26.61,32.93a153.8,153.8,0,0,1,7.57,18.25l42.09,4.47a15,15,0,0,1,13.41,14.91v60.38A15,15,0,0,1,451.3,294.1l-42.09,4.47a153.8,153.8,0,0,1-7.57,18.25l26.61,32.93a15,15,0,0,1-1.06,20L384.5,412.47a15,15,0,0,1-20,1.06l-32.92-26.6a152.91,152.91,0,0,1-18.26,7.56l-4.46,42.09A15,15,0,0,1,293.9,450ZM247,420h33.39l4.09-38.56a15,15,0,0,1,11.06-12.91A123,123,0,0,0,325.7,356a15,15,0,0,1,17,1.31l30.16,24.37,23.61-23.61L372.06,328a15,15,0,0,1-1.31-17,122.63,122.63,0,0,0,12.49-30.14,15,15,0,0,1,12.92-11.06l38.55-4.1V232.31l-38.55-4.1a15,15,0,0,1-12.92-11.06A122.63,122.63,0,0,0,370.75,187a15,15,0,0,1,1.31-17l24.37-30.16-23.61-23.61-30.16,24.37a15,15,0,0,1-17,1.31,123,123,0,0,0-30.14-12.49,15,15,0,0,1-11.06-12.91L280.41,78H247l-4.09,38.56a15,15,0,0,1-11.07,12.91A122.79,122.79,0,0,0,201.73,142a15,15,0,0,1-17-1.31L154.6,116.28,131,139.89l24.38,30.16a15,15,0,0,1,1.3,17,123.41,123.41,0,0,0-12.49,30.14,15,15,0,0,1-12.91,11.06l-38.56,4.1v33.38l38.56,4.1a15,15,0,0,1,12.91,11.06A123.41,123.41,0,0,0,156.67,311a15,15,0,0,1-1.3,17L131,358.11l23.61,23.61,30.17-24.37a15,15,0,0,1,17-1.31,122.79,122.79,0,0,0,30.13,12.49,15,15,0,0,1,11.07,12.91ZM449.71,279.19h0Z" />
                          <path d="M263.71,340.36A91.36,91.36,0,1,1,355.08,249,91.46,91.46,0,0,1,263.71,340.36Zm0-152.72A61.36,61.36,0,1,0,325.08,249,61.43,61.43,0,0,0,263.71,187.64Z" />
                        </g>
                      </svg>
                    </span>
                    <span>Settings</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      style={{
                        transition: "fill 0.25s ease 0s",
                      }}
                      fill={settingsHeadHovered ? "#5757ff" : "black"}
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 96 96"
                    >
                      <title />
                      <path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-10"></div>
                <div
                  style={{
                    padding: "0px 12px",
                    maxHeight: expandedItem === "settings" ? "20px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.25s ease-out",
                  }}
                >
                  <div>Theme</div>
                </div>
              </div>
            </div>
          </div>
          {width <= 768 && <div className="mt-20"></div>}
          <div
            className="copyright-info"
            style={{
              bottom: 0,
              left: 0,
              position: "absolute",
              textAlign: "center",
              pointerEvents: "none",
              width: "100%",
              backgroundColor: "yellow",
              height: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "rgb(112, 112, 112)",
                flexWrap: "wrap",
                cursor: "default",
                color: "rgb(112, 112, 112)",
              }}
            >
              © 2024 Stack Task | Designed & Developed by Aykut Kav
            </div>
          </div>{" "}
        </div>
        {/* content container */}
        <div className="content-container">
          <div className="content-container-top-section">
            <div className="task-search-bar">
              <div className="search-bar">
                <input
                  onChange={(e) => setFilterString(e.target.value)}
                  type="text"
                  placeholder="Search a task here"
                />
                <svg
                  width={18}
                  height={18}
                  className="input-search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  version="1.1"
                  viewBox="0 0 512 512"
                >
                  <path d="M344.5,298c15-23.6,23.8-51.6,23.8-81.7c0-84.1-68.1-152.3-152.1-152.3C132.1,64,64,132.2,64,216.3  c0,84.1,68.1,152.3,152.1,152.3c30.5,0,58.9-9,82.7-24.4l6.9-4.8L414.3,448l33.7-34.3L339.5,305.1L344.5,298z M301.4,131.2  c22.7,22.7,35.2,52.9,35.2,85c0,32.1-12.5,62.3-35.2,85c-22.7,22.7-52.9,35.2-85,35.2c-32.1,0-62.3-12.5-85-35.2  c-22.7-22.7-35.2-52.9-35.2-85c0-32.1,12.5-62.3,35.2-85c22.7-22.7,52.9-35.2,85-35.2C248.5,96,278.7,108.5,301.4,131.2z" />
                </svg>
              </div>
            </div>
            <div className="new-task">
              <button onClick={() => setShowAddTaskModal(true)}>
                + New task
              </button>
            </div>
            <div className="pp">
              <div
                onClick={() => {
                  if (!changingProfilePictureBar) {
                    document
                      .getElementById("formuploadModal-profile-image")
                      .click();
                  }
                }}
                className={`profile-container`}
                style={{
                  pointerEvents: !changingProfilePictureBar ? "auto" : "none",
                  cursor: !changingProfilePictureBar ? "pointer" : "default",
                }}
              >
                {userInfo.profilePicture && !changingProfilePictureBar ? (
                  <>
                    <img
                      src={userInfo.profilePicture}
                      alt="Profile"
                      className="profile-photo"
                    />
                    <div className="online-indicator"></div>
                  </>
                ) : !changingProfilePictureBar ? (
                  <>
                    <div className="profile-image-place-holder">
                      {userInfo.name[0].toUpperCase()}
                    </div>
                    <div className="online-indicator"></div>
                  </>
                ) : (
                  <Lottie animationData={animationData} />
                )}

                <input
                  onChange={handleChangeProfileImage}
                  type="file"
                  id="formuploadModal-profile-image"
                  name="profileImage"
                  className="form-control"
                  style={{ display: "none" }}
                />
              </div>
              {/* logout popover start to check */}
              <div className="icon">
                {" "}
                <svg
                  onClick={handleShowLogoutPopover}
                  style={{
                    display: "flex",
                    cursor: "pointer",
                  }}
                  fill={"#919092"}
                  width={18}
                  height={18}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 96 96"
                >
                  <title />
                  <path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z" />
                </svg>
                {/* popover here !!! */}
                <Popover
                  className="popover-material-ui-light-theme"
                  open={showLogoutPopover}
                  anchorEl={anchorElLogoutPopover}
                  onClose={handleCloseLogoutPopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div
                    onClick={handleLogout}
                    className="popover-content-details"
                  >
                    <div className="logout-option-wrapper logout-option pointer">
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <svg width={16} height={16} viewBox="0 0 24 24">
                          <g fill="none" fillRule="evenodd">
                            <path
                              stroke="currentColor"
                              d="M6.5 8.3V5.63c0-1.17.9-2.13 2-2.13h7c1.1 0 2 .95 2 2.13v11.74c0 1.17-.9 2.13-2 2.13h-7c-1.1 0-2-.95-2-2.13V14.7"
                            ></path>
                            <path
                              fill="currentColor"
                              d="m12.8 11-2.15-2.15a.5.5 0 1 1 .7-.7L14 10.79a1 1 0 0 1 0 1.42l-2.65 2.64a.5.5 0 0 1-.7-.7L12.79 12H4.5a.5.5 0 0 1 0-1h8.3z"
                            ></path>
                          </g>
                        </svg>
                      </div>
                      <div>Log out</div>
                    </div>
                  </div>
                </Popover>
              </div>
              {/* logout popover finish to check */}
            </div>
          </div>
          <div className="content-container-mid-section">
            <div className="current-date-mid-section ">
              {getDayStr()}, {getMonthStr()} {date}
            </div>
            <div className="greeting-user-section">
              <div className="first-content-greeting-section"></div>
              <div className="second-content-greeting-section">
                {formatAMPM(today)}, {userInfo.name}
              </div>
              <div className="third-content-greeting-section">
                <div
                  style={{
                    position: "relative",
                    width: width <= 768 && "100%",
                  }}
                >
                  <input
                    className="mt-5 default-value-input"
                    type="date"
                    min={todaysDate}
                    max={todaysDate}
                  />
                  <label htmlFor="date-input" className="input-label">
                    Today
                  </label>
                </div>
              </div>
            </div>
            <div className="task-completed-info">
              <span>{`${completedTask.length} tasks completed`}</span>
              <div className="completed-task-loading-bar">
                <div
                  className="completed-task-loading-bar-inside"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="mid-section-last-grid-div">
              <div className="first-box">
                <div>
                  <div className="icon-box to-do">
                    <svg
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title />
                      <path
                        d="M12.69,12.06a1,1,0,0,1-1.34,0L2.87,4.35A2,2,0,0,1,4,4H20a2,2,0,0,1,1.13.35Z"
                        fill="white"
                      />
                      <path
                        d="M22,6.26V17a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V6.26l8.68,7.92a2,2,0,0,0,1.32.49,2,2,0,0,0,1.33-.51Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="f-w-bold">To do</div>
                    <div className="number-detail fs-12">
                      {taskList.length
                        ? `${taskList.length} tasks`
                        : "No tasks available"}
                    </div>
                  </div>
                </div>
                <div className="percentage-information">
                  <span>
                    <svg
                      style={{
                        display: "flex",
                      }}
                      width={16}
                      height={16}
                      fill="#004329"
                      id="Layer_1"
                      viewBox="0 0 512 512"
                    >
                      <path d="M128.4,189.3L233.4,89c5.8-6,13.7-9,22.4-9c8.7,0,16.5,3,22.4,9l105.4,100.3c12.5,11.9,12.5,31.3,0,43.2  c-12.5,11.9-32.7,11.9-45.2,0L288,184.4v217c0,16.9-14.3,30.6-32,30.6c-17.7,0-32-13.7-32-30.6v-217l-50.4,48.2  c-12.5,11.9-32.7,11.9-45.2,0C115.9,220.6,115.9,201.3,128.4,189.3z" />
                    </svg>
                  </span>
                  <span>5%</span>
                </div>
              </div>
              <div className="second-box">
                <div>
                  <div className="icon-box in-progress">
                    <svg
                      width={18}
                      height={18}
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title />
                      <g data-name="Layer 2" id="Layer_2">
                        <polygon points="21.59 8 15.87 8 19.87 2 7.32 2 2.52 14 8.61 14 5.84 22.31 21.59 8" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <div className="f-w-bold">In Progress</div>
                    <div className="number-detail fs-12">
                      {inProgressTaskList.length
                        ? `${inProgressTaskList.length} tasks`
                        : "No tasks in progress"}
                    </div>
                  </div>
                </div>
                <div className="percentage-information">
                  <span>
                    <svg
                      style={{
                        display: "flex",
                      }}
                      width={16}
                      height={16}
                      fill="#004329"
                      id="Layer_1"
                      viewBox="0 0 512 512"
                    >
                      <path d="M128.4,189.3L233.4,89c5.8-6,13.7-9,22.4-9c8.7,0,16.5,3,22.4,9l105.4,100.3c12.5,11.9,12.5,31.3,0,43.2  c-12.5,11.9-32.7,11.9-45.2,0L288,184.4v217c0,16.9-14.3,30.6-32,30.6c-17.7,0-32-13.7-32-30.6v-217l-50.4,48.2  c-12.5,11.9-32.7,11.9-45.2,0C115.9,220.6,115.9,201.3,128.4,189.3z" />
                    </svg>
                  </span>
                  <span>{inProgressPercentage}%</span>
                </div>
              </div>
              <div className="third-box">
                <div>
                  <div className="icon-box completed">
                    <svg height="18px" viewBox="0 0 20 21" width="18px">
                      <title />
                      <desc />
                      <defs />
                      <g fill="none" id="Page-1" stroke="none" strokeWidth="1">
                        <g
                          fill="white"
                          id="Core"
                          transform="translate(-296.000000, -422.000000)"
                        >
                          <g
                            id="star"
                            transform="translate(296.000000, 422.500000)"
                          >
                            <path
                              d="M10,15.273 L16.18,19 L14.545,11.971 L20,7.244 L12.809,6.627 L10,0 L7.191,6.627 L0,7.244 L5.455,11.971 L3.82,19 L10,15.273 Z"
                              id="Shape"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div>
                    <div className="f-w-bold">Completed</div>
                    <div className="number-detail fs-12">
                      {completedTask.length
                        ? `${completedTask.length} tasks`
                        : "No completed tasks"}
                    </div>
                  </div>
                </div>
                <div className="percentage-information">
                  <span>
                    <svg
                      style={{
                        display: "flex",
                      }}
                      width={16}
                      height={16}
                      fill="#004329"
                      id="Layer_1"
                      viewBox="0 0 512 512"
                    >
                      <path d="M128.4,189.3L233.4,89c5.8-6,13.7-9,22.4-9c8.7,0,16.5,3,22.4,9l105.4,100.3c12.5,11.9,12.5,31.3,0,43.2  c-12.5,11.9-32.7,11.9-45.2,0L288,184.4v217c0,16.9-14.3,30.6-32,30.6c-17.7,0-32-13.7-32-30.6v-217l-50.4,48.2  c-12.5,11.9-32.7,11.9-45.2,0C115.9,220.6,115.9,201.3,128.4,189.3z" />
                    </svg>
                  </span>
                  <span>{completionPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="content-container-last-section">
            <div className="last-section-content">
              <div className="last-section-content-nav-bar">
                <div>
                  <div>
                    <div className="pp">
                      <div className="profile-container">
                        {userInfo.profilePicture ? (
                          <img
                            src={userInfo.profilePicture}
                            alt="Profile"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="profile-image-place-holder-variant-two">
                            {userInfo.name[0].toUpperCase()}
                          </div>
                        )}
                        <div className="online-indicator"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {showCompletedTasks ? "Completed Tasks" : "My Tasks"}
                  </div>
                </div>
                {!showCompletedTasks ? (
                  <div
                    onClick={openCompletedTasks}
                    className="fs-12 show-completed-text pointer"
                  >
                    Show Completed
                  </div>
                ) : (
                  <div
                    onClick={openAllTasks}
                    className="fs-12 show-completed-text pointer"
                  >
                    Show Tasks
                  </div>
                )}
              </div>
              <div className="mt-20"></div>
              <div>
                <input
                  onKeyDown={handleKeyDown}
                  value={newTaskInputValue}
                  name="task"
                  onChange={handleTaskChangeFromInput}
                  type="text"
                  className="add-new-task-input"
                  placeholder="Add new task here"
                />
              </div>
              <div className="mt-20"></div>
              <div className="task-details-container">
                {!showCompletedTasks ? (
                  <>
                    {filteredTasks.map((task, index) => (
                      <>
                        {!task.completed && (
                          <div
                            onMouseEnter={() =>
                              setHoveredTodoTaskMoreBtn(index)
                            }
                            onMouseLeave={() => setHoveredTodoTaskMoreBtn(null)}
                            key={index}
                            className={`last-section-task-details `}
                          >
                            <div className="task-wrapper">
                              <div>
                                <div>
                                  <svg
                                    className={`clicked_animate ${
                                      completedBtnAnimationActive === index
                                        ? ""
                                        : "reset"
                                    }`}
                                    onClick={() => {
                                      taskSoftCompletion(task._id, index);
                                    }}
                                    style={{
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                    width={18}
                                    height={18}
                                    fill="black"
                                    viewBox="0 0 32 32"
                                  >
                                    <defs></defs>
                                    <title />
                                    <g>
                                      <path d="M16,31A15,15,0,1,1,31,16,15,15,0,0,1,16,31ZM16,3A13,13,0,1,0,29,16,13,13,0,0,0,16,3Z" />
                                      <path d="M13.67,22a1,1,0,0,1-.73-.32l-4.67-5a1,1,0,0,1,1.46-1.36l3.94,4.21,8.6-9.21a1,1,0,1,1,1.46,1.36l-9.33,10A1,1,0,0,1,13.67,22Z" />
                                    </g>
                                  </svg>
                                </div>
                                <div>{task.task}</div>
                              </div>

                              <div className="category-and-detail-task-wrapper">
                                {/* popover start to check */}
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-popover"
                                >
                                  {(popupState) => (
                                    <div>
                                      <div
                                        onMouseEnter={() =>
                                          setHoveredTodoTaskMoreBtn(index)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredTodoTaskMoreBtn(null)
                                        }
                                        style={{
                                          backgroundColor:
                                            hoveredTodoTaskMoreBtn === index &&
                                            "#f7f6ff",
                                          transition:
                                            "background-color 0.25s ease 0s",
                                        }}
                                        className="more-btn-wrapper"
                                        {...bindTrigger(popupState)}
                                      >
                                        {hoveredTodoTaskMoreBtn === index && (
                                          <svg
                                            style={{
                                              transition: "fill 0.25s ease 0s",
                                            }}
                                            fill={
                                              hoveredTodoTaskMoreBtn === index
                                                ? "#5757ff"
                                                : "#75757A"
                                            }
                                            height="18px"
                                            width="18px"
                                            viewBox="0 0 512 512"
                                          >
                                            <g>
                                              <path d="M256,224c-17.7,0-32,14.3-32,32s14.3,32,32,32c17.7,0,32-14.3,32-32S273.7,224,256,224L256,224z" />
                                              <path d="M128.4,224c-17.7,0-32,14.3-32,32s14.3,32,32,32c17.7,0,32-14.3,32-32S146,224,128.4,224L128.4,224z" />
                                              <path d="M384,224c-17.7,0-32,14.3-32,32s14.3,32,32,32s32-14.3,32-32S401.7,224,384,224L384,224z" />
                                            </g>
                                          </svg>
                                        )}
                                      </div>
                                      <Popover
                                        className="popover-material-ui-light-theme"
                                        {...bindPopover(popupState)}
                                        anchorOrigin={{
                                          vertical: "center",
                                          horizontal: "left",
                                        }}
                                        transformOrigin={{
                                          vertical: "center",
                                          horizontal: "right",
                                        }}
                                      >
                                        <div className="popover-content-details">
                                          <div className="priority-options-wrapper priority-option">
                                            <div className="first-content-priority-options">
                                              <div>Priority</div>
                                              <div>
                                                <kbd className="MfVfq5c4BnVGSEZ2TX0WwwG58z0TN9HG HJVn5ZIy7NR5i9LDOqYUeg5eaDTAY8FT a83bd4e0 _266d6623 fb8d74bb">
                                                  Y
                                                </kbd>
                                              </div>
                                            </div>
                                            <div className="second-content-priority-options">
                                              <div
                                                className="pointer"
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <LightTooltip title="Priority 1">
                                                  <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      fill="#D0453A"
                                                      fillRule="evenodd"
                                                      d="M4.223 4.584A.5.5 0 0 0 4 5v14.5a.5.5 0 0 0 1 0v-5.723C5.886 13.262 7.05 13 8.5 13c.97 0 1.704.178 3.342.724 1.737.58 2.545.776 3.658.776 1.759 0 3.187-.357 4.277-1.084A.5.5 0 0 0 20 13V4.5a.5.5 0 0 0-.777-.416C18.313 4.69 17.075 5 15.5 5c-.97 0-1.704-.178-3.342-.724C10.421 3.696 9.613 3.5 8.5 3.5c-1.758 0-3.187.357-4.277 1.084Z"
                                                      clipRule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </LightTooltip>
                                              </div>
                                              <div
                                                className="pointer"
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <LightTooltip title="Priority 2">
                                                  <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      fill="#EB8907"
                                                      fillRule="evenodd"
                                                      d="M4.223 4.584A.5.5 0 0 0 4 5v14.5a.5.5 0 0 0 1 0v-5.723C5.886 13.262 7.05 13 8.5 13c.97 0 1.704.178 3.342.724 1.737.58 2.545.776 3.658.776 1.759 0 3.187-.357 4.277-1.084A.5.5 0 0 0 20 13V4.5a.5.5 0 0 0-.777-.416C18.313 4.69 17.075 5 15.5 5c-.97 0-1.704-.178-3.342-.724C10.421 3.696 9.613 3.5 8.5 3.5c-1.758 0-3.187.357-4.277 1.084Z"
                                                      clipRule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </LightTooltip>
                                              </div>
                                              <div
                                                className="pointer"
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <LightTooltip title="Priority 3">
                                                  <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      fill="#236EE0"
                                                      fillRule="evenodd"
                                                      d="M4.223 4.584A.5.5 0 0 0 4 5v14.5a.5.5 0 0 0 1 0v-5.723C5.886 13.262 7.05 13 8.5 13c.97 0 1.704.178 3.342.724 1.737.58 2.545.776 3.658.776 1.759 0 3.187-.357 4.277-1.084A.5.5 0 0 0 20 13V4.5a.5.5 0 0 0-.777-.416C18.313 4.69 17.075 5 15.5 5c-.97 0-1.704-.178-3.342-.724C10.421 3.696 9.613 3.5 8.5 3.5c-1.758 0-3.187.357-4.277 1.084Z"
                                                      clipRule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </LightTooltip>
                                              </div>
                                              <div
                                                className="pointer"
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  border:
                                                    "1px solid rgb(231,231,231)",
                                                }}
                                              >
                                                <LightTooltip title="Priority 4">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    className="g1pQExb"
                                                    data-icon-name="priority-icon"
                                                    data-priority="4"
                                                  >
                                                    <path
                                                      fill="currentColor"
                                                      fillRule="evenodd"
                                                      d="M4 5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.822 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.518 1.084-4.277 1.084-1.113 0-1.92-.197-3.658-.776C10.204 13.178 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777V19.5a.5.5 0 0 1-1 0V5Zm4.5 7c-1.367 0-2.535.216-3.5.654V5.277c.886-.515 2.05-.777 3.5-.777.97 0 1.704.178 3.342.724 1.737.58 2.545.776 3.658.776 1.367 0 2.535-.216 3.5-.654v7.377c-.886.515-2.05.777-3.5.777-.97 0-1.704-.178-3.342-.724C10.421 12.196 9.613 12 8.5 12Z"
                                                      clipRule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </LightTooltip>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="content-wrapper edit-option pointer">
                                            <div className="first-content-popover ">
                                              <div>
                                                <svg
                                                  width={16}
                                                  height={16}
                                                  viewBox="0 0 24 24"
                                                >
                                                  <g
                                                    fill="none"
                                                    fillRule="evenodd"
                                                  >
                                                    <path
                                                      fill="currentColor"
                                                      d="M9.5 19h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z"
                                                    ></path>
                                                    <path
                                                      stroke="currentColor"
                                                      d="M4.42 16.03a1.5 1.5 0 0 0-.43.9l-.22 2.02a.5.5 0 0 0 .55.55l2.02-.21a1.5 1.5 0 0 0 .9-.44L18.7 7.4a1.5 1.5 0 0 0 0-2.12l-.7-.7a1.5 1.5 0 0 0-2.13 0L4.42 16.02z"
                                                    ></path>
                                                  </g>
                                                </svg>
                                              </div>
                                              <div>Edit</div>
                                            </div>
                                            <div className="second-content-popover">
                                              <div>
                                                <kbd className="MfVfq5c4BnVGSEZ2TX0WwwG58z0TN9HG HJVn5ZIy7NR5i9LDOqYUeg5eaDTAY8FT a83bd4e0 _266d6623 fb8d74bb">
                                                  ⌘
                                                </kbd>
                                              </div>
                                              <div>
                                                <kbd className="MfVfq5c4BnVGSEZ2TX0WwwG58z0TN9HG HJVn5ZIy7NR5i9LDOqYUeg5eaDTAY8FT a83bd4e0 _266d6623 fb8d74bb">
                                                  E
                                                </kbd>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className="content-wrapper delete-option pointer"
                                            onClick={() => {
                                              taskSoftDeletion(task._id, task);
                                              popupState.close();
                                            }}
                                          >
                                            <div className="first-content-popover  ">
                                              <div>
                                                <svg
                                                  width={16}
                                                  height={16}
                                                  viewBox="0 0 24 24"
                                                >
                                                  <g
                                                    fill="none"
                                                    fillRule="evenodd"
                                                  >
                                                    <path d="M0 0h24v24H0z"></path>
                                                    <rect
                                                      width="14"
                                                      height="1"
                                                      x="5"
                                                      y="6"
                                                      fill="currentColor"
                                                      rx="0.5"
                                                    ></rect>
                                                    <path
                                                      fill="currentColor"
                                                      d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"
                                                    ></path>
                                                    <path
                                                      stroke="currentColor"
                                                      d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"
                                                    ></path>
                                                  </g>
                                                </svg>
                                              </div>
                                              <div>Delete</div>
                                            </div>
                                            <div className="second-content-popover">
                                              <div>
                                                <kbd className="MfVfq5c4BnVGSEZ2TX0WwwG58z0TN9HG HJVn5ZIy7NR5i9LDOqYUeg5eaDTAY8FT a83bd4e0 _266d6623 fb8d74bb">
                                                  ⌘
                                                </kbd>
                                              </div>
                                              <div>
                                                <kbd className="MfVfq5c4BnVGSEZ2TX0WwwG58z0TN9HG HJVn5ZIy7NR5i9LDOqYUeg5eaDTAY8FT a83bd4e0 _266d6623 fb8d74bb">
                                                  ⌫
                                                </kbd>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Popover>
                                    </div>
                                  )}
                                </PopupState>
                                {/* popover finish to check */}

                                <div
                                  className={`category-${task.category.toLowerCase()}`}
                                >
                                  {task.category.charAt(0).toUpperCase() +
                                    task.category.slice(1)}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid rgb(231,231,231)",
                              }}
                            ></div>
                          </div>
                        )}
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    {completedTask.map((task, index) => (
                      <>
                        <div key={index} className="last-section-task-details">
                          <div className="task-wrapper">
                            <div>
                              <div>
                                <svg
                                  width={18}
                                  height={18}
                                  version="1.1"
                                  viewBox="0 0 25 25"
                                >
                                  <title />
                                  <desc />
                                  <defs />
                                  <g
                                    fillRule="evenodd"
                                    stroke="none"
                                    strokeWidth="1"
                                  >
                                    <g fill="#5aed7c">
                                      <path
                                        d="M12.5,25 C19.4035594,25 25,19.4035594 25,12.5 C25,5.59644063 19.4035594,0 12.5,0 C5.59644063,0 0,5.59644063 0,12.5 C0,19.4035594 5.59644063,25 12.5,25 Z M9.5007864,16.7921068 L5.37867966,12.6700001 L4.67157288,13.3771069 L9.62132034,18.3268543 L10.3284271,17.6197475 L10.2078932,17.4992136 L20.1568542,7.55025253 L19.4497475,6.84314575 L9.5007864,16.7921068 Z"
                                        id="Check-Circle"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              </div>
                              <div>{task.task}</div>
                            </div>
                            <div
                              className={`category-${task.category.toLowerCase()}`}
                            >
                              {task.category.charAt(0).toUpperCase() +
                                task.category.slice(1)}
                            </div>
                          </div>
                          <div
                            style={{
                              borderBottom: "1px solid rgb(231,231,231)",
                            }}
                          ></div>
                        </div>
                      </>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
