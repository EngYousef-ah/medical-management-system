import { createContext } from "react";
import type { TypeUser } from "@/types/TypeUser";

export type UserContextType = {
  users: TypeUser[];
  loading:boolean;
};

export const UserContext = createContext<UserContextType | null>(null);