/**
 *  @swagger
 *      /pos/insert:
 *      post:
 *          summary: Insertar una posición en la bdd
 *          requestBody:
 *              description: Mensaje parseado
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

const redisserv = process.env.REDIS_HOST || null;
const router = express.Router();

if(redisserv){
  const redisClient = createClient({url : `redis://${redisserv}:6379`});

  (async () => {  redisClient.on('error', (err) => console.log('Redis Client Error', err)); })();
  
  (async () => { await redisClient.connect() })();
}

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

        const key = `objetos:${primKey.replace(' ', '_')}`;

        await redisClient.hSet(key, req.body);

        res.status(201).json({ message: 'Objeto almacenado', key });

    }catch(err){
        res.status(500).json({ message: 'Error al almacenar el objeto', error: err.message });
    }
  });

/**
 *  @swagger
 *      /pos:
 *      get:
 *        summary: retorna una posición determinada por la patente, fecha y hora y el número de evento.
 *        requestBody:
 *          description: Id de la posición insertada.
 *          required: true
 *          content:
 *            application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *        responses:
 *          200:
 *              description: A successful response
 *          404:
 *              description: Object not found
 *          500:
 *              description: Error while searching
*/

router.get('/', async (req, res) => {
  //const { id } = req.body;
  console.log(req.body)
  try {
    const objeto = await redisClient.hGetAll(`objetos:${req.body.id}`);
    if (!objeto) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }
    res.status(200).json(objeto);

    console.log(objeto)
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar el objeto', error: err.message });
    console.log(err.message)
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