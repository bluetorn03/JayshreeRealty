import { spawn } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

async function runVerification() {
  console.log('==================================================');
  console.log('PRODUCTION AUDIT FULL VERIFICATION SUITE');
  console.log('==================================================');

  const testPort = '5099';
  const serverProcess = spawn('node', ['server/index.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: testPort, NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverOutput = '';
  serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    serverOutput += text;
    process.stdout.write('[Server Log]: ' + text);
  });

  serverProcess.stderr.on('data', (data) => {
    process.stderr.write('[Server Err]: ' + data.toString());
  });

  // Wait for server to initialize and start listening
  await new Promise(r => setTimeout(r, 8000));

  const baseUrl = `http://localhost:${testPort}`;

  try {
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log('Health Status Code:', healthRes.status);
    console.log('Health Response:', healthData);

    console.log('\n--- 2. Testing GET /admin & GET /admin/ ---');
    const adminRes = await fetch(`${baseUrl}/admin`);
    console.log('GET /admin Status Code:', adminRes.status);
    console.log('GET /admin Content-Type:', adminRes.headers.get('content-type'));

    const adminSlashRes = await fetch(`${baseUrl}/admin/`);
    console.log('GET /admin/ Status Code:', adminSlashRes.status);
    console.log('GET /admin/ Content-Type:', adminSlashRes.headers.get('content-type'));

    console.log('\n--- 3. Testing POST /api/test-email ---');
    const emailRes = await fetch(`${baseUrl}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: 'jayshreerealty16@gmail.com' })
    });
    const emailData = await emailRes.json();
    console.log('Test Email Status Code:', emailRes.status);
    console.log('Test Email Result:', JSON.stringify(emailData, null, 2));

    console.log('\n--- 4. Testing POST /api/leads & Duplicate Prevention ---');
    const testPhone = `9892${Math.floor(100000 + Math.random() * 900000)}`;
    const leadPayload = {
      name: 'Production Audit Prospect',
      phone: testPhone,
      email: 'jayshreerealty16@gmail.com',
      requirement: '3 BHK Luxury Apartment in Nerul',
      budget: '₹2.5 Cr',
      preferredArea: 'Nerul Palm Beach Road',
      leadSource: 'Audit Verification Suite'
    };

    const leadRes1 = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    });
    const leadData1 = await leadRes1.json();
    console.log('Lead Submission 1 Status:', leadRes1.status);
    console.log('Lead Submission 1 Response:', leadData1);

    // Immediate duplicate attempt
    const leadRes2 = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    });
    const leadData2 = await leadRes2.json();
    console.log('Lead Submission 2 (Duplicate) Status:', leadRes2.status);
    console.log('Lead Submission 2 Response:', leadData2);

  } catch (err) {
    console.error('Verification suite error:', err);
  } finally {
    serverProcess.kill('SIGTERM');
    console.log('\n==================================================');
    console.log('VERIFICATION SUITE COMPLETED');
    console.log('==================================================');
    process.exit(0);
  }
}

runVerification();
