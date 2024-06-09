import CORS from "cors";
import Express from "express";
import { CORS_OPTIONS } from "./config/consts.js";
import { HelloWorldController } from "./controllers/helloworld.controller.js";

const app = Express();

app.use(Express.json());
app.use(CORS(CORS_OPTIONS));

const globalRouter = Express.Router();

app.use("/api", globalRouter);

// /api/helloworld
globalRouter.get("/helloworld", HelloWorldController);

export default app;
