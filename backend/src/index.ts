import app from './app.js';
import env from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

const handleFatalError = (err: Error, type: string) => {
  console.error(`❌ ${type}:`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', (err) => handleFatalError(err, 'Uncaught Exception'));
process.on('unhandledRejection', (err: any) => handleFatalError(err as Error, 'Unhandled Rejection'));
