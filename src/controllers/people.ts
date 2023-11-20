import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

type TaskData = {
    code: number;
    msg: string;
    data: string;
    question: string;
    hint1: string;
    hint2: string;
};

type Person = {
    imie: string;
    nazwisko: string;
    wiek: number;
    o_mnie: string;
    ulubiona_postac_z_kapitana_bomby: string;
    ulubiony_serial: string;
    ulubiony_film: string;
    ulubiony_kolor: string;
};

type PeopleArray = Person[];

export const people = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("1");
        const data = await Authorization("people");
        console.log("2");
        const taskData: TaskData = await getTaskData(data.token);
        const MEMORY_PATH = path.join(__dirname, "./../../public/people.json");
        const jsonData: PeopleArray = JSON.parse(
            fs.readFileSync(MEMORY_PATH, "utf8"),
        );

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    // eslint-disable-next-line max-len
                    content: ` wyciagnij z fragmentu Imie i Nazwisko, zapisz je z dużej litery, jesli imie jest zapisane zdrobniale zapisz je w oficjalnej wersji
                    odpowiadaj tylko imieniem i nazwiskiem 
                    np
                    ###
                    Adam Małysz
                    Jakub Nieznany
                    Aleksander Laska
                    `,
                },
                {
                    role: "user",
                    content: `${taskData.question}`,
                },
            ],
            model: "gpt-4",
            max_tokens: 1500,
        });

        const chatAnswer = chatCompletion.choices[0].message.content;
        const name = chatAnswer.split(" ")[0];
        const surname = chatAnswer.split(" ")[1];

        const dataAboutPerson = jsonData.find(
            e => e.imie === name && e.nazwisko === surname,
        );

        const detailedInfo1 = `Imię: ${dataAboutPerson.imie}, Nazwisko: ${dataAboutPerson.nazwisko}, Wiek: ${dataAboutPerson.wiek}, O mnie: ${dataAboutPerson.o_mnie}, Ulubiona postać z Kapitana Bomby: ${dataAboutPerson.ulubiona_postac_z_kapitana_bomby}, Ulubiony serial: ${dataAboutPerson.ulubiony_serial}, Ulubiony film: ${dataAboutPerson.ulubiony_film}, Ulubiony kolor: ${dataAboutPerson.ulubiony_kolor}`;

        const chatquest = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    // eslint-disable-next-line max-len
                    content: `  ${detailedInfo1}: mozesz udzielic informacji na temat tej osoby 
                    `,
                },
                {
                    role: "user",
                    content: `${taskData.question}`,
                },
            ],
            model: "gpt-4",
            max_tokens: 1500,
        });

        const chatAnswer2 = chatquest.choices[0].message.content;
        const answer = await sendAnswer({
            token: data.token,
            answer: chatAnswer2,
        });
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
