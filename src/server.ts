import { Server } from '@overnightjs/core';
import * as http from 'http';
import express from 'express';
import * as database from './database';
import AuthController from './auth/controllers/auth.controller';
import config from './config/default'

export class SetupServer extends Server {
    private server?: http.Server;

    constructor(private port = config.port) {
        super();
    }

    public init(): void {
        this.setupExpress();
        this.setupControllers();
        this.setupDatabase();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupControllers(): void {
        const authController = new AuthController();

        this.addControllers([authController]);
    }

    private async setupDatabase(): Promise<void> {
        await database.connect();
    }

    public start(): void {
        this.server = this.app.listen(this.port, () => {
            console.log(`Server running at: http://localhost:${this.port}/`);
        });
    }
}
