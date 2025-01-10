import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 
import EditarPlan from "./EditarPlan.jsx";
import RegistrarAhorro from "./RegistrarAhorro.jsx";
import moment from "moment"; // Importamos moment.js

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const Detalles = ({ plan, onClose, updatePlans}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrarAhorroModal, setShowRegistrarAhorroModal] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(true);
  };

  const handleCloseRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(false);
    onCloseAll();
  };

  // Función para obtener los planes de la API
  const fetchPlans = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/plandeahorro/traerplan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
      });

      const data = await response.json();
      
      // Aquí actualizamos el estado con el nuevo plan
      updatePlans(data); // Esto debería actualizar el estado en el componente principal
      setLoading(false); // Cambiar el estado de carga a falso una vez que se reciban los planes
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false); // En caso de error, también se cambia el estado de carga
    }
  };

  const handleEliminar = async () => {
    if (!plan || !plan.id) return;  

    setLoading(true);
    setError("");  
    
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/plandeahorro/eliminar_plan_ahorro`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({ "plan_ahorro_id": plan.id }),
      });

      if (response.ok) {
        fetchPlans();
        onClose();  

        Swal.fire("Deleted!", "Your plan has been deleted.", "success");  
      } else {
        setError("Error al eliminar el plan de ahorro.");
        Swal.fire("Error", "No se pudo eliminar el plan.", "error");  
      }
    } catch (err) {
      setError("Hubo un error al intentar eliminar el plan.");
      Swal.fire("Error", "Hubo un problema al eliminar el plan.", "error");  
    } finally {
      setLoading(false);  
    }
  };

  if (!plan) return null;

  // Usamos moment para manipular las fechas sin cambiar la zona horaria
  const validFechaInicio = plan.fecha_inicio ? moment(plan.fecha_inicio).format("DD/MM/YYYY") : null;  // Usamos moment.js para formatear
  const validFechaObjetivo = plan.fecha_objetivo ? moment(plan.fecha_objetivo).format("DD/MM/YYYY") : null;

  return (
    <div>
      <div className="modal fade show" tabIndex="-1" style={{ display: "block" }} aria-labelledby="detallesModalLabel" aria-hidden="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detallesModalLabel">Detalles del Plan</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <tbody>
                  <tr><th>Nombre del Plan</th><td>{plan.nombre_plan}</td></tr>
                  <tr><th>Fecha de Inicio</th><td>{validFechaInicio ? validFechaInicio : "Fecha inválida"}</td></tr>
                  <tr><th>Monto Inicial</th><td>{formatNumber(plan.monto_inicial)}</td></tr>
                  <tr><th>Fecha Objetivo</th><td>{validFechaObjetivo ? validFechaObjetivo : "Fecha inválida"}</td></tr>
                  <tr><th>Monto Objetivo</th><td>{formatNumber(plan.monto_objetivo)}</td></tr>
                  <tr><th>Monto Acumulado</th><td>{formatNumber(plan.monto_acumulado)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" onClick={() => {
                Swal.fire({
                  title: "Estas Seguro?",
                  text: "No podras revertir esta accion!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Si, Eliminalo!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleEliminar();
                  }
                });
              }} disabled={loading}>
                {loading ? "Eliminando..." : "🗑️ Eliminar"}
              </button>
              <button type="button" className="btn btn-outline-warning" onClick={handleEdit}>✏️ Editar</button>
              <button type="button" className="btn btn-outline-success" onClick={handleRegistrarAhorro}>🐷 Registrar Ahorro</button> 
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditarPlan
          plan={plan}
          onClose={handleCloseEditModal}
        />
      )}

      {onCloseAll && showRegistrarAhorroModal && (
        <RegistrarAhorro
          plan={plan}
          onClose={handleCloseRegistrarAhorro}
        />
      )}
    </div>
  );
};

export default Detalles;
