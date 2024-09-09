import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthenticationModalContext = createContext();

const AuthenticationModalProvider = ({ children }) => {
  const [authenticationModalOpened, setAuthenticationModalOpened] =
    useState(false);
  const [showRegisterTab, setShowRegisterTab] = useState(false);

  useEffect(() => {
    console.log(
      "global context contact modal status:",
      authenticationModalOpened
    );
  }, [authenticationModalOpened]);

  return (
    <AuthenticationModalContext.Provider
      value={{
        authenticationModalOpened,
        setAuthenticationModalOpened,
        showRegisterTab,
        setShowRegisterTab,
      }}
    >
      {children}
    </AuthenticationModalContext.Provider>
  );
};

AuthenticationModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthenticationModalContext, AuthenticationModalProvider };
