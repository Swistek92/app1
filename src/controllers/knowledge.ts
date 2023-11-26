import { Request, Response } from "express";
import { getTaskData, Authorization, sendAnswer } from "../utils";
import OpenAI from "openai";
import axios from "axios";
type ExchangeRatesSeries = {
    Table: string;
    Currency: string;
    Code: string;
    Rates: Rates;
};

type Rates = {
    Rate: Rate[];
};

type Rate = {
    No: string;
    EffectiveDate: string; // format YYYY-MM-DD
    Mid: number;
};

type ratesAnswer = {
    data: ExchangeRatesSeries;
};

type CountryData = Array<{
    name: {
        common: string;
        official: string;
        nativeName: {
            [key: string]: {
                official: string;
                common: string;
            };
        };
    };
    tld: string[];
    cca2: string;
    ccn3: string;
    cca3: string;
    cioc: string;
    independent: boolean;
    status: string;
    unMember: boolean;
    currencies: {
        [key: string]: {
            name: string;
            symbol: string;
        };
    };
    idd: {
        root: string;
        suffixes: string[];
    };
    capital: string[];
    altSpellings: string[];
    region: string;
    subregion: string;
    languages: {
        [key: string]: string;
    };
    translations: {
        [key: string]: {
            official: string;
            common: string;
        };
    };
    latlng: number[];
    landlocked: boolean;
    borders: string[];
    area: number;
    demonyms: {
        [key: string]: {
            f: string;
            m: string;
        };
    };
    flag: string;
    maps: {
        googleMaps: string;
        openStreetMaps: string;
    };
    population: number;
    gini: {
        [year: string]: number;
    };
    fifa: string;
    car: {
        signs: string[];
        side: string;
    };
    timezones: string[];
    continents: string[];
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    coatOfArms: {
        png: string;
        svg: string;
    };
    startOfWeek: string;
    capitalInfo: {
        latlng: number[];
    };
    postalCode: {
        format: string;
        regex: string;
    };
}>;

type countryAnswer = {
    data: CountryData;
};
export const knowledge = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Authorization("knowledge");
        const taskData: any = await getTaskData(data.token);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const checkQuestion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    // eslint-disable-next-line max-len
                    content: ` jesli pytanie jest o demografie zwróc nazwe kraju  w JSON po angielsku w taki sposób

                    np

                    {
                        "question": "country",
                        "country": "poland"}
                    {
                        "question": "country",
                        "country": "germany"}

                        jesli pytanie jest o jakas walute zwróc JSON który w polu currency zawiera kod waluty
                        np

                        {question: "currency",
                         "currency": "USD",   
                    }
                    
                        {question: "currency",
                         "currency": "PLN",   
                    }

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

        const chatAnswer = checkQuestion.choices[0].message.content;

        const answer = JSON.parse(chatAnswer);
        res.json({
            chatAnswer,
            taskData,
        }).status(200);
        //         if (answer.question === "country") {
        //             const fetch: countryAnswer = await axios.get(
        //                 `https://restcountries.com/v3.1/name/${answer.country}`,
        //             );
        //             console.log(fetch);
        //             const population = fetch.data[0].population;
        //             const taskAnswer = await sendAnswer({
        //                 token: data.token,
        //                 answer: population,
        //             });
        //             res.json({
        //                 taskAnswer,
        //                 chatAnswer,
        //                 taskData,
        //             }).status(200);
        //         } else {
        //             const fetch: ratesAnswer = await axios.get(
        //                 `https://api.nbp.pl/api/exchangerates/rates/A/${answer.currency}/
        // `,
        //             );
        //             // console.log(fetch), console.log(fetch.Rates.Rate[0].Mid);
        //             console.log(fetch.data.Rates.Rate[0].Mid);
        //             const answer = fetch.data.Rates.Rate[0].Mid;
        //             const taskAnswer = await sendAnswer({
        //                 token: data.token,
        //                 answer: answer,
        //             });
        //             res.json({
        //                 taskAnswer,
        //                 chatAnswer,
        //                 taskData,
        //             }).status(200);
        //         }
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        }).status(500);
    }
};
