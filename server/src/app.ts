import CookieParser from "cookie-parser";
import CORS from "cors";
import Express from "express";
import { CORS_OPTIONS } from "./config/consts";
// Enforce availability of required env variables with proper format
import "./config/env";
import globalRouter from "./route";

// Initialize Express application
const app = Express();

// Middleware to parse JSON request bodies
app.use(Express.json());

// Middleware to parse cookies from the request headers
app.use(CookieParser());

// Middleware to enable CORS with specified options
app.use(CORS(CORS_OPTIONS));

// Use the global router for all routes prefixed with "/api"
app.use("/api", globalRouter);

// Export the Express application instance
export default app;
