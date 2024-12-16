import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home5.css";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import logof from './LogoFinancia.png';

const Home5 = () => {
  const incomeExpenseData = [
    { name: "Ingresos", value: 4000 },
    { name: "Egresos", value: 3000 },
  ];

  const incomeExpenseColors = ["#82ca9d", "#8884d8"];

  const monthlyData = [
    { month: "Enero", ingresos: 3000, egresos: 2000 },
    { month: "Febrero", ingresos: 4000, egresos: 2500 },
    { month: "Marzo", ingresos: 3500, egresos: 3000 },
    { month: "Abril", ingresos: 4500, egresos: 3200 },
  ];

  const progressValue = 75;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        
        <img src={logof} alt="Logo" />
        <hr />
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <span className="d-flex align-items-center">
              <span className="me-2">👤</span>
              <span>rdvn.halir@hotmail.com</span>
            </span>
          </li>
          <li className="nav-item">
            <a href="#notificaciones" className="nav-link">
              🔔 Notificaciones
            </a>
          </li>
          <li className="nav-item">
            <a href="#transacciones" className="nav-link">
              💸 Transacciones
            </a>
          </li>
          <ul className="submenu">
            <li className="nav-item">
              <a href="#ingresos" className="nav-link">
                ➕ Ingresos
              </a>
            </li>
            <li className="nav-item">
              <a href="#egresos" className="nav-link">
                ➖ Egresos
              </a>
            </li>
          </ul>
          <li className="nav-item">
            <a href="#planes-ahorro" className="nav-link">
              🏦 Planes de ahorro
            </a>
          </li>
          <li className="nav-item">
            <a href="#suscripciones" className="nav-link">
              ☁️ Suscripciones
            </a>
          </li>
          <li className="nav-item">
            <a href="#reportes" className="nav-link">
              📊 Reportes
            </a>
          </li>
          <li className="nav-item">
            <a href="#alertas" className="nav-link">
              🚨 Alertas
            </a>
          </li>
          <hr />
          <li className="nav-item mt-auto">
            <a href="#logout" className="nav-link">
              🔓 Logout
            </a>
          </li>
          <li className="nav-item">
            <a href="#acerca-de" className="nav-link">
              ℹ️ Acerca de
            </a>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="content">
        <h1>Bienvenido a Fináncia+E</h1>
        <p>Asi van las cosas...</p>

        <div className="dashboard">
          {/* Gráficas alineadas horizontalmente */}
          <div className="row justify-content-center mb-4">
            {/* Gráfico de dona */}
            <div className="col-md-6 mb-3">
              <h3>Distribución de Ingresos vs Egresos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeExpenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {incomeExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={incomeExpenseColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de líneas */}
            <div className="col-md-6 mb-3">
              <h3>Evolución Mensual de Ingresos y Egresos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="egresos" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="progress-container">
            <h3>Progreso de Meta</h3>
            <div
              className="progress-bar"
              style={{
                background: "linear-gradient(to right, #a8e063, #56ab2f)",
              }}
            >
              <div
                className="progress-fill"
                style={{
                  width: `${progressValue}%`,
                }}
              ></div>
            </div>
            <p className="progress-text">{progressValue}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home5;
