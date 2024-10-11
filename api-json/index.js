const express = require('express');
const { urlencoded, json } = require('express');
const router = require('./routes/signos.routes.js');
const cors = require('cors');

const app = express();

// Configuración para aceptar datos en formato URL y JSON
app.use(urlencoded({ extended: true }));
app.use(json());

// Configuración de CORS para aceptar solicitudes desde tu frontend en Vercel
app.use(cors({
    origin: 'https://proyecthoroscopoapi.vercel.app'  // Cambia esto a tu URL de frontend en Vercel
}));

// Manejar solicitudes preflight OPTIONS
app.options('*', cors());

// Usar el router para todas las rutas que comiencen con '/v1/signos'
app.use('/v1/signos', router);

// Escuchar en el puerto asignado por Vercel o en el puerto 4000 en local
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
