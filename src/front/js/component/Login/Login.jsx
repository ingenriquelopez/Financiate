/*componentes/Login/Login.jsx*/
import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Button, Form, Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import logoFinanciaUrl from "../../../img/LogoFinancia.png";

const iconoSignup =
  "https://png.pngtree.com/png-clipart/20230918/original/pngtree-flat-style-sign-up-icon-with-finger-cursor-on-white-vector-png-image_12377125.png";

const monedas = [
  ["USD", "Dólar estadounidense"],
  ["CAD", "Dólar canadiense"],
  ["MXN", "Peso mexicano"],
  ["BRL", "Real brasileño"],
  ["ARS", "Peso argentino"],
  ["COP", "Peso colombiano"],
  ["PEN", "Nuevo sol peruano"],
  ["CLP", "Peso chileno"],
  ["UYU", "Peso uruguayo"],
  ["VES", "Soberano venezolano"]
];

const Login = () => {
  const [id, setId] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
  const [capital_inicial, setCapital_inicial] = useState('');  // Estado para el valor de capital_inicial
  const [moneda, setMoneda] = useState('');    // Estado para el valor de moneda
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  // Usamos useRef para crear una bandera de montaje
  const isMounted = useRef(true);

  // Cleanup en el useEffect para evitar actualizaciones después del desmontaje
  useEffect(() => {
    return () => {
      isMounted.current = false;  // Marcar como desmontado cuando el componente se desmonte
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lógica para el inicio de sesión
    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();

    // Verifica si el componente sigue montado antes de actualizar el estado
    if (response.ok && data.token) {
      actions.setToken(data.token);
      actions.setCorreo(correo);
      actions.setUsuarioId(data.usuario.id);
      actions.setNombreUsuario(data.usuario.nombre_usuario);
      setId(data.usuario.id);
      console.log(data.usuario.id)

      // Verifica si los valores de capital_inicial o moneda son null
      if (data.usuario.capital_inicial === null || data.usuario.moneda === null) {
        // Si son null, muestra el modal para ingresar los datos
        if (isMounted.current) {
          console.log(data)
          setShowModal(true);
        }
      } else {
        if (isMounted.current) {
          navigate("/Home");  // Si no son null, redirige al usuario a la página privada
        }
      }
    } else {
      alert("Error al iniciar sesión");
    }
  };

  const handleModalSubmit = async () => {
    // Enviar los valores de capital y moneda al backend
    const response = await fetch(process.env.BACKEND_URL + "/api/usuarios", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.token}`,  // Enviamos el token en el encabezado Authorization
      },
      body: JSON.stringify({ id, correo, capital_inicial, moneda })
    });

    const data = await response.json();

    if (response.ok) {
      if (isMounted.current) {
        navigate("/Home");  // Redirige a la página Home
      }
    } else {
      alert("Error al actualizar los datos financieros");
    }

    if (isMounted.current) {
      setShowModal(false);  // Cierra el modal si el componente sigue montado
    }
  };

  return (
    <div className="bgGradient">
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loginForm p-5 shadow-lg animate__animated animate__zoomIn bg-white">
             {/* Imagen de logo arriba del formulario */}
             <div className="text-center mb-4 logoContainer">
              <img 
                src={logoFinanciaUrl} 
                alt="Logo Financia" 
                className="img-fluid"
                style={{ maxHeight: '50px', width: '100%' }} 
              />
            </div>
          <h2 className="text-center mb-5">Login</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 animate__animated animate__pulse">Login
            </Button>
          </Form>

          <div className="text-center mt-4">
            ¿ Aun NO Ya tienes una cuenta ?
            <NavLink to="/signup" className="btn btn-link">
              <img src={iconoSignup} className="iconoSignup" alt="Signup" />
            </NavLink>
          </div>
        </div>
      </Container>

      {/* Modal para ingresar capital inicial y moneda */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        size="lg"
        className="elevated-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Configuración Financiera Inicial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column align-items-center">
            <div className="d-flex justify-content-between w-100 mb-4">
              <Form.Group controlId="formCapital" className="w-50">
                <Form.Label>Capital Inicial</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingresa tu capital inicial"
                  value={capital_inicial}
                  onChange={(e) => setCapital_inicial(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Form.Group>

              <Form.Group controlId="formMoneda" className="w-50 ms-3">
                <Form.Label>Moneda</Form.Label>
                <Form.Control
                  as="select"
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">Selecciona una moneda</option>
                  {monedas.map(([abreviatura, nombre]) => (
                    <option key={abreviatura} value={abreviatura}>
                      {nombre} ({abreviatura})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>

            <Modal.Footer className="w-100 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="w-48">
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleModalSubmit} className="w-48">
                Guardar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
