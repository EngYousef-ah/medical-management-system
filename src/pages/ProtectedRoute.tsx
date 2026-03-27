import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRole: string;
}
export default function ProtectedRoute({ allowedRole }: Props) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const userData = JSON.parse(atob(token));
  const role = userData?.role;

  if (role && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}