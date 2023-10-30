import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateArticeBasedOnTitle,
} from "../utils";
import OpenAI from "openai";
type TaskData = {
    code: number;
    msg: string;
    blog: string[];
};
export const blogger = async (req: Request, res: Response): Promise<void> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data = await Authorization("blogger");
        const { blog }: TaskData = await getTaskData(data.token);
        const blogAtticles = [];
        for (const title of blog) {
            const artice = await generateArticeBasedOnTitle(title);
            blogAtticles.push(artice);
        }

        const answer = await sendAnswer({
            token: data.token,
            answer: blogAtticles,
        });
        res.json({
            blog: blog,
            answer: answer,
            blogAtticles,
        }).status(200);
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
