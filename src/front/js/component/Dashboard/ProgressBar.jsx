import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ nombre_plan, monto_inicial, total, current }) => {
    const percentage = Math.min((current / total) * 100, 100); // Asegura que no supere el 100%

    const getFillColor = (percentage) => {
        return `linear-gradient(to right, rgba(128, 0, 128, 0.2), rgb(128, 0, 128))`; // Morado
    };

    const valuePosition = `calc(${percentage}% - 30px)`; // Centrado según el porcentaje

    return (
        <div className="progress-bar-container mb-5">
            {/* Nombre del plan centrado arriba */}
            {nombre_plan && <div className="progress-bar-title">{nombre_plan}</div>}

            <div className="progress-bar-wrapper">
                {/* 0% al inicio */}
                <span className="percentage-left">0%</span>

                {/* Barra de progreso */}
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            background: getFillColor(percentage),
                            width: `100%`,
                        }}
                    />
                    <div className="progress-value" style={{ left: valuePosition }}>
                        {current > 0 && new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(current)}
                    </div>
                </div>

                {/* 100% al final */}
                <span className="percentage-right">100%</span>
            </div>

            {/* Valores debajo de la barra */}
            <div className="progress-money">
                <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto_inicial)}</span>
                <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</span>
            </div>
        </div>
    );
};

export default ProgressBar;
