from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone,date
from sqlalchemy import Column, ForeignKey, String, Date, DateTime
from sqlalchemy.orm import relationship
import hashlib

db = SQLAlchemy()

# Modelo de Usuario
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = Column(db.Integer, primary_key=True)
    nombre_usuario = Column(String(50), nullable=False, unique=True)
    correo = Column(String(120), nullable=False, unique=True)
    contrasena_hash = Column(String(128), nullable=False)
    creado_en = Column(DateTime, default=datetime.now(timezone.utc))
    capital_inicial = db.Column(db.Float, nullable=True, default=None)
    moneda = db.Column(db.String(10), nullable=True, default=None)  # Moneda del usuario

    ingresos = relationship('Ingreso', backref='usuario', lazy=True)
    egresos = relationship('Egreso', backref='usuario', lazy=True)
    planes_ahorro = relationship('PlanAhorro', backref='usuario', lazy=True)
    fondos_emergencia = relationship('FondoEmergencia', backref='usuario', lazy=True)
    suscripciones = db.relationship('Suscripcion', backref='usuario', lazy=True)
    alertas = db.relationship('Alerta', backref='usuario', lazy=True)

    def establecer_contrasena(self, contrasena):
         #Encripta la contraseña usando SHA-256 y la trunca a 80 caracteres.
        sha256_hash = hashlib.sha256(contrasena.encode('utf-8')).hexdigest()  # Hash de 64 caracteres
        self.contrasena_hash = sha256_hash[:80]  # Asegurarnos de que no sobrepase los 80 caracteres

    def verificar_contrasena(self, contrasena):
        #Verifica si la contraseña ingresada es correcta comparándola con la encriptada."""
        # Genera el hash de la contraseña ingresada
        sha256_hash = hashlib.sha256(contrasena.encode('utf-8')).hexdigest()
        # Compara el hash generado con el almacenado en la base de datos
        return self.contrasena_hash == sha256_hash[:80]  # Asegurarnos de comparar solo los primeros 80 caracteres
    
    # Método para convertir el objeto en un diccionario
    def to_dict(self):
        return {
            'id': self.id,
            'nombre_usuario': self.nombre_usuario,
            'correo': self.correo,
            'capital_inicial':self.capital_inicial,
            'moneda':self.moneda
        }
    
    def calcular_totales(self):
        total_ingresos = sum(ingreso.monto for ingreso in self.ingresos)
        total_egresos = sum(egreso.monto for egreso in self.egresos)
        capital_actual = self.capital_inicial + total_ingresos - total_egresos
        return {
            "capital_inicial": self.capital_inicial,
            "total_ingresos": total_ingresos,
            "total_egresos": total_egresos,
            "capital_actual": capital_actual,
        }


# Modelo de Categorías
class Categoria(db.Model):
    __tablename__ = 'categorias'
    id = Column(db.Integer, primary_key=True)
    nombre = Column(db.String(50), nullable=False, unique=True)
    icono =  Column(db.String(10), nullable=False, unique=True)
    is_default = db.Column(db.Boolean, default=False)  # Categoría predeterminada
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=True)  # Null si es predeterminada
    egresos = relationship('Egreso', backref='categoria', lazy=True)
    ingresos = relationship('Ingreso', backref='categoria', lazy=True)

# Modelo de Ingreso  UV J
class Ingreso(db.Model):
    __tablename__ = 'ingresos'
    id = Column(db.Integer, primary_key=True)
    monto = Column(db.Float, nullable=False)
    descripcion = Column(db.String(255))
    fecha = Column(db.Date, default=date.today)
    usuario_id = Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    categoria_id = Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)

# Modelo de Egreso
class Egreso(db.Model):
    __tablename__ = 'egresos'
    id = Column(db.Integer, primary_key=True)
    monto = Column(db.Float, nullable=False)
    descripcion = Column(db.String(255))
    fecha = Column(db.Date, default=date.today)
    usuario_id = Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    categoria_id = Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)

# Modelo de Suscripción
class Suscripcion(db.Model):
    __tablename__ = 'suscripciones'
    id = Column(db.Integer, primary_key=True)
    nombre = Column(db.String(100), nullable=False)
    costo = Column(db.Float, nullable=False)
    frecuencia = Column(db.String(50), nullable=False)  # Ejemplo: 'mensual', 'anual'
    fecha_inicio = Column(db.Date, nullable=False, default=date.today)
    usuario_id = Column(db.Integer, ForeignKey('usuarios.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'costo': self.costo,
            'frecuencia': self.frecuencia,
            'fecha_inicio': self.fecha_inicio.isoformat(),
            'usuario_id': self.usuario_id
        }

# Modelo de Plan de Ahorro
class PlanAhorro(db.Model):
    __tablename__ = 'planes_ahorro'
    id = db.Column(db.Integer, primary_key=True)
    descripcion = Column(db.String(255))
    monto_inicial = Column(db.Float, default=0.0)
    fecha_inicio = Column(db.Date, default=date.today)
    monto_objetivo = Column(db.Float, nullable=False)
    fecha_objetivo = Column(db.Date, default=date.today)
    usuario_id = Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

# Modelo de Fondo de Emergencia
class FondoEmergencia(db.Model):
    __tablename__ = 'fondos_emergencia'
    id = db.Column(db.Integer, primary_key=True)
    monto_meta = Column(db.Float, nullable=False)
    monto_actual = Column(db.Float, default=0.0)
    usuario_id = Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

# Modelo de Alerta
class Alerta(db.Model):
    __tablename__ = 'alertas'
    id = Column(db.Integer, primary_key=True)
    mensaje = Column(db.String(255), nullable=False)
    leida = Column(db.Boolean, default=False)
    creada_en = Column(db.DateTime, default=datetime.now(timezone.utc))
    usuario_id = Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
