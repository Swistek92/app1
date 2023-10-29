const getTaskData = async (token: string): Promise<any> => {
    const task = await fetch(`https://zadania.aidevs.pl/task/${token}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!task.ok) {
        throw new Error(`HTTP error! status RESPONSE 2 : ${task.status}`);
    }
    const taskData: any = await task.json();

    return taskData;
};

export default getTaskData;
