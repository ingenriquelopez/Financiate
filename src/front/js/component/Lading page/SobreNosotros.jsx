import React from 'react';
import VadhirImg from "../../../img/Vadhir.png";
import RadovanImg from "../../../img/Radovan.png";

const SobreNosotros = () => {
    return (
        <div className="container mt-5">

            <div className='fw-bold fs-1 mb-5'>Sobre Nosotros</div>

            <p>FINÁNCIA+E es la app definitiva para gestionar tu economía personal de manera sencilla y efectiva. Organiza tus gastos con categorías personalizadas, recibe alertas de tus suscripciones y planifica tus ahorros. Todo esto y mucho más, al alcance de tu mouse o celular. ¡Toma el control de tus finanzas hoy mismo!</p>

            <br /><br /><br /><br />

            {/* Primer bloque de contenido */}
            <div className="row">
                <div className="col-4">
                    <img src={VadhirImg} alt="Vadhir" className="img-fluid" />
                </div>
                <div className="col-8">
                    <p>Licenciado en Docencia de Idiomas con más de ocho años de experiencia en el ámbito educativo. Durante su trayectoria, observó cómo la tecnología puede transformar y enriquecer el proceso de enseñanza-aprendizaje, inspirándolo a explorar nuevas formas de integrar herramientas digitales en la educación. Esto lo llevó a iniciar su formación como Full Stack Developer, donde desarrolló habilidades en tecnologías como HTML, CSS, JavaScript, React, Python, SQL, entre otras. Su objetivo ahora es combinar la experiencia pedagógica con los conocimientos en programación para crear soluciones innovadoras que impulsen el aprendizaje y la accesibilidad en la educación.</p>
                </div>
            </div>

            <br /><br /><br /><br />

            {/* Segundo bloque de contenido */}
            <div className="row mt-4">
                <div className="col-8">
                    <p>Licenciado en Comunicación Social, mención audiovisual, con más de diez años de experiencia en el ámbito del marketing digital y animación tanto 2D como 3D, dominio de programas como: Adobe Photoshop, Adobe Illustrator, After Effects y Blender. Durante su trayectoria, se especializó en el modelado 3D de productos para videos publicitarios. Actualmente ve la programación como una oportunidad de expansión del diseño web y otras tecnologías digitales. Esto lo lleva a iniciar su formación en tecnologías como: HTML, CSS, JavaScript, Python y React. De esta forma puede integrar tanto funcionalidad operativa como diseño web.</p>
                </div>
                <div className="col-4">
                    <img src={RadovanImg} alt="Radovan" className="img-fluid" />
                </div>
            </div>
        </div>
    );
};

export default SobreNosotros;