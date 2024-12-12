import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Importar NavLink
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import LogoFinanciaUrl from "img/LogoFinancia.png";
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Lógica para el registro
    console.log('Registro exitoso:', { username, email, password });
  };

  return (
    <div className="bgGradient">
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">

        <div className="loginForm p-5 shadow-lg bg-white">
          <div className="text-center mb-4">
            {/* <img src={LogoFinanciaUrl} className="logoF" alt="Logo Financia" /> */}
            {/* <img src="/img/LogoFinancia.png" alt="Logo Financia" /> */}
          </div>
          <h2 className="text-center mb-5">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername" className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="contraseña (maximo 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-4">
            ¿Ya tienes una cuenta?
            <NavLink to="/" className="btn btn-link">
               Login
            </NavLink>
            
            
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
