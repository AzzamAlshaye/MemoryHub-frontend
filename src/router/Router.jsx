// src/AppRouter.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import SignInPage from "../pages/Auth/SignInPage.jsx";
import SignupPage from "../pages/Auth/SignupPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import MapPage from "../pages/user/MapPage.jsx";
import GroupPage from "../pages/user/group/GroupPage.jsx";
import GroupList from "../pages/user/group/GroupList.jsx";
import GroupInfo from "../pages/user/group/GroupInfo.jsx";
import ConfirmJoinGroup from "../components/group/ConfirmJoinGroup.jsx"; 
import Profile from "../pages/user/Profile.jsx";
import MyTickets from "../pages/user/MyTickets.jsx";
import AdminCrud from "../pages/admin/AdminCrud.jsx";
import AdminTickets from "../pages/admin/AdminTickets.jsx";
import UnauthorizedPage from "../pages/unauthorized/UnauthorizedPage.jsx";
import PageNotFound from "../pages/unauthorized/NotFound.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MobileNav from "../components/MobileNav.jsx";
import EditPost from "../components/map/EditPost.jsx";
import AdminDashoard from '../pages/admin/AdminDashboard.jsx'

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
    path: "/",
    element: <LayoutWithNav />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "mapPage", element: <MapPage /> },

      // view a group
      { path: "group/:groupId", element: <GroupPage /> },

      // join-via-link popup
      {
        path: "group/:groupId/join",
        element: <ConfirmJoinGroup />,
      },

      // other group routes
      { path: "GroupList", element: <GroupList /> },
      { path: "group/:groupId/info", element: <GroupInfo /> },

      // profile, posts, tickets, admin
      { path: "Profile", element: <Profile /> },
      { path: "MyTickets", element: <MyTickets /> },
 { path: "admin/crud", element: <AdminCrud /> },
      { path: "admin/tickets", element: <AdminTickets /> },
     {
      path:"admin/dashboard",element:<AdminDashoard></AdminDashoard>
     }
    ],
  },
  // auth & misc
  { path: "/SignInPage", element: <SignInPage /> },
  { path: "/SignupPage", element: <SignupPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <PageNotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
