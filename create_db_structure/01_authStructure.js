import pg from "pg";
//
const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    user: "postgres",
    database: "authentication",
    password: 'qqa'
});
//
pool.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(60) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE access_tokens (
        id SERIAL PRIMARY KEY,
        token UUID UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        user_id INTEGER REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE TABLE email_verification_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(60) NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        signup_session_token UUID UNIQUE NOT NULL
    );
`).then(() => {
    console.log("Tables Creation Done");
}).catch((err) => {
    console.error(err);
}).finally(() => {
    pool.end();
});