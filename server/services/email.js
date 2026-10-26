import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Sanitizes header text to prevent SMTP header injection attacks (CRLF injection).
 */
function sanitizeHeader(value) {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/[\r\n\0]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Validates that an email address has a standard structure without newline injection.
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (/[\r\n\0]/.test(trimmed)) return false;
  // Strict standard email pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Escapes HTML characters in user inputs to prevent HTML/script injection in email clients.
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const str = String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Dynamically read environment configuration on every send
 * so changes in .env take effect immediately without requiring process restart.
 */
export function getMailConfig() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envPath));
      Object.assign(process.env, parsed);
    }
  } catch (e) {
    // Fall back to existing process.env
  }

  const host = sanitizeHeader(process.env.SMTP_HOST || 'smtp.hostinger.com');
  const port = parseInt((process.env.SMTP_PORT || '465').replace(/["']/g, '').trim(), 10) || 465;
  const user = sanitizeHeader(process.env.SMTP_USER || 'info@jayshreerealty.com');
  const rawPass = process.env.SMTP_PASS || '';
  const pass = rawPass.replace(/["']/g, '').replace(/\s+/g, '').trim();
  const fromEmail = sanitizeHeader(process.env.SMTP_FROM || user || 'info@jayshreerealty.com');
  const receiver = sanitizeHeader(process.env.RECEIVER_EMAIL || 'info@jayshreerealty.com');

  return { host, port, user, pass, fromEmail, receiver };
}

/**
 * Creates and configures the Nodemailer transporter for Hostinger SMTP.
 */
export function createTransporter(customConfig = null) {
  const config = customConfig || getMailConfig();
  const isSecure = config.port === 465;

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: isSecure, // true for port 465 (SSL), false for 587 (TLS/STARTTLS)
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10s timeout
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

/**
 * Verifies Hostinger SMTP connectivity without sending an email.
 * Safe for server startup checks and diagnostic endpoints.
 */
export const verifySmtpConnection = async () => {
  const config = getMailConfig();

  if (!config.pass || config.pass.startsWith('your_') || config.pass.toLowerCase().includes('placeholder')) {
    return {
      verified: false,
      host: config.host,
      port: config.port,
      user: config.user,
      message: 'SMTP_PASS is not configured in .env (placeholder or empty)'
    };
  }

  const transporter = createTransporter(config);
  try {
    await transporter.verify();
    return {
      verified: true,
      host: config.host,
      port: config.port,
      user: config.user,
      message: 'Hostinger SMTP connection verified successfully'
    };
  } catch (error) {
    return {
      verified: false,
      host: config.host,
      port: config.port,
      user: config.user,
      message: error.message || 'SMTP authentication failed'
    };
  }
};

/**
 * Sends a rich, branded email notification for incoming property leads, contact forms, and inquiries.
 * Guarantees that inquiries are not lost if sending fails.
 */
export const sendLeadEmailNotification = async (leadData) => {
  const { host, port, user, pass, fromEmail, receiver } = getMailConfig();

  // Validate credentials presence
  if (!pass || pass.startsWith('your_') || pass.toLowerCase().includes('placeholder') || pass === 'HostingerEmailPassword') {
    console.warn('[Hostinger SMTP Warning] SMTP_PASS is not configured in .env. Lead saved to database.');
    return {
      success: true,
      emailSent: false,
      note: 'Lead preserved in database; SMTP_PASS is not configured in .env'
    };
  }

  const transporter = createTransporter({ host, port, user, pass, fromEmail, receiver });

  // Sanitize headers and fields
  const rawVisitorName = leadData.name || 'Valued Prospect';
  const visitorName = sanitizeHeader(rawVisitorName);
  const visitorPhone = sanitizeHeader(leadData.phone || 'N/A');
  const rawEmail = (leadData.email || '').trim();
  const visitorEmail = isValidEmail(rawEmail) ? rawEmail : '';
  const formName = sanitizeHeader(leadData.cta_source || leadData.form_source || leadData.lead_source || 'Website Inquiry');
  const pageName = sanitizeHeader(leadData.page_name || leadData.page_source || 'Website');
  const propertySource = sanitizeHeader(leadData.property_source || 'N/A');
  const buttonSource = sanitizeHeader(leadData.button_source || 'N/A');
  const deviceInfo = sanitizeHeader(leadData.device_info || 'Unknown Device');
  const trafficSource = sanitizeHeader(leadData.traffic_source || 'Direct');

  const requirement = leadData.requirement || 'N/A';
  const budget = leadData.budget || 'N/A';
  const preferredArea = leadData.preferred_area || 'N/A';
  const message = leadData.message || 'No additional notes provided.';
  const timestampStr = leadData.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Safe UTM attribution formatting
  const utmSource = sanitizeHeader(leadData.utm_source || '');
  const utmMedium = sanitizeHeader(leadData.utm_medium || '');
  const utmCampaign = sanitizeHeader(leadData.utm_campaign || '');
  const utmString = [
    utmSource && `Source: ${utmSource}`,
    utmMedium && `Medium: ${utmMedium}`,
    utmCampaign && `Campaign: ${utmCampaign}`
  ].filter(Boolean).join(' | ') || 'None';

  // HTML entity encoded values for email body
  const safeName = escapeHtml(visitorName);
  const safePhone = escapeHtml(visitorPhone);
  const safeEmail = escapeHtml(visitorEmail || 'No email provided');
  const safeFormName = escapeHtml(formName);
  const safeRequirement = escapeHtml(requirement);
  const safeBudget = escapeHtml(budget);
  const safePreferredArea = escapeHtml(preferredArea);
  const safePropertySource = escapeHtml(propertySource);
  const safeMessage = escapeHtml(message);
  const safePageName = escapeHtml(pageName);
  const safeButtonSource = escapeHtml(buttonSource);
  const safeDeviceInfo = escapeHtml(deviceInfo);
  const safeTrafficSource = escapeHtml(trafficSource);
  const safeUtm = escapeHtml(utmString);
  const safeTimestamp = escapeHtml(timestampStr);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Property Inquiry - Jayshree Realty</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070b19; color: #e2e8f0; margin: 0; padding: 20px; }
      .container { max-width: 620px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .header { background: linear-gradient(135deg, #0b1120 0%, #1a2234 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #c5a059; }
      .brand-title { color: #c5a059; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
      .brand-subtitle { color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; font-weight: 500; }
      .badge { display: inline-block; background: rgba(197, 160, 89, 0.15); color: #e5c178; border: 1px solid rgba(197, 160, 89, 0.35); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 12px; letter-spacing: 0.5px; }
      .content { padding: 28px 24px; }
      .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #c5a059; font-weight: 700; margin: 0 0 14px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
      .field-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .field-table td { padding: 8px 0; vertical-align: top; }
      .field-label { width: 35%; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; font-weight: 600; }
      .field-value { width: 65%; font-size: 14px; color: #f8fafc; font-weight: 500; }
      .field-value a { color: #c5a059; text-decoration: none; font-weight: 600; }
      .field-value a:hover { text-decoration: underline; }
      .highlight-box { background: rgba(15, 23, 42, 0.9); border: 1px solid #1e293b; border-left: 4px solid #c5a059; padding: 14px 16px; border-radius: 8px; margin: 18px 0; }
      .highlight-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 600; }
      .highlight-text { font-size: 14px; color: #f1f5f9; line-height: 1.6; }
      .btn-container { text-align: center; margin: 24px 0 12px 0; }
      .btn { display: inline-block; background: #c5a059; color: #070b19 !important; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; }
      .meta-box { background: #070b19; border: 1px solid #1e293b; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #94a3b8; line-height: 1.6; margin-top: 20px; }
      .footer { background: #070b19; text-align: center; padding: 18px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="brand-title">Jayshree Realty</h1>
        <p class="brand-subtitle">High-Intent Real Estate Lead Notification</p>
        <div class="badge">${safeFormName}</div>
      </div>
      <div class="content">
        <div class="section-title">Prospect Details</div>
        <table class="field-table">
          <tr>
            <td class="field-label">Name:</td>
            <td class="field-value">${safeName}</td>
          </tr>
          <tr>
            <td class="field-label">Phone:</td>
            <td class="field-value"><a href="tel:${safePhone}">${safePhone}</a></td>
          </tr>
          <tr>
            <td class="field-label">Email:</td>
            <td class="field-value">${visitorEmail ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : safeEmail}</td>
          </tr>
          <tr>
            <td class="field-label">Requirement:</td>
            <td class="field-value">${safeRequirement} (${safeBudget})</td>
          </tr>
          <tr>
            <td class="field-label">Preferred Area:</td>
            <td class="field-value">${safePreferredArea}</td>
          </tr>
          ${propertySource !== 'N/A' ? `
          <tr>
            <td class="field-label">Property Source:</td>
            <td class="field-value" style="color:#c5a059; font-weight:600;">${safePropertySource}</td>
          </tr>` : ''}
        </table>

        <div class="highlight-box">
          <div class="highlight-label">Inquiry Message / Notes</div>
          <div class="highlight-text">${safeMessage}</div>
        </div>

        <div class="section-title">Traffic & Attribution Metadata</div>
        <div class="meta-box">
          <strong>Page:</strong> ${safePageName} | <strong>Button:</strong> ${safeButtonSource}<br/>
          <strong>Device:</strong> ${safeDeviceInfo} | <strong>Traffic Source:</strong> ${safeTrafficSource}<br/>
          <strong>Campaign (UTM):</strong> ${safeUtm}<br/>
          <strong>Date & Time:</strong> ${safeTimestamp}
        </div>

        ${
          visitorEmail
            ? `<div class="btn-container">
                <a href="mailto:${safeEmail}?subject=Re:%20Inquiry%20with%20Jayshree%20Realty" class="btn">Reply to Prospect via Email</a>
               </div>`
            : ''
        }
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Jayshree Realty Hostinger Mailbox System. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  // Header injection safe mail options
  const mailOptions = {
    from: `"Jayshree Realty Leads" <${fromEmail}>`,
    to: receiver,
    replyTo: visitorEmail ? visitorEmail : fromEmail,
    subject: `🚨 New Lead: ${visitorName} (${visitorPhone}) - ${formName}`,
    text: `New Lead: ${visitorName} (${visitorPhone}) | Requirement: ${requirement} (${budget}) - ${preferredArea} | Message: ${message}`,
    html: htmlContent,
  };

  let attempts = 0;
  const maxAttempts = 3;
  let lastError = null;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Hostinger SMTP Success] Email sent (attempt ${attempts}/${maxAttempts}):`, info.messageId);
      return { success: true, emailSent: true, messageId: info.messageId, attempts };
    } catch (error) {
      lastError = error;
      console.error(`[Hostinger SMTP Warning] Attempt ${attempts}/${maxAttempts} failed:`, error.message);
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, attempts * 1000)); // 1s, 2s exponential backoff
      }
    }
  }

  console.error('[Hostinger SMTP Error] All delivery attempts failed:', lastError?.message);
  return { success: true, emailSent: false, error: lastError?.message, attempts };
};

/**
 * Diagnostic test email executor for production verification.
 * Verifies credentials and sends a formatted test email to verify delivery.
 */
export const executeTestEmailAudit = async (customRecipient = null) => {
  const config = getMailConfig();
  const host = config.host;
  const port = config.port;
  const user = config.user;
  const pass = config.pass;
  const fromEmail = config.fromEmail;
  const receiver = sanitizeHeader(customRecipient || config.receiver || 'info@jayshreerealty.com');

  const auditLog = {
    smtp_host: host,
    smtp_port: port,
    smtp_user: user,
    smtp_from: fromEmail,
    receiver_email: receiver,
    transporter_verified: false,
    email_sent: false,
    message_id: null,
    smtp_response: null,
    status_code: 500,
    failure_reason: null
  };

  if (!pass || pass.startsWith('your_') || pass.toLowerCase().includes('placeholder')) {
    auditLog.failure_reason = 'SMTP_PASS environment variable is not configured or contains placeholder';
    auditLog.status_code = 401;
    return { success: false, ...auditLog };
  }

  const transporter = createTransporter(config);

  try {
    await transporter.verify();
    auditLog.transporter_verified = true;

    const info = await transporter.sendMail({
      from: `"Jayshree Realty System Audit" <${fromEmail}>`,
      to: receiver,
      subject: 'Jayshree Realty — Hostinger Email SMTP Verification',
      text: `Hostinger SMTP is operational on ${host}:${port}. Sent at ${new Date().toISOString()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; padding: 24px; background-color: #070b19; color: #ffffff; border-radius: 10px; max-width: 550px;">
          <h2 style="color: #c5a059; margin-top: 0;">Jayshree Realty — Hostinger Email Verified</h2>
          <p style="color: #e2e8f0; line-height: 1.6;">
            This confirmation email verifies that the Hostinger Mailbox SMTP connection is fully operational and delivering emails securely.
          </p>
          <div style="background: #0f172a; border: 1px solid #1e293b; border-left: 4px solid #c5a059; padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 13px; color: #94a3b8;">
            <p style="margin: 4px 0;"><strong>Host:</strong> ${escapeHtml(host)}</p>
            <p style="margin: 4px 0;"><strong>Port:</strong> ${escapeHtml(String(port))} (SSL/TLS)</p>
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${escapeHtml(fromEmail)}</p>
            <p style="margin: 4px 0;"><strong>Recipient:</strong> ${escapeHtml(receiver)}</p>
            <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
            © ${new Date().getFullYear()} Jayshree Realty Production Infrastructure.
          </p>
        </div>
      `
    });

    auditLog.email_sent = true;
    auditLog.message_id = info.messageId;
    auditLog.smtp_response = info.response;
    auditLog.status_code = 200;
    return { success: true, ...auditLog };
  } catch (error) {
    auditLog.failure_reason = error.message || 'SMTP operation failed';
    auditLog.status_code = error.responseCode || 500;
    console.error('[Hostinger SMTP Audit Error]', error.message);
    return { success: false, ...auditLog };
  }
};

export const sendTestEmail = async () => {
  return executeTestEmailAudit();
};
