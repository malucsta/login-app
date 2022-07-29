import mongoose, { connection } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const connect = async (): Promise<void> => {
    const db = await mongoose.connect(`${process.env.MONGOURL}`);
    console.log('server connected to database:', db.connection.db.databaseName);
};

export const close = (): Promise<void> => connection.close();