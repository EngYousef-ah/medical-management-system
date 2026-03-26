import { createContext } from "react";
import type { TypeUser } from "@/types/TypeUser";

export type UserContextType = {
  users: TypeUser[];
  loading:boolean;
  error:string | null;
};

export const UserContext = createContext<UserContextType | null>(null);