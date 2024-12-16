import React, { useContext } from "react";
import { Context } from "../store/appContext";
import Dashboard from '../component/Dashboard/Dashboard.jsx';
import "../../styles/home.css";
import Sidebar from "../component/Sidebar/Sidebar.js";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="homeContainer text-center mt-5">
			<Sidebar/>
			<Dashboard/>
			
		</div>
	);
};
