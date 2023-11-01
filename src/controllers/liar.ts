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
// import validateAnswer from "src/utils/validateAnswer";
type ResponseData = {
    code: number;
    msg: string;
    answer: string;
};
export const liar = async (req: Request, res: Response): Promise<void> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data = await Authorization("liar");
        // console.log(data);
        const formData = new FormData();
        const question = "Tell what is capital of Poland? Say in one word.";
        formData.append("question", question);

        const response = await axios.post(
            `https://zadania.aidevs.pl/task/${data.token}`,
            formData,
        );
        const { answer }: ResponseData = response.data;
        const validate: any = await validateAnswer(question, answer);
        const taksAnswer = await sendAnswer({
            token: data.token,
            answer: validate,
        });

        res.json({
            taksAnswer,
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
