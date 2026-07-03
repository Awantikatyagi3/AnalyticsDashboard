import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || './data/database.sqlite';
let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure data directory exists
  const dir = path.dirname(path.resolve(dbPath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Open the database
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  return dbInstance;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();

  console.log('Initializing database tables...');

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Dashboards table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS dashboards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      powerBiUrl TEXT NOT NULL,
      lastUpdated TEXT NOT NULL
    )
  `);

  // Create Analytics table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      metricName TEXT NOT NULL,
      metricValue REAL NOT NULL
    )
  `);

  console.log('Tables initialized. Checking if seeding is required...');

  // Seed default admin user if not exists
  const userCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count === 0) {
    console.log('Seeding default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      'admin',
      hashedPassword
    );
    console.log('Admin user seeded (admin / admin123).');
  }

  // Seed dashboards if empty
  const dashboardCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM dashboards');
  if (dashboardCount && dashboardCount.count === 0) {
    console.log('Seeding dashboards...');
    const dashboards = [
      {
        name: 'Census & Population Demographics',
        category: 'census',
        powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTZkZmVjYjQtZGM3Mi00NzkxLThlZDMtZmE5NzljNWViMTJlIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9',
        lastUpdated: '2026-06-08T10:00:00Z'
      },
      {
        name: 'Tourism and Visitor Analytics',
        category: 'tourism',
        powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTZkZmVjYjQtZGM3Mi00NzkxLThlZDMtZmE5NzljNWViMTJlIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9',
        lastUpdated: '2026-06-07T14:30:00Z'
      },
      {
        name: 'Healthcare Services & Metrics',
        category: 'health',
        powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTZkZmVjYjQtZGM3Mi00NzkxLThlZDMtZmE5NzljNWViMTJlIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9',
        lastUpdated: '2026-06-08T09:15:00Z'
      },
      {
        name: 'Educational Enrolment & Performance',
        category: 'education',
        powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTZkZmVjYjQtZGM3Mi00NzkxLThlZDMtZmE5NzljNWViMTJlIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9',
        lastUpdated: '2026-06-05T11:00:00Z'
      },
      {
        name: 'State Financial Status & GDP Insights',
        category: 'finance',
        powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTZkZmVjYjQtZGM3Mi00NzkxLThlZDMtZmE5NzljNWViMTJlIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9',
        lastUpdated: '2026-06-08T08:00:00Z'
      },
      {
        name: 'Electric Vehicle Adoption & Charger Status',
        category: 'ev',
        powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTZkZmVjYjQtZGM3Mi00NzkxLThlZDMtZmE5NzljNWViMTJlIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9',
        lastUpdated: '2026-06-08T12:00:00Z'
      }
    ];

    for (const dashboard of dashboards) {
      await db.run(
        'INSERT INTO dashboards (name, category, powerBiUrl, lastUpdated) VALUES (?, ?, ?, ?)',
        dashboard.name,
        dashboard.category,
        dashboard.powerBiUrl,
        dashboard.lastUpdated
      );
    }
    console.log('Dashboards seeded.');
  }

  // Seed analytics if empty
  const analyticsCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM analytics');
  if (analyticsCount && analyticsCount.count === 0) {
    console.log('Seeding analytics data...');
    const analyticsData = [
      // Census
      { category: 'census', metricName: 'Total Population', metricValue: 1425775850 },
      { category: 'census', metricName: 'Population Growth Rate (%)', metricValue: 0.81 },
      { category: 'census', metricName: 'Literacy Rate (%)', metricValue: 77.7 },
      { category: 'census', metricName: 'Urban Population (%)', metricValue: 35.9 },

      // Tourism
      { category: 'tourism', metricName: 'Annual Domestic Tourists (M)', metricValue: 1731.0 },
      { category: 'tourism', metricName: 'Annual Foreign Tourists (M)', metricValue: 10.9 },
      { category: 'tourism', metricName: 'Hotel Occupancy Rate (%)', metricValue: 66.5 },
      { category: 'tourism', metricName: 'Average Stay Duration (Days)', metricValue: 4.2 },

      // Health
      { category: 'health', metricName: 'Life Expectancy at Birth (Years)', metricValue: 70.8 },
      { category: 'health', metricName: 'Infant Mortality Rate (per 1000)', metricValue: 28.0 },
      { category: 'health', metricName: 'Maternal Mortality Ratio (per 100k)', metricValue: 97.0 },
      { category: 'health', metricName: 'Public Health Outlay (% of GDP)', metricValue: 2.1 },

      // Education
      { category: 'education', metricName: 'Primary School GER (%)', metricValue: 101.4 },
      { category: 'education', metricName: 'Pupil-Teacher Ratio (Primary)', metricValue: 26.2 },
      { category: 'education', metricName: 'Youth Literacy Rate (15-24) (%)', metricValue: 93.0 },
      { category: 'education', metricName: 'Schools with Internet Access (%)', metricValue: 34.2 },

      // Finance
      { category: 'finance', metricName: 'GDP Growth Rate (%)', metricValue: 7.2 },
      { category: 'finance', metricName: 'Fiscal Deficit (% of GDP)', metricValue: 5.9 },
      { category: 'finance', metricName: 'Inflation Rate (CPI) (%)', metricValue: 4.8 },
      { category: 'finance', metricName: 'Direct Tax Collection Growth (%)', metricValue: 15.3 },

      // EV
      { category: 'ev', metricName: 'Total Registered EVs', metricValue: 2822450 },
      { category: 'ev', metricName: 'Public Charging Stations', metricValue: 12140 },
      { category: 'ev', metricName: 'EV Penetration in Two-Wheelers (%)', metricValue: 5.4 },
      { category: 'ev', metricName: 'CO2 Emissions Avoided (Metric Tons)', metricValue: 420000 }
    ];

    for (const metric of analyticsData) {
      await db.run(
        'INSERT INTO analytics (category, metricName, metricValue) VALUES (?, ?, ?)',
        metric.category,
        metric.metricName,
        metric.metricValue
      );
    }
    console.log('Analytics data seeded.');
  }

  console.log('Database initialization complete.');
}
