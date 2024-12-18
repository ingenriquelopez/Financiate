import React, { useState, useContext, useEffect } from 'react';
import './Ingresos.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';


function Ingresos() {
  const { store, actions } = useContext(Context);
  const [ingreso, setIngreso] = useState({
    notas: "",
    category: "",
    accountMoney: 0,
    date: "",
  });
  const [accountMoney, setAccountMoney] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  // const [hour, setHour] = useState('');
  const [notas, setNotas] = useState('');
  // const [estado, setEstado] = useState('');
  const [locacion, setLocacion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Este efecto se ejecutará cada vez que la ruta cambie
  useEffect(() => {
    if (location.pathname === '/Ingresos') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  // Categorias select input
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/api/categorias");
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
  // const categories = [
  //   'Comida y Bebidas',
  //   'Compras',
  //   'Freelance',
  //   'Pasaje',
  //   'Vehículo',
  //   'Casa',
  //   'Recreación',
  //   'Tecnología y conexión',
  //   'Salud',
  //   'Salario'
  // ];

  // const estados = ['Recibido', 'Por recibir'];
  const handleChange = (event) => {
    setIngreso({ ...ingreso, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { accountMoney, notas, category } = ingreso;
    const usuario_id = store.usuario_id;
    console.log(accountMoney)
    console.log(category)
    console.log(notas)
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/ingreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: accountMoney,
          descripcion: notas,
          usuario_id,
          categoria_id: category
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

  // const handleRegistrar = (e) => {
  //   e.preventDefault();
  //   // Handle form submission
  //   console.log({
  //     accountMoney,
  //     category,
  //     date,
  //     // hour,
  //     notas,
  //     // estado,
  //     // locacion,
  //   });
  // };

  // Función para cerrar el modal y redirigir al Home
  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
    navigate('/Home'); // Redirige a la ruta /Home
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
                  {/* Colocamos Monto encima de Categoría */}
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
                      as="select"
                      name="category"
                      value={ingreso.category}
                      onChange={handleChange}
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
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  {/* <div className="form-field">     ------------------estado por recibir y recibido
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
                  </div> */}

                  {/* <div className="form-field">
                    <label htmlFor="locacion">Locación:</label>
                    <input
                      type="text"
                      id="locacion"
                      value={locacion}
                      onChange={(e) => setLocacion(e.target.value)}
                      placeholder="Enter location"
                      required
                    />
                  </div> */}
                </div>
              </div>

              {/* Botones */}
              <div className="form-field buttons-container">
                <button
                  type="submit"
                  className="modal-b fw-bold registrar-button"
                >
                  REGISTRAR
                </button>

                {/* Botón de Cerrar Modal */}
                <button
                  type="button"
                  className="modal-b close-button"
                  onClick={handleCloseModal} // Llamamos a la función para cerrar y redirigir
                >
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