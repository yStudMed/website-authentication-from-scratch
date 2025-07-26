import { v4 as uuidv4 } from "uuid";
export default function generateToken() {
    const signupSessionToken = uuidv4();
    return signupSessionToken;
}
;
