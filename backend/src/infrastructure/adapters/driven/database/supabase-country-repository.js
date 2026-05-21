const CountryRepository = require('../../../../ports/country/outbound/country-repository');
const supabase = require('../../../../config/supabase');

class SupabaseCountryRepository extends CountryRepository {
  async findAllCountries() {
    const { data, error } = await supabase
      .from('paises')
      .select('id, nombre, codigo, slug, estado, created_at')
      .order('nombre', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findActiveCountries() {
    const { data, error } = await supabase
      .from('paises')
      .select('id, nombre, codigo, slug')
      .eq('estado', 'activo')
      .order('nombre', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findCountryById(id) {
    const { data, error } = await supabase
      .from('paises')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseCountryRepository;
