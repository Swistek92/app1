import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
import OpenAI from "openai";
import * as fs from "fs";
import FormData from "form-data";
import path from "path";
// import matuesz from './../../public/'
type Data = {
    code: number;
    msg: string;
    token: string;
};

type TaskData = {
    code: number;
    msg: string;
    cookie: string;
};

export const whisper = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("whisper");
        const taskData: any = await getTaskData(data.token);

        const client = new OpenAI();
        const audioFilePath = path.join(
            __dirname,
            "./../../public/mateusz.mp3",
        );
        // For Transcription
        const audioFileStream = fs.createReadStream(audioFilePath);

        const transcript = await client.audio.transcriptions.create({
            model: "whisper-1",
            file: audioFileStream,
        });
        const answer = await sendAnswer({
            token: data.token,
            answer: transcript.text,
        });

        res.json({
            answer,
            // taskData,
            // transcript,
        }).status(200);
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
