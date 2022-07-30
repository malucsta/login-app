import bcrypt from 'bcryptjs';
import *  as jwt from 'jsonwebtoken';
import config from '../../config/default'

export default class AuthService {

    public static async hashPassword(password: string, salt = bcrypt.genSaltSync(12)): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static async generateToken(id: string): Promise<string> {
        return jwt.sign({ id: id }, config.AUTH_KEY, {
            //1 day
            expiresIn: 86400,
        })
    }

    public static validateToken(header: string | string[]) : string | jwt.JwtPayload | undefined {

        const [scheme, token] = header;

        if (!/^Bearer$/i.test(scheme)) 
            return; 

        return jwt.verify(token, config.AUTH_KEY); 
    }
}
