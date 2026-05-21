const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const { createContainer } = require('./infrastructure/composition-root');
const AuthController = require('./infrastructure/adapters/driving/http/auth-controller');
const createAuthRoutes = require('./infrastructure/adapters/driving/http/auth-routes');
const UserController = require('./infrastructure/adapters/driving/http/user-controller');
const createUserRoutes = require('./infrastructure/adapters/driving/http/user-routes');
const NewsController = require('./infrastructure/adapters/driving/http/news-controller');
const createNewsRoutes = require('./infrastructure/adapters/driving/http/news-routes');
const TestimonialController = require('./infrastructure/adapters/driving/http/testimonial-controller');
const createTestimonialRoutes = require('./infrastructure/adapters/driving/http/testimonial-routes');
const ContactRequestController = require('./infrastructure/adapters/driving/http/contact-request-controller');
const createContactRequestRoutes = require('./infrastructure/adapters/driving/http/contact-request-routes');
const AuditoriaController = require('./infrastructure/adapters/driving/http/auditoria-controller');
const createAuditoriaRoutes = require('./infrastructure/adapters/driving/http/auditoria-routes');
const CountryController = require('./infrastructure/adapters/driving/http/country-controller');
const createCountryRoutes = require('./infrastructure/adapters/driving/http/country-routes');

const { authService, userService, newsService, testimonialService, contactRequestService, auditoriaService, countryService, archivoController, archivoRoutes, comentarioController, comentarioRoutes, notificacionController, notificacionRoutes, estadisticaPaisController, estadisticaPaisRoutes, connectionLogController, connectionLogRoutes, profileController, profileRoutes, adminController, adminRoutes, historialNoticiaController, historialNoticiaRoutes } = createContainer();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'indice')));
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'frontend', 'assets')));
app.use('/admin', express.static(path.join(__dirname, '..', '..', 'frontend', 'admin'), { redirect: false, extensions: ['html'] }));
app.use('/argentina', express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'argentina')));
app.use('/chile', express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'chile')));
app.use('/ecuador', express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'ecuador')));
app.use('/colombia', express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'colombia')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'indice', 'index.html'));
});

app.get('/argentina', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'argentina', 'index.html'));
});
app.get('/chile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'chile', 'index.html'));
});
app.get('/ecuador', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'ecuador', 'index.html'));
});
app.get('/colombia', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'colombia', 'index.html'));
});

app.get(['/admin', '/admin/'], (req, res) => {
  res.redirect('/admin/login');
});

// Documentación Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'CMS Multipaís - API Docs',
  customfavIcon: '/assets/img/favicon.ico',
}));

// Rutas API
const authController = new AuthController(authService);
app.use('/api/auth', createAuthRoutes(authController));

const userController = new UserController(userService);

const newsController = new NewsController(newsService);
const newsRouter = createNewsRoutes(newsController);
app.use('/api/news', newsRouter);
app.use('/api/noticias', newsRouter);

const testimonialController = new TestimonialController(testimonialService);
const testimonialRouter = createTestimonialRoutes(testimonialController);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/testimonios', testimonialRouter);

const contactRequestController = new ContactRequestController(contactRequestService);
const contactRequestRouter = createContactRequestRoutes(contactRequestController);
app.use('/api/contact-requests', contactRequestRouter);
app.use('/api/solicitudes', contactRequestRouter);

const auditoriaController = new AuditoriaController(auditoriaService);
app.use('/api/auditoria', createAuditoriaRoutes(auditoriaController));

const countryController = new CountryController(countryService);
const countryRouter = createCountryRoutes(countryController);
app.use('/api/countries', countryRouter);
app.use('/api/paises', countryRouter);

const userRouter = createUserRoutes(userController);
app.use('/api/users', userRouter);
app.use('/api/usuarios', userRouter);

app.use('/api/archivos', archivoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/estadisticas-pais', estadisticaPaisRoutes);
app.use('/api/connection-logs', connectionLogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/historial-noticias', historialNoticiaRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'API CMS Multipais funcionando correctamente'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
