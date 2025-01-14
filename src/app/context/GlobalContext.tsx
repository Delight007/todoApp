"use client";
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Todos } from "../Todo/page";

interface GlobalContextType {
  todos: Todos[];
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
}
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};

export default function GlobalProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todos[]>([]);
  return (
    <GlobalContext.Provider value={{ todos, setTodos }}>
      {children}
    </GlobalContext.Provider>
  );
}
