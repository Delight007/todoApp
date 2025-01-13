import { MdDelete } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Todo, { Todos } from "../Todo/Todo";
import { useGlobalContext } from "../context/GlobalContext";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";
interface TodoListProps {
  todo: Todos;
}

const TodoList: React.FC<TodoListProps> = ({ todo }) => {
  const { setTodos } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  async function handleDelete(todoDelete: Todos) {
    try {
      await deleteDoc(doc(db, "Todos", todoDelete.id));
      setTodos((prevTodos: Todos[]) =>
        prevTodos.filter((prev) => prev.id !== todoDelete.id)
      );
    } catch (err) {
      console.log("error", err);
    }
  }

  async function handleDone(todoDone: Todos) {
    console.log("todo done Already");
    try {
      await updateDoc(doc(db, "Todos", todoDone.id), { done: !todoDone.done });

      setTodos((prevTodos: Todos[]) =>
        prevTodos.map((prev) =>
          prev.id === todoDone.id ? { ...prev, done: !prev.done } : prev
        )
      );
    } catch (err) {
      console.log("error", err);
    }
  }

  async function handleEdith() {
    try {
      if (newTitle.trim() === "") {
        setNewTitle(todo.title);
        setIsEditing(false);
      }

      const docRef = doc(db, "Todos", todo.id);
      await updateDoc(docRef, { title: newTitle });
      setTodos((prevTodos: Todos[]) =>
        prevTodos.map((prev) =>
          prev.id === todo.id ? { ...prev, title: newTitle } : prev
        )
      );
      setIsEditing(false);
    } catch (err) {
      console.log("error", err);
    }
  }
  return (
    <div className=" flex justify-between items-center font-medium py-3 px-3 rounded-lg shadow-md  my-2 h-14 w-[500px]">
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleEdith}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEdith();
          }}
          className="text-lg w-2/4 bg-transparent border-b-2  focus:outline-none "
          autoFocus
        />
      ) : (
        <h3 className={`${todo.done ? "line-through text-gray-400" : ""}`}>
          {todo.title}
        </h3>
      )}

      <div className="flex items-center ">
        <span className="mr-4 text-sm text-gray-600">
          {new Date(todo.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="float-right font-semibold text-xl">
          <button className=" text-red-600" onClick={() => setIsEditing(true)}>
            <FaEdit />
          </button>
          <button className="mx-4" onClick={() => handleDone(todo)}>
            <IoCheckmarkDoneCircle
              className={`${todo.done ? "text-green-500" : "text-red-600"}`}
            />
          </button>
          <button className=" text-red-600" onClick={() => handleDelete(todo)}>
            <MdDelete />
          </button>
        </span>
      </div>
    </div>
  );
};

export default TodoList;
