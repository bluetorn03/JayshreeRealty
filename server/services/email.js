import nodemailer from 'nodemailer';

export const sendLeadEmailNotification = async (leadData) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER || 'jayshreerealty16@gmail.com';
  const pass = process.env.SMTP_PASS || '';
  const receiver = process.env.RECEIVER_EMAIL || 'jayshreerealty16@gmail.com';

  if (!pass || pass === 'your_app_password_here' || pass === 'your_gmail_app_password_here' || pass === 'HostingerEmailPassword') {
    console.warn('[SMTP Warning] SMTP_PASS is not fully configured in .env. Lead saved to database.');
    return { success: true, emailSent: false, note: 'Lead saved to database, SMTP password placeholder skipped' };
  }

  // Gmail SMTP Transport
  const isGmail = host.includes('gmail.com');
  const transporter = nodemailer.createTransport(
    isGmail && port === 465
      ? {
          service: 'gmail',
          auth: { user, pass }
        }
      : {
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        }
  );

  const visitorName = leadData.name || 'Valued Prospect';
  const visitorPhone = leadData.phone || 'N/A';
  const visitorEmail = leadData.email || 'No email provided';
  const formName = leadData.cta_source || leadData.form_source || leadData.lead_source || 'Website Form';
  const pageName = leadData.page_name || leadData.page_source || 'Home';
  const requirement = leadData.requirement || 'N/A';
  const budget = leadData.budget || 'N/A';
  const preferredArea = leadData.preferred_area || 'N/A';
  const message = leadData.message || 'No additional notes provided.';
  const timestampStr = leadData.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Extended Attribution Fields
  const buttonSource = leadData.button_source || 'N/A';
  const propertySource = leadData.property_source || 'N/A';
  const deviceInfo = leadData.device_info || 'Unknown Device';
  const trafficSource = leadData.traffic_source || 'Direct';
  const utmSource = leadData.utm_source || '';
  const utmMedium = leadData.utm_medium || '';
  const utmCampaign = leadData.utm_campaign || '';

  const utmString = [
    utmSource && `Source: ${utmSource}`,
    utmMedium && `Medium: ${utmMedium}`,
    utmCampaign && `Campaign: ${utmCampaign}`
  ].filter(Boolean).join(' | ') || 'None';

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #070b19; color: #e2e8f0; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; text-align: center; border-bottom: 2px solid #c5a059; }
      .header h1 { color: #c5a059; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
      .header p { color: #94a3b8; margin: 5px 0 0 0; font-size: 13px; }
      .badge { display: inline-block; background: rgba(197, 160, 89, 0.15); color: #c5a059; border: 1px solid rgba(197, 160, 89, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
      .content { padding: 24px; }
      .field-group { margin-bottom: 16px; border-bottom: 1px dashed #334155; padding-bottom: 12px; }
      .field-group:last-child { border-bottom: none; }
      .label { font-size: 12px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 4px; }
      .value { font-size: 15px; color: #f8fafc; font-weight: 500; }
      .highlight-box { background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-left: 4px solid #c5a059; padding: 14px; border-radius: 6px; margin: 16px 0; }
      .btn { display: inline-block; background: #c5a059; color: #070b19; padding: 12px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; text-align: center; margin-top: 16px; }
      .footer { background: #070b19; text-align: center; padding: 16px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>JAYSHREE REALTY</h1>
        <p>New High-Intent Property Inquiry Received</p>
        <div class="badge">${formName}</div>
      </div>
      <div class="content">
        <div class="field-group">
          <div class="label">Prospect Name</div>
          <div class="value">${visitorName}</div>
        </div>
        <div class="field-group">
          <div class="label">Phone Number</div>
          <div class="value"><a href="tel:${visitorPhone}" style="color:#c5a059; text-decoration:none;">${visitorPhone}</a></div>
        </div>
        <div class="field-group">
          <div class="label">Email Address</div>
          <div class="value">${visitorEmail}</div>
        </div>
        <div class="field-group">
          <div class="label">Requirement & Budget</div>
          <div class="value">${requirement} (${budget}) - ${preferredArea}</div>
        </div>
        ${propertySource !== 'N/A' ? `
        <div class="field-group">
          <div class="label">Property Source</div>
          <div class="value" style="color:#c5a059;">${propertySource}</div>
        </div>` : ''}
        <div class="highlight-box">
          <div class="label">Message / Details</div>
          <div class="value" style="margin-top:4px;">${message}</div>
        </div>
        <div class="field-group">
          <div class="label">Submission Attribution</div>
          <div class="value" style="font-size:13px; color:#94a3b8;">
            Page: ${pageName} | Button: ${buttonSource}<br/>
            Device: ${deviceInfo} | Traffic: ${trafficSource}<br/>
            UTM Parameters: ${utmString}<br/>
            Date & Time: ${timestampStr}
          </div>
        </div>
        ${
          visitorEmail && visitorEmail.includes('@')
            ? `<div style="text-align: center;">
                <a href="mailto:${visitorEmail}?subject=Re:%20Inquiry%20with%20Jayshree%20Realty" class="btn">Reply via Email Directly</a>
               </div>`
            : ''
        }
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Jayshree Realty Gmail Lead Notification System.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"Jayshree Realty Leads" <${user}>`,
    to: receiver,
    replyTo: visitorEmail && visitorEmail.includes('@') ? visitorEmail : user,
    subject: `🚨 New Lead: ${visitorName} (${visitorPhone}) - ${formName}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Gmail SMTP Success] Email sent:', info.messageId);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Gmail SMTP Error] Failed to send email:', error.message);
    return { success: true, emailSent: false, error: error.message };
  }
};
