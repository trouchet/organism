import mqtt from 'mqtt';
import dotenv from 'dotenv';

import { now } from './utils.js';

dotenv.config()

const HOST = process.env.HOST;
const PORT = process.env.PORT || '1883';
const CLIENT_ID = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${HOST}:${PORT}`

const client = mqtt.connect(connectUrl, {
  CLIENT_ID,
  clean: true,	
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  reconnectPeriod: 1000, 			// [ms]
})

const topic = '/nodejs/mqtt'

client.on('connect', () => {
  console.log(now(), `: Connected to broker ${connectUrl}!`)

  client.subscribe([topic], () => {
    console.log(now(), `: Subscribe to topic '${topic}'`)
  })

  client.publish(topic, 
  	'Hey Jude', 
  	{ 
  		qos: 0, 
  		retain: false 
  	}, 
  	(error) => {
    if (error) {
      console.error(error)
    }
  })
})

client.on('reconnect', (error) => {
  console.log(now(), `: Reconnecting to broker ${connectUrl}:`, error)
})

client.on('error', (error) => {
  console.log(now(), `: Cannot connect to broker ${connectUrl}:`, error)
})

client.on('message', (topic, payload) => {
  console.log(now(), ': Received Message:', topic, payload.toString())
})
