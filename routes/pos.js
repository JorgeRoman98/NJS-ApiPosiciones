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

const redisserv = process.env.REDIS_HOST || '192.168.2.40';

const router = express.Router();

let posRepository;

(async () => {
    try {
        const { positionRepository } = await import('../redisPosition.mjs');
        posRepository = positionRepository;
    } catch (err) {
        console.error('Error al conectar:', err);
    }
})();

router.post('/insert', async (req, res) => {
    try{
        const { positionRepository } = await import('../redisPosition.mjs');
            
        console.log('Conectado a Redis');
        const bod = req.body

        // const user = positionRepository.createEntity(req.body);
        // const position = positionRepository.save(user)
        const position = await positionRepository.createAndSave(req.body);
        
        res.send(position)
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
 *      responses:
 *          200:
 *              description: A successful response
*/

router.get('/:mov_codigo', async (req,res) => {
    const { positionRepository } = await import('../redisPosition.mjs');

    const mov_codigo = req.params.mov_codigo;
    const redis_resp = await positionRepository.search().where('patente').equals(mov_codigo).return.all();

    res.json({ resp: redis_resp })
})

/**
 *  @swagger
 *      /pos/all:
 *      get:
 *          summary: retorna todas las posiciones.
 *      responses:
 *          200:
 *              description: A successful response
*/

router.get('/all', async (req,res) => {
    const { positionRepository } = await import('../redisPosition.mjs');
    const positions = await positionRepository.search().return.all()

    res.send(positions)
})

module.exports = router;