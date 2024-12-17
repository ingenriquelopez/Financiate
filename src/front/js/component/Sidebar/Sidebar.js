import React, { useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Context } from "../../store/appContext";
import './Sidebar.css';
import Logo from '../../../img/LogoFinancia.png';

const Sidebar = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
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
          <Link className="nav-link" to="/categorias">
            <i className="fa-solid fa-layer-group"></i> Categorías
          </Link>
          <Link className="nav-link" to="/reportes">
            <i className="fa-solid fa-chart-line"></i> Reportes
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
