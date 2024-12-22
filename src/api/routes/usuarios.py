# api/routes/usuarios.py
from flask import Blueprint, request, jsonify
from api.models import db, Usuario,Ingreso,Egreso
from flask_jwt_extended import jwt_required, create_access_token

usuarios_bp = Blueprint('usuarios', __name__)

# CRUD para Usuario
@usuarios_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(data)
    if not data or not all(k in data for k in ('nombre_usuario', 'correo', 'contrasena')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    if Usuario.query.filter((Usuario.nombre_usuario == data['nombre_usuario']) | (Usuario.correo == data['correo'])).first():
        return jsonify({'msg': 'El usuario o correo ya existe'}), 400

    nuevo_usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo=data['correo'],
        capital_inicial=None,
        moneda=None
    )

    nuevo_usuario.establecer_contrasena(data['contrasena'])
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({'msg': 'Usuario creado exitosamente'}), 201

@usuarios_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ('correo', 'contrasena')):
        return jsonify({'msg': 'Datos incompletos'}), 400

    usuario = Usuario.query.filter_by(correo=data['correo']).first()
    if not usuario or not usuario.verificar_contrasena(data['contrasena']):
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    token = create_access_token(identity=usuario.id)
    usuario_dict = usuario.to_dict()
    return jsonify({'token': token, 'usuario': usuario_dict}), 200

@usuarios_bp.route('/usuarios', methods=['GET'])
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

@usuarios_bp.route('/usuarios', methods=['PUT'])
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

@usuarios_bp.route('/usuario/<int:id>', methods=['GET'])
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

@usuarios_bp.route('/usuario/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'msg': 'Usuario eliminado exitosamente'}), 200



#-----------------------------
# Ruta para obtener los totales de un usuario por ID
@usuarios_bp.route('/totales', methods=['GET'])
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

#-----------------------------------------------

# CRUP para Reportes
@usuarios_bp.route('/reportes', methods=['GET'])
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


#---------------------------------------------------
@usuarios_bp.route('/datosmensuales', methods=['GET'])
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

