import { UserContext } from "./UserContext";
import useFetch from "@/hooks/useFetch";

type Props = {
  children: React.ReactNode;
};
const API_URL = "https://69c59dee8a5b6e2dec2cb4d4.mockapi.io";
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