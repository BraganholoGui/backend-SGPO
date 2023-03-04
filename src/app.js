import * as Sentry from '@sentry/node';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import cors from './app/middlewares/cors.js';
import './database/index.js';
import routes from './routes.js';
import bodyParser from 'body-parser';
import pino from 'pino';
import expressPinoLogger from 'express-pino-logger';
import path from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
    console.log("Application Started");
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(cors);
    this.server.use(bodyParser.json({ limit: '500mb' }));
    this.server.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(expressPinoLogger({
      logger: pino(),
      autoLogging: true
    }))
  }

  routes() {
    // this.server.use('/api', routes);
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      //if (process.env.NODE_ENV === 'development') {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
      //}

      //return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
