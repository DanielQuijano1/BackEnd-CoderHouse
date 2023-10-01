import mongoStore from 'connect-mongo'
import { DB_NAME, DB_PASSWORD, DB_USER, S_SECRET } from '../config/config.js';


const DB_URL =
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}.gpx0edf.mongodb.net/?retryWrites=true&w=majority`;

const sessionConfig = {
    store: mongoStore.create({
        mongoUrl: DB_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10 * 3600,
    }),
    secret: S_SECRET,
    resave: false,
    saveUninitialized: false,
}

export default sessionConfig;