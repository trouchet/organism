import express from 'express';
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import path from 'path';

import { now_ISO, now_date, now_epoch } from './utils.js';
import { logger, log_message } from './logger.js';

import { morganMiddleware } from 'quivero-api/utils/logging/logger.js';

const app = express();

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({ extended: true }));
// [END enable_parser]

// [START logger]
app.use(morganMiddleware);
// [END logger]

// Listen to the App Engine-specified port, or 8080 otherwise
const APP_PORT = process.env.PORT || 8080;

app.listen(APP_PORT, () => {
  console.log(`Listening on port: ${APP_PORT}`);
});

const diary = logger('MQTT');

dotenv.config()

const MQTT_HOST = process.env.HOST;
const MQTT_PORT = process.env.PORT || '1883';
const CLIENT_ID = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`

const client = mqtt.connect(connectUrl, {
  CLIENT_ID,
  clean: true,	
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  // [ms]
  reconnectPeriod: 1000,
})

client.on('connect', () => {
  log_message(diary, 'info', `Connected to broker ${connectUrl}!`);

  client.subscribe([topic], () => {
    log_message(diary, 'info', `Subscribe to topic '${topic}'`);
  })
})

client.on('reconnect', (error) => {
  log_message(diary, 'error', `Reconnecting to broker ${connectUrl}:`)
})

client.on('error', (error) => {
  log_message(diary, 'error', `Cannot connect to broker ${connectUrl}:`+error)
})

client.on('message', (topic, payload) => {
  log_message(diary, 'info', 'Received Message: ' + topic + ' ' + payload.toString())
})

const topic = '/nodejs/mqtt'
let message = 'Hey Jude';

app.get(
  '/', 
  (req, res) => {
    client.publish(
      topic, message, 
      { 
       qos: 0, 
       retain: false 
      }, 
      (error) => {
       if (error) {
         log_message(diary, 'error', error)
       }
      }
    )

    let info_msg = `Message ${message} published!`;
    log_message(diary, 'info', info_msg)
   res.send(info_msg);
  }
);

// [START add_display_form]
app.get(
  '/submit', 
  (req, res) => {
    var dir_name = path.join(process.cwd(), '/views/form.html');
    res.sendFile(dir_name);
  }
);
// [END add_display_form]

// [START add_post_handler]
app.post(
  '/submit', 
  async (req, res) => {  
    console.log(JSON.stringify(req.body))

    client.publish(
      topic, 
      String(req.body.name), 
      { 
       qos: 0, 
       retain: false 
      }, 
      (error) => {
       if (error) {
         log_message(diary, 'error', error)
       }
      }
    ) 
  }
);
// [END add_post_handler]
