if (process.env.NODE_ENV !== "production") {
    const resutlEnv = require('dotenv');
    resutlEnv.config();
}

const app = require("./app");