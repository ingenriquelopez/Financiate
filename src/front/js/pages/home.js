import React,{useEffect} from "react";
import Dashboard from '../component/Dashboard/Dashboard.jsx';
import "../../styles/home.css";
import Sidebar from "../component/Sidebar/Sidebar.js";

export const Home = () => {

	useEffect(() => {
		const fetchCategorias = async () => {
		  try {
			// Aquí cambiamos la URL a la ruta de la API 'categorias/default'
			const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/default`, {
			  method: 'POST', // Usamos el método POST como en la API
			  headers: {
				'Content-Type': 'application/json', // Aseguramos que enviamos el tipo de contenido adecuado
			  },
			});
	
			// Verificamos si la respuesta es correcta
			if (!response.ok) {
			  throw new Error('Error al obtener las categorías');
			}
	
			// Convertimos la respuesta en formato JSON
			const result = await response.json();
			console.log(result);
	

		  } catch (error) {
			console.error('Error:', error.message);
		  }
		};
	
		fetchCategorias();
	  }, []); // Este efecto se ejecutará solo una vez al cargar el componente
	
	return (
		<div className="homeContainer text-center">
			<Sidebar className="mt-5"/>
			<Dashboard/> 
			
		</div>
	);
};
