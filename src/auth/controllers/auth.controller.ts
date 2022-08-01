import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { deepSanitize } from 'src/helpers/deepSanitize';

@Controller('auth')
export default class AuthController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }


    @Get('')
    @Middleware(authMiddleware)
    @Middleware(adminMiddleware)
    public async findAllUsers(_: Request, res: Response) {
        try {
            const users = await this.userService.findAllUsers();

            if(!users) 
                return res.status(404).send({ sucess: false, message: 'No users found' });

            return res.status(200).send({ sucess: true, users }); 

        } catch(error) {
            return res.status(400).send({ sucess: false, message: 'Operation failed' });
        }
    }


    @Get('me')
    @Middleware(authMiddleware)
    public async me(_: Request, res: Response) {

        const { id } = res.locals.user;

        try {
            const user = await this.userService.findUserById(id);

            if(!user)
                return res.status(400).send({ sucess: false, message: `This user doesn't exist anymore` }); 

            return res.status(200).send({ sucess: true, user: user });
             
        } catch(error) {
            return res.status(400).send({ sucess: false, message: 'Operation failed' });
        }
    }


    @Post('register')
    public async createUser(req: Request, res: Response) {

        const user: UserModel = {
            name: req.body.name,
            email: req.body.email,
            password: deepSanitize(req.body.password),
            isAdmin: req.body.isAdmin
        };

        try {

            const foundUser = await this.userService.findUserByEmail(user.email);

            if (foundUser)
                return res.status(409).send({ sucess: false, message: 'User already exists' });

            const createdUser = await this.userService.createUser(user);

            if(!createdUser)
                return res.status(500).send({ sucess: false, message: 'Registration failed' });

            const token = await AuthService.generateToken(createdUser.id, createdUser.isAdmin);
            return res.status(200).send({ sucess: true, createdUser, token: token });

        } catch (error) {
            return res.status(400).send({ sucess: false, message: 'Registration failed' });
        }
    }


    @Post('authenticate')
    public async authenticateUser(req: Request, res: Response) {

        const { email, password } = req.body;

        try {
            const user = await this.userService.findUserByEmailWithPassword(email)

            if (!user)
                return res.status(400).send({ sucess: false, message: 'User not found' });

            if (!await AuthService.comparePassword(password, user.password))
                return res.status(400).send({ sucess: false, message: 'Incorrect password' });

            const token = await AuthService.generateToken(user.id, user.isAdmin);

            return res.status(200).send({ sucess: true, token: token });


        } catch (error) {
            return res.status(400).send({ sucess: false, message: 'Registration failed' });
        }
    }

    @Put('')
    @Middleware(authMiddleware)
    public async updateUser(req: Request, res: Response) {
        
        const { id } = res.locals.user;
        const { name } = req.body; 

        try {

            const updatedUser = await this.userService.UpdateName(id, name); 
            return res.status(200).send({ sucess: true, updatedUser });

        } catch (error) {
            return res.status(400).send({ sucess: false, message: 'Update failed' });
        }
    }


    @Delete('')
    @Middleware(authMiddleware)
    public async deleteOwnUser(_: Request, res: Response) {
        
        const { id } = res.locals.user

        try {

            if(!id)
                return res.status(404).send({ sucess: false, message: `Delete failed` });
            
            const user = await this.userService.deleteUser(id); 

            if(!user)
                return res.status(404).send({ sucess: false, message: `User doesn't exist` });


            return res.status(200).send({ sucess: true, deletedUsers: user.deletedCount });

        } catch (error) {
            return res.status(400).send({ sucess: false, message: 'Delete failed' });
        }
    }


    @Delete(':id')
    @Middleware(authMiddleware)
    @Middleware(adminMiddleware)
    public async deleteOtherUser(req: Request, res: Response) {
        
        const { id } = req.params;

        try {

            if(!id)
                return res.status(404).send({ sucess: false, message: `Provide the id of user to delete` });
            
            const user = await this.userService.deleteUser(id); 

            if(!user)
                return res.status(404).send({ sucess: false, message: `User doesn't exist` });


            return res.status(200).send({ sucess: true, deletedUsers: user.deletedCount });

        } catch (error) {
            return res.status(400).send({ sucess: false, message: 'Delete failed' });
        }
    }
}
