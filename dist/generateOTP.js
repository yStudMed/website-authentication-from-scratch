import crypto from "crypto";
import generateToken from "./generateToken.js";
export default function generateOTP() {
    const buffer = crypto.randomBytes(32);
    const otp = (parseInt(crypto.createHash("sha256").update(buffer).digest("hex"), 16) % 1000000).toString().slice(0, 6);
    const expiry = new Date(+Date.now() + (10 * 60 * 1000));
    return {
        otpToken: otp.padStart(6, "0"),
        expiry,
        signUpSessionToken: generateToken()
    };
}
;
