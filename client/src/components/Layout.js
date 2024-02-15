// Importing React and React Router DOM for routing and navigation.
import React from "react"; 
import {BrowserRouter, Routes, Route} from "react-router-dom";

// Importing components used across different routes.
import Header from "./Header"; 
import AuthBox from "./AuthBox";
import Dashboard from "./Dashboard";

// Importing the global context hook to use the application state.
import { useGlobalContext } from "../context/GlobalContext";

const Layout = () => {
    // Accessing the fetchingUser state from the global context to determine if user data is still loading.
    const { fetchingUser } = useGlobalContext(); 
    // Conditional rendering based on the fetchingUser state.
    return fetchingUser ? (
        // Display a loading message if user data is still being fetched.
        <div className="loading">
            <h1>Loading</h1>
        </div>
    ) : (
        // Render the application's layout with routes once data is loaded.
        <BrowserRouter>
            <Header />

            <Routes>
                <Route exact path = "/" element={<AuthBox />} />
                <Route path = "/register" element={<AuthBox register/>} />
                <Route path = "/dashboard" element ={<Dashboard/>} />
            </Routes>
        </BrowserRouter>
    ); 
};

export default Layout; 