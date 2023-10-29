import { Request, Response } from "express";
import OpenAI from "openai";

export const openai = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say this is a test" }],
            model: "gpt-3.5-turbo",
        });

        res.json({
            status: 200,
            message: "passed ",
            chatCompletion,
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
