import mongoose, { connection } from 'mongoose';
import config from './config/default'

export const connect = async (): Promise<void> => {
    const db = await mongoose.connect(config.MONGOURL);
    console.log('server connected to database:', db.connection.db.databaseName);
};

export const close = (): Promise<void> => connection.close();