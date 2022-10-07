import mqtt from 'mqtt';
import dotenv from 'dotenv';

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
  console.log('mqtt: Connected')

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
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
  console.log(`Reconnecting(mqtt):`, error)
})

client.on('error', (error) => {
  console.log(`Cannot connect(mqtt):`, error)
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})
