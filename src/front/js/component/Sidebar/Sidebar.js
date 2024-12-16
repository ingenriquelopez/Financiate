import React, { useContext } from "react";
import { Link, useLocation } from 'react-router-dom';  // Importa useLocation
import { Context } from "../../store/appContext";
import './Sidebar.css';
import Logo from '../../../img/LogoFinancia.png';

const Sidebar = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();  // Usamos useLocation para obtener la ruta actual
  const handleLogout = () => {
    // Aquí se maneja el cierre de sesión, redirigiendo a la página de login
    window.location.href = '/login';
  };

  // Condicionamos el renderizado del sidebar para que no aparezca en /login, /signup o en la ruta raíz /
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;  // No renderiza el sidebar si estamos en la ruta raíz, login o signup
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={Logo} alt="Logo Financia" />
      </div>
      <div className="sidebar-body">
        <nav className="nav flex-column">
          <Link className="nav-link" to="/Home">
            <i className="fa-solid fa-gauge-high"></i> Dashboard
          </Link>
          <Link className="nav-link" to="/Ingresos">
            <i className="fa-solid fa-plus"></i> Ingresos
          </Link>
          <Link className="nav-link" to="/egresos">
            <i className="fa-solid fa-minus"></i> Egresos
          </Link>
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="user-info">
          <span><i className="fa-solid fa-user"></i> {store.nombreUsuario}</span>
          <button onClick={handleLogout} className="btn btn-outline-danger">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
