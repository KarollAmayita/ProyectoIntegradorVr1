const supabase = require('../config/supabase');

const findRolById = async (id) => {
  const { data, error } = await supabase
    .from('roles')
    .select('id, nombre, descripcion')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  findRolById,
};
