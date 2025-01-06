import React, { useState, useEffect } from 'react';
import './Suscripciones.css';

function Suscripciones() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    nombre: '',         
    costo: '',          
    frecuencia: 'mensual', 
    fecha_inicio: ''    
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const token = localStorage.getItem('token'); // token se almacena en localStorage
    if (!token) {
      alert("Token no disponible, por favor inicia sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch('/api/suscripciones', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudieron obtener las suscripciones'}`);
        return;
      }

      const data = await response.json();
      setSubscriptions(data); // datos recibidos del backend
    } catch (error) {
      console.error("Error al obtener las suscripciones:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // token guardado
    if (!token) {
      alert("Token no disponible, por favor inicia sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch('/api/suscripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: modalData.nombre,
          costo: parseFloat(modalData.costo),
          frecuencia: modalData.frecuencia,
          fecha_inicio: modalData.fecha_inicio
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo crear la suscripción'}`);
        return;
      }

      const responseData = await response.json();
      setSubscriptions([...subscriptions, responseData.suscripcion]);
      setModalData({ nombre: '', costo: '', frecuencia: 'mensual', fecha_inicio: '' });
      setIsModalOpen(false);
      alert("Suscripción creada exitosamente.");
    } catch (error) {
      console.error("Error al crear la suscripción:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
  };

  const handleDeleteSubscription = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token no disponible, por favor inicia sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch(`/api/suscripcion/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo eliminar la suscripción'}`);
        return;
      }

      alert("Suscripción eliminada exitosamente.");
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Error al eliminar la suscripción:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
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
              
              <div className="form-field full-width">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={modalData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre de la suscripción"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-column">
                  <div className="form-field">
                    <label htmlFor="costo">Costo:</label>
                    <input
                      type="number"
                      id="costo"
                      name="costo"
                      value={modalData.costo}
                      onChange={handleInputChange}
                      placeholder="Monto"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="frecuencia">Frecuencia:</label>
                    <select
                      id="frecuencia"
                      name="frecuencia"
                      value={modalData.frecuencia}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-field">
                    <label htmlFor="fecha_inicio">Fecha de inicio:</label>
                    <input
                      type="date"
                      id="fecha_inicio"
                      name="fecha_inicio"
                      value={modalData.fecha_inicio}
                      onChange={handleInputChange}
                      required
                    />
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
        {subscriptions.map((sub) => (
          <div key={sub.id} className="subscription-card">
            <div className="card-left">
              <h4>{sub.nombre}</h4>
              <p>Valor: ${sub.costo}</p>
              <p>Frecuencia: {sub.frecuencia === 'mensual' ? 'Mensual' : 'Anual'}</p>
              <p>Fecha de inicio: {new Date(sub.fecha_inicio).toLocaleDateString()}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteSubscription(sub.id)}
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
