import OpenAI from "openai";

const validateAnswer = async (
    question: string,
    answer: string,
): Promise<any> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `check that ${answer} is correct answer on question: ${question}, answer excatly YES/NO`,
            },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
};

export default validateAnswer;
