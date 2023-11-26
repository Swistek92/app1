import express, { Express, Request, Response } from "express";
import logger from "morgan";
import * as path from "path";
import cookieParser from "cookie-parser";

import cors from "cors";
import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { router } from "./routes/index";

export function createServer(): express.Express {
    const app: Express = express();
    app.set("port", process.env.PORT || 8080);

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, "../public")));
    app.set("view engine", "ejs");

    app.use(cookieParser());
    app.get("/api/", (req: Request, res: Response) => {
        console.log("im a log");
        res.status(200).json("v122");
    });
    app.use("/api", router);
    app.use(cors());

    app.use(errorNotFoundHandler);
    app.use(errorHandler);
    return app;
}
