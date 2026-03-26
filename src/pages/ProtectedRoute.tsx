import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRole: string;
}
export default function ProtectedRoute({ allowedRole }: Props) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const parsedUser = JSON.parse(user);
  const role = parsedUser?.role;

  if (role && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}