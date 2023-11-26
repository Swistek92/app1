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
    hint: string;
    url: string;
};

type Task = {
    taskData: TaskData;
};

export const trigerOwnApi = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const data = await Authorization("ownapi");
        const taskAnswer = await sendAnswer({
            token: data.token,
            answer: "http://3.80.42.106:8080/api/ownapi",
        });
        res.json({
            taskAnswer,
        }).status(200);
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
