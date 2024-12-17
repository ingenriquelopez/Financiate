from flask import Flask, request, jsonify, Blueprint
from api.models import db, Usuario, Ingreso, Egreso, PlanAhorro, FondoEmergencia, Suscripcion, Alerta
from flask_jwt_extended import jwt_required, create_access_token

# Crear el Blueprint
api = Blueprint('api', __name__)

# CRUD para Usuario
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not all(k in data for k in ('nombre_usuario', 'correo', 'contrasena')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    if Usuario.query.filter((Usuario.nombre_usuario == data['nombre_usuario']) | (Usuario.correo == data['correo'])).first():
        return jsonify({'msg': 'El usuario o correo ya existe'}), 400

    # Crear el nuevo usuario con la contraseña hasheada
    nuevo_usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo=data['correo'],
        capital_inicial=None,
        moneda=None
    )

    # Hashear la contraseña antes de almacenarla
    nuevo_usuario.establecer_contrasena(data['contrasena'])
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({'msg': 'Usuario creado exitosamente'}), 201


#--------------------------------------------------------------------
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ('correo', 'contrasena')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    usuario = Usuario.query.filter_by(correo=data['correo']).first()
    print(usuario)
    if not usuario or not usuario.verificar_contrasena(data['contrasena']):
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    token = create_access_token(identity=usuario.id)
    # Aquí, supongamos que `usuario` es un objeto de tipo Usuario
    # Y que `access_token` ya ha sido generado correctamente
    usuario_dict = usuario.to_dict()  # Convierte el objeto Usuario en un diccionario
    # Retornar el access_token y los datos del usuario
    return jsonify({'token': token, 'usuario': usuario_dict}), 200
    

@api.route('/usuarios', methods=['GET'])
@jwt_required()
def obtener_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{
        'id': u.id,
        'nombre_usuario': u.nombre_usuario,
        'correo': u.correo,
        'capital_inicial': u.capital_inicial,
        'moneda': u.moneda
    } for u in usuarios]), 200

#-----------------------------------------
@api.route('/usuarios', methods=['PUT'])
def actualizar_usuario():
    data = request.get_json()
    usuario = Usuario.query.get_or_404(data['id'])


    if 'correo' in data:
        usuario.correo = data['correo']

    if 'capital_inicial' in data:
        usuario.capital_inicial = data['capital_inicial']

    if 'moneda' in data:
        usuario.moneda = data['moneda']

    db.session.commit()
    return jsonify({'msg': 'Usuario actualizado exitosamente'}), 200


#-------------------------------------------------
@api.route('/usuario/<int:id>', methods=['GET'])
@jwt_required()
def obtener_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify({
        'id': usuario.id,
        'nombre_usuario': usuario.nombre_usuario,
        'correo': usuario.correo,
        'capital_inicial': usuario.capital_inicial,
        'moneda': usuario.moneda
    }), 200


@api.route('/usuario/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'msg': 'Usuario eliminado exitosamente'}), 200

# CRUD para Ingreso
@api.route('/ingresos', methods=['GET'])
@jwt_required()
def obtener_ingresos():
    ingresos = Ingreso.query.all()
    return jsonify([{
        'id': i.id,
        'monto': i.monto,
        'descripcion': i.descripcion,
        'fecha': i.fecha,
        'usuario_id': i.usuario_id,
        'categoria_id': i.categoria_id
    } for i in ingresos]), 200

@api.route('/ingreso', methods=['POST'])
@jwt_required()
def crear_ingreso():
    data = request.get_json()
    if not data or not all(k in data for k in ('monto', 'descripcion', 'usuario_id', 'categoria_id')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    nuevo_ingreso = Ingreso(
        monto=data['monto'],
        descripcion=data['descripcion'],
        usuario_id=data['usuario_id'],
        categoria_id=data['categoria_id']
    )
    db.session.add(nuevo_ingreso)
    db.session.commit()
    return jsonify({'msg': 'Ingreso creado exitosamente'}), 201

# CRUD para Egreso
@api.route('/egresos', methods=['GET'])
@jwt_required()
def obtener_egresos():
    egresos = Egreso.query.all()
    return jsonify([{
        'id': e.id,
        'monto': e.monto,
        'descripcion': e.descripcion,
        'fecha': e.fecha,
        'usuario_id': e.usuario_id,
        'categoria_id': e.categoria_id
    } for e in egresos]), 200

@api.route('/egreso', methods=['POST'])
#@jwt_required()
def crear_egreso():
    data = request.get_json()
    if not data or not all(k in data for k in ('monto', 'descripcion', 'usuario_id', 'categoria_id')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    nuevo_egreso = Egreso(
        monto=data['monto'],
        descripcion=data['descripcion'],
        usuario_id=data['usuario_id'],
        categoria_id=data['categoria_id']
    )
    db.session.add(nuevo_egreso)
    db.session.commit()
    return jsonify({'msg': 'Egreso creado exitosamente'}), 201

# CRUD para PlanAhorro
@api.route('/planes_ahorro', methods=['GET'])
@jwt_required()
def obtener_planes_ahorro():
    planes = PlanAhorro.query.all()
    return jsonify([{
        'id': p.id,
        'monto_meta': p.monto_meta,
        'monto_actual': p.monto_actual,
        'descripcion': p.descripcion,
        'fecha_objetivo': p.fecha_objetivo,
        'usuario_id': p.usuario_id
    } for p in planes]), 200

# CRUD para FondoEmergencia
@api.route('/fondos_emergencia', methods=['GET'])
@jwt_required()
def obtener_fondos_emergencia():
    fondos = FondoEmergencia.query.all()
    return jsonify([{
        'id': f.id,
        'monto_meta': f.monto_meta,
        'monto_actual': f.monto_actual,
        'usuario_id': f.usuario_id
    } for f in fondos]), 200

# CRUD para Suscripciones
@api.route('/suscripciones', methods=['GET'])
@jwt_required()
def obtener_suscripciones():
    suscripciones = Suscripcion.query.all()
    return jsonify([{
        'id': s.id,
        'nombre': s.nombre,
        'costo': s.costo,
        'frecuencia': s.frecuencia,
        'usuario_id': s.usuario_id
    } for s in suscripciones]), 200

# CRUD para Alerta
@api.route('/alertas', methods=['GET'])
@jwt_required()
def obtener_alertas():
    alertas = Alerta.query.all()
    return jsonify([{
        'id': a.id,
        'mensaje': a.mensaje,
        'leida': a.leida,
        'creada_en': a.creada_en,
        'usuario_id': a.usuario_id
    } for a in alertas]), 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200