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

<body
    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-collapse: collapse;">

        <!-- Header -->
        <tr>
            <td
                style="background-color: #02506b; padding: 16px 30px; text-align: center; border-bottom: 7px solid #AD1D41;">
                <h1
                    style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                    PMV Maritime Solutions
                </h1>
                <p
                    style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    New Contact Submission Received
                </p>
            </td>
        </tr>

        <!-- Body Content -->
        <tr>
            <td style="padding: 30px;">
                <!-- Category Badge -->
                <div style="margin-bottom: 20px;">
                    <span
                        style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #005978; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                        Category: ${categoryLabel}
                    </span>
                </div>

                <!-- Client Info Grid -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <div
                                style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                                Full Name
                            </div>
                            <div style="font-size: 15px; color: #242424; font-weight: 600;">
                                ${fullName}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <div
                                style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                                Email Address
                            </div>
                            <div style="font-size: 15px; color: #007BA7; font-weight: 600;">
                                <a href="mailto:${email}" style="color: #007BA7; text-decoration: none;">${email}</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <div
                                style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                                Submission Date & Time
                            </div>
                            <div style="font-size: 15px; color: #242424; font-weight: 600;">
                                ${dateTime || new Date().toLocaleString()}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <div
                                style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                                Message Content
                            </div>
                            <div style="font-size: 15px; color: #242424; font-weight: 600;">
                                ${message}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td
                style="background-color: #ad1d41;padding: 13px;text-align: center;font-size: 12px;color: #ffffff; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} <strong>PMV Maritime Solutions</strong>. All rights reserved.<br>
                IFZA Properties, Dubai Silicon Oasis, UAE
            </td>
        </tr>

    </table>
</body>

</html>
  `;
}

export function generateUserCredentialsEmailHTML({ fullName, username, email, password, loginUrl = "https://pmvmaritime.com/admin" }) {
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PMV Maritime Admin Access Credentials</title>
</head>

<body
    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 25px 15px; color: #334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-collapse: collapse; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">

        <!-- Header -->
        <tr>
            <td
                style="background-color: #02506b; padding: 24px 30px; text-align: center; border-bottom: 5px solid #AD1D41;">
                <h1
                    style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                    PMV Maritime Solutions
                </h1>
                <p
                    style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    Administrative Portal Access
                </p>
            </td>
        </tr>

        <!-- Body Content -->
        <tr>
            <td style="padding: 32px 30px 24px 30px;">
                <!-- Welcome Title -->
                <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0; font-weight: 700;">
                    Hello ${fullName || username},
                </h2>
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                    You have access to <strong>pmvmaritime.com</strong> admin panel. Below are your official login credentials to access the management portal:
                </p>

                <!-- Credentials Card -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #005978; margin: 20px 0; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; width: 35%; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                            User ID
                        </td>
                        <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #02506b; font-family: 'Courier New', Courier, monospace;">
                            ${username}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                            Email
                        </td>
                        <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #1e293b;">
                            <a href="mailto:${email}" style="color: #007BA7; text-decoration: none;">${email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                            Password
                        </td>
                        <td style="padding: 12px 18px; font-size: 14px; font-weight: 700; color: #AD1D41; font-family: 'Courier New', Courier, monospace; letter-spacing: 0.5px;">
                            ${password}
                        </td>
                    </tr>
                </table>

                <!-- Action Button -->
                <div style="text-align: center; margin: 28px 0 20px 0;">
                    <a href="${loginUrl}" target="_blank"
                        style="display: inline-block; background-color: #02506b; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px 32px; text-decoration: none; border-radius: 2px; box-shadow: 0 2px 4px rgba(2, 80, 107, 0.2);">
                        Access Admin Panel
                    </a>
                </div>

                <!-- Password Change Notice -->
                <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-top: 10px;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #92400e; font-weight: 600;">
                        <strong>Security Notice:</strong> You can change your password later anytime directly from the admin panel under the password settings.
                    </p>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td
                style="background-color: #ad1d41; padding: 14px 20px; text-align: center; font-size: 11px; color: #ffffff; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} <strong>PMV Maritime Solutions</strong>. All rights reserved.<br>
                IFZA Properties, Dubai Silicon Oasis, UAE
            </td>
        </tr>

    </table>
</body>

</html>
  `;
}

export function generatePasswordChangedEmailHTML({ fullName, username, newPassword, dateTime, loginUrl = "https://pmvmaritime.com/admin" }) {
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PMV Maritime Password Has Been Changed</title>
</head>

<body
    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 25px 15px; color: #334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-collapse: collapse; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">

        <!-- Header -->
        <tr>
            <td
                style="background-color: #02506b; padding: 24px 30px; text-align: center; border-bottom: 5px solid #AD1D41;">
                <h1
                    style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                    PMV Maritime Solutions
                </h1>
                <p
                    style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    Account Security Notification
                </p>
            </td>
        </tr>

        <!-- Body Content -->
        <tr>
            <td style="padding: 32px 30px 24px 30px;">
                <!-- Welcome Title -->
                <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0; font-weight: 700;">
                    Hello ${fullName || username},
                </h2>
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0;">
                    Your password was successfully updated.
                </p>

                <!-- New Password Card -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #005978; padding: 14px 18px; margin: 18px 0;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Your new password is:
                    </div>
                    <div style="font-size: 16px; font-weight: 700; color: #AD1D41; font-family: 'Courier New', Courier, monospace; letter-spacing: 0.5px;">
                        ${newPassword}
                    </div>
                </div>

                <!-- Security & Date/Time Notice -->
                <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 16px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e; font-weight: 600;">
                        Your password was changed. If you did not make this change, please contact the administrator immediately.
                    </p>
                </div>

                <!-- Action Button -->
                <div style="text-align: center; margin: 28px 0 20px 0;">
                    <a href="${loginUrl}" target="_blank"
                        style="display: inline-block; background-color: #02506b; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px 32px; text-decoration: none; border-radius: 2px; box-shadow: 0 2px 4px rgba(2, 80, 107, 0.2);">
                        Access Admin Panel
                    </a>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td
                style="background-color: #ad1d41; padding: 14px 20px; text-align: center; font-size: 11px; color: #ffffff; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} <strong>PMV Maritime Solutions</strong>. All rights reserved.<br>
                IFZA Properties, Dubai Silicon Oasis, UAE
            </td>
        </tr>

    </table>
</body>

</html>
  `;
}


