const supabase = require('../config/supabase');

const countries = [
  { nombre: 'Colombia', codigo: 'CO', slug: 'colombia' },
  { nombre: 'Chile', codigo: 'CL', slug: 'chile' },
  { nombre: 'Ecuador', codigo: 'EC', slug: 'ecuador' },
];

const createCountries = async () => {
  try {
    console.log('🌍 Verificando países existentes...');

    for (const country of countries) {
      const { data: existing } = await supabase
        .from('paises')
        .select('id')
        .eq('codigo', country.codigo)
        .maybeSingle();

      if (existing) {
        console.log(`⚠️  ${country.nombre} ya existe`);
      } else {
        const { error } = await supabase
          .from('paises')
          .insert([country]);

        if (error) {
          console.error(`❌ Error creando ${country.nombre}:`, error.message);
        } else {
          console.log(`✅ ${country.nombre} creado correctamente`);
        }
      }
    }

    console.log('🎉 Proceso completado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createCountries();
