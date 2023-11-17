import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
type Data = {
    code: number;
    msg: string;
    token: string;
};

type TaskData = {
    code: number;
    msg: string;
    cookie: string;
};

export const embedding = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("embedding");
        const taskData: any = await getTaskData(data.token);

        const createdEmbedding = await generateEmbedding({
            input: "Hawaiian pizza",
        });
        const answer = await sendAnswer({
            token: data.token,
            answer: createdEmbedding,
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
