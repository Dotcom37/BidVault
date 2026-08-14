import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "@/config/db";
import transporter from "@/config/nodemailer";
import jwt from "jsonwebtoken";


export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
// helper
export const normalizeEmail = (email) => email.toLowerCase();

export const register = async (request) => {
  try {
    let { email, password, name } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    email = normalizeEmail(email);

    // Check if user already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete old OTPs
    await pool.query(
      "DELETE FROM otp_verifications WHERE email = $1",
      [email]
    );

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store OTP
    await pool.query(
      `INSERT INTO otp_verifications
       (email, otp, purpose, attempts, expires_at)
       VALUES ($1, $2, 'signup', 0, NOW() + INTERVAL '10 minutes')`,
      [email, hashedOtp]
    );

    // Create unverified user
    await pool.query(
      `INSERT INTO users
       (email, name, password, is_verified)
       VALUES ($1, $2, $3, false)`,
      [email, name || null, hashedPassword]
    );

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    return Response.json(
      {
        message: "OTP sent to email",
        email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};
export const login = async (request) => {
  try {
    let { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    email = normalizeEmail(email);

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    if (!user.is_verified) {
      return Response.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = generateToken(user);

    return Response.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};
export const verifyOtp = async (request) => {
  try {
    let { email, otp } = await request.json();

    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    email = normalizeEmail(email);

    const otpRes = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE email = $1
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    if (otpRes.rows.length === 0) {
      return Response.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    const record = otpRes.rows[0];

    if (record.attempts >= 5) {
      return Response.json(
        { error: "Too many attempts. Try later." },
        { status: 429 }
      );
    }

    const isValid = await bcrypt.compare(otp, record.otp);

    if (!isValid) {
      await pool.query(
        `UPDATE otp_verifications
         SET attempts = attempts + 1
         WHERE id = $1`,
        [record.id]
      );

      return Response.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Verify user
    const userRes = await pool.query(
      `UPDATE users
       SET is_verified = true
       WHERE email = $1
       RETURNING *`,
      [email]
    );

    const user = userRes.rows[0];

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // Delete OTP after successful verification
    await pool.query(
      "DELETE FROM otp_verifications WHERE email = $1",
      [email]
    );

    // Generate JWT
    const token = generateToken(user);

    return Response.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};
export const forgotPassword = async (request) => {
  try {
    let { email } = await request.json();

    email = normalizeEmail(email);

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      await pool.query(
        `UPDATE users
         SET reset_token = $1,
             reset_token_expiry = NOW() + INTERVAL '1 hour'
         WHERE email = $2`,
        [token, email]
      );

      const resetLink =
        `${new URL(request.url).origin}/auth/reset-password?token=${token}`;

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Password Reset",
        text: `Click here to reset your password: ${resetLink}`,
      });
    }

    // Always return the same response for security
    return Response.json({
      message: "If the email exists, a reset link was sent",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};

export const resetPassword = async (request) => {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return Response.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT * FROM users
       WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [hashed, user.id]
    );

    return Response.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};

export const resendOtp = async (request) => {
  try {
    let { email } = await request.json();

    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    email = email.toLowerCase();

    // Check if user exists
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = userRes.rows[0];

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    if (user.is_verified) {
      return Response.json(
        { error: "User already verified" },
        { status: 400 }
      );
    }

    // Delete old OTPs
    await pool.query(
      "DELETE FROM otp_verifications WHERE email = $1",
      [email]
    );

    // Generate new OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store OTP
    await pool.query(
      `INSERT INTO otp_verifications
       (email, otp, purpose, attempts, expires_at)
       VALUES ($1, $2, 'signup', 0, NOW() + INTERVAL '10 minutes')`,
      [email, hashedOtp]
    );

    // Send email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your new OTP",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    return Response.json({
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};
export const getDashboard = async (_request, user) => {
  try {
    const auctions = await pool.query(
      `SELECT id, title, description, category, start_price, current_price, end_time, is_active
       FROM auctions
       WHERE seller_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    return Response.json({
      myAuctions: auctions.rows,
      wonAuctions: [],
    });
  } catch (error) {
    console.error("GET DASHBOARD ERROR:", error);
    return Response.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
};
export const getMe = async (request, user) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [user.id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


