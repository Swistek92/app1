import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
import OpenAI from "openai";
// import { openai } from "./openai";
type TaskData = {
    code: number;
    msg: string;
    input: string;
    question: string;
};

export const scraper = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("scraper");
        const taskData: TaskData = await getTaskData(data.token);
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `${taskData.msg} based on ${taskData.input}`, // Add your system message or parameters here
                },
                {
                    role: "user",
                    content: `${taskData.question}`,
                },
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 500,
        });

        const chatanswer = chatCompletion.choices[0].message.content;

        const answer = await sendAnswer({
            token: data.token,
            answer: chatanswer,
        });
        res.json({
            answer,
            chatanswer,
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
