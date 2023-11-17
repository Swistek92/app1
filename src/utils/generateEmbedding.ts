type Embedding = {
    object: string;
    data: {
        object: string;
        index: number;
        embedding: number[];
    }[];
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
};
const generateEmbedding = async ({
    input,
}: {
    input: string;
}): Promise<number[]> => {
    const url = "https://api.openai.com/v1/embeddings";
    const payload: any = {
        input: input,
        model: "text-embedding-ada-002",
    };
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${process.env.OPENAI_API_KEY}`);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
    };

    try {
        const response = await fetch(url, requestOptions);
        const data: Embedding = await response.json();

        return data.data[0].embedding;
    } catch (error) {
        return error;
    }
};

export default generateEmbedding;
