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

export const functions = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("functions");
        const taskData: any = await getTaskData(data.token);

        const answerData = {
            answer: {
                description: "Add user",
                name: "addUser",
                parameters: {
                    properties: {
                        name: {
                            type: "string",
                        },
                        surname: {
                            type: "string",
                        },
                        year: {
                            type: "integer",
                        },
                    },
                    type: "object",
                },
            },
        };
        const anaswerObj = {
            token: data.token,
            answer: answerData.answer,
        };

        console.log(anaswerObj);
        const answer = await sendAnswer(anaswerObj);
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
