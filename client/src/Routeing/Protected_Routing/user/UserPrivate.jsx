import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UserPrivate({ children }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("Private route", userInfo);

  if (!userInfo) {
    return <Navigate to={"/"} />;
  }

  return children;
}

export default UserPrivate;
