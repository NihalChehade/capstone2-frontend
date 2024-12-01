import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";

const Logout = () => {
  const { logout } = useContext(UserContext);

  // Logout user as soon as the component mounts
  useEffect(() => {
    logout();  
  }, [logout]);

  // Redirect the user to the login page after logging out
  return <Navigate to="/" />;
};

export default Logout;
