import React from "react";
import Dashboard from '../component/Dashboard/Dashboard.jsx';
import "../../styles/home.css";
import Sidebar from "../component/Sidebar/Sidebar.js";

export const Home = () => {
	
	return (
		<div className="homeContainer text-center mt-5">
			<Sidebar/>
			<Dashboard/>
			
		</div>
	);
};
