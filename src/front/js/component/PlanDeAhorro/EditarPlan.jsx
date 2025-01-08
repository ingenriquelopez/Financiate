import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import moment from 'moment'; // Importamos moment.js para trabajar con fechas

const EditarPlan = ({ plan, onClose, updatePlans }) => {
  // Función para obtener la fecha actual en formato DD-MM-YYYY
  const getCurrentDate = () => {
    const today = moment().startOf('day'); // Usamos moment.js para evitar problemas de zona horaria
    return today.format('DD-MM-YYYY');
  };

  const [formData, setFormData] = useState({
    nombre_plan: '',
    fecha_inicio: '',
    fecha_objetivo: '',
    monto_objetivo: ''
  });

  // Función para formatear la fecha a DD-MM-YYYY
  const formatToDDMMYYYY = (dateString) => {
    return moment(dateString).format('DD-MM-YYYY'); // Usamos moment.js para formatear la fecha
  };

  // Función para convertir la fecha a formato YYYY-MM-DD para almacenarla de manera estándar
  const formatToYYYYMMDD = (dateString) => {
    return moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD');
  };

  // Al iniciar el componente o recibir un plan, establecer los valores
  useEffect(() => {
    if (plan) {
      setFormData({
        nombre_plan: plan.nombre_plan || '',
        fecha_inicio: plan.fecha_inicio ? formatToDDMMYYYY(plan.fecha_inicio) : getCurrentDate(),
        fecha_objetivo: plan.fecha_objetivo ? formatToDDMMYYYY(plan.fecha_objetivo) : getCurrentDate(),
        monto_objetivo: plan.monto_objetivo || '',
      });
    } else {
      setFormData({
        nombre_plan: '',
        fecha_inicio: getCurrentDate(),
        fecha_objetivo: getCurrentDate(),
        monto_objetivo: '',
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
          id: plan.id,
          ...formData,
          fecha_inicio: formatToYYYYMMDD(formData.fecha_inicio), // Convertimos la fecha a formato YYYY-MM-DD
          fecha_objetivo: formatToYYYYMMDD(formData.fecha_objetivo), // Convertimos la fecha a formato YYYY-MM-DD
        })
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Plan Editado con éxito',
          confirmButtonText: 'Aceptar'
        });

        onClose();
      } else {
        Swal.fire({
          title: "Hubo un error al actualizar el plan",
          text: data.error,
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

                <div className="col-md-6 mb-3 d-flex  flex-column justify-content-center align-items-center"  style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px" }}>
                  <div className="mb-3 text-center">
                      <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio</label>
                      <Flatpickr
                        value={formData.fecha_inicio}
                        onChange={([date]) => setFecha({
                          ...fecha,
                          fecha: formatToDDMMYYYY(date) // Convertimos a DD-MM-YYYY
                        })}
                        options={{
                          dateFormat: "d-m-Y"
                        }}
                        className="form-control"
                      />
                  </div>
                  <div className="mb-3 text-center">
                    <label htmlFor="monto_objetivo" className="form-label">Monto Objetivo</label>
                    <input
                      type="number"
                      id="monto_objetivo"
                      name="monto_objetivo"
                      className="form-control input-smaller"
                      value={formData.monto_objetivo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fecha_objetivo" className="form-label">Fecha Objetivo</label>
                    <Flatpickr
                      value={formData.fecha_objetivo}
                      onChange={([date]) => setFormData({
                        ...formData,
                        fecha_objetivo: formatToDDMMYYYY(date) // Convertimos a DD-MM-YYYY
                      })}
                      options={{
                        dateFormat: "d-m-Y"
                      }}
                      className="form-control"
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
