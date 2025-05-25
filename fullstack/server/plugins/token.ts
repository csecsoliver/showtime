import crypto from "crypto";
export interface TokenData {
    user: string;
    expiry: number;
}

export const tokens: { [key: string]: TokenData } = {
    "exampletoken": {
        user: "admin",
        expiry: Date.parse("2026-05-18T00:00:00.000Z")
    },
    
};
export default function tokenGen(username:string){
    const token = crypto.randomBytes(32).toString("hex");
    tokens[token] = {
        user: username,
        expiry: Date.now() + 60 * 60 * 24 * 1000 * 10
    }
    return token;
}