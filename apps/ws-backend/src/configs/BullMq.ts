import { client } from "@slates/db/client";
import { Queue } from "bullmq"
import { Worker } from "bullmq";

export const connection = { host: "127.0.0.1", port: 6379 }; // Update if needed

const shapesQueue = new Queue('shapes-queue', {connection});


export async function addShapesToQueue(shape : any) {
    console.log("Shape recieved", shape);
    await shapesQueue.add("Adding shapes to DB", {
        shape
    }, {
        removeOnComplete: true,
        attempts : 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    })
}

const worker = new Worker('shapes-queue', async (job) => {
    console.log("Message received:", job.id);
    const data = job.data.shape;
    try {
        await client.chat.create({
            data: {
                roomId: data.roomId,
                message: data.message,
                userId: data.userId
            }
        });
    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
    }
}, { 
    connection,
    concurrency: 5 
});

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

worker.on('error', err => {
    console.error("Worker error:", err);
});


