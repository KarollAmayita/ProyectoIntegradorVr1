/**
 * @interface ConnectionLogRepository
 * 
 * @method findAll - ({ limit, offset, username, usuario_id, usuario_ids }?: Object) => Promise<{ data: import('../../domain/entities/connectionLog')[], count: number }>
 * @method findById - (id: string) => Promise<import('../../domain/entities/connectionLog') | null>
 * @method getSummary - () => Promise<{ total: number, total_hoy: number, ultimas: import('../../domain/entities/connectionLog')[] }>
 */

module.exports = {};
