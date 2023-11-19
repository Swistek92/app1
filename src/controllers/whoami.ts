import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
import OpenAI from "openai";
type taskData = {
    code: number;
    msg: string;
    hint: string;
};

const getHint = async (): Promise<string> => {
    try {
        const data = await Authorization("whoami");
        const taskData: taskData = await getTaskData(data.token);
        return taskData.hint;
    } catch (error) {
        throw new Error(error);
    }
};

export const whoami = async (req: Request, res: Response): Promise<void> => {
    try {
        const hints: string[] = [];
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        let chatAnswer = "";
        let findAnswer = false;

        while (!findAnswer) {
            const hint = await getHint();
            hints.push(hint);

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        // eslint-disable-next-line max-len
                        content: `wiesz o jaka osobę chodzi? jeśli tak zwróć jej imie i nazwisko, jesli nie odpowiedz false`,
                    },
                    {
                        role: "user",
                        content: `${hints.join(" ")}`,
                    },
                ],
                model: "gpt-4",
                max_tokens: 500,
            });

            chatAnswer = chatCompletion.choices[0].message.content;

            if (chatAnswer !== "false") {
                findAnswer = true;
            }
        }
        const data = await Authorization("whoami");

        const answer = await sendAnswer({
            token: data.token,
            answer: chatAnswer,
        });

        res.json({
            answer,
            chatAnswer,
            hints,
        }).status(200);
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
