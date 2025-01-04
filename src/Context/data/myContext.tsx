import { createContext } from "react";

interface MyContextType {
  name: string;
  class: string;
}

// Provide a default value for the context
const myContext = createContext<MyContextType | null>(null);

export default myContext;