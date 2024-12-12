import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Egresos.css';

function Egresos() {
  const [egreso, setEgreso] = useState({
    descripcion: '',
    categoria: '',
    monto: 0,
  });

  const handleChange = (event) => {
    setEgreso({ ...egreso, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí es donde se va a mandar todo al back
    console.log(egreso); // Esto es solo para ver en la consola
  };

  return (
    <div className="bgGradient">
    <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="card-custom">
            <form onSubmit={handleSubmit}>
            <label>
                Descripción:
                <input type="text" name="descripcion" value={egreso.descripcion} onChange={handleChange} />
            </label>
            <label>
                Categoría:
                <select name="categoria" value={egreso.categoria} onChange={handleChange}>
                    <option value="comida">Comida</option>
                    <option value="transporte">Transporte</option>
                    <option value="recreación">Recreación</option>
                    {/* Agrega más opciones de categoría */}
                </select>
            </label>
            <label>
                <input type="number" name="monto" value={egreso.monto} onChange={handleChange} />
            </label>
            <Button variant="primary" type="submit">
                Registrar Egreso
            </Button>
    </form>
    </div>
    </Container>
    </div>
  );
}

export default Egresos;