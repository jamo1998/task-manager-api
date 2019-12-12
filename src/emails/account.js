const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jamesonaardalen@gmail.com',
    subject: 'Thank you for joining Fast Task',
    text: `Welcome to Fast Track, ${name}! I hope you enjoy this fun and easy to use application :)`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jamesonaardalen@gmail.com',
    subject: `We're sorry to see you leave.`,
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
