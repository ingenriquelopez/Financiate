import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CrearPlanDeAhorro = ({ showModal, onClose, planToEdit, updatePlans }) => {
  const [formData, setFormData] = useState({
    nombre_plan: '',
    fecha_inicio: '',
    monto_inicial: '',
    fecha_objetivo: '',
    monto_objetivo: '',
    monto_acumulado: '',
  });

  // Limpiar el formulario cuando se edita un plan o se cancela
  useEffect(() => {
    if (planToEdit) {
      setFormData({
        nombre_plan: planToEdit.nombre_plan || '',
        fecha_inicio: planToEdit.fecha_inicio ? planToEdit.fecha_inicio.slice(0, 10) : '',
        monto_inicial: planToEdit.monto_inicial || '',
        fecha_objetivo: planToEdit.fecha_objetivo ? planToEdit.fecha_objetivo.slice(0, 10) : '',
        monto_objetivo: planToEdit.monto_objetivo || '',
        monto_acumulado: planToEdit.monto_acumulado || '',
      });
    } else {
      // Si no hay plan para editar, aseguramos que el formulario esté limpio
      setFormData({
        nombre_plan: '',
        fecha_inicio: '',
        monto_inicial: '',
        fecha_objetivo: '',
        monto_objetivo: '',
        monto_acumulado: '',
      });
    }
  }, [planToEdit]); // Dependemos de planToEdit para actualizar los campos

  // Manejar los cambios del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para guardar el plan (crear o editar)
  const handleSave = async () => {
    // Validación de campos vacíos
    if (!formData.nombre_plan || !formData.monto_inicial || !formData.fecha_inicio || !formData.monto_objetivo || !formData.fecha_objetivo) {
      Swal.fire("Por favor, complete todos los campos.");
      return;
    }

    try {
      const url = `${process.env.BACKEND_URL}/api/plandeahorro/agregarplan`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert("Error al guardar el plan.");
        return;
      }
      // Leer el cuerpo de la respuesta como JSON
      const data = await response.json();

      // Si todo va bien, se cierra el modal y se puede actualizar el listado de planes
      Swal.fire({
        title: "Plan Guardado Correctamente",
        icon: "success",
      });

      // Aquí actualizamos el estado con el nuevo plan
      updatePlans(data.nuevo_plan); // Esto debería actualizar el estado en el componente principal

      // Resetear el estado después de guardar
      setFormData({
        nombre_plan: '',
        fecha_inicio: '',
        monto_inicial: '',
        fecha_objetivo: '',
        monto_objetivo: '',
        monto_acumulado: '',
      });

      onClose(); // Cerrar el modal después de guardar el plan
    } catch (error) {
      console.error('Error guardando el plan:', error);
      alert('Error al guardar el plan.');
    }
  };

  // Manejar el cierre del modal y limpiar el formulario
  const handleCloseModal = () => {
    setFormData({
      nombre_plan: '',
      fecha_inicio: '',
      monto_inicial: '',
      fecha_objetivo: '',
      monto_objetivo: '',
      monto_acumulado: '',
    }); // Limpiar el formulario al cerrar el modal
    onClose(); // Llamar a la función onClose para cerrar el modal
  };

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="planModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white text-center">
            <h5 className="modal-title" id="planModalLabel">{planToEdit ? 'Editar Plan' : 'Agregar Plan'}</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="nombre_plan" className="form-label">Nombre del Plan</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre_plan"
                  name="nombre_plan"
                  value={formData.nombre_plan}
                  onChange={handleChange}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="monto_inicial" className="form-label">Monto Inicial</label>
                  <input
                    type="number"
                    className="form-control"
                    id="monto_inicial"
                    name="monto_inicial"
                    value={formData.monto_inicial}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_inicio"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="monto_objetivo" className="form-label">Monto Objetivo</label>
                  <input
                    type="number"
                    className="form-control"
                    id="monto_objetivo"
                    name="monto_objetivo"
                    value={formData.monto_objetivo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_objetivo" className="form-label">Fecha Objetivo</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_objetivo"
                    name="fecha_objetivo"
                    value={formData.fecha_objetivo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPlanDeAhorro;
