import fs from "fs";
import { Request, Response } from "express";
import { getTaskData, Authorization, sendAnswer } from "../utils";
import OpenAI from "openai";
import path from "path";

export const optimaldb = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("optimaldb");
        const taskData: any = await getTaskData(data.token);

        const MEMORY_PATH = path.join(__dirname, "./../../public/friends.json");
        const db: any = JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8"));
        const optimizedDb: { [key: string]: any } = {};

        for (const key in db) {
            if (db.hasOwnProperty(key)) {
                const value = db[key];
                const optimizedValue = value.slice(
                    0,
                    Math.floor(0.3 * value.length),
                );
                optimizedDb[key] = optimizedValue;
            }
        }

        const optimizedDbJson = JSON.stringify(optimizedDb);

        const answer = await sendAnswer({
            token: data.token,
            answer: optimizedDbJson,
        });

        res.json({
            answer,
            taskData,
        }).status(200);
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
