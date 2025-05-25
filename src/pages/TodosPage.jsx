import React, { useState, useEffect } from "react";
import '../css/Todos.css'

function TodoList() {

  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState("id"); // default sort
  const [searchCriterion, setSearchCriterion] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");

  const logedInUserName = localStorage.getItem("currentUser") || "";


  useEffect(() => {
    fetch(`http://localhost:3005/users?username=${logedInUserName}`)
      .then(res => res.json())
      .then(data => {
        if(data.length ==0){
          throw (`cant found ${logedInUserName} info.`)
        }
        setUserId(data[0].id);
        console.log(userId);
      })
      .catch(console.error);
  }, []);


  useEffect(() => {
    fetch(`http://localhost:3005/todos?userId=${userId}`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(console.error);
  }, [userId]);


  function handleAddTodo() {
    const newTodo = {
      userId,
      id: Date.now().toString(), 
      title: "New Task",
      completed: false,
    };

    fetch("http://localhost:3005/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then(res => res.json())
      .then(data => setTodos(prev => [...prev, data]))
      .catch(console.error);
  }


  function handleDelete(id) {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
      .catch(console.error);
  }


  function handleTitleChange(id, newTitle) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, title: newTitle };
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    })
      .then(res => res.json())
      .then(data => setTodos(prev => prev.map(t => (t.id === id ? data : t))))
      .catch(console.error);
  }

  // עדכון מצב completed
  function handleCompletedChange(id, completed) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed };
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    })
      .then(res => res.json())
      .then(data => setTodos(prev => prev.map(t => (t.id === id ? data : t))))
      .catch(console.error);
  }

  // סינון לפי חיפוש
  const filteredTodos = todos.filter(todo => {
    if (!searchTerm) return true;

    if (searchCriterion === "completed") {
      const termLower = searchTerm.toLowerCase();
      const completedString = todo.completed ? "true" : "false";
      return completedString.includes(termLower);
    }

    // id or title
    return todo[searchCriterion].toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  // מיון
  filteredTodos.sort((a, b) => {
    if (sortBy === "completed") {
      return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
    }
    if (sortBy === "id") {
      return a.id.localeCompare(b.id);
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="todo-container">
      <h2>Todos</h2>

      <div className="todo-controls">
        <div>
          <label>Sort by: </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label>Search by: </label>
          <select value={searchCriterion} onChange={e => setSearchCriterion(e.target.value)}>
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={handleAddTodo}>Add Todo</button>

      </div>

      <table className="todo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map(todo => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>
                <input
                  type="text"
                  value={todo.title}
                  onChange={e => handleTitleChange(todo.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={e => handleCompletedChange(todo.id, e.target.checked)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredTodos.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No todos found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TodoList;
