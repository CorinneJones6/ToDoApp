import React from 'react'; 
import axios from "axios"; 
import { useGlobalContext } from '../context/GlobalContext';

// Defining the NewToDo component.
const NewToDo = () => {

    // Extracting addToDo function from the global context to add a new todo item.
    const {addToDo} = useGlobalContext(); 
    // State for handling the input value of the new todo item.
    const [content, setContent] = React.useState(""); 
    
    // Function to handle the form submission.
    const onSubmit = (e) => {
        e.preventDefault(); // Prevents the default form submission behavior.

         // Making a POST request to add a new todo item, sending the content as the body.
        axios.post("/api/todos/new", {content}).then( (res)=> {
            setContent(""); // Resetting the content state to empty, clearing the input field.
            addToDo(res.data); // Adding the newly created todo item to the global context state.
        }); 
    }; 

    // Rendering the form for adding a new todo item.
    return (
        <form className="new" onSubmit={onSubmit}>
            <input type ="text" value ={content} onChange={(e) => setContent(e.target.value)}/>
            
          <button className ="btn" type ="submit" disabled={content.length==0}>
            Add
           </button>


        </form>
    ); 
}; 

export default NewToDo; 