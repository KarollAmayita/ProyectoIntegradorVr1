const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const PASSWORD = '123456';
const SEC_ANSWER = 'cms2026';

const usersByCountry = {
  Colombia: [
    { username: 'admin_colombia', nombre: 'Admin', apellido: 'Colombia', email: 'admin.co@cms.com', rol: 'admin_pais' },
    { username: 'editor_colombia', nombre: 'Editor', apellido: 'Colombia', email: 'editor.co@cms.com', rol: 'editor' },
  ],
  Chile: [
    { username: 'admin_chile', nombre: 'Admin', apellido: 'Chile', email: 'admin.cl@cms.com', rol: 'admin_pais' },
    { username: 'editor_chile', nombre: 'Editor', apellido: 'Chile', email: 'editor.cl@cms.com', rol: 'editor' },
  ],
  Ecuador: [
    { username: 'admin_ecuador', nombre: 'Admin', apellido: 'Ecuador', email: 'admin.ec@cms.com', rol: 'admin_pais' },
    { username: 'editor_ecuador', nombre: 'Editor', apellido: 'Ecuador', email: 'editor.ec@cms.com', rol: 'editor' },
  ],
};

const seedUsers = async () => {
  try {
    const password_hash = bcrypt.hashSync(PASSWORD, 10);
    const respuesta_seguridad_hash = bcrypt.hashSync(SEC_ANSWER, 10);

    const { data: roles } = await supabase.from('roles').select('id, nombre');
    const roleMap = Object.fromEntries(roles.map(r => [r.nombre, r.id]));

    for (const [countryName, users] of Object.entries(usersByCountry)) {
      let { data: country } = await supabase
        .from('paises')
        .select('id, nombre')
        .eq('nombre', countryName)
        .maybeSingle();

      if (!country) {
        const slug = countryName.toLowerCase();
        const codigo = { Colombia: 'CO', Chile: 'CL', Ecuador: 'EC' }[countryName];
        const { data: newCountry, error: ce } = await supabase
          .from('paises')
          .insert({ nombre: countryName, codigo, slug })
          .select('id, nombre')
          .single();
        if (ce) throw new Error(`Error creando país ${countryName}: ${ce.message}`);
        country = newCountry;
        console.log(`Pais creado: ${country.nombre}`);
      }

      for (const u of users) {
        const { data: existing } = await supabase
          .from('usuarios')
          .select('id')
          .eq('username', u.username)
          .maybeSingle();
        if (existing) {
          console.log(`Ya existe: ${u.username}`);
          continue;
        }

        const { error: ue } = await supabase.from('usuarios').insert({
          nombre: u.nombre,
          apellido: u.apellido,
          email: u.email,
          username: u.username,
          password_hash,
          pregunta_seguridad: '¿Cuál es el código inicial del sistema?',
          respuesta_seguridad_hash,
          rol_id: roleMap[u.rol],
          pais_id: country.id,
          estado: 'activo',
        });
        if (ue) {
          console.log(`Error creando ${u.username}: ${ue.message}`);
        } else {
          console.log(`Creado: ${u.username} (${u.rol}, ${countryName}) - password: ${PASSWORD}`);
        }
      }
    }

    console.log('\nSeed completado.');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

seedUsers();
