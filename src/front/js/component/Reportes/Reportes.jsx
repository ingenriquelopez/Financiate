import React, { useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { Context } from '../../store/appContext';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const { store, actions } = useContext(Context);
  const usuario_id = store.usuario_id

  const fetchReportes = async () => {
    if (!usuario_id) {
      console.error("usuario_id no está disponible");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/usuarios/reportes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReportes(data);
      } else {
        console.error("Error al obtener reportes");
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

 // Este efecto solo se ejecuta una vez cuando el componente se monta o cuando el usuario_id cambia
  useEffect(() => {
    fetchReportes();
  }, [usuario_id]);  // Solo se ejecuta cuando usuario_id cambie

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Reportes</h2>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {reportes
          .slice()
          .sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return fechaB - fechaA;
          })
          .map((reporte) => (
            <li
              key={`${reporte.tipo}-${reporte.id}`}
              style={{
                backgroundColor: "white",
                border: `2px solid ${reporte.tipo === "ingreso" ? "green" : "red"}`,
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
              }}
            >
              <p style={{ textAlign: "left", fontWeight: "bold", marginBottom: "10px" }}>
                {reporte.tipo.toUpperCase()}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
                <span>Monto: ${reporte.monto.toFixed(2)}</span>
                <span>Descripción: {reporte.descripcion}</span>
                <span>Fecha: {new Date(reporte.fecha).toISOString().split('T')[0].split('-').reverse().join('/')}</span>

              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Reportes;
