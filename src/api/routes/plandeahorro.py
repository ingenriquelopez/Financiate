from flask import Blueprint, request, jsonify
from api.models import db, PlanAhorro
from api.token_required import token_required
from datetime import date

#-----------------------------------------------------
plandeahorro_bp = Blueprint('plandeahorro', __name__)
#-----------------------------------------------------


#---------------------------------------------------------
@plandeahorro_bp.route('/agregarplan', methods=['POST'])
@token_required
def agregar_plan_ahorro(payload):
    # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')  # Acceder al 'id' del usuario
    
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener los datos del nuevo plan desde el body de la solicitud
    data = request.get_json()

    # Verificar que los campos requeridos estén presentes (campos que yo decido son indispensables)
    required_fields = ['descripcion', 'monto_objetivo', 'fecha_inicio', 'monto_inicial', 'fecha_objetivo']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({"error": f"Faltan los siguientes campos: {', '.join(missing_fields)}"}), 400

    # Validar formato de datos
    try:
        fecha_inicio = date.fromisoformat(data['fecha_inicio'])
        fecha_objetivo = date.fromisoformat(data['fecha_objetivo'])
    except ValueError:
        return jsonify({"error": "Las fechas deben estar en formato AAAA-MM-DD"}), 400

    if fecha_inicio > fecha_objetivo:
        return jsonify({"error": "La fecha de inicio no puede ser mayor que la fecha objetivo"}), 400

    try:
        monto_inicial = float(data['monto_inicial'])
        monto_objetivo = float(data['monto_objetivo'])
    except ValueError:
        return jsonify({"error": "El monto inicial y el monto objetivo deben ser números válidos"}), 400

    if monto_inicial < 0 or monto_objetivo <= 0:
        return jsonify({"error": "El monto inicial no puede ser negativo y el monto objetivo debe ser mayor que cero"}), 400

    # Crear el nuevo plan de ahorro
    nuevo_plan = PlanAhorro(
        descripcion=data['descripcion'],
        fecha_inicio=fecha_inicio,
        monto_inicial=monto_inicial,
        monto_objetivo=monto_objetivo,
        fecha_objetivo=fecha_objetivo,
        usuario_id=usuario_id
    )

    # Guardar en la base de datos
    db.session.add(nuevo_plan)
    db.session.commit()
    
      # Devolver toda la información del nuevo plan para actualizar la UI
    return jsonify({
        "msg": "Plan de ahorro agregado exitosamente",
        "nuevo_plan": {
            "id": nuevo_plan.id,
            "descripcion": nuevo_plan.descripcion,
            "fecha_inicio": nuevo_plan.fecha_inicio.isoformat(),
            "monto_inicial": nuevo_plan.monto_inicial,
            "monto_objetivo": nuevo_plan.monto_objetivo,
            "fecha_objetivo": nuevo_plan.fecha_objetivo.isoformat(),
            "usuario_id": nuevo_plan.usuario_id
        }
    }), 201
#------------------------------------------------------
@plandeahorro_bp.route('/editarplan', methods=['PUT'])
@token_required
def editar_plan_ahorro(payload):
   # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el id del plan desde el cuerpo de la solicitud
    data = request.get_json()
    plan_id = data.get('id')  # Aquí es donde obtienes el id del plan

    if not plan_id:
        return jsonify({"error": "ID del plan es necesario"}), 400

    # Buscar el plan de ahorro por ID
    plan = PlanAhorro.query.get_or_404(plan_id)

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

@plandeahorro_bp.route('/eliminarplan', methods=['DELETE'])
@token_required
def eliminar_plan_ahorro(payload):
    # El 'id' del usuario ya está disponible a través de 'payload'
    usuario_id = payload.get('id')

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Obtener el id del plan desde el cuerpo de la solicitud
    data = request.get_json()
    plan_id = data.get('id')  # Aquí es donde obtienes el id del plan

    if not plan_id:
        return jsonify({"error": "ID del plan es necesario"}), 400

    # Buscar el plan de ahorro por ID
    plan = PlanAhorro.query.get_or_404(plan_id)

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
    
    planes = PlanAhorro.query.filter_by(usuario_id=usuario_id).all()
    #Serialziar los planes de ahorro filtrados por usuario segun token
    planes_serializados = [
        {
            'id': p.id,
            'descripcion': p.descripcion,
            'monto_inicial': p.monto_inicial,
            'fecha_inicio': p.fecha_inicio.isoformat(),
            'fecha_objetivo': p.fecha_objetivo.isoformat(),
            'monto_objetivo': p.monto_objetivo,
            'usuario_id': p.usuario_id
        } 
        for p in planes
    ]

    return jsonify(planes_serializados), 200
