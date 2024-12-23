from flask import Blueprint, request, jsonify
from api.models import db, FondoEmergencia
from api.token_required import token_required

#--------------------------------------------------------------
fondos_emergencia_bp = Blueprint('fondos_emergencia', __name__)
#--------------------------------------------------------------

# CRUD para FondoEmergencia
@fondos_emergencia_bp.route('/fondos_emergencia', methods=['GET'])
@token_required
def obtener_fondos_emergencia(payload):
    fondos = FondoEmergencia.query.all()
    return jsonify([{
        'id': f.id,
        'monto_meta': f.monto_meta,
        'monto_actual': f.monto_actual,
        'usuario_id': f.usuario_id
    } for f in fondos]), 200
