import React, { createContext, useContext, useReducer, useEffect} from "react";
import axios from "axios";

// Define the initial state for the context
const initialState = {
  user: null, // The logged-in user
  fetchingUser: true, // Flag for loading state of user fetching
  completeToDos: [], // Array of completed todo items
  incompleteToDos: [], // Array of incomplete todo items
};


// Define the reducer function to handle state updates
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state, 
        user: action.payload, // Set the user
        fetchingUser: false, // Update fetching state
      };
    case "SET_COMPLETE_TODOS":
      return {
        ...state,
        completeToDos: action.payload, // Set completed todos
      };
    case "SET_INCOMPLETE_TODOS":
      return {
        ...state,
        incompleteToDos: action.payload, // Set incomplete todos
      };
    case "RESET_USER":
      return {
        ...state,
        user: null, // Reset user to null
        completeToDos: [], // Clear completed todos
        incompleteToDos: [], // Clear incomplete todos
        fetchingUser: false, // Update fetching state
      };
    default:
      return state;
  }
};

// Create a context
export const GlobalContext = createContext(initialState); 

// Create a provider component that encapsulates the global state
export const GlobalProvider = (props)=>{
    const [state, dispatch] = useReducer(globalReducer, initialState); 

    // Fetch the current user and their todos when the component mounts
    useEffect(() => {
        getCurrentUser(); 
    }, []);

     // Action to fetch the current user's information
    const getCurrentUser = async () => {
        try{
            const res = await axios.get("/api/auth/current");

            if(res.data){
                const toDosRes = await axios.get("/api/todos/current"); 

                if(toDosRes.data){
                  // Dispatch actions to set the user and their todos
                    dispatch({type: "SET_USER", payload: res.data}); 
                    dispatch({type: "SET_COMPLETE_TODOS", payload: toDosRes.data.complete}); 
                    dispatch({type: "SET_INCOMPLETE_TODOS", payload: toDosRes.data.incomplete});
                }
            } 
            else {
                dispatch({type: "RESET_USER"});
            }
        }
        catch(error){
            console.log(error); 
            dispatch({type: "RESET_USER"});
        }
    };

    // Function to log out the current user. It sends a request to the server to log out and then resets the user state in the context.
    const logout = async () => {
        try {
          await axios.put("/api/auth/logout"); // Attempt to log out via API call
    
          dispatch({ type: "RESET_USER" }); // Reset user state on success
        } catch (error) {
          console.log(error);
          dispatch({ type: "RESET_USER" }); // Ensure user state is reset even if there's an error
        }
      };

    // Function to add a new todo item. It updates the global state to include the new todo in the list of incomplete todos.  
    const addToDo = (toDo) => {
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload:[toDo, ...state.incompleteToDos] // Add the new todo at the start of the incomplete todos list
    
        });
    };

    // Function to mark a todo as complete. It removes the todo from the list of incomplete todos and adds it to the list of complete todos.
    const toDoComplete = (toDo) => {
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: state.incompleteToDos.filter(
              (incompleteToDos) => incompleteToDos._id !==toDo._id
            )
        })

        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: [toDo, ...state.completeToDos] // Add the completed todo to the start of the complete todos list
        })
    }; 

    // Function to mark a todo as incomplete. It does the opposite of toDoComplete, moving a todo back to the incomplete list.
    const toDoIncomplete = (toDo) => {
        dispatch({
            type: "SET_COMPLETE_TODOS", 
            payload: state.completeToDos.filter(
                (completeToDos) => completeToDos._id !==toDo._id // Filter out the todo becoming incomplete
            ),
        }); 

        const newIncompleteToDos = [toDo, ...state.incompleteToDos]; 

        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: newIncompleteToDos.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort the todos by creation date
            ),
        })
    }; 

    // Function to remove a todo item. It updates the global state to exclude the specified todo from either list based on its completion status.
    const removeToDo = (toDo) => {
        if(toDo.complete){
            dispatch({
                type: "SET_COMPLETE_TODOS", 
                payload: state.completeToDos.filter(
                    (completeToDo) => completeToDo._id !==toDo._id) // Remove from complete todos
            })
        }else{
            dispatch({
                type: "SET_INCOMPLETE_TODOS", 
                payload: state.incompleteToDos.filter(
                    (incompleteToDo) => incompleteToDo._id !==toDo._id), // Remove from incomplete todos
            }); 
        }
    }; 

    // Function to update a todo item's details. It finds the todo in the appropriate list and updates its data.
    const updateToDo = (toDo) => {
        if (toDo.complete) {
          const newCompleteToDos = state.completeToDos.map((completeToDo) =>
            completeToDo._id !== toDo._id ? completeToDo : toDo // Update the todo if IDs match
          );
    
          dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: newCompleteToDos,
          });
        } else {
          const newIncompleteToDos = state.incompleteToDos.map((incompleteToDo) =>
            incompleteToDo._id !== toDo._id ? incompleteToDo : toDo // Update the todo if IDs match
          );
    
          dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: newIncompleteToDos,
          });
        }
      };

    // Provide the global state and actions to the children components
    const value = {
       ...state, 
       getCurrentUser,
       logout, 
       addToDo,
       toDoComplete,
       toDoIncomplete,
       removeToDo,
       updateToDo,
    };

    return(
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use the global context
export function useGlobalContext() {
    return useContext(GlobalContext); 
}