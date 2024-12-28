import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoFinanciaUrlBlue from "../../../img/Financiate_blue.png";
import LpMan from "../../../img/man-holding.png";
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg bg-body-secondary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src={logoFinanciaUrlBlue} alt="Logo" className="navbar-logo" />
                    </a>
                    <div className="navbar-nav">
                        <Link className="fw-bold fs-5 nav-link " to="/sobre-nosotros">Sobre nosotros</Link>
                    </div>
                    <div className="ms-auto">

                        <Link to="/login" className="boton-is fw-bold btn btn-transparent">Iniciar sesión</Link>
                        <Link to="/signup" className="boton-r fw-bold btn btn-primary text-white ms-2">Regístrate</Link>
                    </div>
                </div>
            </nav>

            {/* Contenido Landing Page */}
            <div className="container mt-5">
                <div className="row align-items-center">
                    {/* Columna de texto (izquierda) */}
                    <div className="col-12 col-md-6">
                        <div className="header">Tus ingresos y egresos a un solo click</div>

                        {/* Descripción */}
                        <p>
                            FINÁNCIA+E gestiona tu economía mediante categorías personalizadas, alerta de pago de suscripciones, planes de ahorro y mucho más al alcance de tu mouse o tu celular.
                        </p>

                        {/* Botón CTA */}
                        <Link to="/login" className="fw-bold fs-5 Boton-cta btn btn-primary w-100">
                            Finánciate aquí
                        </Link>
                    </div>

                    {/* Columna de imagen (derecha) */}
                    <div className="col-12 col-md-6 mt-4 mt-md-0">
                        <img src={LpMan} alt="Persona con teléfono" className="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;