from flask import Blueprint, request, jsonify
from api.models import db, Suscripcion
from api.token_required import token_required
from datetime import date

# Crear el Blueprint para las rutas de suscripciones
suscripciones_bp = Blueprint('suscripciones', __name__)

# ------------------------------------------------------
# Ruta para obtener todas las suscripciones de un usuario
@suscripciones_bp.route('/suscripciones', methods=['GET'])
@token_required
def obtener_suscripciones(payload):
    """Obtiene todas las suscripciones del usuario autenticado."""
    usuario_id = payload.get('id')  # Acceder al 'id' del usuario

    # Verificar que el usuario_id esté presente en el payload
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    suscripciones = Suscripcion.query.filter_by(usuario_id=usuario_id).all()
    
    return jsonify([{
        'id': s.id,
        'nombre': s.nombre,
        'costo': s.costo,
        'frecuencia': s.frecuencia,
        'fecha_inicio': s.fecha_inicio,
        'usuario_id': s.usuario_id
    } for s in suscripciones]), 200

# ------------------------------------------------------
# Ruta para crear una nueva suscripción
@suscripciones_bp.route('/suscripcion', methods=['POST'])
@token_required
def crear_suscripcion(payload):
    """Crea una nueva suscripción para el usuario autenticado."""
    usuario_id = payload.get('id')  # ID del usuario autenticado

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()

    # Validar campos requeridos
    required_fields = ['nombre', 'costo', 'frecuencia', 'fecha_inicio']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    try:
        # Validar y convertir los datos
        fecha_inicio = date.fromisoformat(data['fecha_inicio'])
        costo = float(data['costo'])

        if costo <= 0:
            return jsonify({"error": "El costo debe ser mayor a cero"}), 400

        # Crear la nueva suscripción
        nueva_suscripcion = Suscripcion(
            nombre=data['nombre'],
            costo=costo,
            frecuencia=data['frecuencia'],
            fecha_inicio=fecha_inicio,
            usuario_id=usuario_id
        )

        # Guardar en la base de datos
        db.session.add(nueva_suscripcion)
        db.session.commit()

        return jsonify({
            "msg": "Suscripción creada exitosamente",
            "suscripcion": nueva_suscripcion.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({"error": f"Error en los datos: {str(e)}"}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Ocurrió un error al crear la suscripción: {str(e)}"}), 500

# ------------------------------------------------------
# Ruta para actualizar una suscripción existente
@suscripciones_bp.route('/suscripcion/<int:id>', methods=['PUT'])
@token_required
def actualizar_suscripcion(payload, id):
    """Actualiza una suscripción existente."""
    usuario_id = payload.get('id')
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    data = request.get_json()
    suscripcion = Suscripcion.query.get_or_404(id)

    if suscripcion.usuario_id != usuario_id:
        return jsonify({"error": "No tienes permiso para modificar esta suscripción"}), 403

    # Actualizar los campos permitidos
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
@suscripciones_bp.route('/suscripcion/<int:id>', methods=['DELETE'])
@token_required
def eliminar_suscripcion(payload, id):
    """Elimina una suscripción existente."""
    usuario_id = payload.get('id')
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    suscripcion = Suscripcion.query.get_or_404(id)

    if suscripcion.usuario_id != usuario_id:
        return jsonify({"error": "No tienes permiso para eliminar esta suscripción"}), 403

    db.session.delete(suscripcion)
    db.session.commit()
    return jsonify({'msg': 'Suscripción eliminada exitosamente'}), 200
