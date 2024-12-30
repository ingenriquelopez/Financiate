import React, { useState, useEffect } from "react";
import './PlanDeAhorro.css';

const PlanDeAhorro = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    fecha_inicio: "",
    monto_inicial: "",
    fecha_objetivo: "",
    monto_objetivo: "",
  });

  // Fetch savings plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/plandeahorro/traerplan`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
          },
        });
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, [plans]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Open modal to add or edit
  const handleOpenModal = (plan = null) => {
    setCurrentPlan(plan);
    if (plan) {
      setFormData({
        descripcion: plan.descripcion || "",
        fecha_inicio: plan.fecha_inicio ? plan.fecha_inicio.slice(0, 10) : "",
        monto_inicial: plan.monto_inicial || "",
        fecha_objetivo: plan.fecha_objetivo ? plan.fecha_objetivo.slice(0, 10) : "",
        monto_objetivo: plan.monto_objetivo || "",
        
      });
      
    } else {
      setFormData({
        descripcion: "",
        fecha_inicio: "",
        monto_inicial: "",
        fecha_objetivo: "",
        monto_objetivo: "",
      });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPlan(null);
  };

  // Handle save (add or edit)
  const handleSave = async () => {
    try {
      const url = currentPlan 
        ? `${process.env.BACKEND_URL}/api/plandeahorro/editarplan` 
        : `${process.env.BACKEND_URL}/api/plandeahorro/agregarplan`;
      
      const method = currentPlan ? "PUT" : "POST";
      
      const bodyData = currentPlan 
        ? { ...formData, id: currentPlan.id } // Incluir ID solo para edición
        : formData;

  
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('tokenFinanciaE')}` 
        },
        body: JSON.stringify(bodyData),
      });
  
      if (!response.ok) {
        alert("Error al guardar el plan.");
        return;
      }
  
      const updatedPlan = await response.json();
   
      if (currentPlan) {
        // Actualizar el plan en la lista
        setPlans((prev) =>
          prev.map((plan) => (plan.id === currentPlan.id ? updatedPlan.nuevoPlan : plan))
        );
      } else {
        // Agregar un nuevo plan
        setPlans((prev) => [...prev, updatedPlan.nuevoPlan]);
      }
  
      handleCloseModal();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };
  

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const url = `${process.env.BACKEND_URL}/api/plandeahorro/eliminarplan`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('tokenFinanciaE')}` 
        },
        body: JSON.stringify({id}),
      });
      if (response.ok) {
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Gestión de Planes de Ahorro</h2>
      <button onClick={() => handleOpenModal()} className="btn btn-primary mb-3">
        Crear Plan de Ahorro
      </button>
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Fecha Inicio</th>
            <th>Monto Inicial</th>
            <th>Fecha Objetivo</th>
            <th>Monto objetivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              plan && plan.id ? ( // Verifica que el objeto 'plan' no sea undefined y tenga la propiedad 'id'
                <tr key={plan.id}>
                  <td>{plan.descripcion}</td>
                  <td>{plan.fecha_inicio ? plan.fecha_inicio.slice(0, 10) : "Sin fecha"}</td>
                  <td>{plan.monto_inicial}</td>
                  <td>{plan.fecha_objetivo ? plan.fecha_objetivo.slice(0, 10) : "Sin fecha"}</td>
                  <td>{plan.monto_objetivo}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleOpenModal(plan)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(plan.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ) : null // Si no hay un 'id' válido, no renderiza nada
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay planes disponibles</td>
            </tr>
          )}
        </tbody>

      </table>

      {/* Modal */}
      <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" 
          style={{ display: showModal ? "block" : "none" }} aria-labelledby="planModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="planModalLabel">{currentPlan ? "Editar Plan" : "Agregar Plan"}</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="monto_inicial" className="form-label">Monto Inicial</label>
                    <input
                      type="number"
                      className="form-control"
                      id="monto_inicial"
                      name="monto_inicial"
                      value={formData.monto_inicial}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_inicio"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="monto_objetivo" className="form-label">Monto objetivo</label>
                    <input
                      type="number"
                      className="form-control"
                      id="monto_objetivo"
                      name="monto_objetivo"
                      value={formData.monto_objetivo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fecha_objetivo" className="form-label">Fecha Objetivo</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_objetivo"
                      name="fecha_objetivo"
                      value={formData.fecha_objetivo}
                      onChange={handleChange}
                    />
                  </div>
                 
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDeAhorro;
