"use client";
import React, { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import TodoList from "../TodoList/TodoList";
// import GlobalProvider from "../context/GlobalContext";

export interface Todos {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
}

export default function Todo() {
  const [todo, setTodo] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [todos, setTodos] = useState<Todos[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [active, setActive] = useState<string>("Present");

  // Realtime Updates
  useEffect(() => {
    const todoCollection = collection(db, "Todos");
    const unsubscribe = onSnapshot(todoCollection, (snapshot) => {
      const todoList: Todos[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Todos, "id">;
        return {
          id: doc.id,
          ...data,
          // createdAt: new Date(data.createdAt),
        };
      });
      console.log(todoList);
      setTodos(todoList);
    });
    return () => unsubscribe();
  }, []);

  // Handle Submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todo.trim() || (date && isNaN(new Date(date).getTime()))) {
      console.log("Enter a valid todo");
      return;
    }

    try {
      setIsAdding(true);
      const newTodo = {
        title: todo,
        done: false,
        createdAt: new Date(date),
      };
      const docRef = await addDoc(collection(db, "Todos"), newTodo);

      setTodo("");
      setDate("");
    } catch (err) {
      console.error("Error adding todo: ", err);
    } finally {
      setIsAdding(false);
    }
  }

  const filteredTodos = todos
    .slice()
    .sort((a, b) => Number(a.done) - Number(b.done))
    .filter((t) => {
      const matchesFilter =
        filter === "Done" ? t.done : filter === "Undone" ? !t.done : true;
      const matchesSearch = t.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const now = new Date();

      const todoDate = new Date(t.createdAt);
      const matchesDate =
        active === "Past"
          ? now > todoDate
          : active === "Present"
          ? todoDate.toDateString() === now.toDateString()
          : active === "Future"
          ? now < todoDate
          : true;
      return matchesFilter && matchesSearch && matchesDate;
    });

  return (
    <div className="h-screen mx-w[1300px]">
      <div className=" w-[700px] mx-auto flex items-center flex-col">
        <h1 className="mt-5 font-semibold text-red-600 underline text-2xl text-left">
          To-Do List
        </h1>
        <form
          className="w-[500px] flex justify-center flex-col items-center border p-6 mx-auto mt-12 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className=" relative w-[400px] gap-3">
            <label htmlFor="todo-input" className="font-semibold">
              Enter Todo :
            </label>

            <input
              className="border-red-600 border p-3 mb-4 rounded-lg w-full focus:outline-none"
              type="text"
              value={todo}
              placeholder="Enter List"
              onChange={(e) => setTodo(e.target.value)}
            />
            <label htmlFor="todo-input" className="font-semibold ">
              Enter Date :
            </label>
            <input
              type="date"
              value={date}
              placeholder="Enter Date"
              onChange={(e) => setDate(e.target.value)}
              className="border-red-600 border p-2 rounded-lg w-full focus:outline-none"
            />

            <button
              className=" w-[400px] border-none rounded-lg  box-border mt-4 p-3 bg-red-600 text-white text-sm font-medium"
              disabled={isAdding}
            >
              {isAdding ? "Adding" : "Add"}
            </button>
          </div>
        </form>

        <div className="flex justify-between gap-2 mt-4 ">
          <div>
            <form>
              <input
                type="text"
                value={search}
                placeholder="search"
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded-lg focus:outline-none"
              />
            </form>
          </div>

          <div>
            <select
              className="border p-2 rounded-lg w-28 focus: outline-none font-semibold"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Default">Default</option>
              <option value="Done">Done</option>
              <option value="Undone">Undone</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 m-4">
          <button
            className={`border p-2  w-[100px] rounded-lg ${
              active === "Past"
                ? "bg-white text-red-600"
                : " bg-red-600 text-white "
            }`}
            onClick={() => setActive("Past")}
          >
            Past
          </button>
          <button
            className={`border p-2  w-[100px] rounded-lg ${
              active === "Present"
                ? "bg-white text-red-600"
                : " bg-red-600 text-white "
            }`}
            onClick={() => setActive("Present")}
          >
            Present
          </button>
          <button
            className={`border p-2  w-[100px] rounded-lg ${
              active === "Future"
                ? "bg-white text-red-600"
                : " bg-red-600 text-white "
            }`}
            onClick={() => setActive("Future")}
          >
            Future
          </button>
        </div>

        <div className="mt-6">
          {filteredTodos.map((todo) => (
            <TodoList key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
}
