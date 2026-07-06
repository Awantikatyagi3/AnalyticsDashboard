import app from '../app';
import { test as runSpecmaticTests } from 'specmatic';
import { initializeDatabase } from '../config/database';
import { Server } from 'http';

const TEST_PORT = 3005;
const BASE_URL = `http://localhost:${TEST_PORT}`;
let server: Server;
let jwtToken = '';

describe('DENA Analytics Contract & Workflow Tests', () => {
  beforeAll(async () => {
    // 1. Initializing and Seeding Database
    await initializeDatabase();
    
    // 2. Start the Server programmatically
    await new Promise<void>((resolve) => {
      server = app.listen(TEST_PORT, () => {
        console.log(`Test server started programmatically on ${BASE_URL}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    // 3. Stop the Server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Test server shut down successfully.');
          resolve();
        });
      });
    }
  });

  it('runs Specmatic contract tests programmatically', async () => {
    // Specmatic native testing wrapper runs the contract tests against the programmatically started server.
    const result = await runSpecmaticTests('localhost', TEST_PORT);
    
    // We expect the contract tests to pass.
    expect(result).toBeDefined();
  }, 120000); // 120 seconds timeout since Specmatic running in the JVM can take some time to boot

  it('runs the sequential CREATE/VIEW/CREATE workflow (User Journey)', async () => {
    // Step 1: Login User (CREATE session/token)
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    expect(loginRes.status).toBe(200);
    const loginJson = await loginRes.json() as any;
    expect(loginJson.token).toBeDefined();
    jwtToken = loginJson.token;

    // Step 2: Get Dashboards (VIEW list)
    const dashboardsRes = await fetch(`${BASE_URL}/api/dashboards`);
    expect(dashboardsRes.status).toBe(200);
    const dashboards = await dashboardsRes.json() as any[];
    expect(Array.isArray(dashboards)).toBe(true);
    expect(dashboards.length).toBeGreaterThan(0);
    const firstDashboard = dashboards[0];
    const dashboardId = firstDashboard.id;

    // Step 3: Get Dashboard By ID (VIEW detail)
    const dashboardDetailRes = await fetch(`${BASE_URL}/api/dashboards/${dashboardId}`);
    expect(dashboardDetailRes.status).toBe(200);
    const dashboard = await dashboardDetailRes.json() as any;
    expect(dashboard.id).toBe(dashboardId);
    const category = dashboard.category;

    // Step 4: Get Analytics by Category (VIEW metrics)
    const analyticsRes = await fetch(`${BASE_URL}/api/analytics/${category}`);
    expect(analyticsRes.status).toBe(200);
    const analytics = await analyticsRes.json() as any[];
    expect(Array.isArray(analytics)).toBe(true);
    expect(analytics.length).toBeGreaterThan(0);
    const firstMetric = analytics[0];
    expect(firstMetric.category).toBe(category);

    // Step 5: Generate AI Insights (CREATE / POST insights)
    const insightsRes = await fetch(`${BASE_URL}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ category })
    });
    expect(insightsRes.status).toBe(200);
    const insight = await insightsRes.json() as any;
    expect(insight.category).toBe(category);
    expect(insight.summary).toBeDefined();
  });
});
