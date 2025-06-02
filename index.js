const express = require('express');
const rutas = require('./routes/rutas');
const client = require('./db');

const app = express();
app.use(express.json());
app.use('/api', rutas);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});