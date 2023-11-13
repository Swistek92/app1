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

const filterByName = (messages: string[], name: string): string[] => {
    const lowerCaseName = name.toLowerCase();
    return messages.filter(message =>
        message.toLowerCase().includes(lowerCaseName),
    );
};
const getLastWord = (sentence: string): string => {
    const words = sentence.trim().split(" ");
    return words[words.length - 1].replace(/[?!.]/g, "");
};

export const inprompt = async (req: Request, res: Response): Promise<void> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data = await Authorization("inprompt");
        const { input, question }: TaskData = await getTaskData(data.token);
        const name = getLastWord(question);

        const answer = filterByName(input, name)[0];

        const sendAnswer2 = await sendAnswer({
            token: data.token,
            answer,
        });

        res.json({ sendAnswer2 }).status(200);
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error,
        }).status(500);
    }
};
