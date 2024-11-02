import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);

  // What is async and await?

  // - JavaScript can only execute one thing at a time, so we use async/await to run multiple things at once.
  // Because fetching data can take a while, we will "await" it until it is done. Meanwhile, if the user wants
  // to do anything else on the page, we can handle those interactions without waiting for the data to be fetched first.

  // - Any function that does asynchronous work (e.g. has "await"s) must have the "async" keyword before it.
  const fetchTodos = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userID = user.id;

    const { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userID)
      .order("inserted_at", { ascending: true });

    if (error) {
      console.error(error.message);
    }

    console.log(todos);

    setTodos(todos);
  };

  const addTodo = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const formData = new FormData(e.target);
    const task = formData.get("task");

    // Showing immediate UI feedback to the user is not necessary, but is a good practice.
    // We can do this by updating the todos state immediately.

    // 1. Reset the input immediately as we have a variable for the task.
    e.target.reset();
    // 2. Update the todos state with a new task.
    // (-1 is just a placeholder ID which will be overwritten by the database re-fetch)
    setTodos([...todos, { id: -1, task }]);

    // Perform the insert
    const { error } = await supabase.from("todos").insert({
      task,
      user_id: user.id,
    });

    if (error) {
      console.error(error.message);
    }

    // Fetch the todos again with the fresh data
    fetchTodos();
  };

  const toggleTodo = async (todo) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !todo.is_complete }) // !todo.is_complete flips the boolean: true -> false, or false -> true
      .eq("id", todo.id);

    if (error) {
      console.error(error.message);
    }

    // Update the todos state with the new data
    setTodos(
      todos.map((t) => {
        if (t.id === todo.id) {
          return { ...t, is_complete: !t.is_complete };
        }
        return t;
      })
    );

    fetchTodos();
  };

  useEffect(() => {
    // When the component mounts, we fetch the todos

    // We define the fetchTodos function outside of the useEffect here
    // so it can be called by other functions
    fetchTodos();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Todo App</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="btn btn-ghost bg-base-200 btn-sm"
        >
          Sign Out
        </button>
      </div>
      <ul className="menu bg-base-200 rounded-box">
        {todos.map((todo) => (
          <li key={todo.id}>
            <button
              onClick={() => {
                toggleTodo(todo);
              }}
              className={`${
                todo.is_complete ? "line-through text-gray-600" : ""
              } btn btn-ghost justify-start no-animation`}
            >
              {todo.task}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={addTodo}>
        <input
          type="text"
          name="task"
          placeholder="What needs to be done?"
          className="input input-bordered w-full placeholder:text-gray-600"
        />
      </form>
    </div>
  );
}
