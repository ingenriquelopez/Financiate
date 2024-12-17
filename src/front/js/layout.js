import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { Footer } from "./component/footer";

import Sidebar from '../js/component/Sidebar/Sidebar.js';
import Login from './component/Login/Login.jsx';
import Signup from "./component/Signup/Signup.jsx";
import Egresos from "./component/Egresos/Egresos.jsx";
import Ingresos from "./component/Ingresos/Ingresos.jsx";
import Categorias from "./component/Categorias/Categorias.jsx";
import Reportes from "./component/Reportes/Reportes.jsx";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <LayoutContent />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

const LayoutContent = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {!hideSidebar && <Sidebar />}

      <div
        style={{
          marginLeft: hideSidebar ? '0' : '250px',
          width: hideSidebar ? '100%' : 'calc(100% - 250px)',
          transition: 'all 0.3s ease',
        }}
      >
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Home />} path="/Home" />
          <Route element={<Egresos />} path="/egresos" />
          <Route element={<Ingresos />} path="/Ingresos" />
          <Route element={<Categorias />} path="/categorias" />
          <Route element={<Reportes />} path="/reportes" />
          <Route element={<h1>Not found!</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default injectContext(Layout);
