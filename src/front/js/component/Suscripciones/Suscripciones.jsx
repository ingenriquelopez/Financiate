import React, { useState, useEffect, useRef } from 'react';
import './Suscripciones.css';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Importa el estilo de flatpickr

function Suscripciones() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carga
    const isMounted = useRef(true);
    const [error, setError] = useState(false);
    
    
    const [modalData, setModalData] = useState({
        nombre: '',
        costo: '',
        frecuencia: 'mensual',
        fecha_inicio: ''
    });

            
    const fetchSubscriptions = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/suscripciones/suscripcion`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                },
              });


            if (!response.ok) {
                const errorText = await response.text(); // Leer texto en caso de error
                console.error("Error del servidor:", errorText);
                alert("Error: No se pudieron obtener las suscripciones. Verifica los datos.");
                return;
            }

            const data = await response.json();
            
            if (isMounted.current) {
                setSubscriptions(data);
                setLoading(false); // Cambiar el estado de carga a falso una vez que se reciban las suscripciones
            }
            } catch (error) {
                console.error('Error fetching suscripciones:', error);
                setLoading(false); // En caso de error, también se cambia el estado de carga
            }         
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModalData({ ...modalData, [name]: value });
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();

        try {
            const url = `${process.env.BACKEND_URL}/api/suscripciones/suscripcion`;
            console.log(url)
      
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
              },
              body: JSON.stringify({
                ...modalData,
              }),
            });
      
            if (!response.ok) {
              alert("Error al guardar la suscripcioon.");
              return;
            }
      
            const data = await response.json();
      
            Swal.fire({
              title: "Suscripcion  Guardado Correctamente",
              icon: "success",
            });

            setSubscriptions([...subscriptions, data.suscripcion]);
            setModalData({ nombre: '', costo: '', frecuencia: 'mensual', fecha_inicio: '' });
            setIsModalOpen(false);
      
          } catch (error) {
            console.error('Error guardando la suscripcion:', error);
            alert('Error al guardar la suscripcion.');
          }

    };

    const handleDeleteSubscription = async (id) => {
        setLoading(true); // Asegurarse de que el estado de carga sea verdadero mientras se realiza la eliminación
    
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/suscripciones/suscripcion`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                },
                body: JSON.stringify({ id }),
            });
    
            if (response.ok) {
                Swal.fire("Deleted!", "Tu Suscripción ha sido eliminada.", "success");
    
                // Actualizar el estado de las suscripciones de manera segura usando la función de actualización basada en el estado anterior
                setSubscriptions((prevSubscriptions) => 
                    prevSubscriptions.filter(sub => sub.id !== id)
                );
                setIsModalOpen(false);
            } else {
                setError("Error al eliminar la suscripción.");
                Swal.fire("Error", "No se pudo eliminar la suscripción.", "error");
            }
        } catch (err) {
            setError("Hubo un error al intentar eliminar la suscripción.");
            Swal.fire("Error", "Hubo un problema al eliminar la suscripción.", "error");
        } finally {
            setLoading(false); // Asegurarse de que el estado de carga se actualice independientemente del resultado
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
                            <div className="form-field">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={modalData.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="costo">Costo:</label>
                                <input
                                    type="number"
                                    id="costo"
                                    name="costo"
                                    value={modalData.costo}
                                    onChange={handleInputChange}
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
                            <div className="form-field">
                                <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
                                <input
                                    type="date"
                                    id="fecha_inicio"
                                    name="fecha_inicio"
                                    value={modalData.fecha_inicio}
                                    onChange={handleInputChange}
                                    required
                                />
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
                {subscriptions.map(sub => (
                    <div key={sub.id} className="subscription-card">
                        <div className="card-left">
                            <h4>{sub.nombre}</h4>
                            <p>Costo: ${sub.costo.toFixed(2)}</p>
                            <p>Frecuencia: {sub.frecuencia}</p>
                            <p>Fecha de Inicio: {sub.fecha_inicio}</p>
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

