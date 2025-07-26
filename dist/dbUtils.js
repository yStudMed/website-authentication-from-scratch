import pool from "./pool.js";
import generateToken from "./generateToken.js";
import { verifyPassword } from "./password.js";
export async function findByEmail(email) {
    const result = await pool.query(`
        SELECT email FROM users WHERE email = $1
    `, [email]);
    return result.rows;
}
;
export async function addNewUser(email, passwordHash) {
    const result = await pool.query(`
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id
        ;
    `, [email, passwordHash]);
    return result.rows;
}
;
//
export async function deleteUser(userId) {
    await pool.query(`
        DELETE FROM users WHERE id = $1;
    `, [userId]);
}
;
//
export async function insertNewAccessToken(userId) {
    const token = generateToken();
    const expiry = new Date(+Date.now() + (30 * 24 * 60 * 60 * 1000));
    await pool.query(`
        INSERT INTO access_tokens (token, expires_at, user_id) 
        VALUES ($1, $2, $3)
        ;
    `, [token, expiry, userId]);
    return { token, expiry };
}
;
export async function accessTokenlookUp(token) {
    const result = await pool.query(`
        SELECT token, expires_at, user_id FROM access_tokens WHERE token = $1;
    `, [token]);
    return result.rows;
}
;
export async function deleteAccessToken(token) {
    await pool.query(`
        DELETE FROM access_tokens WHERE token = $1;
    `, [token]);
}
;
export async function signUpSessionTokenLookup(sessionToken) {
    const result = await pool.query(`
        SELECT email, password_hash, expires_at FROM email_verification_otps WHERE signup_session_token = $1;
    `, [sessionToken]);
    return result.rows;
}
;
export async function findUser(email, password) {
    const result = await pool.query(`
        SELECT id, password_hash FROM users WHERE email = $1;
    `, [email]);
    if (result && result.rows.length > 0) {
        try {
            const isPasswordVerified = await verifyPassword(password, result.rows[0].password_hash);
            if (isPasswordVerified) {
                return {
                    userId: result.rows[0].id,
                };
            }
            else {
                throw new Error("Password is Not Verified");
            }
            ;
        }
        catch (err) {
            throw err;
        }
        ;
    }
    else {
        throw new Error("User Not Found");
    }
    ;
}
;
