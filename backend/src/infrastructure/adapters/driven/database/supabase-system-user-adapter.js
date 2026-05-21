const SystemUserPort = require('../../../../ports/testimonial/outbound/system-user-port');
const supabase = require('../../../../config/supabase');

class SupabaseSystemUserAdapter extends SystemUserPort {
  async findSystemUser() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('username', 'sistema')
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseSystemUserAdapter;
