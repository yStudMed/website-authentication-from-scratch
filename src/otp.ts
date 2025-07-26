import generateOTP from "./generateOTP.js";
import pool from "./pool.js";
import { hashPassword } from "./password.js";

export async function insertOTP(email: string, password: string) {
    const { otpToken, expiry, signUpSessionToken } = generateOTP();
    const hashedPassword = await hashPassword(password);
    await pool.query(`
        INSERT INTO email_verification_otps (email, password_hash, otp_code, expires_at, signup_session_token)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE
        SET 
        password_hash = EXCLUDED.password_hash,
        otp_code = EXCLUDED.otp_code,
        expires_at = EXCLUDED.expires_at,
        signup_session_token = EXCLUDED.signup_session_token
        ;
    `, [email, hashedPassword, otpToken, expiry, signUpSessionToken]);
    return { otpToken, expiry, signUpSessionToken };
};

export async function updateOTP(signUpSessionTokenCookie : string) {
    const { otpToken, expiry, signUpSessionToken } = generateOTP();
    const result = await pool.query(`
        UPDATE email_verification_otps
        SET
        otp_code = $1,
        expires_at = $2,
        signup_session_token = $3
        WHERE signup_session_token = $4
        RETURNING email, otp_code, expires_at, signup_session_token
        ;
    `, [otpToken, expiry, signUpSessionToken, signUpSessionTokenCookie]);
    return result!.rows;
};

export async function getOTP(otpCode: string) {
    const result = await pool.query(`
        SELECT email, password_hash, otp_code, expires_at FROM email_verification_otps WHERE otp_code = $1;
    `, [otpCode]);
    return result!.rows;
};

export async function deleteOTP(otpCode: string) {
    await pool.query(`
        DELETE FROM email_verification_otps WHERE otp_code = $1;
    `, [otpCode]);
};