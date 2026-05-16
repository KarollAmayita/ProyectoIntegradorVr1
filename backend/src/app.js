const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const countryRoutes = require('./routes/countryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRequestRoutes = require('./routes/contactRequestRoutes');
const connectionLogRoutes = require('./routes/connectionLogRoutes');
const archivosRoutes = require('./routes/archivosRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Importar middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'indice')));
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'frontend', 'assets')));
app.use('/admin', express.static(path.join(__dirname, '..', '..', 'frontend', 'admin'), { redirect: false }));
app.use('/argentina', express.static(path.join(__dirname, '..', '..', 'frontend', 'portales', 'argentina')));

// Rutas del frontend con URLs limpias
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'indice', 'index.html'));
});

app.get(['/admin', '/admin/'], (req, res) => {
  res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'login.html'));
});

app.get('/admin/recuperar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'recuperar.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'dashboard.html'));
});

app.get('/admin/noticias', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'noticias.html'));
});

app.get('/admin/testimonios', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'testimonios.html'));
});

app.get('/admin/solicitudes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'solicitudes.html'));
});

app.get('/admin/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'usuarios.html'));
});

app.get('/admin/conexiones', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'admin', 'conexiones.html'));
});

app.get('/argentina', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'portales', 'argentina', 'index.html'));
});

// Ruta base API
app.get('/api', (req, res) => {
  res.json({
    message: 'API CMS Multipais funcionando correctamente',
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact-requests', contactRequestRoutes);
app.use('/api/connection-logs', connectionLogRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/auditoria', auditoriaRoutes);

// Rutas con nombres en español (alias)
app.use('/api/auth', authRoutes); // already in Spanish
app.use('/api/perfil', profileRoutes);
app.use('/api/paises', countryRoutes);
app.use('/api/noticias', newsRoutes);
app.use('/api/testimonios', testimonialRoutes);
app.use('/api/solicitudes', contactRequestRoutes);
app.use('/api/usuarios', userRoutes);

// Rutas públicas con nombres en español
app.use('/api/public', publicRoutes);

// Middleware de rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores global
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});