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

    const fetchSubscriptions = async () => {
        const token = localStorage.getItem('tokenFinanciaE');
        console.log("Token enviado:", token);

        if (!token) {
            alert("Token no disponible. Redirigiendo a la página de inicio de sesión...");
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('https://effective-train-7vpj6676q742x9jg-3000.app.github.dev/suscripciones', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                }
            });

            console.log("Estado HTTP:", response.status);

            if (!response.ok) {
                const errorText = await response.text(); // Leer texto en caso de error
                console.error("Error del servidor:", errorText);
                alert("Error: No se pudieron obtener las suscripciones. Verifica los datos.");
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log("Datos devueltos por el servidor:", data);
                setSubscriptions(data);
            } else {
                console.warn("Respuesta vacía o no es JSON.");
                setSubscriptions([]); // Manejar respuesta vacía
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error.message);
            alert("Ocurrió un error al conectar con el servidor.");
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

        const token = localStorage.getItem('tokenFinanciaE');
        console.log("Token enviado para agregar suscripción:", token);

        if (!token) {
            alert("Token no disponible. Redirigiendo a la página de inicio de sesión...");
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('https://effective-train-7vpj6676q742x9jg-3000.app.github.dev/suscripcion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
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
        const token = localStorage.getItem('tokenFinanciaE');

        if (!token) {
            alert("Token no disponible. Redirigiendo a la página de inicio de sesión...");
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`https://effective-train-7vpj6676q742x9jg-3000.app.github.dev/suscripcion/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'No se pudo eliminar la suscripción'}`);
                return;
            }

            alert("Suscripción eliminada exitosamente.");
            setSubscriptions(subscriptions.filter(sub => sub.id !== id));
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

