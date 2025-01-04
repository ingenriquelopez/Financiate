import React from 'react';
import Navbar from './Navbar.jsx';  // Ajusta la ruta
import CerditoImg from "../../../img/Cerdito.png";  // Ajusta la ruta
import EnriqueImg from "../../../img/Enrique.png";  // Ajusta la ruta

const SobreNosotros = () => {
    return (
        <div>
            <Navbar />
            <div className="container containerNosotros mt-5">
                {/* Sección 1 */}
                <section className="section-bg-dark min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="row w-100">
                        <div className="col-12 col-md-8 d-flex align-items-center">
                            <p className="text-justify fs-4">
                                FINÁNCIA+E es la app definitiva para gestionar tu economía personal de manera sencilla y efectiva.
                                Organiza tus gastos con categorías personalizadas, recibe alertas de tus suscripciones y planifica tus ahorros.
                                Todo esto y mucho más, al alcance de tu mouse o celular. ¡Toma el control de tus finanzas hoy mismo!
                            </p>
                        </div>
                        <div className="col-12 col-md-4 d-flex align-items-center justify-content-center">
                            <img src={CerditoImg} alt="Cerdito" className="img-fluid" />
                        </div>
                    </div>
                </section>

                {/* Sección 2 */}
                <section className="section-bg-light min-vh-100 d-flex align-items-center justify-content-center py-5 border-section">
                    <div className="row w-100">
                        {/* Columna de imagen y nombre */}
                        <div className="col-12 col-md-4 d-flex justify-content-center flex-column align-items-center">
                            <img src={EnriqueImg} alt="Enrique" className="img-fluid" />
                            <p className="fw-bold text-center mt-2">Enrique López</p> {/* Nombre debajo de la imagen */}
                        </div>

                        {/* Columna de descripción */}
                        <div className="col-12 col-md-8">
                            <p className="text-justify fs-5">
                                Web Developer Full Stack Ingeniero en Sistemas Computacionales | Especialista en Análisis y Visualización de Datos Masivos
                                <br />
                                Con más de 20 años de experiencia en la industria tecnológica, soy un desarrollador full stack apasionado por crear soluciones innovadoras que combinen funcionalidad y diseño. Domino tanto el front-end como el back-end, y tengo una sólida experiencia en bases de datos.
                            </p>
                            <p className="txtNosotros fs-5">
                                Mi expertise incluye:
                                <br />
                                Front-end: HTML, CSS, JavaScript, Bootstrap, React
                                <br />
                                Back-end: Python, Flask, NodeJs
                                <br />
                                Bases de Datos: PostgreSQL, SQL Server, MongoDB
                                <br />
                                Mi enfoque está en construir aplicaciones robustas, escalables y eficientes, con un diseño intuitivo que brinde una experiencia excepcional a los usuarios. Estoy comprometido con la mejora continua y la colaboración en equipo para alcanzar resultados sobresalientes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Secciones 3, 4, 5 */}
                <section className="section-bg-dark min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center text-white">
                        <h2 className="fw-bold fs-4">Nuestros Valores</h2>
                        <p className="lead">Innovación, Transparencia y Compromiso</p>
                    </div>
                </section>

                <section className="section-bg-light min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <h2 className="fw-bold fs-4">Nuestro Equipo</h2>
                        <p className="lead">Un grupo apasionado por crear soluciones tecnológicas</p>
                    </div>
                </section>

                <section className="section-bg-dark min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center text-white">
                        <h2 className="fw-bold fs-4">Contáctanos</h2>
                        <p className="lead">Estamos aquí para ayudarte con cualquier consulta</p>
                    </div>
                </section>
            </div>

            <footer className="bg-body-secondary py-3 mt-5">
                <div className="container d-flex justify-content-center align-items-center">
                    <p className="mb-0 text-center pb-4">
                        Copyrights 2025 | Developed and designed in 4Geeks Academy
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SobreNosotros;
