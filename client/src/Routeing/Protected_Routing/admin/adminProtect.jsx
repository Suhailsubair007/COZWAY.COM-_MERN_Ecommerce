import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function AdminProtect({ children }) {
  const admin = useSelector((state) => state.admin.adminInfo);

  if (!admin) {
    return <Navigate to={"/admin"} />;
  }
  return children;
}

export default AdminProtect;
