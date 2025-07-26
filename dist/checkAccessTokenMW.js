function redirectIfAuthenticated(req, res, next) {
    const cookies = req.headers.cookie;
    if (cookies) {
        const indexOFAccessTokenKey = cookies.indexOf("access_token");
        const indexOfFirstCharacterInToken = indexOFAccessTokenKey + 13;
        const token = cookies.slice(indexOfFirstCharacterInToken, indexOfFirstCharacterInToken + 36);
    }
    ;
    next();
}
;
module.exports = redirectIfAuthenticated;
export {};
