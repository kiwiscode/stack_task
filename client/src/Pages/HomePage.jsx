import { NavLink } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

function HomePage() {
  const { userInfo, logout } = useContext(UserContext);
  console.log(userInfo, logout);
  return (
    <div>
      <h1>TODO APP</h1>
      {!userInfo.active && (
        <div>
          <NavLink to="/login">
            <button>Login</button>
          </NavLink>

          <NavLink to="/signup">
            <button>Signup</button>
          </NavLink>
        </div>
      )}
      {userInfo.active && (
        <div>
          <NavLink to="/">
            <button onClick={logout}>Logout</button>
          </NavLink>
          <p>
            Welcome {userInfo.name}! A new day, a new beginning. Remember, a
            to-do list is a great tool to stay organized and achieve your goals.
            Happy tasking!
          </p>
        </div>
      )}
    </div>
  );
}
export default HomePage;
