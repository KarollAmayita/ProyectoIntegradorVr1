const SupsupabaseAuthRepository = require('./adapters/driven/database/supabase-auth-repository');
const BcryptPasswordHasher = require('./adapters/driven/external/bcrypt-password-hasher');
const JwtTokenService = require('./adapters/driven/external/jwt-token-service');
const SupabaseConnectionLogger = require('./adapters/driven/external/supabase-connection-logger');
const AuthService = require('../application/auth/auth-service');
const UserService = require('../application/user/user-service');
const SupsupabaseUserRepository = require('./adapters/driven/database/supabase-user-repository');
const SupabaseRolRepository = require('./adapters/driven/database/supabase-rol-repository');
const SupabaseAuditoriaAdapter = require('./adapters/driven/database/supabase-auditoria-adapter');
const NewsService = require('../application/news/news-service');
const SupabaseNewsRepository = require('./adapters/driven/database/supabase-news-repository');
const SupsupabaseHistorialNoticiaAdapter = require('./adapters/driven/database/supabase-historial-noticia-adapter');
const TestimonialService = require('../application/testimonial/testimonial-service');
const SupsupabaseTestimonialRepository = require('./adapters/driven/database/supabase-testimonial-repository');
const SupabaseSystemUserAdapter = require('./adapters/driven/database/supabase-system-user-adapter');
const ContactRequestService = require('../application/contact-request/contact-request-service');
const SupsupabaseContactRequestRepository = require('./adapters/driven/database/supabase-contact-request-repository');
const AuditoriaService = require('../application/auditoria/auditoria-service');
const SupabaseAuditoriaRepository = require('./adapters/driven/database/supabase-auditoria-repository');
const CountryService = require('../application/country/country-service');
const SupsupabaseCountryRepository = require('./adapters/driven/database/supabase-country-repository');
const CategoriaService = require('../application/categoria/categoria-service');
const SupsupabaseCategoriaRepository = require('./adapters/driven/database/supabase-categoria-repository');

const SupabaseArchivoRepository = require('./adapters/driven/database/supabase-archivo-repository');
const SupabaseStorageAdapter = require('./adapters/driven/storage/supabase-storage-adapter');

const SupabaseComentarioRepository = require('./adapters/driven/database/supabase-comentario-repository');
const SupabaseNotificacionRepository = require('./adapters/driven/database/supabase-notificacion-repository');
const SupabaseEstadisticaPaisRepository = require('./adapters/driven/database/supabase-estadistica-pais-repository');
const SupabaseConnectionLogRepository = require('./adapters/driven/database/supabase-connection-log-repository');
const SupabaseHistorialNoticiaRepository = require('./adapters/driven/database/supabase-historial-noticia-repository');

const createListarArchivosUseCase = require('../application/use-cases/archivos/listarArchivos');
const createObtenerArchivoUseCase = require('../application/use-cases/archivos/obtenerArchivo');
const createRegistrarUrlArchivoUseCase = require('../application/use-cases/archivos/registrarUrlArchivo');
const createUploadArchivoUseCase = require('../application/use-cases/archivos/uploadArchivo');
const createActualizarArchivoUseCase = require('../application/use-cases/archivos/actualizarArchivo');
const createEliminarArchivoUseCase = require('../application/use-cases/archivos/eliminarArchivo');

const createHttpArchivoController = require('./adapters/driving/http/archivo-controller');
const createArchivoRoutes = require('./adapters/driving/http/archivo-routes');

const createListarComentariosUseCase = require('../application/use-cases/comentario/listarComentarios');
const createListarComentariosPublicosUseCase = require('../application/use-cases/comentario/listarComentariosPublicos');
const createObtenerComentarioUseCase = require('../application/use-cases/comentario/obtenerComentario');
const createCrearComentarioUseCase = require('../application/use-cases/comentario/crearComentario');
const createModerarComentarioUseCase = require('../application/use-cases/comentario/moderarComentario');
const createEliminarComentarioUseCase = require('../application/use-cases/comentario/eliminarComentario');
const createHttpComentarioController = require('./adapters/driving/http/comentario-controller');
const createComentarioRoutes = require('./adapters/driving/http/comentario-routes');

const createListarNotificacionesUseCase = require('../application/use-cases/notificacion/listarNotificaciones');
const createMarcarLeidaNotificacionUseCase = require('../application/use-cases/notificacion/marcarLeidaNotificacion');
const createMarcarTodasLeidasNotificacionUseCase = require('../application/use-cases/notificacion/marcarTodasLeidasNotificacion');
const createContarNotificacionesNoLeidasUseCase = require('../application/use-cases/notificacion/contarNotificacionesNoLeidas');
const createHttpNotificacionController = require('./adapters/driving/http/notificacion-controller');
const createNotificacionRoutes = require('./adapters/driving/http/notificacion-routes');

