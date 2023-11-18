import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
import OpenAI from "openai";
type TaskData = {
    code: number;
    msg: string;
    hint1: string;
    hint2: string;
    hint3: string;
};
export const rodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("rodo");
        const taskData: TaskData = await getTaskData(data.token);
        const msg = taskData.msg;

        const answer = await sendAnswer({
            token: data.token,
            // eslint-disable-next-line max-len
            answer: "Please provide a brief introduction about yourself using the placeholders %imie%, %nazwisko%, %zawod%, and %miasto%.",
        });

        res.json({
            answer,
        }).status(200);
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
