import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const EliminarPlanDeAhorro = ({ plan, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(true); // Flag para saber si el componente sigue montado

  useEffect(() => {
    // Marcar el componente como montado cuando se monta
    setIsMounted(true);

    // Cleanup function que marca el componente como desmontado
    return () => {
      setIsMounted(false); // Cuando el componente se desmonta, actualiza el flag
    };
  }, []);

  const handleEliminar = async () => {
    if (!plan || !plan.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/eliminar_plan_ahorro", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
          },
        body: JSON.stringify({ plan_ahorro_id: plan.id }),
      });

      if (response.ok) {
        // Solo actualiza el estado si el componente sigue montado
        if (isMounted) {
          onClose();
          alert("Plan eliminado exitosamente");
        }
      } else {
        // Si el componente está montado, muestra el error
        if (isMounted) {
          setError("Error al eliminar el plan de ahorro.");
        }
      }
    } catch (err) {
      // Si el componente está montado, muestra el error
      if (isMounted) {
        setError("Hubo un error al intentar eliminar el plan.");
      }
    } finally {
      // Solo cambia el estado si el componente sigue montado
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Plan de Ahorro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar el plan de ahorro:{" "}
          <strong>{plan?.nombre_plan}</strong>?
        </p>
        <p className="text-danger">
          Este paso no puede deshacerse. Asegúrate de que deseas proceder.
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EliminarPlanDeAhorro;