const createListarEstadisticasPaisUseCase = require('../application/use-cases/estadistica-pais/listarEstadisticasPais');
const createObtenerEstadisticaPaisUseCase = require('../application/use-cases/estadistica-pais/obtenerEstadisticaPais');
const createCrearEstadisticaPaisUseCase = require('../application/use-cases/estadistica-pais/crearEstadisticaPais');
const createActualizarEstadisticaPaisUseCase = require('../application/use-cases/estadistica-pais/actualizarEstadisticaPais');
const createEliminarEstadisticaPaisUseCase = require('../application/use-cases/estadistica-pais/eliminarEstadisticaPais');
const createHttpEstadisticaPaisController = require('./adapters/driving/http/estadistica-pais-controller');
const createEstadisticaPaisRoutes = require('./adapters/driving/http/estadistica-pais-routes');

const createListarConnectionLogsUseCase = require('../application/use-cases/connection-log/listarConnectionLogs');
const createObtenerConnectionLogUseCase = require('../application/use-cases/connection-log/obtenerConnectionLog');
const createObtenerResumenConnectionLogUseCase = require('../application/use-cases/connection-log/obtenerResumenConnectionLog');
const createHttpConnectionLogController = require('./adapters/driving/http/connection-log-controller');
const createConnectionLogRoutes = require('./adapters/driving/http/connection-log-routes');

const createObtenerProfileUseCase = require('../application/use-cases/profile/obtenerProfile');
const ProfileController = require('./adapters/driving/http/profile-controller');
const createProfileRoutes = require('./adapters/driving/http/profile-routes');

const createObtenerPanelAdminUseCase = require('../application/use-cases/admin/obtenerPanelAdmin');
const AdminController = require('./adapters/driving/http/admin-controller');
const createAdminRoutes = require('./adapters/driving/http/admin-routes');

const createListarHistorialNoticiaUseCase = require('../application/use-cases/historial-noticia/listarHistorialNoticia');
const createObtenerHistorialNoticiaUseCase = require('../application/use-cases/historial-noticia/obtenerHistorialNoticia');
const createHttpHistorialNoticiaController = require('./adapters/driving/http/historial-noticia-controller');
const createHistorialNoticiaRoutes = require('./adapters/driving/http/historial-noticia-routes');

