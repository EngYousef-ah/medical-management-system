import { UserContext } from "./UserContext";
import useFetch from "@/hooks/useFetch";

type Props = {
  children: React.ReactNode;
};

export function UserProvider({ children }: Props) {

  const { data, loading } = useFetch("http://localhost:3000/users");

  return (
    <UserContext.Provider value={{
      users: data || [],
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
}