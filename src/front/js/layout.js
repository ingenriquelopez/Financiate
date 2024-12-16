import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { Footer } from "./component/footer";

// Importa el componente Sidebar
import Sidebar from '../js/component/Sidebar/Sidebar.js';

import Login from './component/Login/Login.jsx';
import Signup from "./component/Signup/Signup.jsx";
import Egresos from "./component/Egresos/Egresos.jsx";
import Ingresos from "./component/Ingresos/Ingresos.jsx";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <LayoutContent /> {/* Renderizamos el contenido del layout dentro del Router */}
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

const LayoutContent = () => {
  const location = useLocation(); // Ahora usamos useLocation dentro del Router

  // Verifica si la ruta es de login, signup o la raíz
  const hideSidebar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Solo muestra el Sidebar si no estamos en login, signup o la raíz */}
      {!hideSidebar && <Sidebar />}

      <div
        style={{
          marginLeft: hideSidebar ? '0' : '250px', // Cuando no hay Sidebar, el marginLeft es 0
          width: hideSidebar ? '100%' : 'calc(100% - 250px)', // Ajustamos el ancho
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
          <Route element={<h1>Not found!</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default injectContext(Layout);
