import { UserContext } from "./UserContext";
import useFetch from "@/hooks/useFetch";

type Props = {
  children: React.ReactNode;
};
const API_URL = "https://my-json-server.typicode.com/EngYousef-ah/medical-management-system";
export function UserProvider({ children }: Props) {

  const { data, loading } = useFetch(`${API_URL}/users`);

  return (
    <UserContext.Provider value={{
      users: data || [],
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
}