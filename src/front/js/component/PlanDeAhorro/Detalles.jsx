import React, { useState } from "react";
import EditarPlan from "./EditarPlan.jsx"; // Importamos el componente para editar el plan
import RegistrarAhorro from "./RegistrarAhorro.jsx"; // Importamos el componente para registrar el ahorro

const Detalles = ({ plan, onClose, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrarAhorroModal, setShowRegistrarAhorroModal] = useState(false); // Estado para controlar la visibilidad del modal de Registrar Ahorro

  const handleEdit = () => {
    setShowEditModal(true); // Abrir el modal de edición cuando se hace clic en "Editar"
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false); // Cerrar el modal de edición
  };

  const handleUpdate = () => {
    // Llamar al onClose o actualizar el estado después de la edición
    onClose();
  };

  const handleRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(true); // Mostrar el modal de Registrar Ahorro
  };

  const handleCloseRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(false); // Cerrar el modal de Registrar Ahorro
  };

  if (!plan) return null; // Si no hay un plan seleccionado, no renderiza nada

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
                  <tr>
                    <th>Nombre del Plan</th>
                    <td>{plan.nombre_plan}</td>
                  </tr>
                  <tr>
                    <th>Fecha de Inicio</th>
                    <td>{plan.fecha_inicio ? plan.fecha_inicio.slice(0, 10) : "Sin fecha"}</td>
                  </tr>
                  <tr>
                    <th>Monto Inicial</th>
                    <td>{plan.monto_inicial}</td>
                  </tr>
                  <tr>
                    <th>Fecha Objetivo</th>
                    <td>{plan.fecha_objetivo ? plan.fecha_objetivo.slice(0, 10) : "Sin fecha"}</td>
                  </tr>
                  <tr>
                    <th>Monto Objetivo</th>
                    <td>{plan.monto_objetivo}</td>
                  </tr>
                  <tr>
                    <th>Monto Acumulado</th>
                    <td>{plan.monto_acumulado}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" onClick={onDelete}>🗑️ Eliminar</button>
              <button type="button" className="btn btn-outline-warning" onClick={handleEdit}>✏️ Editar</button>
              <button type="button" className="btn btn-outline-success" onClick={handleRegistrarAhorro}>🐷 Registrar Ahorro</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <EditarPlan
          plan={plan}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdate}
        />
      )}

      {/* Modal de Registrar Ahorro */}
      {showRegistrarAhorroModal && (
        <RegistrarAhorro
          plan={plan} // Pasamos el ID del plan al modal
          onClose={handleCloseRegistrarAhorro}
        />
      )}
    </div>
  );
};

export default Detalles;
