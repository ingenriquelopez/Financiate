from flask import Blueprint, request, jsonify
from api.models import db, PlanAhorro
from flask_jwt_extended import jwt_required

planes_ahorro_bp = Blueprint('planes_ahorro', __name__)

# CRUD para PlanAhorro
@planes_ahorro_bp.route('/planes_ahorro', methods=['GET'])
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
