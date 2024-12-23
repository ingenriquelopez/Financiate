from flask import Blueprint, request, jsonify
from api.models import db, Egreso
from api.token_required import token_required

#------------------------------------------
egresos_bp = Blueprint('egresos', __name__)
#-----------------------------------------


# CRUD para Egreso
@egresos_bp.route('/egresos', methods=['GET'])
@token_required
def obtener_egresos(payload):
    egresos = Egreso.query.all()
    return jsonify([{
        'id': e.id,
        'monto': e.monto,
        'descripcion': e.descripcion,
        'fecha': e.fecha,
        'usuario_id': e.usuario_id,
        'categoria_id': e.categoria_id
    } for e in egresos]), 200

@egresos_bp.route('/agrega_egreso', methods=['POST'])
@token_required
def crear_egreso(payload):
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
