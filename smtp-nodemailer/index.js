require('dotenv').config();
const nodemailer = require('nodemailer');

const apiKey = process.env.RELOOP_API_KEY;

if (!apiKey) {
  console.error('Error: RELOOP_API_KEY environment variable is required.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.reloop.sh',
  port: 465,
  secure: true, // port 465
  auth: {
    user: 'reloop',
    pass: apiKey,
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"Reloop" <onboarding@yourdomain.com>',
    to: 'recipient@example.com',
    subject: 'Hello from Reloop SMTP',
    html: '<p>Congrats on sending your first email via Reloop SMTP!</p>',
  });

  console.log('Message sent: %s', info.messageId);
}

main().catch(console.error);
