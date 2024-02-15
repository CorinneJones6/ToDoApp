// Importing necessary modules and hooks
import React from "react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { useGlobalContext } from "../context/GlobalContext";

// AuthBox component for handling both login and registration
const AuthBox = ({register}) => {
    // Accessing the global context to use the current user state and the getCurrentUser function
    const { getCurrentUser, user } = useGlobalContext(); 
    // Hook to programmatically navigate between routes
    const navigate = useNavigate(); 
    // State hooks for form fields and loading/error states
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState(""); 
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [name, setName] = React.useState(""); 
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({}); 

    // Redirect to the dashboard if a user is already logged in
    React.useEffect(()=>{
        if(user && navigate){
            navigate("/dashboard"); 
        }
        }, [user, navigate]);

    // Handles form submission for both login and registration    
    const onSubmit = (e) => {
        e.preventDefault(); 
        setLoading(true); 

        // Preparing the data object based on whether it's a registration or login action
        let data = {}; 

        if(register) {
            data={
                name,
                email,
                password,
                confirmPassword,
            };
        } else{
            data= {
                email, 
                password,
            }; 
        }
        // Sending a POST request to either the login or register endpoint
        axios.post(register ? "/api/auth/register" : "/api/auth/login", data).then(() => {
            getCurrentUser(); // Refreshing the current user information
        }).catch(error =>{
            setLoading(false); // Reset loading state

            // Handling errors by setting them in state to be displayed
            if(error?.response?.data){
                setErrors(error.response.data); 
            }
        }); 
    }; 

    return (
        <div className ="auth">
             <div className ="auth__box">
                <div className ="auth__header">
                    <h1>{register ? "Register" : "Login"}</h1>
                </div>

                <form onSubmit={onSubmit}>
                    {register && (
                        <div className ="auth__field">
                            <label>Name</label>
                            <input type="text" value ={name}
                            onChange={(e) => setName(e.target.value)}/>
                            {errors.name && (<p className="auth__error">{errors.name}</p>)}
                        </div>
                    )}
                
                <div className ="auth__field">
                    <label>Email</label>
                    <input type="text" value ={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                    {errors.email && (<p className="auth__error">{errors.email}</p>)}
                </div>

                <div className ="auth__field">
                    <label>Password</label>
                    <input type="password" value ={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    {errors.password && (<p className="auth__error">{errors.password}</p>)}
                </div>

                {register && (
                    <div className ="auth__field">
                        <label>Confirm Password</label>
                        <input type="password" value ={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                        {errors.confirmPassword && (<p className="auth__error">{errors.confirmPassword}</p>)}
                    </div>
                )}

                <div className ="auth__footer">
                    {Object.keys(errors).length > 0 && (
                        <p className="auth__error">
                            {register ? "Validation errors" : errors.error}
                        </p>
                    )}

                    <button className="btn" type="submit" disabled={loading}>
                        {register ? "Register" : "Login"}</button>

                    {!register ? (
                        <div className="auth__register">
                        <p>
                            New user? <Link to="/register">Create an account</Link>
                        </p>
                        </div>
                    ) : (
                        <div className="auth__register">
                        <p>
                            Already a member? <Link to="/">Login now</Link>
                        </p>
                        </div>

                    )}
                </div>
                </form>
             </div>
        </div>
    );
};

export default AuthBox; 