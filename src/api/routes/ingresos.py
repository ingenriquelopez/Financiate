# api/routes/ingresos.py
from flask import Blueprint, request, jsonify
from api.models import db, Ingreso
from flask_jwt_extended import jwt_required

ingresos_bp = Blueprint('ingresos', __name__)

@ingresos_bp.route('/ingresos', methods=['GET'])
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

@ingresos_bp.route('/ingreso', methods=['POST'])
@jwt_required()
def crear_ingreso():
    data = request.get_json()
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
    return jsonify({'msg': 'Ingreso creado exitosamente'}), 201
