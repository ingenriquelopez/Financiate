import React, { useState } from 'react';
import './Categorias.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Función para agregar categoría
  const addCategory = () => {
    const newId = categorias.length + 1;
    setCategorias([...categorias, { id: newId, name: newCategory }]);
    setNewCategory('');
    setShowModal(false);
  };

  // Función para eliminar categoría
  const deleteCategory = (id) => {
    const updatedCategories = categorias.filter(category => category.id !== id);
    setCategorias(updatedCategories);
  };

  return (
    <div className="container">
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Categorías</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <button onClick={() => deleteCategory(category.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button onClick={() => setShowModal(true)}>Agregar</button>
        <button onClick={() => setCategorias([])}>Eliminar todas</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="col-3 modal">
          <div className="modal-content">
            <h3>Agregar Nueva Categoría</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nombre de la categoría"
            />
            <button onClick={addCategory}>Agregar</button>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;