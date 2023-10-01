import { ORIGIN } from "./config.js";

const corsConfig = {
    allowedHeaders: `${ORIGIN}`,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    origin: ORIGIN
}

export default corsConfig;