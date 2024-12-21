import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Categorias.css';
import { FaTrash } from 'react-icons/fa';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const addCategory = async (categoryName) => {
    console.log('categoryName:', categoryName);  // Verifica el valor de categoryName
    try {
      if (typeof categoryName !== 'string') {
        throw new Error('El nombre de la categoría debe ser una cadena de texto');
      }
  
      if (!categoryName.trim()) {
        throw new Error('El nombre de la categoría no puede estar vacío');
      }
  
      const data = { nombre: categoryName };  
  
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
      console.log(result)
      // Extraer solo el id y el nombre del backend
      const { id, nombre } = result;
      console.log(id)
      // Actualizar el estado con la nueva categoría
      setCategorias((prevCategorias) => [...prevCategorias, { id, nombre }]);
      setNewCategory('');
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const deleteCategory = (categoryName) => {
    const updatedCategories = categorias.filter(category => category.nombre !== categoryName);
    setCategorias(updatedCategories);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/categorias`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        console.log(data);
        setCategorias(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="container my-5">
      <div className="card custom-card shadow-lg border-0">
        <div className="card-header bg-light text-center">
          <h4 className="mb-0 elegant-text">Gestión de Categorías</h4>
        </div>
        <div className="card-body">
          <table className="table table-borderless table-hover">
            <thead className="table-light">
              <tr>
                <th className="text-muted">ID</th>
                <th className="text-muted">Categorías</th>
                <th className="text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((category, index) => (
                <tr key={category.id || index}><td>{category.id}</td><td>{category.nombre}</td><td><button className="btn btn-outline-danger" onClick={() => deleteCategory(category.id)}><FaTrash /></button></td></tr>
              ))}
            </tbody>

          </table>
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-primary elegant-button"
              onClick={() => setShowModal(true)}
            >
              Agregar Categoría
            </button>
            <button
              className="btn btn-outline-danger elegant-button"
              onClick={() => setCategorias([])}
              disabled={categorias.length === 0}
            >
              Eliminar Todas
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title elegant-text">Agregar Nueva Categoría</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control elegant-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nombre de la categoría"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary elegant-button"
                  onClick={() => addCategory(newCategory)}
                  disabled={!newCategory.trim()}
                >
                  Agregar
                </button>

                <button
                  className="btn btn-outline-secondary elegant-button"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
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
