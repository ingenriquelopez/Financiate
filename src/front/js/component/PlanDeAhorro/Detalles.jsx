import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";  // Importar SweetAlert2
import EditarPlan from "./EditarPlan.jsx";
import RegistrarAhorro from "./RegistrarAhorro.jsx";

const Detalles = ({ plan, onClose }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrarAhorroModal, setShowRegistrarAhorroModal] = useState(false);
  const [loading, setLoading] = useState(false);  // Para controlar el estado de carga
  const [error, setError] = useState("");  // Para manejar errores

  const handleEdit = () => {
    setShowEditModal(true); // Abrir el modal de edición
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false); // Cerrar el modal de edición
  };

  const handleRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(true); // Mostrar el modal de Registrar Ahorro
  };

  const handleCloseRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(false); // Cerrar el modal de Registrar Ahorro
  };

  const handleEliminar = async () => {
    if (!plan || !plan.id) return;  // Asegurarse de que haya un plan

    setLoading(true);
    setError("");  // Resetear el error antes de hacer la solicitud
    
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
        onClose();  // Cerrar el modal o realizar alguna otra acción después de la eliminación
        Swal.fire("Deleted!", "Your plan has been deleted.", "success");  // Alerta de éxito
      } else {
        setError("Error al eliminar el plan de ahorro.");
        Swal.fire("Error", "No se pudo eliminar el plan.", "error");  // Alerta de error
      }
    } catch (err) {
      setError("Hubo un error al intentar eliminar el plan.");
      Swal.fire("Error", "Hubo un problema al eliminar el plan.", "error");  // Alerta de error en caso de fallo en la petición
    } finally {
      setLoading(false);  // Finalizar el estado de carga
    }
  };

  if (!plan) return null; // Si no hay un plan, no renderiza nada

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
              <Button variant="danger" onClick={() => {
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
                    // Aquí es donde se ejecuta la lógica de eliminación solo cuando el usuario confirma
                    handleEliminar();
                  }
                });
              }} disabled={loading}>
                {loading ? "Eliminando..." : "Eliminar"}
              </Button>
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
        />
      )}

      {/* Modal de Registrar Ahorro */}
      {showRegistrarAhorroModal && (
        <RegistrarAhorro
          plan={plan}
          onClose={handleCloseRegistrarAhorro}
        />
      )}
    </div>
  );
};

export default Detalles;
