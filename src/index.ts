import express from "express";
import { PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "./secrets";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import Queue from "bull";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import rootRouter from "./routes";

const redisOptions = {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
};

// define queue
const queuesList = ["generation"];

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/queues");

const queues = queuesList
  .map((qs) => new Queue(qs, redisOptions as any))
  .map((q) => new BullAdapter(q as any));

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: queues as any,
  serverAdapter: serverAdapter,
});

const app = express();
//app.use(helmet());
//app.use(express.json());

app.use("/queues", serverAdapter.getRouter());
app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
