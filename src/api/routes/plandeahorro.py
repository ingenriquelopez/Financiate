from flask import Blueprint, request, jsonify
from api.models import db, PlanAhorro
from api.token_required import token_required
from datetime import date
#-----------------------------------------------------
plandeahorro_bp = Blueprint('plandeahorro', __name__)
#-----------------------------------------------------


@plandeahorro_bp.route('/agregarplan', methods=['POST'])
@token_required
def agregar_plan_ahorro(payload):
    # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')  # Acceder al 'id' del usuario
    
    if not usuario_id:
         return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener los datos del nuevo plan desde el body de la solicitud
    data = request.get_json()

    # Verificar que los campos requeridos estén presentes
    if not data.get('descripcion') or not data.get('monto_objetivo'):
        return jsonify({"error": "Descripción y monto objetivo son requeridos"}), 400

    # Crear el nuevo plan de ahorro
    nuevo_plan = PlanAhorro(
         descripcion=data['descripcion'],
         monto_inicial=data.get('monto_inicial', 0.0),
         fecha_inicio=data.get('fecha_inicio', date.today()),
         monto_objetivo=data['monto_objetivo'],
         fecha_objetivo=data.get('fecha_objetivo', date.today()),
         usuario_id=usuario_id
     )

    # Guardar en la base de datos
    db.session.add(nuevo_plan)
    db.session.commit()
    
    return jsonify({"msg": "Plan de ahorro agregado exitosamente", "id": nuevo_plan.id}), 201

#--------------------------------------------------------------

@plandeahorro_bp.route('/modificarplan/<int:id>', methods=['PUT'])
@token_required
def modificar_plan_ahorro(id, payload):
    # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Buscar el plan de ahorro por ID
    plan = PlanAhorro.query.get_or_404(id)

    # Verificar que el plan pertenece al usuario autenticado
    if plan.usuario_id != usuario_id:
        return jsonify({"error": "No tienes permiso para modificar este plan"}), 403

    # Obtener los datos para actualizar
    data = request.get_json()

    if 'descripcion' in data:
        plan.descripcion = data['descripcion']
    if 'monto_inicial' in data:
        plan.monto_inicial = data['monto_inicial']
    if 'fecha_inicio' in data:
        plan.fecha_inicio = data['fecha_inicio']
    if 'monto_objetivo' in data:
        plan.monto_objetivo = data['monto_objetivo']
    if 'fecha_objetivo' in data:
        plan.fecha_objetivo = data['fecha_objetivo']

    # Guardar los cambios en la base de datos
    db.session.commit()

    return jsonify({"msg": "Plan de ahorro actualizado exitosamente"}), 200
#-------------------------------------------------------------------------

@plandeahorro_bp.route('/eliminarplan/<int:id>', methods=['DELETE'])
@token_required
def eliminar_plan_ahorro(id, payload):
    # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Buscar el plan de ahorro por ID
    plan = PlanAhorro.query.get_or_404(id)

    # Verificar que el plan pertenece al usuario autenticado
    if plan.usuario_id != usuario_id:
        return jsonify({"error": "No tienes permiso para eliminar este plan"}), 403

    # Eliminar el plan
    db.session.delete(plan)
    db.session.commit()

    return jsonify({"msg": "Plan de ahorro eliminado exitosamente"}), 200
#----------------------------------------------------------------------

# CRUD para PlanAhorro
@plandeahorro_bp.route('/traerplan', methods=['GET'])
@token_required
def obtener_planes_ahorro(payload):
    # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')  # Acceder al 'id' del usuario

    # Verificar que el usuario_id esté presente en el payload
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401
    
    planes = PlanAhorro.query.all()
    return jsonify([{
        'id': p.id,
        'descripcion': p.descripcion,
        'monto_inicial': p.monto_inicial,
        'fecha_inicio': p.fecha_inicio,
        'fecha_objetivo': p.fecha_objetivo,
        'monto_objetivo': p.monto_objetivo,
        'usuario_id': p.usuario_id
    } for p in planes]), 200

#------------------------------------------------
