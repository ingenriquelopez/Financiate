import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import Swal from "sweetalert2";
import "./Fondo.css";

const Fondo = () => {
    const { actions } = useContext(Context);
    const [monto, setMonto] = useState("");
    const [razon, setRazon] = useState("");

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!monto || !razon) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor, completa todos los campos antes de guardar.",
            });
            return;
        }
        const token = localStorage.getItem("token");
        console.log("Token enviado:", token);  // Verificar que el token esté correcto

        try {
            const respuesta = await fetch(`${process.env.BACKEND_URL}/api/fondos_emergencia`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    monto: parseFloat(monto),
                    razon,
                }),
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Tu fondo de emergencias ha sido guardado.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: resultado.msg || "Hubo un error al guardar el fondo. Intenta nuevamente.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema con la conexión al servidor. Intenta más tarde.",
            });
        }

        setMonto("");
        setRazon("");
    };

    return (
        <div className="fondo-container">
            <h2 className="titulo">Fondo de Emergencia</h2>
            <form className="fondo-form" onSubmit={manejarEnvio}>
                <div className="form-group">
                    <label htmlFor="monto" className="form-label">
                        Ingresa el monto deseado como fondo de emergencia
                    </label>
                    <input
                        type="number"
                        id="monto"
                        className="form-input"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder="Ejemplo: 10000"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="razon" className="form-label">
                        Razón del fondo
                    </label>
                    <input
                        type="text"
                        id="razon"
                        className="form-input"
                        value={razon}
                        onChange={(e) => setRazon(e.target.value)}
                        placeholder="Ejemplo: Gastos médicos"
                    />
                </div>

                <button type="submit" className="btn-guardar">
                    Guardar Fondo
                </button>
            </form>
        </div>
    );
};

export default Fondo;
