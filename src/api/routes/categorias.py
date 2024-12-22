# api/routes/categorias.py
from flask import Blueprint, request, jsonify
from api.models import db, Categoria, Ingreso, Egreso

categorias_bp = Blueprint('categorias', __name__)


@categorias_bp.route('/categorias', methods=['GET'])
def listar_categorias():
    # Ordeno categorías por 'nombre' de forma ascendente
    categorias = Categoria.query.order_by(Categoria.nombre.asc()).all()
    return jsonify([{
        'id': e.id,
        'nombre': e.nombre,
        'icono':e.icono
    } for e in categorias]), 200


# Ruta para crear una nueva categoría
@categorias_bp.route('/categoria', methods=['POST'])
#@jwt_required()  # Si deseas que solo los usuarios autenticados puedan agregar categorías
def crear_categoria():
    data = request.get_json()  # Obtener los datos enviados en el cuerpo de la solicitud
    print(data);
    # Validar que los datos necesarios estén presentes
    if not data or 'nombre' not in data:
        return jsonify({'msg': 'El nombre de la categoría es obligatorio'}), 400

    # Verificar si ya existe una categoría con el mismo nombre
    if Categoria.query.filter_by(nombre=data['nombre']).first():
        return jsonify({'msg': 'La categoría ya existe'}), 400

    # Crear la nueva categoría
    nueva_categoria = Categoria(
        nombre=data['nombre'],
        icono = data['icono']
    )
    
    # Agregarla a la base de datos
    db.session.add(nueva_categoria)
    db.session.commit()

    # Retornar el ID de la nueva categoría
    return jsonify({'msg': 'Categoría creada exitosamente', 'id': nueva_categoria.id,"nombre":nueva_categoria.nombre,"icono":nueva_categoria.icono}), 201

#---------------------------------------------------
@categorias_bp.route('/categoria', methods=['DELETE'])
def eliminar_categoria():
    # Verificar si la categoría existe
    data = request.get_json()
    id= data['id'] 
    categoria = Categoria.query.get(id)
    
    if not categoria:
        return jsonify({"error": "Categoría no encontrada"}), 404

    # Verificar si la categoría está relacionada con algún ingreso o egreso
    ingresos_relacionados = Ingreso.query.filter_by(categoria_id=id).count()
    egresos_relacionados = Egreso.query.filter_by(categoria_id=id).count()

    if ingresos_relacionados > 0 or egresos_relacionados > 0:
            return jsonify({
                "error": "La categoría está relacionada con ingresos o egresos.",
                "details": {
                    "ingresos_relacionados": ingresos_relacionados,
                    "egresos_relacionados": egresos_relacionados
                }
            }), 400

    # Eliminar la categoría si no está relacionada
    db.session.delete(categoria)
    db.session.commit()

    return jsonify({"message": "Categoría eliminada correctamente"}), 200

#----------------------------------------------------
@categorias_bp.route('/categorias', methods=['DELETE'])
def eliminar_todas_las_categorias():
    try:
        # Obtener todas las categorías
        categorias = Categoria.query.all()

        if not categorias:
            return jsonify({"error": "No hay categorías para eliminar."}), 404

        # Filtrar las categorías no comprometidas
        categorias_no_comprometidas = []
        categorias_comprometidas = []

        for categoria in categorias:
            ingresos_relacionados = Ingreso.query.filter_by(categoria_id=categoria.id).count()
            egresos_relacionados = Egreso.query.filter_by(categoria_id=categoria.id).count()

            if ingresos_relacionados == 0 and egresos_relacionados == 0:
                categorias_no_comprometidas.append(categoria)
            else:
                categorias_comprometidas.append({
                    "id": categoria.id,
                    "nombre": categoria.nombre,
                    "ingresos_relacionados": ingresos_relacionados,
                    "egresos_relacionados": egresos_relacionados
                })

        # Eliminar las categorías no comprometidas
        for categoria in categorias_no_comprometidas:
            db.session.delete(categoria)

        db.session.commit()

        # Verificar si la tabla está vacía
        categorias_count = db.session.execute('SELECT COUNT(*) FROM categorias').scalar()
        if categorias_count == 0:
            # Resetear el contador de ID para la secuencia en PostgreSQL
            db.session.execute('ALTER SEQUENCE categorias_id_seq RESTART WITH 1;')
            db.session.commit()

        return jsonify({
            "message": f"{len(categorias_no_comprometidas)} categorías eliminadas correctamente.",
            "comprometidas": categorias_comprometidas
        }), 200

    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

#---------------------------------------------------


@categorias_bp.route('/categorias/default', methods=['POST'])
#@jwt_required()  # Puedes quitar el decorador jwt_required si no es necesario
def insertar_categorias_por_defecto():

    # Comprobar si la tabla de categorías está vacía
    if Categoria.query.count() > 0:
        return jsonify({"msg": "Las categorías ya existen en la base de datos"}), 200
    
    # Definir las categorías de ingresos y egresos con sus iconos, colores y nombres
    categorias = [
    # Categorías de ingresos
    {'nombre': 'Salario', 'icono': '💼', 'color': '#4CAF50'},
    {'nombre': 'Freelance / Trabajo Independiente', 'icono': '🧑‍💻', 'color': '#2196F3'},
    {'nombre': 'Inversiones', 'icono': '💸', 'color': '#FFC107'},
    {'nombre': 'Ventas / Comercio', 'icono': '🛒', 'color': '#FF5722'},
    {'nombre': 'Ingreso Extraordinario', 'icono': '📈', 'color': '#8BC34A'},
    {'nombre': 'Consultoría', 'icono': '📊', 'color': '#00BCD4'},
    {'nombre': 'Venta de Productos', 'icono': '🛍️', 'color': '#3F51B5'},
    {'nombre': 'Rendimientos Bancarios', 'icono': '🏦', 'color': '#795548'},

    # Categorías de egresos
    {'nombre': 'Alquiler', 'icono': '🏠', 'color': '#FFC107'},
    {'nombre': 'Transporte', 'icono': '🚗', 'color': '#00BCD4'},
    {'nombre': 'Salud', 'icono': '🩺', 'color': '#4CAF50'},
    {'nombre': 'Educación', 'icono': '🎓', 'color': '#2196F3'},
    {'nombre': 'Entretenimiento', 'icono': '🎬', 'color': '#9C27B0'},
    {'nombre': 'Gastos Varios', 'icono': '📦', 'color': '#8BC34A'},
    {'nombre': 'Comida', 'icono': '🍽️', 'color': '#FF9800'},
    {'nombre': 'Seguros', 'icono': '🛡️', 'color': '#607D8B'},
    {'nombre': 'Cuidado Personal', 'icono': '💅', 'color': '#795548'}
]

    # Insertar las categorías en la base de datos
    try:
        for categoria in categorias:
            print(categoria)
            nueva_categoria = Categoria(
                nombre=categoria['nombre'],
                icono=categoria['icono']
            )
            db.session.add(nueva_categoria)
           
        db.session.commit()


        return jsonify({"msg": "Categorías insertadas exitosamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Hubo un error al insertar las categorías", "details": str(e)}), 500