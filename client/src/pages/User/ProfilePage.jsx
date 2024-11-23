import React from "react";
import { Outlet } from "react-router-dom";
import UserProfileSidebar from "@/ReuseComponets/User/UserSidebar";
import Header from "@/ReuseComponets/User/Header";

const ProfilePage = () => {
  return (
    <>
      <div className="flex h-screen">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <UserProfileSidebar />
        </div>
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
