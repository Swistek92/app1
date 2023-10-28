import { Request, Response } from "express";
import { copyFileSync } from "fs";

/**
 * GET /
 * Home page.
 */

export const index = async (req: Request, res: Response): Promise<void> => {
    res.json({
        status: 200,
        message: "hello ci cd ",
    }).status(200);
    console.log("");
};

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

export const helloapi = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("apikey", process.env.apikey);
        // if (!process.env.apikey) {
        //     throw new Error("NO API KEY");
        // }
        // const secretApi = process.env.apiKey;
        const apikey = await fetch("https://zadania.aidevs.pl/token/helloapi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apikey: process.env.apikey,
            }),
        });

        if (!apikey.ok) {
            throw new Error(`HTTP error! status: ${apikey.status}`);
        }

        const data: Data = await apikey.json();
        console.log(data.code);
        console.log("data code ", data.code), console.log("data msg", data.msg);
        console.log("data token", data.token);

        const task = await fetch(
            `https://zadania.aidevs.pl/task/${data.token}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!task.ok) {
            throw new Error(`HTTP error! status RESPONSE 2 : ${task.status}`);
        }
        const taskData: TaskData = await task.json();

        const answer = await fetch(
            `https://zadania.aidevs.pl/answer/${data.token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    answer: taskData.cookie,
                }),
            },
        );
        if (!answer.ok) {
            throw new Error(`HTTP error! status ANSWER  : ${answer.status}`);
        }
        const answerData = await answer.json();

        res.json({
            status: 200,
            message: "passed ",
            answerData,
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
