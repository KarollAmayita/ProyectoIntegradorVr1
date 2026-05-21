/**
 * @interface ComentarioRepository
 * 
 * @method findAll - (params: { limit: number, offset: number, estado?: string, noticia_id?: string, noticia_ids?: string[] }) => Promise<{ data: Comentario[], count: number }>
 * @method findById - (id: string) => Promise<Comentario | null>
 * @method findByNoticiaId - (noticiaId: string, params: { limit: number, offset: number }) => Promise<{ data: Comentario[], count: number }>
 * @method create - (payload: Object) => Promise<Comentario>
 * @method updateEstado - (id: string, estado: string) => Promise<Comentario>
 * @method remove - (id: string) => Promise<void>
 */

module.exports = {};
