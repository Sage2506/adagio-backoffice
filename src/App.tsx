import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router'
import AlumnsTable from './components/dashboard/alumns/table'

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => navigate("/login", { replace: true });
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);

  }, [navigate])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <AlumnsTable/>
    </>
  )
}

export default App
