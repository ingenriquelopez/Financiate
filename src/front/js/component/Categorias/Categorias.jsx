import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Categorias.css';
import { FaTrash } from 'react-icons/fa';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    const newId = categorias.length + 1;
    setCategorias([...categorias, { id: newId, name: newCategory }]);
    setNewCategory('');
    setShowModal(false);
  };

  const deleteCategory = (id) => {
    const updatedCategories = categorias.filter(category => category.id !== id);
    setCategorias(updatedCategories);
  };

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
          {categorias.map((category) => (
            <tr key={category.id}>
              <td className="text-secondary">{category.id}</td>
              <td className="text-secondary">{category.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger rounded-circle"
                  onClick={() => deleteCategory(category.id)}
                  title="Eliminar categoría"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
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
              onClick={addCategory}
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
