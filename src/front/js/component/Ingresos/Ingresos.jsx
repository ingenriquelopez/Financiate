import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import './Ingresos.css';

function Ingresos() {
  const { store } = useContext(Context);
  const [ingreso, setIngreso] = useState({
    notas: "",
    category: "",
    accountMoney: 0,
    date: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsModalOpen(location.pathname === '/Ingresos');
  }, [location]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIngreso((prevIngreso) => ({ ...prevIngreso, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { accountMoney, notas, category, date } = ingreso;

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/ingreso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: accountMoney,
          descripcion: notas,
          fecha: date,
          usuario_id: store.usuario_id,
          categoria_id: category,
        }),
      });

      if (response.ok) {
        navigate("/Home");
      } else {
        alert("Error al registrar el ingreso");
      }
    } catch (error) {
      console.error("Error al enviar el ingreso:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/Home');
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal-ingreso">
          <div className="modal-contenido">
            <h2 className="fw-bold modal-titulo">INGRESOS</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="notas">Notas:</label>
                <input
                  type="text"
                  name="notas"
                  value={ingreso.notas}
                  onChange={handleChange}
                  placeholder="Razón de Ingreso"
                  required
                />
              </div>

              <div className="form-contenedor">
                <div className="left-column">
                  <div className="form-field">
                    <label htmlFor="accountMoney">Monto:</label>
                    <input
                      type="number"
                      name="accountMoney"
                      value={ingreso.accountMoney}
                      onChange={handleChange}
                      placeholder="Ingresa monto"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="category">Categoría:</label>
                    <select
                      name="category"
                      value={ingreso.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-field">
                    <label htmlFor="date">Fecha:</label>
                    <input
                      type="date"
                      name="date"
                      value={ingreso.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-field buttons-container">
                <button type="submit" className="modal-b fw-bold registrar-button">
                  REGISTRAR
                </button>
                <button type="button" className="modal-b close-button" onClick={handleCloseModal}>
                  CERRAR
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
