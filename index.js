import mqtt from 'mqtt';
import dotenv from 'dotenv';

import { now_ISO, now_date, now_epoch } from './utils.js';
import { logger, log_message } from './logger.js';

const diary = logger('MQTT');
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
  // [ms]
  reconnectPeriod: 1000,
})

const topic = '/nodejs/mqtt'

client.on('connect', () => {
  log_message(diary, 'info', `Connected to broker ${connectUrl}!`);

  client.subscribe([topic], () => {
    log_message(diary, 'info', `Subscribe to topic '${topic}'`);
  })

  client.publish(topic, 
  	'Hey Jude', 
  	{ 
  		qos: 0, 
  		retain: false 
  	}, 
  	(error) => {
    if (error) {
      log_message(diary, 'error', error)
    }
  })
})

client.on('reconnect', (error) => {
  log_message(diary, 'error', `Reconnecting to broker ${connectUrl}:`+error)
})

client.on('error', (error) => {
  log_message(diary, 'error', `Cannot connect to broker ${connectUrl}:`+error)
})

client.on('message', (topic, payload) => {
  log_message(diary, 'info', 'Received Message: ' + topic + payload.toString())
})

