class Profile {
  constructor({ id, email, nombre, rol, pais_id, created_at }) {
    this.id = id;
    this.email = email;
    this.nombre = nombre;
    this.rol = rol;
    this.pais_id = pais_id;
    this.created_at = created_at;
  }
}

module.exports = Profile;
