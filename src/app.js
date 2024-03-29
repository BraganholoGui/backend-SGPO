import * as Sentry from '@sentry/node';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
// import cors from './app/middlewares/cors.js';
import './database/index.js';
import routes from './routes.js';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
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
    this.server.use(express.json({ limit: '500mb' }));
    this.server.use(express.urlencoded({ limit: '500mb', extended: true }));

    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(bodyParser.json({ limit: '500mb' }));
    this.server.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
