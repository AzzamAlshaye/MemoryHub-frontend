// src/AppRouter.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

// --------- AUTH (uncomment later) ---------
// import { AuthProvider } from "./contexts/AuthContext";          // Remove comment to enable AuthProvider
// import ProtectedRoute from "./components/ProtectedRoute.jsx";  // Remove comment to enable route protection

// Auth Pages (uncomment to enable)
// import SignInPage from "./pages/SignInPage.jsx";               // Remove comment to enable SignIn
// import SignupPage from "./pages/SignupPage.jsx";               // Remove comment to enable Signup

// --------- PUBLIC PAGES ---------
import HomePage from "../pages/HomePage.jsx";
import MapPage from "../pages/user/MapPage.jsx";
import GroupPage from "../pages/user/GroupPage.jsx";
import CommunitiesList from "../pages/user/CommunitiesList.jsx";
import CommunitiesList1 from "../pages/user/CommunitiesList1.jsx";
import ModernUserProfile from "../pages/user/ModernUserProfile.jsx";
import CreatePost from "../pages/user/CreatePost.jsx";
import Join from "../pages/user/JoinGroup.jsx";
import GroupView from "../pages/user/GroupPage.jsx";

// --------- USER PROFILE (protected) ---------
import ProfilePage from "../pages/user/ProfilePage.jsx";

// --------- ADMIN PAGES ---------
// import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCrud from "../pages/admin/AdminCrud.jsx";
import AdminTickets from "../pages/admin/AdminTickets.jsx";

// --------- UTILITIES ---------
import UnauthorizedPage from "../pages/unauthorized/UnauthorizedPage.jsx";
import PageNotFound from "../pages/unauthorized/NotFound.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Layout including Navbar + Footer
const LayoutWithNav = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    // Surround entire app with AuthProvider (uncomment when ready)
    // element: (
    //   <AuthProvider>                                        // Remove comment to wrap routes with AuthProvider
    //     <Outlet />
    //   </AuthProvider>
    // ),
    children: [
      // --------- AUTH ROUTES (uncomment to enable) ---------
      // { path: "/signin", element: <SignInPage /> },         // Sign-in page (auth)
      // { path: "/signup", element: <SignupPage /> },         // Signup page (auth)

      // All other routes wrapped in Navbar/Footer
      {
        element: <LayoutWithNav />,
        children: [
          // --------- PUBLIC MAIN PAGES ---------
          { index: true, element: <HomePage /> },
          { path: "/map", element: <MapPage /> },
          { path: "/group", element: <GroupPage /> },
          { path: "/communities1", element: <CommunitiesList1 /> },
          { path: "/modern-profile", element: <ModernUserProfile /> },
          { path: "/create-post", element: <CreatePost /> },
          { path: "/join", element: <Join /> },
          { path: "/view-group", element: <GroupView /> },
          { path: "/dashboard", element: <ProfilePage /> },
          // { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/crud", element: <AdminCrud /> },
          { path: "/admin/tickets", element: <AdminTickets /> },

          // --------- USER-PROTECTED PAGE (uncomment when ready) ---------
          // {
          //   element: <ProtectedRoute />,                       // Remove comment to protect route
          //   children: [{ path: "/dashboard", element: <ProfilePage /> }],  // Dashboard page
          // },

          // --------- ADMIN-ONLY PAGES (uncomment when ready) ---------
          // {
          //   element: <ProtectedRoute requiredRole="admin" />,  // Remove comment to protect admin
          //   children: [
          //     { path: "/admin/dashboard", element: <AdminDashboard /> },
          //     { path: "/admin/crud", element: <AdminCrud /> },
          //     { path: "/admin/tickets", element: <AdminTickets /> },
          //   ],
          // },

          // --------- UNAUTHORIZED & FALLBACK ---------
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
