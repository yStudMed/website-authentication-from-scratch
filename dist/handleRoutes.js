import { app, rootDir } from "./index.js";
import { join } from "path";
import validator from "validator";
import { findByEmail, signUpSessionTokenLookup, addNewUser, insertNewAccessToken, accessTokenlookUp, findUser, deleteAccessToken, deleteUser } from "./dbUtils.js";
import { insertOTP, getOTP, deleteOTP, updateOTP } from "./otp.js";
import sendMail from "./sendMail.js";
import checkEmailProvider from "./checkEmailProvider.js";
import redirectToWelcomeIfAuthenticated from "./redirectToWelcomeIfAuthenticated.js";
//
function extractTokenFromCookies(cookies, indexOfTokenKey) {
    const indexOfFirstCharacterInToken = indexOfTokenKey + 13;
    const token = cookies.slice(indexOfFirstCharacterInToken, indexOfFirstCharacterInToken + 36);
    return token;
}
;
export default function handleRoutes() {
    app.get("/", redirectToWelcomeIfAuthenticated, (_, res) => {
        res.sendFile(join(rootDir, "/public/main.html"));
    });
    //
    app.get("/login", redirectToWelcomeIfAuthenticated, (_, res) => {
        res.sendFile(join(rootDir, "/public/login.html"));
    });
    //
    app.get("/signup", redirectToWelcomeIfAuthenticated, (_, res) => {
        res.sendFile(join(rootDir, "/public/signup.html"));
    });
    //
    app.get("/otp", redirectToWelcomeIfAuthenticated, async (req, res) => {
        const cookies = req.headers.cookie;
        if (cookies) {
            const indexOfSignUpTokenKey = cookies.indexOf("signup_token");
            if (indexOfSignUpTokenKey !== -1) {
                const signUpSessionToken = extractTokenFromCookies(cookies, indexOfSignUpTokenKey);
                const dbSignUpSessionTokenResult = await signUpSessionTokenLookup(signUpSessionToken);
                if (dbSignUpSessionTokenResult.length > 0 && (+dbSignUpSessionTokenResult[0].expires_at - Date.now()) > 0) {
                    res.sendFile(join(rootDir, "/public/otp.html"));
                }
                else {
                    return res.redirect("/signup");
                }
                ;
            }
            else {
                return res.redirect("/signup");
            }
            ;
        }
        else {
            return res.redirect("/signup");
        }
        ;
    });
    //
    app.get("/welcome", async (req, res) => {
        const cookies = req.headers.cookie;
        if (cookies) {
            const indexOFAccessTokenKey = cookies.indexOf("access_token");
            if (indexOFAccessTokenKey !== -1) {
                const accessToken = extractTokenFromCookies(cookies, indexOFAccessTokenKey);
                const dbAccessTokenLookupResult = await accessTokenlookUp(accessToken);
                if (dbAccessTokenLookupResult.length > 0 && (+dbAccessTokenLookupResult[0].expires_at - Date.now()) > 0) {
                    res.sendFile(join(rootDir, "/public/welcome.html"));
                }
                else {
                    res.status(401).send("Access denied: please log in.");
                }
                ;
            }
            else {
                res.status(401).send("Access denied: please log in.");
            }
            ;
        }
        else {
            res.status(401).send("Access denied: please log in.");
        }
        ;
    });
    //
    app.post("/signup", async (req, res) => {
        const { email, password, confirmPassword } = req.body;
        const isValidEmail = validator.isEmail(email);
        if (!isValidEmail) {
            return res.status(400).send("Invalid Email");
        }
        ;
        if (password !== confirmPassword) {
            return res.status(400).send("Password Mismatch");
        }
        ;
        if (password.length < 3 || password.length > 40) {
            return res.status(400).send("Invalid Password's length");
        }
        ;
        const emailResult = await findByEmail(email);
        if (emailResult.length > 0) {
            return res.status(400).send("Email Already exists");
        }
        ;
        //
        const doesEmailProviderExist = await checkEmailProvider(email);
        if (doesEmailProviderExist) {
            const { otpToken, expiry, signUpSessionToken } = await insertOTP(email, password);
            await sendMail(email, otpToken);
            res.cookie("signup_token", signUpSessionToken, {
                httpOnly: true,
                secure: false, // set to true if using HTTPS
                maxAge: +expiry - Date.now(),
                path: "/otp"
            });
            res.redirect("/otp");
        }
        else {
            return res.status(400).send("Email Provider Doesn't Exist");
        }
        ;
    });
    //
    app.post("/otp/verify", async (req, res) => {
        let otpCode = "";
        for (const property in req.body) {
            otpCode += req.body[property];
        }
        ;
        otpCode = otpCode.trim();
        if (otpCode.length < 6 || Number.isNaN(+otpCode)) {
            return res.status(400).send("Invalid OTP Code");
        }
        ;
        const findOTPResult = await getOTP(otpCode);
        if (findOTPResult.length > 0 && (+findOTPResult[0].expires_at - Date.now()) > 0) {
            await deleteOTP(findOTPResult[0].otp_code);
            const user = await addNewUser(findOTPResult[0].email, findOTPResult[0].password_hash);
            const { token, expiry } = await insertNewAccessToken(user[0].id);
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: false, // set to true if using HTTPS
                maxAge: +expiry - Date.now(),
                path: "/"
            });
            res.redirect("/welcome");
            //
        }
        else {
            return res.status(400).send("Invalid OTP Code");
        }
        ;
    });
    //
    app.post("/otp/resendOTP", async (req, res) => {
        const cookies = req.headers.cookie;
        if (cookies) {
            const indexOfSignUpTokenKey = cookies.indexOf("signup_token");
            if (indexOfSignUpTokenKey !== -1) {
                const signUpSessionToken = extractTokenFromCookies(cookies, indexOfSignUpTokenKey);
                const dbSignUpSessionTokenResult = await signUpSessionTokenLookup(signUpSessionToken);
                if (dbSignUpSessionTokenResult.length > 0 && (+dbSignUpSessionTokenResult[0].expires_at - Date.now()) > 0) {
                    const { email, otp_code, expires_at, signup_session_token } = (await updateOTP(signUpSessionToken))[0];
                    await sendMail(email, otp_code);
                    res.cookie("signup_token", signup_session_token, {
                        httpOnly: true,
                        secure: false, // set to true if using HTTPS
                        maxAge: +expires_at - Date.now(),
                        path: "/otp"
                    });
                    res.redirect("/otp");
                }
                else {
                    res.status(400).send("Expired Session");
                }
                ;
            }
            else {
                res.status(400).send("Expired Session");
            }
            ;
        }
        else {
            res.status(400).send("Expired Session");
        }
        ;
    });
    //
    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const isValidEmail = validator.isEmail(email);
        if (!isValidEmail) {
            return res.status(400).send("Invalid Email");
        }
        ;
        if (password.length < 3 || password.length > 40) {
            return res.status(400).send("Invalid Password's length");
        }
        ;
        try {
            const { userId } = await findUser(email, password);
            const { token, expiry } = await insertNewAccessToken(userId);
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: false, // set to true if using HTTPS
                maxAge: +expiry - Date.now(),
                path: "/"
            });
            res.redirect("/welcome");
        }
        catch (err) {
            console.error(err);
            res.status(401).json({ message: "Invalid email or password" });
        }
        ;
    });
    //
    async function goOut(route, req, res) {
        const cookies = req.headers.cookie;
        if (cookies) {
            const indexOFAccessTokenKey = cookies.indexOf("access_token");
            if (indexOFAccessTokenKey !== -1) {
                const accessToken = extractTokenFromCookies(cookies, indexOFAccessTokenKey);
                const dbAccessTokenLookupResult = await accessTokenlookUp(accessToken);
                if (dbAccessTokenLookupResult.length > 0) {
                    if (route === "logout") {
                        await deleteAccessToken(accessToken);
                    }
                    else {
                        await deleteUser(dbAccessTokenLookupResult[0].user_id);
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
        res.redirect("/");
    }
    ;
    //
    app.post("/logout", (req, res) => {
        goOut("logout", req, res);
    });
    //
    app.post("/delete-account", (req, res) => {
        goOut("delete-account", req, res);
    });
}
;
