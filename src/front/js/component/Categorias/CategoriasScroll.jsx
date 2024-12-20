import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoriasScroll = ({ listaDeCategorias }) => {
    return (
        <div
            className="container my-4"
            style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", borderRadius: "5px" }}
        >
            <ul className="list-group">
                {listaDeCategorias.map((categoria) => (
                    <li key={categoria.id} className="list-group-item">
                        {categoria.nombre}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoriasScroll;