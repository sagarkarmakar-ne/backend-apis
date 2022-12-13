const dotenv= require('dotenv');
dotenv.config();

const port=process.env.PORT;
const DEBUG_MODE=process.env.DEBUG_MODE
const DB_URL=process.env.DB_URL
const JWT_SECRET=process.env.JWT_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET
const APP_URL = process.env.APP_URL

module.exports={
    port: port,
    debug_mode: DEBUG_MODE,
    db_url: DB_URL,
    JWT_SECRET: JWT_SECRET,
    REFRESH_SECRET: REFRESH_SECRET,
    APP_URL: APP_URL
};