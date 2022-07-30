import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';

export function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        if(!AuthService.hasAdminRole(res.locals.user)) 
            return res.status?.(401).send({ sucess: false, message: 'Must be admin to access' })
        
        return next();

    } catch (err) {

        if (err instanceof Error) {
            res.status?.(401).send({ sucess: false, message: err.message });
        } else {
            res.status?.(401).send({ sucess: false, message: 'Unknown authorization error' });
        }
    }
}