import { Capsule } from "../models/Capsule.js";
import nodemailer from "nodemailer";

// Initialize email transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Check for capsules that should be unlocked and send emails
 * Run this via cron job or interval
 */
export const processUnlockedCapsules = async () => {
    try {
        const now = new Date();

        // Find capsules that:
        // 1. Are not yet marked as unlocked
        // 2. Have a date-based unlock type
        // 3. Unlock date has passed
        const capsulesReadyToUnlock = await Capsule.find({
            unlocked: false,
            unlockType: "date",
            unlockDate: { $lte: now },
        });

        for (const capsule of capsulesReadyToUnlock) {
            // Mark as unlocked
            capsule.unlocked = true;

            // Send email to each recipient if not already sent
            if (!capsule.unlockedEmailSent) {
                await sendUnlockedEmails(capsule);
                capsule.unlockedEmailSent = true;
            }

            // Save the updated capsule
            await capsule.save();

            console.log(`✅ Capsule "${capsule.title}" unlocked and emails sent`);
        }

        return capsulesReadyToUnlock.length;

    } catch (error) {
        console.error("❌ Error processing unlocked capsules:", error);
        return 0;
    }
};

/**
 * Send email notification to all recipients when capsule unlocks
 */
export const sendUnlockedEmails = async (capsule) => {
    try {
        const recipients = capsule.recipients;
        
        if (!recipients || recipients.length === 0) {
            console.log("⚠️ No recipients to notify for capsule:", capsule.title);
            return;
        }

        const emailList = Array.isArray(recipients) ? recipients : [recipients];
        
        // Email template
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; border-radius: 8px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                    .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎁 Your Memory is Ready!</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>A digital time capsule with the title <strong>"${capsule.title}"</strong> has been unlocked and is now ready for you to view!</p>
                        
                        <h3>Capsule Details:</h3>
                        <ul>
                            <li><strong>Title:</strong> ${capsule.title}</li>
                            <li><strong>Theme:</strong> ${capsule.theme}</li>
                            <li><strong>Created by:</strong> ${capsule.createdBy}</li>
                            <li><strong>Unlocked on:</strong> ${new Date().toLocaleString()}</li>
                        </ul>

                        <p>Click the button below to view your memory:</p>
                        <a href="${process.env.CLIENT_URL}/capsule/access/${capsule.recipientAccessToken}" class="button">View Capsule</a>

                        <p>This memory was specially prepared for you. Enjoy!</p>
                        <p>Best regards,<br/>MemoryLane Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} MemoryLane - Digital Time Capsule Platform</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send email to each recipient
        for (const recipient of emailList) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: recipient,
                    subject: `🎁 Your Memory is Ready: "${capsule.title}"`,
                    html: htmlContent,
                });
                console.log(`📧 Email sent to ${recipient}`);
            } catch (emailError) {
                console.error(`❌ Failed to send email to ${recipient}:`, emailError);
            }
        }

    } catch (error) {
        console.error("❌ Error sending unlock emails:", error);
    }
};

/**
 * Initialize scheduler - Run every minute to check for unlocks
 * Call this in server.js
 */
export const initializeScheduler = () => {
    console.log("⏰ MemoryLane Scheduler initialized - Running every minute");
    
    // Run immediately on startup
    processUnlockedCapsules();
    
    // Then run every minute (60000 ms)
    const interval = setInterval(async () => {
        const processedCount = await processUnlockedCapsules();
        if (processedCount > 0) {
            console.log(`📊 Scheduler checkpoint: ${processedCount} capsules processed`);
        }
    }, 60000); // 1 minute

    return interval;
};

export default { processUnlockedCapsules, sendUnlockedEmails, initializeScheduler };
