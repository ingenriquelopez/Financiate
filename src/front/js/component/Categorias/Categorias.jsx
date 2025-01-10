import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './Categorias.css';
import { FaTrash } from 'react-icons/fa';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [refreshCategories, setRefreshCategories] = useState(false);  // Nuevo estado de refresco
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ nombre: '', icono: '' });
  const navigate = useNavigate();

  // Función para agregar una categoría con nombre e icono
  const addCategory = async () => {
    try {
      if (typeof newCategory.nombre !== 'string' || typeof newCategory.icono !== 'string') {
        throw new Error('El nombre y el icono de la categoría deben ser cadenas de texto');
      }

      if (!newCategory.nombre.trim()) {
        throw new Error('El nombre de la categoría no puede estar vacío');
      }

      const data = { nombre: newCategory.nombre, icono: newCategory.icono };

      const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/categoria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      const result = await response.json();
      const { id, nombre, icono } = result;
      
      setCategorias((prevCategorias) => [...prevCategorias, { id, nombre, icono }]);
      setNewCategory({ id:'', nombre: '', icono: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Función para eliminar una categoría
  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/categoria`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("No se pudo eliminar la categoría:", errorData.error);

        if (errorData.details) {
          Swal.fire({
            icon: 'warning',
            title: 'No se pudo eliminar la categoría',
            html: `
              <p>${errorData.error}</p>
              <p>Ingresos relacionados: ${errorData.details.ingresos_relacionados}</p>
              <p>Egresos relacionados: ${errorData.details.egresos_relacionados}</p>
            `,
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No se pudo eliminar la categoría',
            text: errorData.error,
          });
        }
        return;
      }

      setCategorias((prevCategorias) =>
        prevCategorias.filter((category) => category.id !== categoryId)
      );

      Swal.fire({
        icon: 'success',
        title: 'Categoría eliminada',
        text: 'La categoría se ha eliminado correctamente.',
      });
    } catch (error) {
      console.error('Error inesperado al eliminar la categoría:', error.message);

      Swal.fire({
        icon: 'warning',
        title: 'Algo salió mal',
        text: 'Hubo un problema al intentar eliminar la categoría.',
      });
    }
  };


  const deleteAllCategories = async () => {
    try {
      // Hacer la solicitud DELETE a la API para eliminar todas las categorías
      const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/eliminartodas`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("No se pudieron eliminar las categorías:", errorData.error);
  
        // Mostrar las categorías comprometidas que no pudieron ser eliminadas
        if (errorData.comprometidas && errorData.comprometidas.length > 0) {
          const compromitidasHtml = errorData.comprometidas.map((categoria) => {
            return `
              <p><strong>${categoria.nombre}</strong></p>
              <p>Ingresos relacionados: ${categoria.ingresos_relacionados}</p>
              <p>Egresos relacionados: ${categoria.egresos_relacionados}</p>
            `;
          }).join("");
  
          Swal.fire({
            icon: 'warning',
            title: 'No se pudieron eliminar algunas categorías',
            html: `
              <p>Las siguientes categorías tienen ingresos o egresos relacionados:</p>
              ${compromitidasHtml}
            `,
          });
        }
        return;
      }
      // Después de eliminar todas las categorías, actualizar el estado para recargar las categorías
      setRefreshCategories(true);
  
  
      // Si todo fue bien, actualizar el estado y mostrar mensaje de éxito
      //setCategorias([]);
      
      Swal.fire({
        icon: 'success',
        title: 'Categorías eliminadas',
        text: 'Las categorías no comprometidas han sido eliminadas correctamente.',
      });
    } catch (error) {
      console.error('Error inesperado al eliminar las categorías:', error.message);
  
      Swal.fire({
        icon: 'warning',
        title: 'Algo salió mal',
        text: 'Hubo un problema al intentar eliminar las categorías.',
      });
    }
  };
  
  
  // Función para manejar el cambio en el formulario
  const handleInputChange = (event) => {
    event.persist(); // Esto permite que el evento sea accesible de manera asincrónica
    const { name, value } = event.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  // Función para cargar las categorías desde la API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('tokenFinanciaE');
        if (!token) {
          throw new Error("Token no disponible");
          }

        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/traertodas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });;

        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }

        const result = await response.json();
        setCategorias(result);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchCategorias();
  }, [refreshCategories]);

  return (
    <div className="container text-center d-flex flex-column align-items-center justify-content-center">
      {/* Título actualizado */}
      <h2>Gestión de Categorías</h2>

      {/* Tabla de categorías */}
      <div className="table-responsive" style={{ width: 'calc(80%)', maxHeight: '400px', overflowY: 'auto' }}>
      <p className = "predeterminadas">⭐ = Predeterminadas</p>
        <table className="table table-striped table-bordered mt-0 mx-auto">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Nombre</th>
              <th style={{ width: '5%' }}>Icono</th>
              <th style={{ width: '10%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}{categoria.is_default ? "⭐":""}</td>
                <td>
                  <span>{categoria.icono}</span>
                </td>
                <td>
                <div className="btn-tooltip-container">
                  <button
                    className="btn btn-danger"
                    aria-disabled={categoria.is_default ? 'true' : 'false'}                    
                     disabled = {categoria.is_default}
                    onClick={() => deleteCategory(categoria.id)}
                  >
                    <FaTrash />
                  </button>
                  {categoria.is_default && (
                    <span className="tooltip">Imposible Eliminar Categorías Predeterminadas</span>
                  )}
                </div>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
  </div>


      {/* Botones para Agregar Categoría y Cerrar alineados horizontalmente */}
      <div className="container mt-3 mb-3">
        <div className="row justify-content-center">
          {/* Botón para eliminar todas las categorías */}
          <div className="col-12 col-sm-4 mb-3">
            <button
              className="btn btn-outline-danger misbotones w-100"
              onClick={deleteAllCategories}
            >
              Eliminar   todas
            </button>
          </div>

          {/* Botón Agregar Categoría */}
          <div className="col-12 col-sm-4 mb-3">
            <button
              className="btn btn-outline-primary misbotones w-100"
              onClick={() => setShowModal(true)}
            >
              Agregar Categoría
            </button>
          </div>

          {/* Botón Cerrar */}
          <div className="col-12 col-sm-4 mb-3">
            <button
              className="btn btn-outline-dark misbotones w-100"
              onClick={() => navigate("/Home")}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>




      {/* Modal para agregar categoría */}
      {showModal && (
        <div className="modal show d-flex flex-column justify-content-center align-items-center" style={{ display: 'block' }}>
          <div className="modal-dialog d-flex flex-column justify-content-center align-items-center">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Categoría</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="category-name">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category-name"
                    name="nombre"
                    value={newCategory.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category-icon">Icono</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category-icon"
                    name="icono"
                    value={newCategory.icono}
                    placeholder='pega aqui tu emoji 😊'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={addCategory}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
