const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const countryRoutes = require('./routes/countryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRequestRoutes = require('./routes/contactRequestRoutes');

// Middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
  index: false,
  extensions: ['html', 'css', 'js']
}));

// Ruta base - redirigir a login
app.get('/', (req, res) => {
  res.redirect('/pages/login.html');
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

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo de errores global
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
