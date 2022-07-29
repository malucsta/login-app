import * as dotenv from 'dotenv';

dotenv.config();

export default {
    port: 3000,
    MONGOURL: `${process.env.MONGOURL}`,
    AUTH_KEY: `${process.env.AUTH_KEY}`
}