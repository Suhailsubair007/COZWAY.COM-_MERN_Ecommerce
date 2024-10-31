import React from "react";
import { Outlet } from "react-router-dom";
import UserProfileSidebar from "@/ReuseComponets/User/UserSidebar";
import Header from "@/ReuseComponets/User/Header";

const ProfilePage = () => {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        {/* Sidebar with sticky positioning */}
        <div className="sticky top-0 h-screen overflow-y-auto">
          <UserProfileSidebar />
        </div>

        {/* Dynamic content for nested routes */}
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
