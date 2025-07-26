import bcrypt from 'bcrypt';
const saltRounds = 12; // Controls hashing complexity; 10–12 is good

export async function hashPassword(plainPassword: string) {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
};


export async function verifyPassword(plainPassword: string, storedHashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(plainPassword, storedHashedPassword);
    } catch (err) {
        console.error("Error verifying password:", err);
        throw err;
    }
};