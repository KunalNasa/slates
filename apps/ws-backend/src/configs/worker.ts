import { Worker } from "bullmq";

export const worker = new Worker('shapes-queue', async (job) => {
    console.log("Message recieved", job.id);
    console.log("Message recieved", job.data);
})

