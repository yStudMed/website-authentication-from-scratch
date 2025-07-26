import { accessTokenlookUp } from './dbUtils.js';
export default async function redirectToWelcomeIfAuthenticated(req, res, next) {
    const cookies = req.headers.cookie;
    if (cookies) {
        const indexOFAccessTokenKey = cookies.indexOf("access_token");
        if (indexOFAccessTokenKey !== -1) {
            const indexOfFirstCharacterInToken = indexOFAccessTokenKey + 13;
            const token = cookies.slice(indexOfFirstCharacterInToken, indexOfFirstCharacterInToken + 36);
            const dbAccessTokenLookupResult = await accessTokenlookUp(token);
            if (dbAccessTokenLookupResult.length > 0 && (+dbAccessTokenLookupResult[0].expires_at - Date.now()) > 0) {
                res.redirect("/welcome");
            }
            ;
        }
        ;
    }
    ;
    next();
}
;
