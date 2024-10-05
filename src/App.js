import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './component/Layout/Layout';
import Home from './component/Home/Home';
import Movie from './component/Movie/Movie';
import Tv from './component/Tv/Tv';
import People from './component/People/People';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import Logout from './component/Logout/Logout';
import DetailsMovie from './component/Detailes/DetailesMovie'; 
import DetailsTv from './component/Detailes/DetailesTv'; 
import DetailsPerson from './component/Detailes/DetailesPerson'; 
import { jwtDecode } from "jwt-decode";
import 'font-awesome/css/font-awesome.css';
import Animation from './component/Animation/Animation';

export default function App() {
  const [loginData, setLoginData] = useState(null);

  const saveLoginData = () => {
    const encodedToken = localStorage.getItem('token');
    try {
      const decodedToken = jwtDecode(encodedToken);
      setLoginData(decodedToken);
      console.log(decodedToken);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveLoginData();
    }
  }, []);

  const routers = createBrowserRouter([
    {
      path: "",
      element: <Layout loginData={loginData} setLoginData={setLoginData} />,
      children: [
        { path: "home", element: <Home /> },
        { path: "movie", element: <Movie /> },
        { path: "tv", element: <Tv /> },
        { path: "animation", element: <Animation /> },
        { path: "people", element: <People /> },
        { path: 'detailsmovie/:id', element: <DetailsMovie /> },
        { path: 'detailstv/:id', element: <DetailsTv /> },
        { path: 'detailsperson/:id', element: <DetailsPerson /> },

        {
          path: "login",
          element: loginData ? <Navigate to="/home" replace /> : <Login saveLoginData={saveLoginData} />
        },
        { path: "register", element: <Register /> },
        { path: "logout", element: <Logout /> },
        { index: true, element: loginData ? <Navigate to="/home" replace /> : <Login saveLoginData={saveLoginData} /> }
      ]
    }
  ]);

  return (
    <RouterProvider router={routers} />
  );
}
