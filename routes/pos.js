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
const { createClient, ClientClosedError } = require('redis');

const redisserv = process.env.REDIS_HOST || '192.168.2.40';

const router = express.Router();

const client = createClient({
    legacyMode: false,
    url : `redis://${redisserv}:6379`,
    socket: {
        connectTimeout: 100000, // Tiempo de espera en milisegundos
    },
}) 

client.on('connect', () => {
    console.log('Conectado a Redis');
});


// (async () => {
//     try {
//         await client.connect();
//     } catch (err) {
//         console.error('Error al conectar:', err);
//     }
// })();

router.post('/insert', async (req, res) => {
    try{
        //await client.connect();
        client.connect().then(() => {
            const { EntityId } = import('redis-om');
            const { posRepository } = import('../redisPosition.mjs');
            
            console.log('Conectado a Redis');
            const bod = req.body
            
            album = posRepository.save(bod)
            res.json({ message: 'Posición creada', Id: album[EntityId] });
          })
        
        await client.quit();
    }catch(error){
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

/**
 *  @swagger
 *      /pos/{mov_codigo}:
 *      get:
 *          summary: retorna las posiciones de una patente.
 *          parameters:
 *            - in: path
 *              name: mov_codigo
 *              schema:
 *                  type: string
 *              required: true
 *              descripcion: patente del vehículo a buscar.
*/

router.get('/:mov_codigo', async (req,res) => {
    const mov_codigo = req.params.mov_codigo;
    const redis_resp = await posRepository.search().where('patente').equals(mov_codigo);

    res.json({ resp: redis_resp })
})

module.exports = router;