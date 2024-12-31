import React, { useState, useEffect, useRef } from "react";
import './PlanDeAhorro.css';
import CrearPlanDeAhorro from "./CrearPlanDeAhorro.jsx";
import Detalles from './Detalles.jsx';

const PlanDeAhorro = () => {
  const [plans, setPlans] = useState([]);
  const [showModalCrear, setShowModalCrear] = useState(false);  // Estado independiente para el modal de creación
  const [showModalDetalles, setShowModalDetalles] = useState(false);  // Estado independiente para el modal de detalles
  const [planToEdit, setPlanToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

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
      console.log(data)
      if (isMounted.current) {
        setPlans(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchPlans();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEdit = (plan) => {
    setPlanToEdit(plan);
    setShowModalCrear(true);  // Abre el modal de creación/edición
  };

  const handleDetalles = (plan) => {
    setPlanToEdit(plan);
    setShowModalDetalles(true);  // Abre el modal de detalles
  };

  const handleCloseCrearModal = () => {
    setShowModalCrear(false);  // Cierra el modal de creación/edición
    setPlanToEdit(null);  // Limpia el plan seleccionado para edición
  };

  const handleCloseDetallesModal = () => {
    setShowModalDetalles(false);  // Cierra el modal de detalles
    setPlanToEdit(null);  // Limpia el plan seleccionado para detalles
  };

  const updatePlans = (newPlan) => {
    if (newPlan.id) {
      setPlans(prevPlans => prevPlans.map(plan => plan.id === newPlan.id ? newPlan : plan));
    } else {
      setPlans(prevPlans => [...prevPlans, newPlan]);
    }
    setShowModalCrear(false);  // Cierra el modal después de actualizar
  };

  return (
    <div className="container text-center">
      <h2>Planes de Ahorro</h2>
      <button onClick={() => setShowModalCrear(true)} className="btn btn-primary">Nuevo Plan</button>

      {/* Modal de Crear/Editar Plan */}
      <CrearPlanDeAhorro
        showModal={showModalCrear}
        onClose={handleCloseCrearModal}
        planToEdit={planToEdit}
        updatePlans={updatePlans}
      />

      {/* Modal de Detalles */}
      <Detalles
        plan={planToEdit}
        onClose={handleCloseDetallesModal}
        onEdit={() => handleEdit(planToEdit)}
      />

      {/* Listado de planes */}
      <div className="row mt-4">
        {loading ? (
          <p>Cargando planes...</p>
        ) : (
          plans.map(plan => (
            plan.id ? (
              <div className="col-md-4" key={plan.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{plan.nombre_plan}</h5>
                    <p className="card-text">Monto inicial: {plan.monto_inicial}</p>
                    {/* Botón de "Ver detalles" */}
                    <button onClick={() => handleDetalles(plan)} className="btn btn-outline-primary">Ver detalles</button>
                  </div>
                </div>
              </div>
            ) : null
          ))
        )}
      </div>
    </div>
  );
};

export default PlanDeAhorro;
