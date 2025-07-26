import dns from "dns/promises";
export default async function checkEmailProvider(email) {
    const domain = email.split('@')[1];
    try {
        const records = await dns.resolveMx(domain);
        if (records && records.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
;
