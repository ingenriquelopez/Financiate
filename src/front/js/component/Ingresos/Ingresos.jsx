import React, { useState } from 'react';
// import './Ingresos.css';  

function Ingresos() {
  const [accountMoney, setAccountMoney] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState('');
  const [locacion, setLocacion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Categorias select input
  const categories = [
    'Comida y Bebidas',
    'Compras',
    'Freelance',
    'Pasaje',
    'Vehículo',
    'Casa',
    'Recreación',
    'Tecnología y conexión',
    'Salud',
    'Salario'
    
  ];

  const estados = ['Recibido', 'Por recibir'];

  const handleRegistrar = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      accountMoney,
      category,
      date,
      hour,
      notas,
      estado,
      locacion,
    });
    
  };

  return (
    <div>
      <button className='modal-b fw-bold' onClick={() => setIsModalOpen(true)}>INGRESO</button>

      {isModalOpen && (
        <div className="modal-ingreso">
          <div className="modal-contenido">
            <h2 className="fw-bold modal-titulo">INGRESOS</h2>
            <form onSubmit={handleRegistrar} className="account-form">
              <div className="form-field">
                <label htmlFor="accountMoney">Monto:</label>
                <input
                  type="number"
                  id="accountMoney"
                  value={accountMoney}
                  onChange={(e) => setAccountMoney(e.target.value)}
                  placeholder="Ingresa monto en bolívares"
                  required
                />
              </div>

              <div className="form-contenedor">
                <div className="left-column">
                  <div className="form-field">
                    <label htmlFor="category">Categoría:</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="date">Fecha:</label>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="hour">Hora:</label>
                    <input
                      type="time"
                      id="hour"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-field">
                    <label htmlFor="notas">Notas:</label>
                    <input
                      type="text"
                      id="notas"
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="Razón de Ingreso"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="estado">Estado:</label>
                    <select
                      id="estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un estado</option>
                      {estados.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="locacion">Locación:</label>
                    <input
                      type="text"
                      id="locacion"
                      value={locacion}
                      onChange={(e) => setLocacion(e.target.value)}
                      placeholder="Enter location"
                      required
                    />
                  </div>
                </div>
              </div>

              {/*Button registrar */}
              <div className="form-field">
                <button
                  type="submit"
                  className="modal-b fw-bold registrar-button"
                >
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ingresos;