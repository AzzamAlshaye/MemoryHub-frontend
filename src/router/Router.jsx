import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router"; 

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import HomePage from "../pages/HomePage.jsx";
import MapPage from "../pages/MapPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import CommunitiesList from "../pages/CommunitiesList.jsx";

// Layout with Navbar and Footer
const LayoutWithNav = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const LayoutWithoutNav = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithNav />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/MapPage",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <MapPage />,
      },
    ],
  },

  {
    path: "/CommunitiesList",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <CommunitiesList />,
      },
    ],
  },
  {
    path: "/ProfilePage",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
