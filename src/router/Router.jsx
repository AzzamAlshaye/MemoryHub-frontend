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

// Layout with Navbar and Footer
const LayoutWithNav = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// Layout without Navbar and Footer
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
        path:"/HomePage",
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
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
