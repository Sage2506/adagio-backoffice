import { useEffect } from "react"
import api from "../../services/api";
import { useNavigate } from "react-router";

export default function LogOut() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("id_token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true })
  }, [navigate])

  return (
    <p>Login out</p>
  )
}