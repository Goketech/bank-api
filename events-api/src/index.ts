import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import config from './config/config';
import log from './utils/logger';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const dirname = path.join(__dirname, '..', 'public');

const PORT = config.PORT || 3001;

app.use(express.static('public'));

app.get('/errors.txt', (req, res) => {
  res.sendFile(path.join(dirname, 'errors.txt'));
});

app.get('/interactions.txt', (req, res) => {
  res.sendFile(path.join(dirname, 'interactions.txt'));
});

wss.on('connection', (ws) => {
  log.info('Client connected');

  ws.on('message', (message: string) => {
    try {
      const event = JSON.parse(message);

      if (event.type === 'event.interaction') {
        fs.appendFileSync(path.join(dirname, 'interactions.txt'), `${event.data}\n`);
      } else if (event.type === 'event.error') {
        fs.appendFileSync(path.join(dirname, 'errors.txt'), `${event.data}\n`);
      }
    } catch (error) {
      log.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    log.info('Client disconnected');
  });
});

server.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
});
