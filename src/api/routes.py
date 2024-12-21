from flask import Flask, request, jsonify, Blueprint
from api.models import db, Usuario, Ingreso, Egreso, PlanAhorro, FondoEmergencia, Suscripcion, Alerta, Categoria
from flask_jwt_extended import jwt_required, create_access_token
from datetime import datetime

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
# @jwt_required()
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
# @jwt_required()
def crear_ingreso():
    data = request.get_json()
    print(data)
    if not data or not all(k in data for k in ('monto', 'descripcion', 'fecha','usuario_id', 'categoria_id')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    nuevo_ingreso = Ingreso(
        monto=data['monto'],
        descripcion=data['descripcion'],
        fecha=data['fecha'],
        usuario_id=data['usuario_id'],
        categoria_id=data['categoria_id']
    )
    db.session.add(nuevo_ingreso)
    db.session.commit()
    return jsonify({'msg': 'ingreso creado exitosamente'}), 201

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
    if not data or not all(k in data for k in ('monto', 'descripcion', 'fecha','usuario_id', 'categoria_id')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    nuevo_egreso = Egreso(
        monto=data['monto'],
        descripcion=data['descripcion'],
        fecha = data['fecha'],
        usuario_id=data['usuario_id'],
        categoria_id=data['categoria_id']
    )
    db.session.add(nuevo_egreso)
    db.session.commit()
    return jsonify({'msg': 'Egreso creado exitosamente'}), 201

@api.route('/categorias', methods=['GET'])
def listar_categorias():
    categorias = Categoria.query.all()
    return jsonify([{
        'id': e.id,
        'nombre': e.nombre
    } for e in categorias]), 200


# Ruta para crear una nueva categoría
@api.route('/categoria', methods=['POST'])
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
        nombre=data['nombre']
    )
    
    # Agregarla a la base de datos
    db.session.add(nueva_categoria)
    db.session.commit()

    # Retornar el ID de la nueva categoría
    return jsonify({'msg': 'Categoría creada exitosamente', 'id': nueva_categoria.id,"nombre":nueva_categoria.nombre}), 201

#---------------------------------------------------
@api.route('/categoria/<int:id>', methods=['DELETE'])
def eliminar_categoria(id):
    # Verificar si la categoría existe
    categoria = Categoria.query.get(id)
    
    if not categoria:
        return jsonify({"error": "Categoría no encontrada"}), 404

    # Verificar si la categoría está relacionada con algún ingreso o egreso
    ingresos_relacionados = Ingreso.query.filter_by(categoria_id=id).count()
    egresos_relacionados = Egreso.query.filter_by(categoria_id=id).count()

    if ingresos_relacionados > 0 or egresos_relacionados > 0:
        return jsonify({"error": "La categoría está relacionada con ingresos o egresos, no se puede eliminar."}), 400

    # Eliminar la categoría si no está relacionada
    db.session.delete(categoria)
    db.session.commit()

    return jsonify({"message": "Categoría eliminada correctamente"}), 200



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

# CRUP para Reportes
@api.route('/reportes', methods=['GET'])
def obtener_reportes():
    usuario_id = request.args.get('usuario_id', type=int)

    if not usuario_id:
        return jsonify({'msg': 'usuario_id es requerido'}), 400
    
    ingresos = Ingreso.query.filter_by(usuario_id=usuario_id).all()
    egresos = Egreso.query.filter_by(usuario_id=usuario_id).all()

    reportes = [
        {
            "id": ingreso.id,
            "monto": ingreso.monto,
            "descripcion": ingreso.descripcion,
            "fecha": ingreso.fecha,
            "tipo": "ingreso"
        } for ingreso in ingresos
    ] + [
        {
            "id": egreso.id,
            "monto": egreso.monto,
            "descripcion": egreso.descripcion,
            "fecha": egreso.fecha,
            "tipo": "egreso"
        } for egreso in egresos
    ]

    reportes_ordenados = sorted(reportes, key=lambda x: x['fecha'], reverse=True)
    return jsonify(reportes_ordenados), 200



#-----------------------------
# Ruta para obtener los totales de un usuario por ID o correo
@api.route('/usuario/totales', methods=['GET'])
def obtener_totales_usuario():
    # Obtén el ID o correo del usuario desde los parámetros de la solicitud
    usuario_id = request.args.get('usuario_id')

    # Busca el usuario según el ID o correo
    if usuario_id:
        usuario = Usuario.query.filter_by(id=usuario_id).first()
    else:
        return jsonify({'error': 'Se requiere un ID o un correo'}), 400

    # Verifica si el usuario existe
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Calcula los totales usando la función del modelo
    totales = usuario.calcular_totales()
    print(f"totales: {totales}")
    # Retorna los totales como JSON
    return jsonify({
         'capital_inicial':totales['capital_inicial'],
         'total_ingresos': totales['total_ingresos'],
         'total_egresos': totales['total_egresos'],
         'capital_actual': totales['capital_actual']
     })

#---------------------------------------------------
@api.route('/datosmensuales', methods=['POST'])
def obtener_datos_mensuales():
    try:
        data = request.get_json()  # Los datos ahora se esperan en el cuerpo de la solicitud
        meses = data.get("meses", [])
        usuario_id = data.get("usuario_id")

        if not meses or not isinstance(meses, list):
             return jsonify({"error": "Por favor, envía un arreglo válido de meses."}), 400

        # Diccionario para convertir nombres de meses a números
        meses_a_numeros = {
            "Enero": 1, "Febrero": 2, "Marzo": 3, "Abril": 4,
            "Mayo": 5, "Junio": 6, "Julio": 7, "Agosto": 8,
            "Septiembre": 9, "Octubre": 10, "Noviembre": 11, "Diciembre": 12
        }

        # Preparar respuesta
        resultado = []

        for mes in meses:
             mes_numero = meses_a_numeros.get(mes.capitalize())
             if mes_numero is None:
                 return jsonify({"error": f"El mes '{mes}' no es válido."}), 400

            # Filtrar ingresos y egresos por usuario, mes y año actual
             ingresos_mes = db.session.query(db.func.sum(Ingreso.monto)).filter(
                 db.extract('month', Ingreso.fecha) == mes_numero,
                 db.extract('year', Ingreso.fecha) == datetime.now().year,
                 Ingreso.usuario_id == usuario_id
             ).scalar() or 0

             egresos_mes = db.session.query(db.func.sum(Egreso.monto)).filter(
                 db.extract('month', Egreso.fecha) == mes_numero,
                 db.extract('year', Egreso.fecha) == datetime.now().year,
                 Egreso.usuario_id == usuario_id
             ).scalar() or 0

            # Añadir al resultado
             resultado.append({
                 "mes": mes,
                 "ingresos": ingresos_mes,
                 "egresos": egresos_mes
             })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#-----------------------------------------------





@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


