const supabase = require('../config/supabase');

const createTable = async () => {
  try {
    console.log('🔧 Creando tabla refresh_tokens...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.refresh_tokens (
          id bigint generated always as identity primary key,
          usuario_id bigint not null references usuarios(id) on delete cascade,
          token text not null unique,
          expires_at timestamptz not null,
          created_at timestamptz default now()
        );
      `
    });

    if (error) {
      console.error('❌ Error creando tabla vía RPC:', error.message);
      console.log('⚠️ Necesitas ejecutar este SQL manualmente en Supabase SQL Editor:');
      console.log(`
        create table if not exists refresh_tokens (
          id bigint generated always as identity primary key,
          usuario_id bigint not null references usuarios(id) on delete cascade,
          token text not null unique,
          expires_at timestamptz not null,
          created_at timestamptz default now()
        );
      `);
    } else {
      console.log('✅ Tabla refresh_tokens creada o ya existe');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
};

createTable();
