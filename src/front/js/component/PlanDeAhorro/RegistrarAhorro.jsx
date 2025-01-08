import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import moment from 'moment'; // Importamos moment.js para trabajar con fechas

const RegistrarAhorro = ({ plan, onClose }) => {
  const [monto_ahorro, setMonto_ahorro] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // Fecha actual por defecto
  const [descripcion, setDescripcion] = useState('Deposito al plan de ahorro'); // Describe el ahorro
  const [error, setError] = useState(''); // Error general
  const [errorMonto, setErrorMonto] = useState(''); // Error para monto a ahorrar
  const [capitalActual, setCapitalActual] = useState(0); // Estado para el capital actual
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Nuevo estado

  // Función para obtener la fecha actual en formato DD-MM-YYYY
  const getCurrentDate = () => {
    const today = moment().startOf('day'); // Usamos moment.js para evitar problemas de zona horaria
    return today.format('DD-MM-YYYY');
  };

  // Función para formatear la fecha a DD-MM-YYYY
  const formatToDDMMYYYY = (dateString) => {
    return moment(dateString).format('DD-MM-YYYY'); // Usamos moment.js para formatear la fecha
  };

  // Función para convertir la fecha a formato YYYY-MM-DD para almacenarla de manera estándar
  const formatToYYYYMMDD = (dateString) => {
    return moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD');
  };

 
  useEffect(() => {
    setFecha(getCurrentDate());
    // Aquí, debes hacer una llamada para obtener el capital actual del usuario
    // asumiendo que la respuesta del backend incluye 'capital_actual' y 'planes'
    const fetchCapitalAndPlans = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/plandeahorro/traerplan`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
          },
        });
        const data = await response.json();
        if (data.capital_actual) {
          setCapitalActual(data.capital_actual);
        }
      } catch (error) {
        console.error('Error fetching capital and plans:', error);
      }
    };

    fetchCapitalAndPlans();
  }, []); // Solo se ejecuta una vez al cargar el componente


  // Validar monto ingresado
  const validateMonto = (monto) => {
    const montoValue = parseFloat(monto);
    if (isNaN(montoValue) || montoValue <= 0) {
      setErrorMonto('El monto debe ser mayor que 0');
      setIsButtonDisabled(true); // Deshabilitamos el botón
    } else if (montoValue > capitalActual) {
      setErrorMonto(`El monto no puede ser mayor que el capital actual (${capitalActual})`);
      setIsButtonDisabled(true); // Deshabilitamos el botón
    } else {
      setErrorMonto('');
      setIsButtonDisabled(false); // Habilitamos el botón
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del monto
    if (monto_ahorro <= 0) {
      setError('El monto de ahorro debe ser mayor que 0');
      return;
    }

    if (!monto_ahorro || !fecha) {
      setError('El monto de ahorro y la fecha son requeridos');
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/plandeahorro/depositar`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          plan_id: plan.id,
          nombre_plan: plan.nombre_plan,
          monto_ahorro,
          descripcion,
          fecha: formatToYYYYMMDD(fecha), // Convertimos la fecha a formato YYYY-MM-DD
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el depósito');
      }

      const data = await response.json();
      // Mostrar la notificación de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Depósito registrado con éxito',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Cerrar el modal
        onClose(); // Cierra el modal
      });

    } catch (error) {
      console.error('Error submitting deposit:', error);
      setError('Error al registrar el depósito');
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="registerDepositModal" aria-hidden="false">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="registerDepositModal">Registrar Ahorro</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {plan ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Plan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plan.nombre_plan}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <div className="row justify-content-center">
                    <div className="col-auto text-center">
                      <label className="form-label">Monto a Depositar</label>
                      <input
                        type="number"
                        className="form-control"
                        value={monto_ahorro}
                        onChange={(e) => {
                          setMonto_ahorro(e.target.value);
                          validateMonto(e.target.value); // Validamos el monto
                        }}
                        required
                      />
                      {errorMonto && <small className="text-danger">{errorMonto}</small>}
                    </div>
                  </div>

                  <div className="row justify-content-center mt-3">
                    <div className="col-auto text-center">
                      <label className="form-label">Fecha del Ahorro</label>
                      <Flatpickr 
                        value={fecha}
                        onChange={([date]) => setFecha(formatToDDMMYYYY(date))}
                        options={{
                          dateFormat: "d-m-Y"
                        }}
                        className="form-control text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                  <button type="submit" className="btn btn-success" disabled={isButtonDisabled}>Registrar</button>
                </div>
              </form>
            ) : (
              <p>Cargando detalles del plan...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarAhorro;
