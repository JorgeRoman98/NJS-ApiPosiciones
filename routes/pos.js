// routes/sample.js
/**
 *  @swagger
 *      /pos/insert:
 *      post:
 *          summary: Returns a sample message
 *          requestBody:
 *              description: Optional description in *Markdown*
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              patente:
 *                                  type: string
 *                              fecha_hora:
 *                                  type: string
 *                              latitud:
 *                                  type: string
 *                              longitud:
 *                                  type: string
 *                              direccion:
 *                                  type: string
 *                              velocidad:
 *                                  type: string
 *                              estado_registro:
 *                                  type: string
 *                              numero_evento:
 *                                  type: string
 *                              odometro:
 *                                  type: string
 *                              numero_satelites:
 *                                  type: string
 *                              hdop:
 *                                  type: string
 *                              edad_dato:
 *                                  type: string
 *                              rut_conductor:
 *                                  type: string
 *                              nombre_conductor:
 *                                  type: string
 *                              opcional_1:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: A successful response
 */

const express = require('express');
const { createClient } = require('redis');

const redisserv = process.env.REDIS_HOST || '192.168.2.40';
const router = express.Router();

console.log(redisserv)
const redisClient = createClient({url : `redis://${redisserv}:6379`});

(async () => {  redisClient.on('error', (err) => console.log('Redis Client Error', err)); })();

(async () => { await redisClient.connect() })();


router.post('/insert', async (req, res) => {
    
        const {
            patente,
            fecha_hora,
            latitud,
            longitud,
            direccion,
            velocidad,
            estado_registro,
            numero_evento,
            odometro,
            numero_satelites,
            hdop,
            edad_dato,
            rut_conductor,
            nombre_conductor,
            opcional_1
          } = req.body
    try{
        const primKey = `${patente};${fecha_hora};${numero_evento}`

        const key = `objetos:${primKey}`;

        await redisClient.hSet(key, {
            patente,
            fecha_hora,
            latitud,
            longitud,
            direccion,
            velocidad,
            estado_registro,
            numero_evento,
            odometro,
            numero_satelites,
            hdop,
            edad_dato,
            rut_conductor,
            nombre_conductor,
            opcional_1
          });

        res.status(201).json({ message: 'Objeto almacenado', key });

    }catch(error){
        res.status(500).json({ message: 'Error al almacenar el objeto', error: err.message });
    }
  });

/**
 *  @swagger
 *      /pos/{id}:
 *      get:
 *          summary: retorna las posiciones de una patente.
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              descripcion: id del vehículo a buscar.
 *      responses:
 *          200:
 *              description: A successful response
*/

router.get('/pos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const objeto = await redisClient.hGetAll(`objetos:${id}`);
    if (!objeto) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }

    res.status(200).json(objeto);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar el objeto', error: err.message });
  }
});

/**
 *  @swagger
 *      /pos/all:
 *      get:
 *          summary: retorna todas las posiciones.
 *      responses:
 *          200:
 *              description: A successful response
*/

router.get('/all', async (_req, res) => {
    try {
      const keys = await redisClient.keys('objetos:*');
      const objetos = [];
  
      for (const key of keys) {
        const objeto = await redisClient.hGetAll(key);
        objetos.push({ id: key.split(':')[1], ...objeto });
      }
  
      res.status(200).json(objetos);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener los objetos', error: err.message });
    }
  });

module.exports = router;