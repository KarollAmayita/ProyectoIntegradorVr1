class ContactRequest {
  constructor({
    id,
    pais_id,
    nombre,
    correo,
    telefono,
    finalidad,
    mensaje,
    estado,
    observaciones_admin,
    gestionado_por,
    fecha_gestion,
    updated_at,
    created_at
  }) {
    this.id = id;
    this.pais_id = pais_id;
    this.nombre = nombre;
    this.correo = correo;
    this.telefono = telefono;
    this.finalidad = finalidad;
    this.mensaje = mensaje;
    this.estado = estado || 'pendiente';
    this.observaciones_admin = observaciones_admin;
    this.gestionado_por = gestionado_por;
    this.fecha_gestion = fecha_gestion;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }
}

module.exports = ContactRequest;
