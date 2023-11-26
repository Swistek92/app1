import { Request, Response } from "express";
import axios from "axios";
import { getTaskData, Authorization, fetchImage, sendAnswer } from "../utils";
import OpenAI from "openai";
type Task = {
    code: number;
    msg: string;
    service: string;
    image: string;
    text: string;
    hint: string;
};
export const meme = async (req: Request, res: Response): Promise<void> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data2 = await Authorization("meme");
        const task: Task = await getTaskData(data2.token);
        // console.log(data);

        const url = "https://get.renderform.io/api/v2/render";
        const apiKey = process.env.meme_key;
        // Tworzymy nagłówki HTTP z kluczem API i ustawiamy Content-Type na application/json
        const headers = {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        };

        // Tworzymy dane do wysłania w formacie JSON
        const data = {
            template: "quiet-spiders-sing-badly-1079",
            data: {
                "title.text": `${task.text}`,
                "image.src": `${task.image}`,
            },
        };

        console.log(task.text);
        console.log(task.image);

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        const answer = await sendAnswer({
            token: data2.token,
            answer: responseData.href,
        });

        res.json({
            answer,
            img: responseData.href,
            taskaa: task.msg,
            responseData,
            task,
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
