import { Request, Response } from "express";

import OpenAI from "openai";

export const ownapi = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body.question);
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `${req.body.question}`,
                },
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 500,
        });

        const chatanswer = chatCompletion.choices[0].message.content;

        res.json({
            reply: chatanswer,
        }).status(200);
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
