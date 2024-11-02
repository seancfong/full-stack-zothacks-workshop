import LoginForm from "./components/LoginForm";
import TodoApp from "./components/TodoApp";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-base-300 min-h-screen min-w-screen flex justify-center items-center flex-col">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">{session ? <TodoApp /> : <LoginForm />}</div>
      </div>
    </div>
  );
}

export default App;
