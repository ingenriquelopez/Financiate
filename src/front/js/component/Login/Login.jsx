import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoFinanciaUrl from "../../../img/LogoFinancia.png";

import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic for login/signup
  };

  return (
    <div className="bgGradient">
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">

        {/* Contenedor del formulario con fondo blanco */}
        <div className="loginForm p-5 shadow-lg animate__animated animate__zoomIn bg-white">
           {/* Contenedor para el logo dentro del formulario */}
           <div className="text-center mb-4">
            <img src={LogoFinanciaUrl} className="logoF" alt="Logo Financia" />
          </div>
          <h2 className="text-center mb-5">{isSignup ? 'Sign Up' : 'Login'}</h2>

          <Form onSubmit={handleSubmit}>
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
                placeholder="Ingresa tu Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {isSignup && (
              <Form.Group controlId="formConfirmPassword" className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirma tu Contraseña"
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit" className="w-100 animate__animated animate__pulse">
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <Button variant="link" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Ya tienes cuenta ? Login' : 'Aun NO tienes cuenta ? Sign Up'}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
