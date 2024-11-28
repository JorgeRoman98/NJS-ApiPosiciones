//const redis = require('redis');
//import { Schema, Repository } from 'redis-om';
import { createClient } from 'redis'
import { Repository, Schema } from 'redis-om';

//(async () => {
  //const { Schema, Client  } = await import('redis-om');
const redis = createClient({
  url: 'redis://redis:6379'
})

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
  }, {
    dataStructure: 'HASH'
  })

const posRepository = new Repository(posSchema, redis)
export{posRepository};
//})();
