import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Layout from "./Layout.jsx";
import Profile from "./pages/Profile.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Travel from "./pages/Travel.jsx";
import Memories from "./pages/Memories.jsx";
import Journal from "./pages/Journal.jsx";
import Home from "./pages/Home.jsx";
import Journalopen from "./pages/Journalopen.jsx";
import { ToastContainer } from "react-toastify";
import CanvaLikeInterface from "./pages/Canvas.jsx";
import Itinerary from "./pages/Itineray";
import JournalCanvas from "./pages/JournalCanvas";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/home/user" element={<Layout />}>
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="travel" element={<Travel />} />
        <Route path="memories" element={<Memories />} />
        <Route path="itinerary" element={<Itinerary />} />
        <Route path="canvas" element={<CanvaLikeInterface />} />
        <Route path="canvas/:id" element={<JournalCanvas />} />
        <Route path="journal" element={<Journal />}>
          <Route path="open" element={<Journalopen />} />
        </Route>
        <Route index element={<Profile />} />
      </Route>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ToastContainer /> */}
    <RouterProvider router={router} />
    {/* <Journalopen/> */}
    {/* <CanvaLikeInterface/> */}
  </StrictMode>
);
