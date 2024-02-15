import React from 'react'; 
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';

// The ToDoCard component displays individual todo items.
const ToDoCard=({toDo}) => {
    // State for the todo content and editing status.
    const [content, setContent] = React.useState(toDo.content);
    const [editing, setEditing] = React.useState(false); 
    // useRef hook to focus on the input element when editing starts.
    const input = React.useRef(null); 
    // Destructuring required functions from the global context.
    const { toDoComplete, toDoIncomplete, removeToDo, updateToDo } =
    useGlobalContext();

    // Function to enable editing mode and focus the input.
    const onEdit = e => {
        e.preventDefault(); 
        setEditing(true); 
        input.current.focus(); 
    }; 

    // Function to disable editing mode and reset content.
    const stopEditing = e => {
        if(e){
            e.preventDefault(); 
        }
        setEditing(false); 
        setContent(toDo.content); 
    }

    // Function to mark the todo as complete.
    const markAsComplete = (e) => {
        e.preventDefault(); 

        axios.put(`/api/todos/${toDo._id}/complete`).then(res=> {
            toDoComplete(res.data); 
        })
    }; 

     // Function to mark the todo as incomplete.
    const markAsIncomplete = (e) => {
        e.preventDefault(); 

        axios.put(`/api/todos/${toDo._id}/incomplete`).then(res=> {
            toDoIncomplete(res.data); 
        });
    }; 

    // Function to delete the todo.
    const deleteToDo = (e) => {
        e.preventDefault(); 

        if(window.confirm("Are you sure you want to delete?")){
            axios.delete(`/api/todos/${toDo._id}`).then(()=> {
                removeToDo(toDo); 
            }); 
        }
    }; 

    // Function to save the edited todo.
    const editToDo = (e) => {
        e.preventDefault();
    
        axios
          .put(`/api/todos/${toDo._id}`, { content })
          .then((res) => {
            updateToDo(res.data);
            setEditing(false);
          })
          .catch(() => {
            stopEditing();
          });
      }; 

    // Render the todo card with conditional rendering for edit and view mode.
    return (
    <div className ={`todo ${toDo.complete ? "todo--complete" : ""}`}>
        <input type = "checkbox" checked={toDo.complete} 
        onChange ={!toDo.complete ? markAsComplete : markAsIncomplete}
        />

        <input type="text" ref={input} value = {content} readOnly = {!editing}
            onChange={e=> setContent(e.target.value)}
        />
       

            <div className ="todo__controls">
                {!editing ? (
                  <>
                  {!toDo.complete && <button onClick={onEdit}>Edit</button>}
                  <button onClick = {deleteToDo}>Delete</button>
                  </>
                ) : (
                   <>
                   <button onClick={stopEditing}>Cancel</button>
                   <button onClick={editToDo}>Save</button>
                   </>

                )}
            </div>
        </div>
    ); 
}; 

export default ToDoCard; 