//import { Entity, Schema } from 'redis-om'
import { Schema } from 'redis-om';
// = pkg;
import client from './redisOMClient.mjs'

//class Position extends Entity {}

client.connect()

const posSchema = new Schema('Position',{
  "patente": { type: 'string'},
  "fecha_hora": { type: 'string'},
  "latitud": { type: 'string'},
  "longitud": { type: 'string'},
  "direccion": { type: 'string'},
  "velocidad": { type: 'string'},
  "estado_registro": { type: 'string'},
  "estado_ignicion": { type: 'string'},
  "numero_evento": { type: 'string'},
  "odometro": { type: 'string'},
  "numero_satelites": { type: 'string'},
  "hdop": { type: 'string'},
  "edad_dato": { type: 'string'},
  "rut_conductor": { type: 'string'},
  "nombre_conductor": { type: 'string'},
  "opcional_1": { type: 'string'},
})
export const positionRepository = client.fetchRepository(posSchema)

await positionRepository.createIndex()