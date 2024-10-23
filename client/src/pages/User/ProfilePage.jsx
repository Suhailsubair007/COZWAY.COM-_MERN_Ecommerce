import React from "react";
import { Outlet } from "react-router-dom";
import UserProfileSidebar from "@/ReuseComponets/User/UserSidebar";
import Header from "@/ReuseComponets/User/Header";


const ProfilePage = () => {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <UserProfileSidebar />

        {/* Dynamic content for nested routes */}
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
