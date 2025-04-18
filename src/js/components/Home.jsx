import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const username = "jackbringas"; 
  const apiUrl = "https://playground.4geeks.com/todo";

  const createUser = async () => {
    try {
      const response = await fetch(apiUrl + "/users/" + username, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        getToDos();  
      } else {
        const data = await response.json();
        alert("Error: " + data.detail);
      }
    } catch (error) {
      console.error("❌ Error verifying or creating user:", error);
    }
  };

  const getToDos = async () => {
    const response = await fetch(apiUrl + "/users/" + username);
    if (response.status === 404) {
      createUser();  
    } else if (response.status === 200) {
      const data = await response.json();
      setTodos(data.todos);
    } else {
      alert("We are not able to retrieve your tasks. Please try again later.");
    }
  };

  useEffect(() => {
    getToDos();
  }, []);

  const addTodo = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTodo = { label: inputValue };
      const response = await fetch(apiUrl + "/todos/" + username, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (response.status === 201) {
        setInputValue("");  
        getToDos(); 
      } else {
        const data = await response.json();
        alert("Error: " + data.detail);
      }
    }
  };

  const deleteTodo = async (id) => {
    const response = await fetch(apiUrl + "/todos/" + id, {
      method: "DELETE",
    });
    if (response.status === 204) {
      getToDos();  
    } else {
      const data = await response.json();
      alert("Error: " + data.detail);
    }
  };

  const clearTodos = async () => {
    const response = await fetch(apiUrl + "/users/" + username, {
      method: "DELETE",
    });
    if (response.status === 204) {
     createUser()  
    } else {
      const data = await response.json();
      alert("Error: " + data.detail);
    }
  };

  return (
    <div className="container">
      <h1>TODOS</h1>
      <ul className="todo-list">
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={addTodo}
            placeholder="What needs to be done?"
          />
        </li>

        {todos.length === 0 ? (
          <p className="empty-message">No tasks, add one!</p>
        ) : (
          todos.map((task) => (
            <li key={task.id} className="todo-item">
              {task.label}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => deleteTodo(task.id)}
              ></button>
            </li>
          ))
        )}
      </ul>
      <div>{todos.length} items left</div>
      <button className="btn btn-danger mt-3" onClick={clearTodos}>
        Clear All
      </button>
    </div>
  );
};

export default Home;
