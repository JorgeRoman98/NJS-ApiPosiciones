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
//const express = require('express');
//const {posRepository} = require('../redisPosition.js');
//import { createClient } from 'redis'
import * as express from "express";
import { posRepository } from '../redisPosition.js';
import { createClient } from 'redis'

const redis = createClient({
    url: 'redis://redis:6379'
  })  

const router = express.Router();

router.post('/insert', async (req, res) => {
    //import { EntityId } from 'redis-om'
    const { EntityId } = await import('redis-om');
    try{
        const bod = req.body
          
        album = await posRepository.save(bod)
        res.json({ message: 'Posición creada', Id: album[EntityId] });   
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