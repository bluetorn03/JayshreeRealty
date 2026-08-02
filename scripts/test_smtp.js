import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const host = (process.env.SMTP_HOST || 'smtp.gmail.com').replace(/["']/g, '').trim();
const port = parseInt((process.env.SMTP_PORT || '465').replace(/["']/g, '').trim(), 10);
const user = (process.env.SMTP_USER || 'jayshreerealty16@gmail.com').replace(/["']/g, '').trim();
const rawPass = process.env.SMTP_PASS || '';
const pass = rawPass.replace(/["']/g, '').replace(/\s+/g, '').trim();
const fromEmail = (process.env.SMTP_FROM || user).replace(/["']/g, '').trim();
const receiver = (process.env.RECEIVER_EMAIL || 'jayshreerealty16@gmail.com').replace(/["']/g, '').trim();

console.log('--- SMTP Audit Credentials ---');
console.log('SMTP_HOST:', host);
console.log('SMTP_PORT:', port);
console.log('SMTP_USER:', user);
console.log('SMTP_FROM:', fromEmail);
console.log('RECEIVER_EMAIL:', receiver);
console.log('SMTP_PASS Length:', pass.length);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  tls: { rejectUnauthorized: false }
});

async function runTest() {
  try {
    console.log('Verifying transporter connection...');
    await transporter.verify();
    console.log('✔ Transporter verification successful!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Jayshree Realty System Audit" <${fromEmail}>`,
      to: receiver,
      subject: 'Jayshree Realty Production Test',
      text: 'This is a production verification email.',
      html: '<p>This is a production verification email.</p>'
    });

    console.log('✔ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('SMTP Response:', info.response);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
  } catch (err) {
    console.error('✘ SMTP Error:', err.message);
    if (err.response) console.error('SMTP Error Response:', err.response);
    if (err.code) console.error('SMTP Error Code:', err.code);
  }
}

runTest();
