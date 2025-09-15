import { useEffect } from "react"
import { useAuth } from "./useAuth";
import { Navigate } from "react-router";

export default function LogOut() {
  const { logout } = useAuth()

  useEffect(() => {
    logout();
  }, [])

  return <Navigate to="/" replace />;

}