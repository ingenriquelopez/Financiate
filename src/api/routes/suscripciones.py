from flask import Blueprint, request, jsonify
from api.models import db, Suscripcion
from api.token_required import token_required
from datetime import date

# Crear el Blueprint para las rutas de suscripciones
suscripciones_bp = Blueprint('suscripciones', __name__)


# ------------------------------------------------------
# Ruta para obtener todas las suscripciones de un usuario
@suscripciones_bp.route('/suscripcion', methods=['GET'])
@token_required
def obtener_suscripciones(payload):
    usuario_id = payload.get('id')
    print(f"[GET] Usuario ID: {usuario_id}")

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    suscripciones = Suscripcion.query.filter_by(usuario_id=usuario_id).all()
    print(f"Suscripciones encontradas: {len(suscripciones)}")

    response = [suscripcion.to_dict() for suscripcion in suscripciones]
    return jsonify(response), 200

# ------------------------------------------------------
# Ruta para crear una nueva suscripción
@suscripciones_bp.route('/suscripcion', methods=['POST'])
@token_required
def crear_suscripcion(payload):
    usuario_id = payload.get('id')

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    data = request.get_json()

    # Validar campos requeridos
    required_fields = ['nombre', 'costo', 'frecuencia', 'fecha_inicio']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    try:
        fecha_inicio = date.fromisoformat(data['fecha_inicio'])
        costo = float(data['costo'])

        if costo <= 0:
            return jsonify({"error": "El costo debe ser mayor a cero"}), 400

        nueva_suscripcion = Suscripcion(
            nombre=data['nombre'],
            costo=data['costo'],
            frecuencia=data['frecuencia'],
            fecha_inicio=data['fecha_inicio'],
            usuario_id=usuario_id
        )

        db.session.add(nueva_suscripcion)
        db.session.commit()
        print(f"Suscripción creada: {nueva_suscripcion.to_dict()}")

        return jsonify({
            "msg": "Suscripción creada exitosamente",
            "suscripcion": nueva_suscripcion.to_dict()
        }), 201

    except ValueError as e:
        print(f"Error en la validación de datos: {e}")
        return jsonify({"error": "Datos inválidos. Verifica el formato."}), 400

    except Exception as e:
        db.session.rollback()
        print(f"Error al crear la suscripción: {e}")
        return jsonify({"error": "Error interno al crear la suscripción"}), 500

# ------------------------------------------------------
# Ruta para actualizar una suscripción existente
@suscripciones_bp.route('/suscripcion/<int:id>', methods=['PUT'])
@token_required
def actualizar_suscripcion(payload, id):
    usuario_id = payload.get('id')

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    data = request.get_json()
    suscripcion = Suscripcion.query.get_or_404(id)

    if suscripcion.usuario_id != usuario_id:
        return jsonify({"error": "No tienes permiso para modificar esta suscripción"}), 403

    if 'nombre' in data:
        suscripcion.nombre = data['nombre']
    if 'costo' in data:
        suscripcion.costo = data['costo']
    if 'frecuencia' in data:
        suscripcion.frecuencia = data['frecuencia']
    if 'fecha_inicio' in data:
        try:
            suscripcion.fecha_inicio = date.fromisoformat(data['fecha_inicio'])
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido. Debe ser YYYY-MM-DD"}), 400

    db.session.commit()
    return jsonify({'msg': 'Suscripción actualizada exitosamente', 'suscripcion': suscripcion.to_dict()}), 200

# ------------------------------------------------------
# Ruta para eliminar una suscripción existente
@suscripciones_bp.route('/suscripcion', methods=['DELETE'])
@token_required
def eliminar_suscripcion(payload):
    usuario_id = payload.get('id')
    
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401
    
    data = request.get_json()  # Aquí obtenemos todo el cuerpo de la solicitud en formato JSON
    idS = data.get('id')  # Extraemos el 'id' del JSON

    suscripcion = Suscripcion.query.get_or_404(idS)

    if suscripcion.usuario_id != usuario_id:
        return jsonify({"error": "No tienes permiso para eliminar esta suscripción"}), 403

    db.session.delete(suscripcion)
    db.session.commit()
    print(f"Suscripción eliminada: ID {id}")
    return jsonify({'msg': 'Suscripción eliminada exitosamente'}), 200

