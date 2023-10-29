import { Request, Response } from "express";
import { getTaskData, Authorization, sendAnswer } from "../utils";
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

export const helloapi = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("helloapi");
        const taskData: TaskData = await getTaskData(data.token);
        const answer = await sendAnswer({
            token: data.token,
            answer: taskData.cookie,
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
