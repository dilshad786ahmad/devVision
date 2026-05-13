const Auth = require("../schema/authentication");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// ================= OTP STORE (in-memory for simplicity) =================
// Key: email, Value: { otp, expiresAt }
const otpStore = new Map();

// ================= EMAIL TRANSPORTER =================
const getTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in environment variables.");
        return null;
    }
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// ================= STEP 1: SEND OTP =================
exports.sendOtp = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

        otpStore.set(email, { otp, expiresAt });

        // Send OTP via email
        const transporter = getTransporter();
        if (!transporter) {
            return res.status(500).json({ 
                success: false, 
                message: "Email service is not configured on the server. Please contact support." 
            });
        }

        await transporter.sendMail({
            from: `"DevVision Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Your Password Reset OTP",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin: 0 auto 16px;">DV</div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Password Reset</h1>
                        <p style="color: #9ca3af; font-size: 14px; margin-top: 8px;">Secure Identity Verification</p>
                    </div>
                    
                    <div style="background-color: rgba(255,255,255,0.03); border-radius: 20px; padding: 32px; border: 1px solid rgba(255,255,255,0.05);">
                        <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                            We received a request to reset your password. Use the following 6-digit code to continue:
                        </p>
                        
                        <div style="background: linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1)); border: 1px dashed rgba(249,115,22,0.4); border-radius: 16px; padding: 24px; text-align: center;">
                            <span style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #f97316; font-family: monospace;">${otp}</span>
                        </div>
                        
                        <p style="color: #ef4444; font-size: 13px; font-weight: 600; text-align: center; margin: 24px 0 0;">
                            ⚠️ This code expires in 2 minutes
                        </p>
                    </div>
                    
                    <div style="margin-top: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); pt-24px;">
                        <p style="color: #6b7280; font-size: 12px; margin-bottom: 8px;">If you didn't request this, you can safely ignore this email.</p>
                        <p style="color: #4b5563; font-size: 11px;">&copy; ${new Date().getFullYear()} DevVision. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        res.status(200).json({ success: true, message: "OTP sent to your email successfully." });
    } catch (error) {
        console.error("CRITICAL: Send OTP Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to send OTP. Please check if the email server is active.", 
            error: error.message 
        });
    }
};

// ================= STEP 2: VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    try {
        const { email: rawEmail, otp } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required." });
        }

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        if (record.otp !== otp.trim()) {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }

        // OTP is valid - mark as verified (keep in store with a verified flag)
        otpStore.set(email, { ...record, verified: true });

        res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "OTP verification failed.", error: error.message });
    }
};

// ================= STEP 3: RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    try {
        const { email: rawEmail, newPassword, confirmPassword } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const record = otpStore.get(email);

        if (!record || !record.verified) {
            return res.status(400).json({ success: false, message: "Please complete OTP verification first." });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await Auth.findOneAndUpdate({ email }, { password: hashedPassword });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Clean up OTP store
        otpStore.delete(email);

        res.status(200).json({ success: true, message: "Password reset successfully! You can now sign in." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Password reset failed.", error: error.message });
    }
};
