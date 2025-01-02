import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const EditarPlan = ({ plan, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre_plan: '',
    fecha_inicio: '',
    monto_inicial: '',
    fecha_objetivo: '',
    monto_objetivo: ''
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre_plan: plan.nombre_plan,
        fecha_inicio: plan.fecha_inicio.slice(0, 10),
        monto_inicial: plan.monto_inicial,
        fecha_objetivo: plan.fecha_objetivo.slice(0, 10),
        monto_objetivo: plan.monto_objetivo
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/plandeahorro/editarplan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          id: plan.id, // ID del plan que se está editando
          ...formData // Los datos modificados
        })
      });

      const data = await response.json();
      if (response.ok) {
        //onUpdate(); // Actualizar la lista de planes
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Plan Editado con éxito',
          confirmButtonText: 'Aceptar'
        });
        
        onClose();  // Cerrar el modal
      } else {
        Swal.fire({
          title: "Hubo un error al actualizar el plan",
          text: "data.error",
          icon: "error"
        });
  
      }
    } catch (error) {
      console.error('Error al editar el plan:', error);
      alert("Error al actualizar el plan");
    }
  };

  return (
    <div className="modal fade show bodyContainer" tabIndex="-1" style={{ display: "block" }} aria-labelledby="editarPlanLabel" aria-hidden="false">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editarPlanLabel">Editar Plan de Ahorro</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
                <div className="row text-center mx-0">
                {/* Columna de Nombre del Plan que ocupa todo el ancho */}
                <div className="col-12 mb-3">
                  <label htmlFor="nombre_plan" className="form-label">Nombre del Plan</label>
                  <input
                    type="text"
                    id="nombre_plan"
                    name="nombre_plan"
                    className="form-control"
                    value={formData.nombre_plan}
                    onChange={handleChange}
                  />
                </div>

                {/* Columna de Monto Inicial y Fecha de Inicio en recuadro izquierdo */}
                <div className="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px" }}>
                  <div className="mb-3 me-3 text-center">
                    <label htmlFor="monto_inicial" className="form-label">Monto Inicial</label>
                    <input
                      type="number"
                      id="monto_inicial"
                      name="monto_inicial"
                      className="form-control input-smaller" // Clase para reducir el ancho
                      value={formData.monto_inicial}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3 text-center">
                    <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio</label>
                    <input
                      type="date"
                      id="fecha_inicio"
                      name="fecha_inicio"
                      className="form-control input-smaller" // Clase para reducir el ancho
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Columna de Monto Objetivo y Fecha Objetivo en recuadro derecho */}
                <div className="col-md-6 mb-3" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px" }}>
                  <div className="mb-3 text-center">
                    <label htmlFor="monto_objetivo" className="form-label">Monto Objetivo</label>
                    <input
                      type="number"
                      id="monto_objetivo"
                      name="monto_objetivo"
                      className="form-control input-smaller" // Clase para reducir el ancho
                      value={formData.monto_objetivo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fecha_objetivo" className="form-label">Fecha Objetivo</label>
                    <input
                      type="date"
                      id="fecha_objetivo"
                      name="fecha_objetivo"
                      className="form-control input-smaller" // Clase para reducir el ancho
                      value={formData.fecha_objetivo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPlan;
