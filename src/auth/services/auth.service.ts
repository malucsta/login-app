import bcrypt from 'bcryptjs';
import *  as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

export default class AuthService {

    constructor() {
        dotenv.config();
    }

    public static async hashPassword(password: string, salt = bcrypt.genSaltSync(12)): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static async generateToken(id: string): Promise<string> {
        return jwt.sign({ id: id }, `${process.env.AUTH_KEY}`, {
            //1 day
            expiresIn: 86400,
        })
    }

    public static validateToken(header: string | string[]) : string | jwt.JwtPayload | undefined {

        const [scheme, token] = header;

        if (!/^Bearer$/i.test(scheme)) 
            return; 

        return jwt.verify(token, `${process.env.AUTH_KEY}`); 
    }
}
