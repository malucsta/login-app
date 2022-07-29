import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import AuthService from '../services/auth.service';

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const authHeader = req.headers?.authorization;

    try {

        if (!authHeader || authHeader === undefined) 
            return res.status?.(403).send({ sucess: false, message: 'Token not provided' });

        const parts = authHeader.toString().split(' ');

        if (!(parts.length === 2))
            return res.status?.(401).send({ sucess: false, message: 'Token error' });

            
        const decoded = AuthService.validateToken(parts); 

        if(!decoded || decoded === undefined)
            res.status?.(401).send({ sucess: false, message: 'Token is invalid' });

        if(decoded instanceof JsonWebTokenError) 
            res.status?.(401).send({ sucess: false, message: 'Token malformed' })

            
        res.locals.user = decoded; 
        return next();

    } catch (err) {

        if (err instanceof Error) {
            res.status?.(401).send({ sucess: false, message: err.message });
        } else {
            res.status?.(401).send({ sucess: false, message: 'Unknown auth error' });
        }
    }
}