import { app, rootDir } from "./index.js";
import express from "express";
import { join } from "path";

export default function handleMiddleWares() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(join(rootDir, "static")));
};