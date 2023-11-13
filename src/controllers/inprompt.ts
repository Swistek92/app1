import { Request, Response } from "express";
import axios from "axios";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateArticeBasedOnTitle,
    validateAnswer,
} from "../utils";
import OpenAI from "openai";
type TaskData = {
    code: number;
    msg: string;
    input: string[];
    question: string;
};
export const inprompt = async (req: Request, res: Response): Promise<void> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data = await Authorization("inprompt");
        const { input, question }: TaskData = await getTaskData(data.token);


        res.json({ input, question }).status(200);
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
