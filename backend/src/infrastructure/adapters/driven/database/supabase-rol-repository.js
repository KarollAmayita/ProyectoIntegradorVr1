const RolRepository = require('../../../../ports/user/outbound/rol-repository');
const supabase = require('../../../../config/supabase');

class SupabaseRolRepository extends RolRepository {
  async findRolById(id) {
    const { data, error } = await supabase
      .from('roles')
      .select('id, nombre, descripcion')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

module.exports = SupabaseRolRepository;
