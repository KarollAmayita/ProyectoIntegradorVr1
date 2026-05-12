const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Crea el archivo backend/.env ' +
      '(puedes copiar backend/.env.example) y pega la URL del proyecto y la service role key desde ' +
      'Supabase → Project Settings → API.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;