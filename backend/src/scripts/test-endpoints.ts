import app from '../app';
import { initializeDatabase, getDb } from '../config/database';
import { Server } from 'http';

const TEST_PORT = 5001;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let server: Server;
let jwtToken = '';

async function runTests() {
  console.log('--- STARTING BACKEND INTEGRATION TESTS ---');

  // 1. Initializing and Seeding Test DB
  try {
    await initializeDatabase();
    console.log('✓ Database initialized and seeded successfully.');
  } catch (err) {
    console.error('✗ Database initialization failed:', err);
    process.exit(1);
  }

  // 2. Start the Server programmatically
  server = app.listen(TEST_PORT, () => {
    console.log(`✓ Test server running on ${BASE_URL}`);
    executeTestCases();
  });
}

async function executeTestCases() {
  let failed = false;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`  [PASS] ${message}`);
    } else {
      console.error(`  [FAIL] ${message}`);
      failed = true;
    }
  };

  try {
    // Test Case 1: Root endpoint
    console.log('\nTesting Root endpoint...');
    const rootRes = await fetch(`${BASE_URL}/`);
    assert(rootRes.status === 200, 'Root returns 200 OK');
    const rootJson = await rootRes.json() as any;
    assert(!!rootJson.documentation && !!rootJson.openapiSpec, 'Root response contains docs links');

    // Test Case 2: GET all dashboards
    console.log('\nTesting GET /api/dashboards...');
    const dbRes = await fetch(`${BASE_URL}/api/dashboards`);
    assert(dbRes.status === 200, 'Returns 200 OK');
    const dashboards = await dbRes.json() as any[];
    assert(Array.isArray(dashboards), 'Response is an array');
    assert(dashboards.length === 6, `Returns all 6 seeded dashboards (got ${dashboards.length})`);
    if (dashboards.length > 0) {
      assert(!!dashboards[0].name && !!dashboards[0].category && !!dashboards[0].powerBiUrl, 'Dashboard items contain proper fields');
    }

    // Test Case 3: GET dashboard by valid ID
    console.log('\nTesting GET /api/dashboards/:id (Valid ID)...');
    const dbDetailRes = await fetch(`${BASE_URL}/api/dashboards/1`);
    assert(dbDetailRes.status === 200, 'Returns 200 OK');
    const dashboard = await dbDetailRes.json() as any;
    assert(dashboard.id === 1, 'Returns correct dashboard with ID 1');
    assert(dashboard.category === 'census', 'Dashboard category is correct');

    // Test Case 4: GET dashboard by non-existent ID
    console.log('\nTesting GET /api/dashboards/:id (Non-existent ID)...');
    const dbNotFoundRes = await fetch(`${BASE_URL}/api/dashboards/999`);
    assert(dbNotFoundRes.status === 404, 'Returns 404 Not Found');
    const dbNotFoundJson = await dbNotFoundRes.json() as any;
    assert(dbNotFoundJson.error.includes('not found'), 'Returns proper error message');

    // Test Case 5: GET dashboard by invalid ID format (Validation check)
    console.log('\nTesting GET /api/dashboards/:id (Invalid ID format)...');
    const dbInvalidRes = await fetch(`${BASE_URL}/api/dashboards/abc`);
    assert(dbInvalidRes.status === 400, 'Returns 400 Bad Request');
    const dbInvalidJson = await dbInvalidRes.json() as any;
    assert(dbInvalidJson.error === 'Validation Error', 'Returns Validation Error header');
    assert(dbInvalidJson.details[0].field === 'id', 'Validation failure correctly flags the "id" field');

    // Test Case 6: GET analytics by valid category
    console.log('\nTesting GET /api/analytics/:category (Valid category)...');
    const analyticsRes = await fetch(`${BASE_URL}/api/analytics/ev`);
    assert(analyticsRes.status === 200, 'Returns 200 OK');
    const analytics = await analyticsRes.json() as any[];
    assert(Array.isArray(analytics), 'Response is an array');
    assert(analytics.length > 0, 'Returns a non-empty array of metrics');
    assert(analytics.every((m: any) => m.category === 'ev'), 'All metrics belong to category "ev"');

    // Test Case 7: GET analytics by invalid category (Validation check)
    console.log('\nTesting GET /api/analytics/:category (Invalid category)...');
    const analyticsInvalidRes = await fetch(`${BASE_URL}/api/analytics/transport`);
    assert(analyticsInvalidRes.status === 400, 'Returns 400 Bad Request');
    const analyticsInvalidJson = await analyticsInvalidRes.json() as any;
    assert(analyticsInvalidJson.error === 'Validation Error', 'Returns validation error header');
    assert(analyticsInvalidJson.details[0].message.includes('Category must be one of'), 'Returns correct enum validation failure message');

    // Test Case 8: POST insights without auth token (Protected route check)
    console.log('\nTesting POST /api/insights (No authentication)...');
    const insightNoAuthRes = await fetch(`${BASE_URL}/api/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'census' })
    });
    assert(insightNoAuthRes.status === 401, 'Returns 401 Unauthorized');
    const insightNoAuthJson = await insightNoAuthRes.json() as any;
    assert(insightNoAuthJson.error.includes('missing'), 'Error flags missing access token');

    // Test Case 9: POST auth login (Invalid credentials)
    console.log('\nTesting POST /api/auth/login (Invalid credentials)...');
    const loginInvalidRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
    });
    assert(loginInvalidRes.status === 401, 'Returns 401 Unauthorized');
    const loginInvalidJson = await loginInvalidRes.json() as any;
    assert(loginInvalidJson.error.includes('Invalid'), 'Error flags invalid credentials');

    // Test Case 10: POST auth login (Valid credentials)
    console.log('\nTesting POST /api/auth/login (Valid credentials)...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    assert(loginRes.status === 200, 'Returns 200 OK');
    const loginJson = await loginRes.json() as any;
    assert(!!loginJson.token, 'Response contains a JWT token');
    assert(loginJson.user.username === 'admin', 'Response returns correct user name');
    jwtToken = loginJson.token; // Save token for subsequent tests

    // Test Case 11: POST insights with valid auth token
    console.log('\nTesting POST /api/insights (Valid JWT authentication)...');
    const insightRes = await fetch(`${BASE_URL}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ category: 'ev' })
    });
    assert(insightRes.status === 200, 'Returns 200 OK');
    const insightJson = await insightRes.json() as any;
    assert(insightJson.category === 'ev', 'Returns insight for requested category');
    assert(!!insightJson.summary, 'Contains simulated AI summary text');
    assert(Array.isArray(insightJson.keyTakeaways) && insightJson.keyTakeaways.length > 0, 'Contains structured key takeaways');
    assert(Array.isArray(insightJson.recommendations) && insightJson.recommendations.length > 0, 'Contains actionable recommendations');

    // Test Case 12: POST insights with valid auth token but invalid body category
    console.log('\nTesting POST /api/insights (Valid JWT, Invalid category body)...');
    const insightBadCatRes = await fetch(`${BASE_URL}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ category: 'blockchain' })
    });
    assert(insightBadCatRes.status === 400, 'Returns 400 Bad Request');
    const insightBadCatJson = await insightBadCatRes.json() as any;
    assert(insightBadCatJson.error === 'Validation Error', 'Returns validation error header');

    // Test Case 13: OpenAPI Spec endpoint
    console.log('\nTesting GET /openapi.json...');
    const specRes = await fetch(`${BASE_URL}/openapi.json`);
    assert(specRes.status === 200, 'Returns 200 OK');
    const specJson = await specRes.json() as any;
    assert(specJson.openapi === '3.0.0', 'Returns valid OpenAPI v3 spec');
    assert(!!specJson.paths['/api/dashboards'], 'OpenAPI spec contains path info for dashboards');

    console.log('\n----------------------------------------');
    if (failed) {
      console.error('✗ SOME TESTS FAILED. CHECK LOGS ABOVE.');
      cleanupAndExit(1);
    } else {
      console.log('✓ ALL ENDPOINT INTEGRATION TESTS PASSED!');
      cleanupAndExit(0);
    }
  } catch (err) {
    console.error('Fatal error during test execution:', err);
    cleanupAndExit(1);
  }
}

function cleanupAndExit(code: number) {
  if (server) {
    server.close(() => {
      console.log('Test server closed.');
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

runTests();
