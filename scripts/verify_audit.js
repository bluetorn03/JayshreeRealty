import { spawn } from 'child_process';

async function runVerification() {
  console.log('--- Starting Server Verification Test ---');

  const serverProcess = spawn('node', ['server/index.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '5055', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverOutput = '';
  serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    serverOutput += text;
    console.log('[Server Out]:', text.trim());
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('[Server Err]:', data.toString().trim());
  });

  // Wait 6 seconds for server startup
  await new Promise(r => setTimeout(r, 6000));

  try {
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await fetch('http://localhost:5055/api/health');
    const healthData = await healthRes.json();
    console.log('Health Status Code:', healthRes.status);
    console.log('Health Response:', healthData);

    console.log('\n--- 2. Testing GET /admin ---');
    const adminRes = await fetch('http://localhost:5055/admin');
    console.log('Admin Status Code:', adminRes.status);
    console.log('Admin Content-Type:', adminRes.headers.get('content-type'));

    console.log('\n--- 3. Testing GET /admin/ ---');
    const adminSlashRes = await fetch('http://localhost:5055/admin/');
    console.log('Admin/ Status Code:', adminSlashRes.status);
    console.log('Admin/ Content-Type:', adminSlashRes.headers.get('content-type'));

    console.log('\n--- 4. Testing POST /api/test-email ---');
    const emailRes = await fetch('http://localhost:5055/api/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: 'jayshreerealty16@gmail.com' })
    });
    const emailData = await emailRes.json();
    console.log('Test Email Status Code:', emailRes.status);
    console.log('Test Email Result:', emailData);

  } catch (err) {
    console.error('Verification error:', err.message);
  } finally {
    serverProcess.kill('SIGTERM');
    console.log('\n--- Verification Finished ---');
    process.exit(0);
  }
}

runVerification();
