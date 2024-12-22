from flask import Blueprint, request, jsonify
from api.models import db, Suscripcion
from flask_jwt_extended import jwt_required

suscripciones_bp = Blueprint('suscripciones', __name__)


# CRUD para Suscripciones
@suscripciones_bp.route('/suscripciones', methods=['GET'])
#@jwt_required()
def obtener_suscripciones():
    """Obtiene todas las suscripciones del usuario autenticado."""
    usuario_id = request.args.get('usuario_id')
    if not usuario_id:
        return jsonify({'msg': 'Usuario no especificado'}), 400

    suscripciones = Suscripcion.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([{
        'id': s.id,
        'nombre': s.nombre,
        'costo': s.costo,
        'frecuencia': s.frecuencia,
        'fecha_inicio': s.fecha_inicio,
        'usuario_id': s.usuario_id
    } for s in suscripciones]), 200


@suscripciones_bp.route('/suscripcion', methods=['POST'])
#@jwt_required()
def crear_suscripcion():
    """Crea una nueva suscripción para el usuario autenticado."""
    data = request.get_json()
    if not data or not all(k in data for k in ('nombre', 'costo', 'frecuencia', 'fecha_inicio','usuario_id')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    nueva_suscripcion = Suscripcion(
        nombre=data['nombre'],
        costo=data['costo'],
        frecuencia=data['frecuencia'],
        fecha_inicio= data['fecha_inicio'],
        usuario_id=data['usuario_id']
    )
    db.session.add(nueva_suscripcion)
    db.session.commit()
    return jsonify({'msg': 'Suscripción creada exitosamente', 'id': nueva_suscripcion.id}), 201


@suscripciones_bp.route('/suscripcion/<int:id>', methods=['PUT'])
#@jwt_required()
def actualizar_suscripcion(id):
    """Actualiza una suscripción existente."""
    data = request.get_json()
    suscripcion = Suscripcion.query.get_or_404(id)

    if 'nombre' in data:
        suscripcion.nombre = data['nombre']
    if 'costo' in data:
        suscripcion.costo = data['costo']
    if 'frecuencia' in data:
        suscripcion.frecuencia = data['frecuencia']

    db.session.commit()
    return jsonify({'msg': 'Suscripción actualizada exitosamente'}), 200


@suscripciones_bp.route('/suscripcion/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_suscripcion(id):
    """Elimina una suscripción existente."""
    suscripcion = Suscripcion.query.get_or_404(id)
    db.session.delete(suscripcion)
    db.session.commit()
    return jsonify({'msg': 'Suscripción eliminada exitosamente'}), 200
