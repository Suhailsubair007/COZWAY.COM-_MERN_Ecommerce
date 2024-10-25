import React from "react";
import { Outlet } from "react-router-dom";
import UserProfileSidebar from "@/ReuseComponets/User/UserSidebar";
import Header from "@/ReuseComponets/User/Header";


const ProfilePage = () => {
  return (
    <>
      <Header />
      <div className="flex h-screen bg-black">
        <UserProfileSidebar />

        {/* Dynamic content for nested routes */}
        <main className="flex-grow bg-green-500 ">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
