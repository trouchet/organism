import mqtt from 'mqtt';
import dotenv from 'dotenv';

import { 
  generateToken
} from 'quivero-api/utils/string/string.js';

import { 
  agentMorganReporter,
  log_message 
} from 'quivero-api/utils/logging/logger.js';

dotenv.config()

const MQTT_HOST = process.env.HOST;
const MQTT_PORT = process.env.PORT || '1883';

const CLIENT_ID = `mqtt_${generateToken(3)}`;

export const connectUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`

export const client = mqtt.connect(connectUrl, {
  CLIENT_ID,
  clean: true,  
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  // [ms]
  reconnectPeriod: 1000,
})

client.on('reconnect', (error) => {
  log_message(agentMorganReporter, 'error', `Reconnecting client ${CLIENT_ID} to broker ${connectUrl}:`)
})

client.on('error', (error) => {
  log_message(agentMorganReporter, 'error', `Cannot connect to broker ${connectUrl}:`+error)
})

client.on('message', (topic, payload) => {
  log_message(agentMorganReporter, 'info', 'Received Message: ' + topic + ' ' + payload.toString())
})