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

export const ownapi = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("ownapi");
        const taskData: any = await getTaskData(data.token);
        console.log(req.body.question);
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
                    content: `${req.body.question}`,
                },
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 500,
        });

        const chatanswer = chatCompletion.choices[0].message.content;
        const taskAnswer1 = await fetch(`https://zadania.aidevs.pl/answer/${data.token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                answer: "",
                reply: chatanswer,
            }),
        });
        const answer = await taskAnswer1.json();

        // const anaswerObj = {
        //     token: data.token,
        //     answer: chatanswer,
        // };

        // const answer = await sendAnswer(anaswerObj);
        // console.log(taskData);
        // const question = taskData.msg;
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
