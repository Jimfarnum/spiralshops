import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SendGrid/mailgun if preferred
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    return await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error - verification should still work without email
    return null;
  }
}

export async function sendRetailerConfirmation(to: string, name: string) {
  return sendVerificationEmail({
    to,
    subject: 'SPIRAL: Store Verification Submitted',
    html: `<h2>Hello ${name},</h2><p>Thank you for submitting your store for verification on SPIRAL. We'll review your documents shortly and update your status.</p><p>– The SPIRAL Team</p>`
  });
}

export async function sendAdminNotification(to: string, storeName: string) {
  return sendVerificationEmail({
    to,
    subject: 'New Store Verification Submitted',
    html: `<h2>Admin,</h2><p>A new store <strong>${storeName}</strong> has submitted a verification request. Please log in to the admin dashboard to review.</p>`
  });
}

export async function sendApprovalEmail(to: string, name: string) {
  return sendVerificationEmail({
    to,
    subject: 'SPIRAL: Store Verified',
    html: `<h2>Hello ${name},</h2><p>Congratulations! Your store has been successfully verified on SPIRAL and is now discoverable by shoppers.</p><p>– The SPIRAL Team</p>`
  });
}

export async function sendRejectionEmail(to: string, name: string, reason: string) {
  return sendVerificationEmail({
    to,
    subject: 'SPIRAL: Store Verification Declined',
    html: `<h2>Hello ${name},</h2><p>Unfortunately, your store verification was declined for the following reason:</p><blockquote>${reason}</blockquote><p>Please update your submission or contact support.</p>`
  });
}