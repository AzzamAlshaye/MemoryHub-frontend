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
import CommunitiesList1 from "../pages/CommunitiesList1.jsx";
import ModernUserProfile from "../pages/ModernUserProfile.jsx"
import Create from "../pages/Create.jsx";
import Join from "../pages/Join.jsx";
import CreatePost from '../pages/CreatePost'
import GroupView from '../pages/GroupView';

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
    path: "/CommunitiesList1",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <CommunitiesList1 />,

      },
      {
        path:'/view-group',
element:<GroupView></GroupView>
      }
    ]
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
    path: "/ModernUserProfile",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <ModernUserProfile />,
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


  {
    path: "/Create",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <Create />,
      },
    ],
  },


   {
    path: "/Join",
    element: <LayoutWithoutNav />,
    children: [
      {
        index: true,
        element: <Join />,
      },
    ],
  },

]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

export default Router