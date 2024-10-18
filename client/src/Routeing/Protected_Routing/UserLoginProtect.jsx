import React from "react";
// import { useAuth } from "./Auth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function UserLoginProtect({ children }) {
  const userInfo = useSelector((state) => state.user.userData);
  console.log(userInfo)

  if (userInfo) {
    return <Navigate to={"/login"} />;
  }
  return children;
}

export default UserLoginProtect;
