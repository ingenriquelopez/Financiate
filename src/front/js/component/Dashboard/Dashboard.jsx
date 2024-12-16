import React from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import './Dashboard.css'; // Importar los estilos

const chartWidth = "80%";
const chartHeight = 200;

const Dashboard = () => {
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
        <div className="dashboard-container">
            <h3 className="main-title">Dashboard Fináncia+E</h3>

            <div className="dashboard">
                {/* Gráficas alineadas horizontalmente */}
                <div className="row justify-content-center mb-4">
                    {/* Gráfico de dona */}
                    <div className="col-md-6 mb-4">
                        <h4 className="chart-title">Distribución de Ingresos vs Egresos</h4>
                        <ResponsiveContainer width={chartWidth} height={chartHeight}>
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
                    <div className="col-md-6 mb-4">
                        <h4 className="chart-title">Evolución Mensual de Ingresos y Egresos</h4>
                        <ResponsiveContainer width={chartWidth} height={chartHeight}>
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
                    <h4 className="chart-title">Progreso de Meta</h4>
                    <div className="progress-bar-container">
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

export default Dashboard;
