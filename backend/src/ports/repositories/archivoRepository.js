/**
 * @interface ArchivoRepository
 * 
 * @method findAll - (params: { limit: number, offset: number, tipo?: string, noticia_id?: string, testimonio_id?: string, noticia_ids?: string[], testimonio_ids?: string[] }) => Promise<{ data: Archivo[], count: number }>
 * @method findById - (id: string) => Promise<Archivo | null>
 * @method create - (archivo: Partial<Archivo>) => Promise<Archivo>
 * @method update - (id: string, payload: Partial<Archivo>) => Promise<Archivo>
 * @method remove - (id: string) => Promise<void>
 */

module.exports = {};
