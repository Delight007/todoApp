import GlobalProvider from "./Components/context/GlobalContext";
import Todo from "./Components/Todo/Todo";

export default function Home() {
  return (
    <div>
      <GlobalProvider>
        <Todo />
      </GlobalProvider>
    </div>
  );
}
