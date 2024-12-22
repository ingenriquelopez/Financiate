from flask import Blueprint, request, jsonify
from api.models import db, Alerta
from flask_jwt_extended import jwt_required

alertas_bp = Blueprint('alertas', __name__)

# CRUD para Alerta
@alertas_bp.route('/alertas', methods=['GET'])
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
