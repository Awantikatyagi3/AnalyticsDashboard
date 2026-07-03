import app from './app';
import { initializeDatabase } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting server initialization sequence...');
    
    // Core check: Initialize and seed SQLite database tables
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  DENA ANALYTICS BACKEND SERVER IS RUNNING`);
      console.log(`  Environment:      ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Port:             ${PORT}`);
      console.log(`  Local URL:        http://localhost:${PORT}`);
      console.log(`  Swagger docs:     http://localhost:${PORT}/api-docs`);
      console.log(`  Raw OpenAPI Spec: http://localhost:${PORT}/openapi.json`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('FAILED TO START THE SERVER:', error);
    process.exit(1);
  }
}

startServer();
