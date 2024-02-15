// Importing React and necessary hooks for global context and navigation.
import React from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
// Importing components for displaying todo items and adding new ones.
import ToDoCard from "./ToDoCard";
import NewToDo from "./NewToDo";

const Dashboard = () => {
    // Accessing the current user and todo lists from the global context.
    const {user, completeToDos, incompleteToDos} = useGlobalContext(); 
    // Hook for programmatically navigating between routes.
    const navigate = useNavigate(); 

    // Redirects to the home page if no user is logged in.
    React.useEffect(() => {
        if (!user && navigate) {
          navigate("/");
        }
      }, [user, navigate]);

    // Renders the dashboard UI, including sections for new todo creation and displaying todos.
    return (
        <div className = "dashboard">
            <NewToDo/>
            <div className = "todos">
                {incompleteToDos.map((toDo) => (
                    <ToDoCard toDo={toDo} key={toDo._id}></ToDoCard>
                ))}
            </div>

            {completeToDos.length > 0 && (
              <div className ="todos">
                <h2 className="todos__title">Completed Task(s)</h2>
                {completeToDos.map((toDo) => (
                    <ToDoCard toDo={toDo} key={toDo._id}></ToDoCard>
                ))}
            </div>
            )}
        </div>
    );
}; 

export default Dashboard; 