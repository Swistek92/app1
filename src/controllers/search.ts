import { QdrantClient } from "@qdrant/js-client-rest";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { Document } from "langchain/document";
import fs from "fs";

import {
    getTaskData,
    Authorization,
    sendAnswer,
    generateEmbedding,
} from "../utils";
import path from "path";

type TaskData = {
    code: number;
    msg: string;
    question: string;
};

const COLLECTION_NAME = "ai_devs1";
const MEMORY_PATH = path.join(__dirname, "./../../public/archiwum.json");
type JsonDataItem = {
    title: string;
    url: string;
    info: string;
    date: string;
};

export const search = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json({
            Asd: "Asd",
        }).status(200);
        // const data = await Authorization("search");
        // const taskData: TaskData = await getTaskData(data.token);

        // const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
        // const queryEmbedding = await embeddings.embedQuery(taskData.question);

        // const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
        // const result = await qdrant.getCollections();
        // const indexed = result.collections.find(
        //     collection => collection.name === COLLECTION_NAME,
        // );

        // if (!indexed) {
        //     await qdrant.createCollection(COLLECTION_NAME, {
        //         vectors: { size: 1536, distance: "Cosine", on_disk: true },
        //     });
        // }

        // const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

        // if (!collectionInfo.points_count) {
        //     const jsonData: JsonDataItem[] = JSON.parse(
        //         fs.readFileSync(MEMORY_PATH, "utf8"),
        //     );
        //     const limitedJsonData = jsonData.slice(0, 300);

        //     const documents = limitedJsonData.map(
        //         (item: JsonDataItem) =>
        //             new Document({
        //                 pageContent: item.info,
        //                 metadata: {
        //                     title: item.title,
        //                     url: item.url,
        //                     date: item.date,
        //                     source: COLLECTION_NAME,
        //                     uuid: uuidv4(),
        //                 },
        //             }),
        //     );

        //     const points = [];
        //     for (const document of documents) {
        //         const [embedding] = await embeddings.embedDocuments([
        //             document.pageContent,
        //         ]);
        //         points.push({
        //             id: document.metadata.uuid,
        //             payload: document.metadata,
        //             vector: embedding,
        //         });
        //     }

        //     await qdrant.upsert(COLLECTION_NAME, {
        //         wait: true,
        //         batch: {
        //             ids: points.map(point => point.id),
        //             vectors: points.map(point => point.vector),
        //             payloads: points.map(point => point.payload),
        //         },
        //     });
        // }

        // const search = await qdrant.search(COLLECTION_NAME, {
        //     vector: queryEmbedding,
        //     limit: 1,
        // });

        // const answer = await sendAnswer({
        //     token: data.token,
        //     answer: search[0].payload.url,
        // });
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
            error1: error,
        }).status(500);
    }
};
