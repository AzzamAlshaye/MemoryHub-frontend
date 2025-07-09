// src/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { AuthProvider } from "../context/AuthContext.jsx";
import RequireAuth from "../components/RequireAuth.jsx";

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
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import UnauthorizedPage from "../pages/unauthorized/UnauthorizedPage.jsx";
import PageNotFound from "../pages/unauthorized/NotFound.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MobileNav from "../components/MobileNav.jsx";

function LayoutWithNav() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="block lg:hidden">
        <MobileNav />
      </div>
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  // ─── Public + AuthProvider ───────────────────────────────────────
  {
    element: (
      <AuthProvider>
        <LayoutWithNav />
      </AuthProvider>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "mapPage", element: <MapPage /> },
      { path: "SignInPage", element: <SignInPage /> },
      { path: "SignupPage", element: <SignupPage /> },
    ],
  },

  // ─── Authenticated users ────────────────────────────────────────
  {
    element: (
      <AuthProvider>
        <RequireAuth>
          <LayoutWithNav />
        </RequireAuth>
      </AuthProvider>
    ),
    children: [
      { path: "group/:groupId", element: <GroupPage /> },
      { path: "group/:groupId/join", element: <ConfirmJoinGroup /> },
      { path: "GroupList", element: <GroupList /> },
      { path: "group/:groupId/info", element: <GroupInfo /> },
      { path: "Profile", element: <Profile /> },
      { path: "MyTickets", element: <MyTickets /> },
    ],
  },

  // ─── Admin-only ────────────────────────────────────────────────
  {
    element: (
      <AuthProvider>
        <RequireAuth requiredRole="admin">
          <LayoutWithNav />
        </RequireAuth>
      </AuthProvider>
    ),
    children: [
      { path: "admin/crud", element: <AdminCrud /> },
      { path: "admin/tickets", element: <AdminTickets /> },
      { path: "admin/tickets/:ticketId", element: <AdminDashboard /> },
    ],
  },

  // ─── Fallbacks ─────────────────────────────────────────────────
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
