const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

exports.sendEmail = catchAsync(async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // azazkaboria99@gmail.com

  const mailOptions = {
    from: `PPC <${process.env.EMAIL}>`,
    to: email,
    subject,
    html,
    headers: {
      priority: 'high',
    },
  };

  await transporter.sendMail(mailOptions);
});

exports.sendEmailText = catchAsync(async (email, subject, text) => {
  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Email options
  const mailOptions = {
    from: `PPC <${process.env.EMAIL}>`,
    to: email,
    subject,
    text,
    headers: {
      priority: 'high',
    },
  };

  // Send the email
  await transporter.sendMail(mailOptions);
});
