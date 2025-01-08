import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Importa el estilo de flatpickr
import './CrearPlanDeAhorro.css';

const CrearPlanDeAhorro = ({ showModal, onClose, planToEdit, updatePlans }) => {

  const getCurrentDate = () => {
    const today = new Date();
    today.setHours(today.getHours() - today.getHours());
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const [formData, setFormData] = useState({
    nombre_plan: '',
    fecha_inicio: getCurrentDate(),
    monto_inicial: '',
    fecha_objetivo: getCurrentDate(),
    monto_objetivo: '',
    monto_acumulado: '',
  });

  const [isChecked, setIsChecked] = useState(true); 
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); 
  const [errors, setErrors] = useState({
    monto_inicial: '',
    monto_objetivo: '',
  });

  const formatToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatToYYYYMMDD = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    if (planToEdit) {
      setFormData({
        nombre_plan: planToEdit.nombre_plan || '',
        fecha_inicio: planToEdit.fecha_inicio ? formatToDDMMYYYY(planToEdit.fecha_inicio) : getCurrentDate(),
        monto_inicial: planToEdit.monto_inicial || '',
        fecha_objetivo: planToEdit.fecha_objetivo ? formatToDDMMYYYY(planToEdit.fecha_objetivo) : getCurrentDate(),
        monto_objetivo: planToEdit.monto_objetivo || '',
        monto_acumulado: planToEdit.monto_acumulado || '',
      });
    } else {
      setFormData({
        nombre_plan: '',
        fecha_inicio: getCurrentDate(),
        monto_inicial: '',
        fecha_objetivo: getCurrentDate(),
        monto_objetivo: '',
        monto_acumulado: '',
      });
    }
  }, [planToEdit]);


  useEffect(() => {
    const { nombre_plan, monto_inicial, monto_objetivo, fecha_objetivo, fecha_inicio } = formData;
    if (nombre_plan && monto_inicial && monto_objetivo && fecha_objetivo && fecha_inicio) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Convertir el valor a un número para asegurar que se está comparando correctamente
    const numericValue = parseFloat(value);
  
    // Validar si el valor de monto_inicial (permitir >= 0, pero no < 0)
    if (name === 'monto_inicial') {
      if (isNaN(numericValue) || numericValue < 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'El monto debe ser mayor o igual que 0',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
  
    // Validar si el valor de monto_objetivo (permitir > 0, pero no <= 0)
    if (name === 'monto_objetivo') {
      if (isNaN(numericValue) || numericValue <= 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'El monto debe ser mayor que 0',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
  
    // Actualizar el estado con el valor del campo
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  const handleSave = async () => {
    if (!formData.nombre_plan || !formData.monto_inicial || !formData.fecha_inicio || !formData.monto_objetivo || !formData.fecha_objetivo) {
      Swal.fire("Por favor, complete todos los campos.");
      return;
    }

    const fechaInicio = new Date(formData.fecha_inicio.split('-').reverse().join('-'));
    const fechaObjetivo = new Date(formData.fecha_objetivo.split('-').reverse().join('-'));

    if (isNaN(fechaInicio) || isNaN(fechaObjetivo)) {
      Swal.fire("Las fechas ingresadas no son válidas.");
      return;
    }

    fechaInicio.setHours(0, 0, 0, 0);
    fechaObjetivo.setHours(0, 0, 0, 0);

    const fecha_inicio_formateada = formatToYYYYMMDD(formData.fecha_inicio);
    const fecha_objetivo_formateada = formatToYYYYMMDD(formData.fecha_objetivo);

    try {
      const url = `${process.env.BACKEND_URL}/api/plandeahorro/agregarplan`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          ...formData,
          fecha_inicio: fecha_inicio_formateada,
          fecha_objetivo: fecha_objetivo_formateada
        }),
      });

      if (!response.ok) {
        alert("Error al guardar el plan.");
        return;
      }

      const data = await response.json();

      Swal.fire({
        title: "Plan Guardado Correctamente",
        icon: "success",
      });

      updatePlans(data.nuevo_plan); 
      setFormData({
        nombre_plan: '',
        fecha_inicio: '',
        monto_inicial: '',
        fecha_objetivo: '',
        monto_objetivo: '',
        monto_acumulado: '',
      });

      onClose(); 
    } catch (error) {
      console.error('Error guardando el plan:', error);
      alert('Error al guardar el plan.');
    }
  };

  const handleCloseModal = () => {
    setFormData({
      nombre_plan: '',
      fecha_inicio: '',
      monto_inicial: '',
      fecha_objetivo: '',
      monto_objetivo: '',
      monto_acumulado: '',
    });
    onClose(); 
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
                  {errors.monto_inicial && <small className="text-danger">{errors.monto_inicial}</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio</label>
                  <Flatpickr
                    value={formData.fecha_inicio}
                    onChange={([date]) => setFormData({
                      ...formData,
                      fecha_inicio: formatToDDMMYYYY(date)
                    })}
                    options={{
                      dateFormat: "d-m-Y",
                      minDate: "today" // Evitar fechas pasadas
                    }}
                    className="form-control"
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
                  {errors.monto_objetivo && <small className="text-danger">{errors.monto_objetivo}</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_objetivo" className="form-label">Fecha de Objetivo</label>
                  <Flatpickr
                    value={formData.fecha_objetivo}
                    onChange={([date]) => setFormData({
                      ...formData,
                      fecha_objetivo: formatToDDMMYYYY(date)
                    })}
                    options={{
                      dateFormat: "d-m-Y"
                    }}
                    className="form-control"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaveDisabled}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPlanDeAhorro;
