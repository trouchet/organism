import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';

import { 
  now_ISO, 
  now_date, 
  now_epoch 
} from './utils.js';

import { 
  app
} from './express.js';

import { 
  connectUrl,
  client
} from './mqtt.js';

import { 
  statusMW
} from './middlewares/status.js';

import { 
  agentMorganReporter,
  log_message 
} from 'quivero-api/utils/logging/logger.js';

dotenv.config()

let topic = '/nodejs/mqtt'
let message = 'Hey Jude';

client.on('connect', () => {
  log_message(agentMorganReporter, 'info', `Connected to broker ${connectUrl}!`);

  client.subscribe([topic], () => {
    log_message(agentMorganReporter, 'info', `Subscribe to topic '${topic}'`);
  })
})

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
         log_message(agentMorganReporter, 'error', error)
       }
      }
    )

    let info_msg = `Message ${message} published!`;
    log_message(agentMorganReporter, 'info', info_msg)
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
    let message = String(req.body.name);
    
    client.publish(
      topic, 
      message, 
      { 
       qos: 0, 
       retain: false 
      }, 
      (error) => {
        if (error) {
          log_message(agentMorganReporter, 'error', error)
        }
      }
    )

    let info_msg = `Message ${message} published!`;
    log_message(agentMorganReporter, 'info', info_msg)
    res.send(info_msg);
  }
);
// [END add_post_handler]
