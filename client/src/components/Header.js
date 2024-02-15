// Importing React and necessary hooks from React Router DOM and the global context.
import React from "react"; 
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const Header = () => {
    // Accessing user state and logout function from global context.
    const { user, logout } = useGlobalContext();
    // Getting the current path to conditionally render links based on the route. 
    const { pathname } = useLocation(); 

    // Rendering the header component with navigation links and conditional rendering based on user state.
    return (
        <div className ="main-header">
            <div className ="main-header__inner">
                <div className ="main-header__left">
                    <Link to="/">To Do It</Link>
                </div>

                <div className ="main-header__right">
                    {user ? (
                        <button className="btn" onClick={logout}>Logout</button>
                    ) : pathname === 
                    "/" ? (
                        <Link to ="/register" className="btn">
                            Register
                        </Link>
                    ) : (
                        <Link to ="/" className="btn">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header; 