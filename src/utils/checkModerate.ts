type Data = {
    id: string;
    model: string;
    results: {
        flagged: boolean;
        categories: {
            sexual: boolean;
            hate: boolean;
            harassment: boolean;
            selfHarm: boolean;
            sexualMinors: boolean;
            hateThreatening: boolean;
            violenceGraphic: boolean;
            selfHarmIntent: boolean;
            selfHarmInstructions: boolean;
            harassmentThreatening: boolean;
            violence: boolean;
        };
        categoryScores: {
            sexual: number;
            hate: number;
            harassment: number;
            selfHarm: number;
            sexualMinors: number;
            hateThreatening: number;
            violenceGraphic: number;
            selfHarmIntent: number;
            selfHarmInstructions: number;
            harassmentThreatening: number;
            violence: number;
        };
    }[];
};

const checkModerate = async (msg: string): Promise<boolean> => {
    const moderate = await fetch(`https://api.openai.com/v1/moderations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            input: msg,
        }),
    });
    const data: Data = await moderate.json();
    return data.results[0].flagged;
};

export default checkModerate;
