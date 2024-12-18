import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import './Dashboard.css'; // Importar los estilos

const chartWidth = "80%";
const chartHeight = 200;

const Dashboard = (props) => {
    const { store, actions } = useContext(Context);
    const [totales, setTotales] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = props.userId || null; // Reemplazar por la fuente real
    const userEmail = props.userEmail || null; // Reemplazar por la fuente real

    const incomeExpenseColors = ["#82ca9d", "#8884d8"];

    const monthlyData = [
        { month: "Enero", ingresos: 3000, egresos: 2000 },
        { month: "Febrero", ingresos: 4000, egresos: 2500 },
        { month: "Marzo", ingresos: 3500, egresos: 3000 },
        { month: "Abril", ingresos: 4500, egresos: 3200 },
    ];

    const progressValue = 55;

    useEffect(() => {
        const fetchTotales = async () => {
            try {
                setLoading(true);
                
                if (!store.usuario_id) {
                    throw new Error("ID  del usuario requerido");
                }

                const response = await fetch(process.env.BACKEND_URL + `/api/usuario/totales?usuario_id=${store.usuario_id}`);
                console.log(response)
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                const formattedData = [
                    { name: "Ingresos", value: data.total_ingresos },
                    { name: "Egresos", value: data.total_egresos },
                ];

                setTotales(formattedData);
            } catch (err) {
                setError("Error.....",err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTotales();
    }, [userId, userEmail]);

    return (
        <div className="dashboard-container">
            <h3 className="main-title">Dashboard Fináncia+E</h3>

            {loading ? (
                <p className="loading-text">Cargando datos...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : (
                <div className="dashboard">
                    <div className="row justify-content-center mb-4">
                        {/* Gráfico de dona */}
                        <div className="col-md-6 mb-4 dona" >
                            <h4 className="chart-title">Distribución de Ingresos vs Egresos</h4> 
                            <ResponsiveContainer width={chartWidth} height={chartHeight} className="mt-2 respo">
                                
                                <PieChart>
                                    <Pie
                                        data={totales}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={75}
                                        fill="#8884d8"
                                        labelLine={true} // Desactiva la línea del label
                                        label={({ x, y, name, value }) => (
                                            <text
                                            x={x}
                                            y={y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                fill: "#333",
                                                marginTop: "10px",  // Ajusta el margin-top aquí
                                            }}
                                            >
                                            {name}: {value}
                                            </text>
                                        )}
                                                                            >
                                        {totales.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={incomeExpenseColors[index % incomeExpenseColors.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gráfico de líneas */}
                        <div className="col-md-6 mb-4">
                            <h4 className="chart-title">Evolución Mensual de Ingresos y Egresos</h4>
                            <ResponsiveContainer width={chartWidth} height={chartHeight}>
                                <LineChart
                                    data={monthlyData}
                                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                >
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
                        <div className="progress-bar-container" style={{ width: "100%" }}>
                            <div
                                className="progress-bar"
                                style={{
                                    background:
                                        "linear-gradient(to right,hsl(88, 41.40%, 80.60%),rgb(42, 121, 6))",
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
            )}
        </div>
    );
};

export default Dashboard;
