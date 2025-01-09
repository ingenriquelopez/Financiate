import React, { useState } from 'react';
import Swal from 'sweetalert2';

const RegistrarAhorro = ({ plan, onClose }) => {
  const [monto_ahorro, setMonto_ahorro] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // Fecha actual por defecto
  const [descripcion, setDescripcion] = useState('Deposito al plan de ahorro'); //describe el ahorro
  const [error, setError] = useState('');

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
          nombre_plan:plan.nombre_plan,
          monto_ahorro,
          descripcion,
          fecha,
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
                            onChange={(e) => setMonto_ahorro(e.target.value)}
                            required
                        />
                        </div>
                    </div>

                    <div className="row justify-content-center mt-3">
                        <div className="col-auto text-center">
                        <label className="form-label">Fecha del Ahorro</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
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
                  <button type="submit" className="btn btn-success">Registrar</button>
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
