import { Queue } from "bullmq"

const shapesQueue = new Queue('shapes-queue');


export async function addShapesToQueue(shape : any) {
    console.log("Shape recieved", shape);
    await shapesQueue.add("Adding shapes to DB", {
        shape
    })
}

