import OpenAI from "openai";

const generateArticeBasedOnTitle = async (title: string): Promise<any> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `napisz  ${title}  maskymalnie 5 zdań `,
            },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
};

export default generateArticeBasedOnTitle;
