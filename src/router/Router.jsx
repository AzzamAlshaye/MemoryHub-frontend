import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Auth Pages
import SignInPage from "./pages/SignInPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

// Public Pages with Nav/Footer
import HomePage from "./pages/HomePage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import MapPage from "./pages/MapPage.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import SubmitTicket from "./pages/SubmitTicket.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminCrud from "./pages/AdminCrud.jsx";
import AdminTickets from "./pages/AdminTickets.jsx";

// Utility
import UnauthorizedPage from "./pages/Unauthorized/UnauthorizedPage.jsx";
import PageNotFound from "./pages/Unauthorized/PageNotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Layout including Navbar + Footer
const LayoutWithNav = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// Define routes via Data API
const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      // Auth routes (no Nav/Footer)
      { path: "/signin", element: <SignInPage /> },
      { path: "/signup", element: <SignupPage /> },
      {
        element: <LayoutWithNav />, // wrap remaining routes
        children: [
          // Public main pages
          { index: true, element: <HomePage /> },
          { path: "/about", element: <AboutUs /> },
          { path: "/contact", element: <ContactUs /> },
          { path: "/map", element: <MapPage /> },
          { path: "/group", element: <GroupPage /> },
          { path: "/submit-ticket", element: <SubmitTicket /> },
          { path: "/profile", element: <ProfilePage /> },
          // User-protected pages
          {
            element: <ProtectedRoute />,
            children: [{ path: "/dashboard", element: <ProfilePage /> }],
          },
          // Admin-only pages
          {
            element: <ProtectedRoute requiredRole="admin" />,
            children: [
              { path: "/admin/dashboard", element: <AdminDashboard /> },
              { path: "/admin/crud", element: <AdminCrud /> },
              { path: "/admin/tickets", element: <AdminTickets /> },
            ],
          },
          // Unauthorized
          { path: "/unauthorized", element: <UnauthorizedPage /> },
          // Fallback
          { path: "*", element: <PageNotFound /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
