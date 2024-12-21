import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './Categorias.css';
import { FaTrash } from 'react-icons/fa';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ nombre: '', icono: '' });

  // Función para agregar una categoría con nombre e icono
  const addCategory = async () => {
    console.log('newCategory:', newCategory);  // Verifica el valor de newCategory
    try {
      if (typeof newCategory.nombre !== 'string' || typeof newCategory.icono !== 'string') {
        throw new Error('El nombre y el icono de la categoría deben ser cadenas de texto');
      }

      if (!newCategory.nombre.trim()) {
        throw new Error('El nombre de la categoría no puede estar vacío');
      }

      const data = { nombre: newCategory.nombre, icono: newCategory.icono };

      const response = await fetch(`${process.env.BACKEND_URL}/api/categoria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      const result = await response.json();
      console.log(result);
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
      const response = await fetch(`${process.env.BACKEND_URL}/api/categoria`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias`);
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const result = await response.json();
        console.log(result);
        setCategorias(result);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="container text-center">
      {/* Título actualizado */}
      <h2>Gestión de Categorías</h2>

      {/* Tabla de categorías */}
      <div className="table-responsive" style={{ width: 'calc(100% + 100px)' }}>
        <table className="table table-striped table-bordered mt-4 mx-auto">
          <thead>
            <tr>
              {/* Aumento de la columna de Nombre (30%) */}
              <th style={{ width: '13%' }}>ID</th>
              <th style={{ width: '40%' }}>Nombre</th>
              <th style={{ width: '20%' }}>Icono</th>
              <th style={{ width: '30%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>
                  {/* Si el icono es un emoji, simplemente lo mostramos como texto */}
                  <span>{categoria.icono}</span>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteCategory(categoria.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones para Agregar Categoría y Cerrar alineados horizontalmente */}
      <div className="d-flex justify-content-between mb-3">
        {/* Botón Agregar Categoría */}
        <button
          className="btn btn-primary boton-modal"
          onClick={() => setShowModal(true)}
        >
          Agregar Categoría
        </button>

        {/* Botón Cerrar */}
        <button
          className="btn btn-secondary boton-modal"
          onClick={() => setShowModal(false)}
        >
          Cerrar
        </button>
      </div>




      {/* Modal para agregar categoría */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
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
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
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
