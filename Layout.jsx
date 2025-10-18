import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { auth } from "./config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

function Layout() {
  const [user] = useAuthState(auth);
  localStorage.setItem("token", user?.accessToken);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Layout;
