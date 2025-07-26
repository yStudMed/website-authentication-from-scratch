import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import handleRoutes from "./handleRoutes.js";
import handleMiddleWares from "./handleMiddlewares.js";
import Pool from "./pool.js";
//
export const app = express();
const PORT = 3006;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const rootDir = __dirname.slice(0, __dirname.lastIndexOf("dist"));

handleMiddleWares();
handleRoutes();

(async () => {
    try {
        await Pool.connect({
            host: "localhost",
            port: 5432,
            database: "authentication",
            user: "postgres",
            password: "qqa"
        });
        //
        app.listen(PORT, () => {
            console.log("Started Server At: ", PORT);
        });
    } catch (err) {
        console.error(err);
    };
})();