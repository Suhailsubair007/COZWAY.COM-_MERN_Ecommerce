import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UserPrivate({ children }) {
  const userInfo = useSelector((state) => state.user.userData);

  if (!userInfo) {
    return <Navigate to={"/login"} />;
  }

  return children;
}

export default UserPrivate;
