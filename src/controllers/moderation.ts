import { Request, Response } from "express";
import {
    Authorization,
    getTaskData,
    checkModerate,
    sendAnswer,
} from "../utils";
type TaskData = {
    code: number;
    msg: string;
    input: string[];
};
export const moderation = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const data = await Authorization("moderation");
        const { input }: TaskData = await getTaskData(data.token);
        const validations = [];
        for (const sentence of input) {
            const moderate = await checkModerate(sentence);
            validations.push(Number(moderate));
        }
        const answer = await sendAnswer({
            token: data.token,
            answer: validations,
        });

        res.json({
            status: answer.code,
            message: answer.msg,
            answer,
        }).status(answer.code);
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
