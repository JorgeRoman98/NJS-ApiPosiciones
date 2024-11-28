// routes/sample.js
/**
 *  @swagger
 *  /pos/insert:
 *  post:
 *      summary: Returns a sample message
 *      requestBody:
 *          description: Optional description in *Markdown*
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          patente:
 *                              type: string
 *                          fecha_hora:
 *                              type: string
 *                          latitud:
 *                              type: string
 *                          longitud:
 *                              type: string
 *                          direccion:
 *                              type: string
 *                          velocidad:
 *                              type: string
 *                          estado_registro:
 *                              type: string
 *                          numero_evento:
 *                              type: string
 *                          odometro:
 *                              type: string
 *                          numero_satelites:
 *                              type: string
 *                          hdop:
 *                              type: string
 *                          edad_dato:
 *                              type: string
 *                          rut_conductor:
 *                              type: string
 *                          nombre_conductor:
 *                              type: string
 *                          opcional_1:
 *                              type: string
 *      responses:
 *          200:
 *              description: A successful response
 *  /pos/{mov_codigo}:
 *  get:
 *      summary: retorna las posiciones de una patente.
 *      parameters:
 *        - in: path
 *          name: mov_codigo
 *          schema:
 *              type: string
 *          required: true
 *          descripcion: patente del vehículo a buscar.
 */
const express = require('express');
const {posRepository} = require('../redisPosition.js');

const router = express.Router();

router.post('/insert', async (req, res) => {
    try{
        const bod = req.body

        const position =  posRepository.createEntity(bod);
        const PosId = await posRepository.save(position) 
        res.json({ message: 'Posición creada', Id: PosId });   
    }catch(error){
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

router.get('/:mov_codigo', async (req,res) => {
    const mov_codigo = req.params.mov_codigo;

    const redis_resp = await posRepository.search().where('patente').equals(mov_codigo);

    res.json({ resp: redis_resp })
})

module.exports = router;

// {
//     "patente": "WISE-12",
//     "fecha_hora": "2017-03-18 16:20:00",
//     "latitud": "-33,43565400",
//     "longitud": "-70,60552700",
//     "direccion": "100",
//     "velocidad": "50",
//     "estado_registro": "1",
//     "estado_ignicion": "1",
//     "numero_evento": "45",
//     "odometro": "1859,55",
//     "numero_satelites": "5",
//     "hdop": "0",
//     "edad_dato": "0",
//     "rut_conductor": "0000048EB410",
//     "nombre_conductor": "111111111",
//     "opcional_1": "-0.1111"
//     }