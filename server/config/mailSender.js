const nodemailer = require('nodemailer');

const mailSender = async (email, title, bodyContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        const emailTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content p {
                        line-height: 1.6;
                        font-size: 16px;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #888;
                    }
                    .footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                        margin-top: 20px;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>Welcome to Cozway, Suhail Subair!</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>${bodyContent}</p>
                        <a href="#" class="button">Visit Our Website</a>
                    </div>
                    <div class="footer">
                        <p>© 2024 Cozway. All rights reserved.</p>
                        <p>Visit us at <a href="https://www.cozway.com">www.cozway.com</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const info = await transporter.sendMail({
            from: '"Cozway - Suhail Subair" <no-reply@cozway.com>',
            to: email,
            subject: title,
            html: emailTemplate,
        });

        // console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = mailSender;
