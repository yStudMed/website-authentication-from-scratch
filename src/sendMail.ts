import nodemailer from "nodemailer";
import fs from "fs";
import { join } from "path";



const mailPassword = fs.readFileSync(join(process.cwd(), "mail_app_password.txt"), {encoding: "utf-8"});

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "youssefalfikey2002@gmail.com",
        pass: mailPassword,
    },
    tls: {
        rejectUnauthorized: false, // ⚠️ Insecure, use only for testing
    },
});


export default async function sendMail(receiverMail: string, otpCode: string) {
    const mailOptions = {
        from: '"Youssef Alfiky" <youssefalfikey2002@gmail.com>',
        to: receiverMail,
        subject: "Verify Your Email in  Live Chat Room",
        text: otpCode, // plain‑text body
        html: `<b>Your One Time Password To Verify Your Email in Live Chat Room is ${otpCode}</b>`, // HTML body
    }
    try {
        const messageInfo = await transporter.sendMail(mailOptions);
        return messageInfo;
    } catch (err) {
        throw err;
    };
};