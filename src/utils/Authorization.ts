type Data = {
    code: number;
    msg: string;
    token: string;
};

const Authorization = async (taskName: string): Promise<Data> => {
    try {
        const apikey = await fetch(
            `https://zadania.aidevs.pl/token/${taskName}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    apikey: process.env.apikey,
                }),
            },
        );

        if (!apikey.ok) {
            throw new Error(`HTTP error! status: ${apikey.status}`);
        }

        const data: Data = await apikey.json();
        return data;
    } catch (error) {
        return error;
    }
};

export default Authorization;
