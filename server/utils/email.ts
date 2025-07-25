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

export function getVerificationSubmittedEmailHTML(storeName: string, storeId: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #006d77; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SPIRAL Store Verification</h1>
      </div>
      
      <div style="padding: 30px; background-color: #f8f9fa;">
        <h2 style="color: #006d77;">Thank you for submitting your store verification!</h2>
        
        <p>Dear ${storeName} team,</p>
        
        <p>We've received your store verification application and are excited to welcome you to the SPIRAL community.</p>
        
        <div style="background-color: white; padding: 20px; border-left: 4px solid #006d77; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #006d77;">What happens next?</h3>
          <ul style="color: #666;">
            <li>Our team will review your application within 2-5 business days</li>
            <li>We'll verify your business documents and information</li>
            <li>You'll receive an email notification about the approval status</li>
            <li>Once approved, your store will be live on SPIRAL</li>
          </ul>
        </div>
        
        <p><strong>Reference ID:</strong> STORE-${storeId}</p>
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
          <p>SPIRAL - Everything Local. Just for You.</p>
          <p>This email was sent automatically. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
  `;
}

export function getVerificationApprovedEmailHTML(storeName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #22c55e; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Store Verification Approved!</h1>
      </div>
      
      <div style="padding: 30px; background-color: #f8f9fa;">
        <h2 style="color: #22c55e;">Congratulations! Your store is now live on SPIRAL</h2>
        
        <p>Dear ${storeName} team,</p>
        
        <p>Great news! Your store verification has been approved and your business is now live on SPIRAL.</p>
        
        <div style="background-color: white; padding: 20px; border-left: 4px solid #22c55e; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #22c55e;">You can now:</h3>
          <ul style="color: #666;">
            <li>Manage your store profile and product listings</li>
            <li>Connect with local customers in your community</li>
            <li>Access your retailer dashboard for analytics</li>
            <li>Start earning through the SPIRAL loyalty program</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://spiral.app/retailer-dashboard" style="background-color: #006d77; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Your Dashboard
          </a>
        </div>
        
        <p>Welcome to the SPIRAL community! We're excited to help you connect with local shoppers.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
          <p>SPIRAL - Everything Local. Just for You.</p>
          <p>Need help? Contact our support team anytime.</p>
        </div>
      </div>
    </div>
  `;
}

export function getVerificationRejectedEmailHTML(storeName: string, rejectionReason: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ef4444; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Store Verification Update</h1>
      </div>
      
      <div style="padding: 30px; background-color: #f8f9fa;">
        <h2 style="color: #ef4444;">Verification Requires Additional Information</h2>
        
        <p>Dear ${storeName} team,</p>
        
        <p>Thank you for your interest in joining SPIRAL. We've reviewed your verification application and need some additional information before we can approve your store.</p>
        
        <div style="background-color: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #ef4444;">Reason for Review:</h3>
          <p style="color: #666;">${rejectionReason}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-left: 4px solid #006d77; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #006d77;">Next Steps:</h3>
          <ul style="color: #666;">
            <li>Address the feedback provided above</li>
            <li>Resubmit your verification application with updated information</li>
            <li>Contact our support team if you have questions</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://spiral.app/verify-store" style="background-color: #006d77; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Resubmit Application
          </a>
        </div>
        
        <p>We're here to help you succeed on SPIRAL. Please don't hesitate to reach out with any questions.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
          <p>SPIRAL - Everything Local. Just for You.</p>
          <p>Contact our support team for assistance: support@spiral.app</p>
        </div>
      </div>
    </div>
  `;
}