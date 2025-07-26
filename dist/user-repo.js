import pool from "./pool.js";
import Pool from "./pool.js";
export async function findbyUsername(username) {
    const result = await Pool.query(`
        Select username FROM users WHERE username = $1
    `, [username]);
    return result?.rows;
}
;
export async function findByEmail(email) {
    const result = await Pool.query(`
        SELECT email FROM users WHERE email = $1
    `, [email]);
    return result?.rows;
}
;
export async function addNewUser(username, email, password) {
}
;
export async function tokenlookUp(token) {
}
;
export async function signUpSissionTokenLookup(sessionToken) {
    const result = await pool.query(`
        SELECT signup_session_token FROM email_verification_otps WHERE signup_session_token = $1
    `, [sessionToken]);
    return result?.rows;
}
;