const createContainer = () => {
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(process.env.JWT_SECRET);
  const connectionLogger = new SupabaseConnectionLogger();
  const auditoriaAdapter = new SupabaseAuditoriaAdapter();

  const authRepository = new SupsupabaseAuthRepository();
  const userRepository = new SupsupabaseUserRepository();
  const rolRepository = new SupabaseRolRepository();
  const newsRepository = new SupabaseNewsRepository();
  const historialNoticiaAdapter = new SupsupabaseHistorialNoticiaAdapter();
  const testimonialRepository = new SupsupabaseTestimonialRepository();
  const systemUserAdapter = new SupabaseSystemUserAdapter();
  const contactRequestRepository = new SupsupabaseContactRequestRepository();
  const auditoriaRepository = new SupabaseAuditoriaRepository();
  const countryRepository = new SupsupabaseCountryRepository();
  const categoriaRepository = new SupsupabaseCategoriaRepository();

  const archivoRepository = new SupabaseArchivoRepository();
  const storageAdapter = new SupabaseStorageAdapter();

  const comentarioRepository = new SupabaseComentarioRepository();
  const notificacionRepository = new SupabaseNotificacionRepository();
  const estadisticaPaisRepository = new SupabaseEstadisticaPaisRepository();
  const connectionLogRepository = new SupabaseConnectionLogRepository();
  const historialNoticiaRepository = new SupabaseHistorialNoticiaRepository();

  const userService = new UserService({ userRepository, rolRepository, passwordHasher, auditoriaPort: auditoriaAdapter });
  const authService = new AuthService({
    authRepository,
    tokenService,
    passwordHasher,
    connectionLogger,
    userService
  });
  const newsService = new NewsService({
    newsRepository,
    historialNoticiaPort: historialNoticiaAdapter,
    slugGenerator: (text) => {
      return text.toString().toLowerCase().trim().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-');
    }
  });
  const testimonialService = new TestimonialService({ testimonialRepository, systemUserPort: systemUserAdapter });
  const contactRequestService = new ContactRequestService({ contactRequestRepository });
  const auditoriaService = new AuditoriaService({ auditoriaRepository, userRepository });
  const countryService = new CountryService({ countryRepository });
  const categoriaService = new CategoriaService({ categoriaRepository });

  // Archivos
  const listarArchivosUseCase = createListarArchivosUseCase(archivoRepository, newsRepository, testimonialRepository);
  const obtenerArchivoUseCase = createObtenerArchivoUseCase(archivoRepository);
  const registrarUrlArchivoUseCase = createRegistrarUrlArchivoUseCase(archivoRepository, auditoriaService);
  const uploadArchivoUseCase = createUploadArchivoUseCase(archivoRepository, storageAdapter, auditoriaService);
  const actualizarArchivoUseCase = createActualizarArchivoUseCase(archivoRepository);
  const eliminarArchivoUseCase = createEliminarArchivoUseCase(archivoRepository, storageAdapter, auditoriaService);
  const archivoController = createHttpArchivoController(listarArchivosUseCase, obtenerArchivoUseCase, registrarUrlArchivoUseCase, uploadArchivoUseCase, actualizarArchivoUseCase, eliminarArchivoUseCase);
  const archivoRoutes = createArchivoRoutes(archivoController);

  // Comentarios
  const listarComentariosUseCase = createListarComentariosUseCase(comentarioRepository, newsRepository);
  const listarComentariosPublicosUseCase = createListarComentariosPublicosUseCase(comentarioRepository);
  const obtenerComentarioUseCase = createObtenerComentarioUseCase(comentarioRepository);
  const crearComentarioUseCase = createCrearComentarioUseCase(comentarioRepository);
  const moderarComentarioUseCase = createModerarComentarioUseCase(comentarioRepository, newsRepository);
  const eliminarComentarioUseCase = createEliminarComentarioUseCase(comentarioRepository, newsRepository);
  const comentarioController = createHttpComentarioController(listarComentariosUseCase, listarComentariosPublicosUseCase, obtenerComentarioUseCase, crearComentarioUseCase, moderarComentarioUseCase, eliminarComentarioUseCase);
  const comentarioRoutes = createComentarioRoutes(comentarioController);

  // Notificaciones
  const listarNotificacionesUseCase = createListarNotificacionesUseCase(notificacionRepository);
  const marcarLeidaNotificacionUseCase = createMarcarLeidaNotificacionUseCase(notificacionRepository);
  const marcarTodasLeidasNotificacionUseCase = createMarcarTodasLeidasNotificacionUseCase(notificacionRepository);
  const contarNotificacionesNoLeidasUseCase = createContarNotificacionesNoLeidasUseCase(notificacionRepository);
  const notificacionController = createHttpNotificacionController(listarNotificacionesUseCase, marcarLeidaNotificacionUseCase, marcarTodasLeidasNotificacionUseCase, contarNotificacionesNoLeidasUseCase);
  const notificacionRoutes = createNotificacionRoutes(notificacionController);

  // Estadisticas Pais
  const listarEstadisticasPaisUseCase = createListarEstadisticasPaisUseCase(estadisticaPaisRepository);
  const obtenerEstadisticaPaisUseCase = createObtenerEstadisticaPaisUseCase(estadisticaPaisRepository);
  const crearEstadisticaPaisUseCase = createCrearEstadisticaPaisUseCase(estadisticaPaisRepository);
  const actualizarEstadisticaPaisUseCase = createActualizarEstadisticaPaisUseCase(estadisticaPaisRepository);
  const eliminarEstadisticaPaisUseCase = createEliminarEstadisticaPaisUseCase(estadisticaPaisRepository);
  const estadisticaPaisController = createHttpEstadisticaPaisController(listarEstadisticasPaisUseCase, obtenerEstadisticaPaisUseCase, crearEstadisticaPaisUseCase, actualizarEstadisticaPaisUseCase, eliminarEstadisticaPaisUseCase);
  const estadisticaPaisRoutes = createEstadisticaPaisRoutes(estadisticaPaisController);

  // Connection Logs
  const listarConnectionLogsUseCase = createListarConnectionLogsUseCase(connectionLogRepository, userRepository);
  const obtenerConnectionLogUseCase = createObtenerConnectionLogUseCase(connectionLogRepository);
  const obtenerResumenConnectionLogUseCase = createObtenerResumenConnectionLogUseCase(connectionLogRepository);
  const connectionLogController = createHttpConnectionLogController(listarConnectionLogsUseCase, obtenerConnectionLogUseCase, obtenerResumenConnectionLogUseCase);
  const connectionLogRoutes = createConnectionLogRoutes(connectionLogController);

  // Profile
  const obtenerProfileUseCase = createObtenerProfileUseCase();
  const profileController = new ProfileController(obtenerProfileUseCase);
  const profileRoutes = createProfileRoutes(profileController);

  // Admin
  const obtenerPanelAdminUseCase = createObtenerPanelAdminUseCase();
  const adminController = new AdminController(obtenerPanelAdminUseCase);
  const adminRoutes = createAdminRoutes(adminController);

  // Historial Noticias
  const listarHistorialNoticiaUseCase = createListarHistorialNoticiaUseCase(historialNoticiaRepository, newsRepository);
  const obtenerHistorialNoticiaUseCase = createObtenerHistorialNoticiaUseCase(historialNoticiaRepository);
  const historialNoticiaController = createHttpHistorialNoticiaController(listarHistorialNoticiaUseCase, obtenerHistorialNoticiaUseCase);
  const historialNoticiaRoutes = createHistorialNoticiaRoutes(historialNoticiaController);

  return { authService, userService, newsService, testimonialService, contactRequestService, auditoriaService, countryService, categoriaService, archivoController, archivoRoutes, comentarioController, comentarioRoutes, notificacionController, notificacionRoutes, estadisticaPaisController, estadisticaPaisRoutes, connectionLogController, connectionLogRoutes, profileController, profileRoutes, adminController, adminRoutes, historialNoticiaController, historialNoticiaRoutes };
};

module.exports = { createContainer };
