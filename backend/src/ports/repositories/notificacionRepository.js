/**
 * @interface NotificacionRepository
 * 
 * @method findByUsuarioId - (usuarioId: number, params: { limit?: number, offset?: number, soloNoLeidas?: boolean }) => Promise<{ data: import('../../domain/entities/notificacion').default[], count: number }>
 * @method findById - (id: number) => Promise<import('../../domain/entities/notificacion').default | null>
 * @method create - (payload: Object) => Promise<import('../../domain/entities/notificacion').default>
 * @method marcarLeida - (id: number) => Promise<import('../../domain/entities/notificacion').default>
 * @method marcarTodasLeidas - (usuarioId: number) => Promise<void>
 * @method countNoLeidas - (usuarioId: number) => Promise<number>
 */

module.exports = {};
