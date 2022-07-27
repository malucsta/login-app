import { Server } from '@overnightjs/core';
import * as http from 'http';
import express from 'express';

export class SetupServer extends Server {
    private server?: http.Server;

    constructor(private port = 3000) {
        super();
    }

    public init(): void {
        this.setupExpress();
        //this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    // private setupControllers(): void {
    // }

    public start(): void {
        this.server = this.app.listen(this.port, () => {
            console.log('Server running at: http://localhost:3000/');
        });
    }
}
