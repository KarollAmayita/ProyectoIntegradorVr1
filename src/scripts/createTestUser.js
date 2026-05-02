const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const createTestUser = async () => {
  try {
    const username = 'testeditor';
    const password = 'editor123';
    const email = 'editor@test.com';

    console.log('🔎 Verificando si ya existe el usuario...');

    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      console.log('⚠️ El usuario testeditor ya existe');
      return;
    }

    console.log('🔐 Generando hash de contraseña...');
    const password_hash = bcrypt.hashSync(password, 10);

    console.log('🔎 Buscando rol editor...');

    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('nombre', 'editor')
      .single();

    if (roleError || !role) {
      throw new Error('❌ No existe el rol editor en la base de datos');
    }

    console.log('🔎 Buscando país Colombia...');

    const { data: country, error: countryError } = await supabase
      .from('paises')
      .select('id')
      .eq('codigo', 'CO')
      .single();

    if (countryError || !country) {
      throw new Error('❌ No existe el país Colombia en la base de datos');
    }

    console.log('👤 Creando usuario editor...');

    const { error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: 'Test',
          apellido: 'Editor',
          email,
          username,
          password_hash,
          rol_id: role.id,
          pais_id: country.id,
          estado: 'activo',
        },
      ]);

    if (error) {
      throw new Error(error.message);
    }

    console.log('✅ Usuario editor creado correctamente');
    console.log('👤 Usuario:', username);
    console.log('🔑 Password:', password);
    console.log('🌍 País ID:', country.id);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createTestUser();
