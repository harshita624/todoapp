import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdDelete, MdAdd, MdMenu } from "react-icons/md";

interface Todo {
  id: string;
  todo: string;
  isCompleted: boolean;
}

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleAdd = () => {
    if (todo.trim().length > 3) {
      setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
      setTodo("");
      saveToLocalStorage();
    }
  };

  const handleDelete = (id: string) => {
    const newTodos = todos.filter((t) => t.id !== id);
    setTodos(newTodos);
    saveToLocalStorage();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleCheckboxChange = (id: string) => {
    const updatedTodos = todos.map((t) => {
      if (t.id === id) {
        return { ...t, isCompleted: !t.isCompleted };
      }
      return t;
    });
    setTodos(updatedTodos);
    saveToLocalStorage();
  };

  const filteredTodos = todos.filter((todoItem) =>
    todoItem.todo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-amber-600 min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-5 justify-between">
        <button className="text-black">
          <MdMenu size={24} />
        </button>
        <img
          src="https://via.placeholder.com/50"
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
      </div>

      <div className="search-bar mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="w-full p-2 border rounded-full mb-2"
        />
      </div>

      <h2 className="text-black text-xl font-semibold mb-4">ALL TODOS</h2>

      <div className="todos mb-5">
        {filteredTodos.length === 0 && (
          <p className="text-center">No tasks to display.</p>
        )}
        {filteredTodos.map((todoItem) => (
          <div
            key={todoItem.id}
            className="todo-item flex justify-between items-center p-2 border rounded-lg mb-2 bg-white"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todoItem.isCompleted}
                onChange={() => handleCheckboxChange(todoItem.id)}
                className="mr-2"
              />
              <span
                className={
                  todoItem.isCompleted ? "line-through text-gray-400" : ""
                }
              >
                {todoItem.todo}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todoItem.id)}
              className="text-red-500"
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>

      <div className="add-todo mb-5 flex items-center">
        <input
          type="text"
          value={todo}
          onChange={handleChange}
          placeholder="Add a new task"
          className="flex-grow p-2 border rounded-lg mb-2"
        />
        <button
          onClick={handleAdd}
          disabled={todo.length <= 3}
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          <MdAdd />
        </button>
      </div>
    </div>
  );
}

export default App;
