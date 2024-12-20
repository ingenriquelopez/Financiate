import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Egresos.css";
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';

function Egresos() {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [egreso, setEgreso] = useState({
    description: "",
    category: "",
    amount: 0,
    fecha: "",
  });

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

  const handleChange = (event) => {
    setEgreso({ ...egreso, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { amount, description, fecha, category } = egreso;
    const usuario_id = store.usuario_id;

    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/egreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: amount,
          descripcion: description,
          fecha,
          usuario_id,
          categoria_id: category
        }),
      });

      if (response.ok) {
        navigate("/Home");
      } else {
        alert("Error al registrar el egreso");
      }
    } catch (error) {
      console.error("Error al enviar el egreso:", error);
    }
  };

  return (
    <div className="bgGradient vh-100 d-flex justify-content-center align-items-center">
      <div className="card-custom text-white">
        <h2 className="text-center">Egreso</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="description">
                <Form.Label>Razón del egreso</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={egreso.description}
                  onChange={handleChange}
                  placeholder="Escribe la razón"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="monto">
                <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={egreso.amount}
                  onChange={handleChange}
                  placeholder="Ej. 500"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="categoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={egreso.category}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={egreso.fecha}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Button variant="primary" type="submit">
                Añadir Egreso
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Egresos;

