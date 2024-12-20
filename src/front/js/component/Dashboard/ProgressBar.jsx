// ProgressBar.jsx
import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ total, current }) => {
    // Calcular el porcentaje basado en el valor actual y el total
    const percentage = Math.min((current / total) * 100, 100); // Asegurarse de que no supere el 100%

    // Función para determinar el color del progreso
    const getFillColor = (percentage) => {
        return `linear-gradient(to right, rgba(128, 0, 128, 0.2), rgb(128, 0, 128))`;  // Morado
    };

    // Cálculo de la posición del valor en la barra (para asegurar que quede centrado)
    const valuePosition = `calc(${percentage}% - 30px)`;  // Desplazar el valor según el porcentaje

    return (
        <div className="progress-bar-container">
            {/* Los valores 0% y 100% */}
            <div className="progress-percentage">
                <span className="percentage-left">0%</span>
                <span className="percentage-right">100%</span>
                {/* Mostrar el porcentaje calculado fuera de la barra */}
                <div className="percentage-calculated" style={{ left: `calc(${percentage}% )` }}>
                    {Math.round(percentage)}%
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        background: getFillColor(percentage),
                    }}
                />
                {/* Mostrar el monto dentro de la barra de progreso */}
                <div className="progress-value" style={{ left: valuePosition }}>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(current)}
                </div>
            </div>

            {/* Valores debajo de la barra */}
            <div className="progress-money">
                <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(0.0)}</span>
                <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</span>
                
            </div>
            <span>Plan de Ahorro</span>
            
        </div>
    );
};

export default ProgressBar;
