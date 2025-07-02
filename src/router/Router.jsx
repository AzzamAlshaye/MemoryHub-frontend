// src/AppRouter.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import SignInPage from "../pages/Auth/SignInPage.jsx";
import SignupPage from "../pages/Auth/SignupPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import MapPage from "../pages/user/MapPage.jsx";
import GroupPage from "../pages/user/GroupPage.jsx";
import CommunitiesList from "../pages/user/CommunitiesList.jsx";
import Profile from "../pages/user/Profile.jsx";
import CreatePost from "../pages/user/CreatePost.jsx";
import Join from "../pages/user/JoinGroup.jsx";
import GroupView from "../pages/user/GroupPage.jsx";
import MyTickets from "../pages/user/MyTickets.jsx";
import AdminCrud from "../pages/admin/AdminCrud.jsx";
import AdminTickets from "../pages/admin/AdminTickets.jsx";
import UnauthorizedPage from "../pages/unauthorized/UnauthorizedPage.jsx";
import PageNotFound from "../pages/unauthorized/NotFound.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MobileNav from "../components/MobileNav.jsx";

const LayoutWithNav = () => (
  <div className="flex flex-col min-h-screen">
    {/* Mobile Navbar */}
    <div className="block lg:hidden">
      <MobileNav />
    </div>

    {/* Page Content */}
    <div className="flex flex-1">
      {/* Sidebar on desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main outlet */}
      <div className="flex flex-col w-full">
        <Outlet />
      </div>
    </div>

    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    children: [
      {
        element: <LayoutWithNav />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/map", element: <MapPage /> },
          { path: "/group", element: <GroupPage /> },
          { path: "/communities", element: <CommunitiesList /> },
          { path: "/profile", element: <Profile /> },
          { path: "/create-post", element: <CreatePost /> },
          { path: "/join", element: <Join /> },
          { path: "/view-group", element: <GroupView /> },
          { path: "/MyTickets", element: <MyTickets /> },
          { path: "/admin/crud", element: <AdminCrud /> },
          { path: "/admin/tickets", element: <AdminTickets /> },
          { path: "/signin", element: <SignInPage /> },
          { path: "/signup", element: <SignupPage /> },
          { path: "/unauthorized", element: <UnauthorizedPage /> },
          { path: "*", element: <PageNotFound /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
