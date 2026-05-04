const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const countryRoutes = require('./routes/countryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRequestRoutes = require('./routes/contactRequestRoutes');

// Importar middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));
app.use('/pages', express.static(path.join(__dirname, '..', '..', 'frontend', 'pages')));
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'frontend', 'assets')));

// Ruta base - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html'));
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

// Middleware de rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores global
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});