import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@bharat-sanchaya.com',
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Welcome to Our Bharat-Sanchaya!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendSellerApprovalEmail = async (email: string, businessName: string, approved: boolean) => {
  const subject = approved ? 'Seller Application Approved' : 'Seller Application Update';
  const message = approved 
    ? `Congratulations! Your seller application for ${businessName} has been approved. You can now start adding products to your store.`
    : `Your seller application for ${businessName} requires additional review. Please check your seller dashboard for more details.`;

  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@bharat-sanchaya.com',
    to: email,
    subject,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>${subject}</h2>
        <p>${message}</p>
        <a href="${process.env.FRONTEND_URL}/seller/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Go to Dashboard
        </a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending seller approval email:', error);
  }
};

export const sendProductStatusEmail = async (email: string, productName: string, status: string, reason?: string) => {
  const subject = `Product ${status}: ${productName}`;
  let message = `Your product "${productName}" has been ${status.toLowerCase()}.`;
  
  if (reason && status === 'REJECTED') {
    message += ` Reason: ${reason}`;
  }

  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@bharat-sanchaya.com',
    to: email,
    subject,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>${subject}</h2>
        <p>${message}</p>
        <a href="${process.env.FRONTEND_URL}/seller/products" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          View Products
        </a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending product status email:', error);
  }
};