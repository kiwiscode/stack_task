import { createContext, useState } from "react";
import PropTypes from "prop-types";

const AuthenticationModalContext = createContext();

const AuthenticationModalProvider = ({ children }) => {
  const [authenticationModalOpened, setAuthenticationModalOpened] =
    useState(false);
  const [showRegisterTab, setShowRegisterTab] = useState(false);

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
