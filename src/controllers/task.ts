import { Request, Response } from "express";
import { badRequest, serverError, ok } from "../helpers/response";
import Bull from "bull";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../secrets";
import { promisify } from "util";
const sleep = promisify(setTimeout);

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const queueOptions = {
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      },
      limiter: {
        max: 3,
        duration: 10000,
      },
    };

    const generationQueue = new Bull("generation", queueOptions as any);

    generationQueue.process(
      (payload: any, done: (error: Error | null, result?: any) => void) => {
        console.log(payload.data + " production process started");

        let timeoutReached = false;

        const timeoutId = setTimeout(() => {
          timeoutReached = true;
          done(new Error("operation timed out"), null);
        }, 1000000);

        payload.log("Production process started");
        payload.progress(20);
        sleep(2000)
          .then(() => {
            if (timeoutReached) return;
            payload.log("Machine is running");
            payload.progress(40);
            return sleep(5000);
          })

          .then(() => {
            if (timeoutReached) return;
            payload.log("Raw material loading");
            payload.progress(60);
            return sleep(5000);
          })

          .then(() => {
            if (timeoutReached) return;
            payload.log("Substances are mixed");
            payload.progress(80);
            return sleep(5000);
          })

          .then(() => {
            clearTimeout(timeoutId);
            if (timeoutReached) {
              payload.log("operation timed out");
              return;
            }
            payload.log("Production completed");
            payload.progress(100);
            done(null, "Production completed");
          })

          .catch((error) => {
            clearTimeout(timeoutId);
            done(error as Error, null);
          });
      }
    );

    const jobs = [...new Array(10).keys()].map((_) => {
      return {
        materials: ["stone", "iron", "gold"],
        machine: "machine-1",
        band: "band-1",
        employee: "employee-1",
      };
    });

    jobs.forEach((job, i) => {
      generationQueue.add(job, {
        attempts: 3,
        backoff: 1000,
        delay: 2000,
        jobId: `product-${i}`,
        timeout: 1000000,
      });
    });

    generationQueue.on("completed", (job) => {
      console.log(`Job with id ${job.id} has been completed`);
    });

    generationQueue.on("failed", (job, error) => {
      console.log(`Job with id ${job.id} has been failed`);
    });

    return ok(res, "Tasks created successfully");
  } catch (e) {
    return serverError(res);
  }
};
