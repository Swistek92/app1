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

export const gnome = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("gnome");
        const taskData: TaskData = await getTaskData(data.token);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const checkQuestion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `answer in polish which colour is hat of gnome? return only colour.
                             if on image wont gnome or hat, return only word error`,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `${taskData.url}`,
                            },
                        },
                    ],
                },
            ],
            model: "gpt-4-vision-preview",
            max_tokens: 1500,
        });

        const chatanswer = checkQuestion.choices[0].message.content;

        const anaswerObj = {
            token: data.token,
            answer: chatanswer,
        };

        const answer = await sendAnswer(anaswerObj);
        console.log(taskData);
        const question = taskData.msg;
        res.json({
            answer,
            question,
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
