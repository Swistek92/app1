import { Request, Response } from "express";
import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateArticeBasedOnTitle,
} from "../utils";
import OpenAI from "openai";
type Task = {
    code: number;
    msg: string;
    hint: string;
    exampleForToDo: string;
    exampleForCalendar: string;
    question: string;
};

export const tools = async (req: Request, res: Response): Promise<void> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data = await Authorization("tools");
        const task: Task = await getTaskData(data.token);

        //  const openai = new OpenAI({
        //      apiKey: process.env.OPENAI_API_KEY,
        //  });

        const checkQuestion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    // eslint-disable-next-line max-len
                    content: ` 
                    zawsze uzywaj zapisu dat w formacie YYYY-MM-DD,
                    jesli zpytanie zawiera rzecz do zrobienia to zwróc dane w JSON w taki sposób:

                    np
                    dla zapytania : Przypomnij mi, że mam kupić mleko:

                    {"tool":"ToDo", "desc":"Kup mleko" }

                    dla zapytania : Przypomnij mi, że mam kupić piwo:

                     {"tool":"ToDo","desc":"Kup piwo" }

                        jesli pytanie jest o jakas wydarzenie które kwalifikuje sie do zapisania w kalendarzu
                         zwróc JSON który w polu desc zawiera krótki opis 
                        np

                      dla zpaytania: Jutro mam spotkanie z Marianem 
                      
                      {"tool":"Calendar", "desc":"Spotkanie z Marianem", "date":"2023-11-26"}

                       dla zpaytania: w poniedzialek mam samolot do warszawy
                       
                        { "tool":"Calendar", "desc":"samolot warszawa", "date":"2023-12-16" }

                    zawsze zwracaj poprawny obiekt JSON

                    `,
                },
                {
                    role: "user",
                    content: `${task.question}`,
                },
            ],
            model: "gpt-4",
            max_tokens: 1500,
        });

        const chatAnswer = checkQuestion.choices[0].message.content;

        console.log(chatAnswer);
        const taskAnswer = await sendAnswer({
            token: data.token,
            answer: JSON.parse(chatAnswer),
        });
        //  const answer = JSON.parse(chatAnswer);
        console.log(task);
        res.json({
            taskAnswer,
            chatAnswer,
            task: task,
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
