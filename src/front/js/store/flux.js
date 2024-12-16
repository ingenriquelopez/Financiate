const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || undefined, // Recupera el token del localStorage al cargar la app
			nombreUsuario:null,
			correo:null,
			message: null,
		},
		actions: {
			setToken: (token) => {
				localStorage.setItem("tokenFinanciaE", token); // Guarda el token en localStorage
				setStore({ token }); // Guarda el token,correo y nombreUsuario en el store global
			  },
			  setCorreo: (correo) => {
				localStorage.setItem("correo", correo); // Guarda el correo en localStorage
				setStore({ correo }); // Guarda el correo en el store global
			  },
			  setNombreUsuario: (nombreUsuario) => {
				console.log(nombreUsuario)
				localStorage.setItem("nombreUsuario", nombreUsuario); 
				setStore({ nombreUsuario }); // Guarda el nombre de usuairo en el store global
			  },

			logout: () => {
				localStorage.removeItem("tokenFinanciaE"); // Elimina el token del localStorage
				setStore({ token: null }); // Limpia el token y el email en el store global

				localStorage.removeItem("correo"); // Elimina el correo del localStorage
				setStore({ correo: null }); // Limpia el correo en el store global

				localStorage.removeItem("nombreUsuario"); // Elimina el nombreUsuario del localStorage
				setStore({ nombreUsuario: null }); // Limpia el nombreUsuario en el store global
			},
		}
	};
};

export default getState;
