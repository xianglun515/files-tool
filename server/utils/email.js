import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
// Make sure to add RESEND_API_KEY to your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using Resend
 * @param {Object} options 
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 * @returns {Promise<Object>} The result of the email send operation
 */
export const sendEmail = async ({ to, subject, html }) => {
  // If API key is not configured, just log it and return (useful for local dev without key)
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[Email Mock] 邮件未发送，缺少 RESEND_API_KEY。目标: ${to}, 主题: ${subject}`);
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const data = await resend.emails.send({
      from: '传媒生作品集助手 <onboarding@resend.dev>', // resend.dev is allowed for testing. For production, you must verify your domain.
      to: [to],
      subject: subject,
      html: html,
    });

    console.log(`✅ 邮件发送成功: ${to}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ 邮件发送失败:`, error);
    return { success: false, error };
  }
};
