class User {
  constructor({
    id,
    nombre,
    apellido,
    email,
    username,
    password_hash,
    estado,
    pais_id,
    roles = [],
    paises = null,
    pregunta_seguridad = null,
    respuesta_seguridad_hash = null,
    password_updated_at = null
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.username = username;
    this.password_hash = password_hash;
    this.estado = estado;
    this.pais_id = pais_id;
    this.roles = roles;
    this.paises = paises;
    this.pregunta_seguridad = pregunta_seguridad;
    this.respuesta_seguridad_hash = respuesta_seguridad_hash;
    this.password_updated_at = password_updated_at;
  }

  get fullName() {
    return `${this.nombre} ${this.apellido}`;
  }

  get isActive() {
    return this.estado === 'activo';
  }

  get roleName() {
    if (Array.isArray(this.roles)) {
      return this.roles[0]?.nombre || null;
    }
    return this.roles?.nombre || null;
  }

  get countryName() {
    if (Array.isArray(this.paises)) {
      return this.paises[0]?.nombre || null;
    }
    return this.paises?.nombre || null;
  }
}

module.exports = User;
