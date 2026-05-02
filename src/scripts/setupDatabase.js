const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = fs.readFileSync(
  './src/db/cms-multipais.sql',
  'utf8'
);

const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

(async () => {
  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' });
    if (error) {
      console.error('Error ejecutando:\n', stmt, '\nError:', error.message);
    } else {
      console.log('✓ Ejecutado:\n', stmt.slice(0, 60), '...');
    }
  }
  console.log('Proceso terminado');
  process.exit(0);
})();
