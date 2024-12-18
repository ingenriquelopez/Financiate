import React, { useState } from 'react';
import './Suscripciones.css';

function Suscripciones() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: '',
    type: '',
    value: '',
    date: '',
    periodicidad: 'mensual'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    setSubscriptions([...subscriptions, modalData]);
    setModalData({ name: '', type: '', value: '', date: '', periodicidad: 'mensual' });
    setIsModalOpen(false);
  };

  const handleDeleteSubscription = (index) => {
    const updatedSubscriptions = subscriptions.filter((_, i) => i !== index);
    setSubscriptions(updatedSubscriptions);
  };

  return (
    <div className="suscripciones-container">
      <h2 className="titulo">Administrar Suscripciones y Pagos</h2>
      <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
        Agregar Suscripción
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Registrar Suscripción o Pago</h3>
            <form onSubmit={handleAddSubscription}>
              
              {/* Nombre ocupa todo el ancho */}
              <div className="form-field full-width">
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={modalData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre de la suscripción"
                  required
                />
              </div>

              {/* Filas para agrupar los campos en columnas */}
              <div className="form-row">
                <div className="form-column">
                  <div className="form-field">
                    <label htmlFor="type">Tipo:</label>
                    <select
                      id="type"
                      name="type"
                      value={modalData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Suscripción en línea">Suscripción en línea</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Tarjetas">Tarjetas</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="value">Valor:</label>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      value={modalData.value}
                      onChange={handleInputChange}
                      placeholder="Monto"
                      required
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-field">
                    <label htmlFor="date">Fecha de cobro:</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={modalData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="periodicidad">Periodicidad:</label>
                    <select
                      id="periodicidad"
                      name="periodicidad"
                      value={modalData.periodicidad}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="buttons-container">
                <button type="submit" className="save-button">Guardar</button>
                <button
                  type="button"
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="subscriptions-list">
        {subscriptions.map((sub, index) => (
          <div key={index} className="subscription-card">
            <div className="card-left">
              <h4>{sub.name}</h4>
              <p>Tipo: {sub.type}</p>
              <p>Valor: ${sub.value}</p>
              <p>Fecha: {sub.date}</p>
              <p>Periodicidad: {sub.periodicidad === 'mensual' ? 'Mensual' : 'Anual'}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteSubscription(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suscripciones;
