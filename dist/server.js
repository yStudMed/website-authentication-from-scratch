import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import handleRoutes from "./handleRoutes.js";
import handleMiddleWares from "./handleMiddlewares.js";
export const app = express();
const PORT = 3006;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const rootDir = __dirname.slice(0, __dirname.lastIndexOf("dist"));
handleMiddleWares();
handleRoutes();
//
app.listen(PORT, () => {
    console.log("Started Server At: ", PORT);
});
