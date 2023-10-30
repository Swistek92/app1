type Data = {
    code: number;
    msg: string;
    note: string;
};
const sendAnswer = async ({
    token,
    answer,
}: {
    token: string;
    answer: any;
}): Promise<Data> => {
    console.log(
        JSON.stringify({
            answer: answer,
        }),
    );
    const res = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            answer: answer,
        }),
    });

    const data: Data = await res.json();
    return data;
};

export default sendAnswer;
