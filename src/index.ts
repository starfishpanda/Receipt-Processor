import * as dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import apiRouter from './routes/apiRoutes.js';
import http from 'http';
import { AppError } from './types/AppError.js';

dotenv.config();
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const HOST: string = '0.0.0.0';
const PORT: number = 3000;
let server: http.Server | null = null;

// Functions to start and stop server gracefully
export const startServer = async (): Promise<http.Server | undefined> => {
  if (server) {
    console.log('Server already started');
    return;
  }
  server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
};

export const stopServer = async (): Promise<void> => {
  if (server) {
    server.close(err => {
      if (err) {
        console.error(`Error closing server: ${err}`);
        return;
      }
      console.log('Server successfully closed.');
      server = null;
    });
  }
};

// Routers
app.use('/', apiRouter);
startServer();

// Global Error Handler
app.use((err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'An unexpected error occurred.';
  console.error(
    `Status: ${statusCode}, Message: ${errorMessage}, Route: ${req.path}, Method: ${req.method}`
  );
  res.status(statusCode).json({ message: errorMessage });
});

const gracefulShutdown = async (sig: string) => {
  console.log(`Received ${sig}. Gracefully shutting server down...`);
  await stopServer();
  console.log('Http server shutdown complete.');
  process.exit(0);
};

// SIGTERM, SIGINT, Uncaught Exceptions, and Uncaught Rejections
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err: AppError) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason: object | null | undefined, promise: Promise<unknown>) => {
  console.log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

export default app;
