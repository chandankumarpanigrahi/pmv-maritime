export function generateSubmissionEmailHTML({ fullName, email, query, message, dateTime }) {
  const categoryMap = {
    general: "General Inquiry",
    consultancy: "Technical Consultancy",
    training: "Maritime Training",
    fleet: "Fleet Management",
    crew: "Crew Management",
    digital: "Digital Solutions",
    others: "Others",
  };

  const categoryLabel = categoryMap[query] || query || "General Inquiry";

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Submission Received</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-collapse: collapse;">
      
      <!-- Header -->
      <tr>
        <td style="background-color: #005978; padding: 25px 30px; text-align: center; border-bottom: 4px solid #AD1D41;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
            PMV Maritime Solutions<span style="color: #AD1D41;">.</span>
          </h1>
          <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
            New Contact Submission Received
          </p>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td style="padding: 30px;">
          <!-- Category Badge -->
          <div style="margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #005978; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              Category: ${categoryLabel}
            </span>
          </div>

          <!-- Client Info Grid -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding-bottom: 15px;">
                <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                  Full Name
                </div>
                <div style="font-size: 16px; color: #0f172a; font-weight: 700;">
                  ${fullName}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 15px;">
                <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                  Email Address
                </div>
                <div style="font-size: 15px; color: #007BA7; font-weight: 600; font-family: monospace;">
                  <a href="mailto:${email}" style="color: #007BA7; text-decoration: none;">${email}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 15px;">
                <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                  Submission Date & Time
                </div>
                <div style="font-size: 13px; color: #475569; font-weight: 500;">
                  ${dateTime || new Date().toLocaleString()}
                </div>
              </td>
            </tr>
          </table>

          <!-- Message Box -->
          <div style="margin-bottom: 25px;">
            <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
              Message Content
            </div>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #AD1D41; padding: 16px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">
              ${message}
            </div>
          </div>

          <!-- Action Button -->
          <div style="text-align: left;">
            <a href="mailto:${email}?subject=RE:%20${encodeURIComponent(categoryLabel)}%20Inquiry%20-%20PMV%20Maritime" style="display: inline-block; background-color: #AD1D41; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              Reply Directly to Client
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
          &copy; ${new Date().getFullYear()} <strong>PMV Maritime Solutions</strong>. All rights reserved.<br>
          IFZA Properties, Dubai Silicon Oasis, UAE
        </td>
      </tr>

    </table>
  </body>
</html>
  `;
}
