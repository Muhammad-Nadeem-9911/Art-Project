const getEmailTemplate = ({ title, body, button }) => {
    const buttonHtml = button 
        ? `<a href="${button.link}" style="background: linear-gradient(to right, #0078D7, #00BCF2, #35C759); color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(0, 188, 242, 0.4);">
             ${button.text}
           </a>`
        : '';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1a1a1a;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #2c2c2c; border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                        <tr>
                            <td align="center" style="padding: 40px 0; background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Iram Ali Art</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                                <h2 style="color: #ffffff; margin-top: 0;">${title}</h2>
                                ${body}
                            </td>
                        </tr>
                        ${button ? `
                        <tr>
                            <td align="center" style="padding: 0 30px 40px 30px;">
                                ${buttonHtml}
                            </td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td align="center" style="padding: 20px 30px; background-color: #222222; color: #888888; font-size: 12px;">
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Iram Ali Art. All rights reserved.</p>
                                <p style="margin: 5px 0 0 0;">If you did not request this email, please ignore it.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

module.exports = { getEmailTemplate };

