import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`
========================================
FHIR R4 Facade API
========================================
Environment: ${config.nodeEnv}
Port: ${config.port}
Legacy API: ${config.legacyApi.baseUrl}
========================================
FHIR Base URL: http://localhost:${config.port}/baseR4
Metadata: http://localhost:${config.port}/baseR4/metadata
========================================
Example endpoints:
  GET  /baseR4/Patient
  GET  /baseR4/Patient/1
  POST /baseR4/Patient
========================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
