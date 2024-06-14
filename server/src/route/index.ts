import { Router } from "express";
import RequireAuth from "../middleware/require-auth.middleware"; // Import middleware to require authentication
import authRouter from "./auth.route"; // Import authentication routes
import cartRouter from "./cart.route"; // Import cart routes
import orderRouter from "./order.route"; // Import order routes
import productRouter from "./product.route"; // Import product routes
import type { ExpressRequest, ExpressResponse } from "../config/types";

const globalRouter = Router(); // Create a new router instance for global routes

// Route for handling product-related requests
globalRouter.use("/products", productRouter); // All requests to /products will be handled by productRouter

// Route for handling authentication-related requests
globalRouter.use("/auth", authRouter); // All requests to /auth will be handled by authRouter

// Route for handling cart-related requests, requires authentication
globalRouter.use("/cart", RequireAuth, cartRouter); // All requests to /cart will be handled by cartRouter and require authentication

// Route for handling order-related requests, requires authentication
globalRouter.use("/order", RequireAuth, orderRouter); // All requests to /order will be handled by orderRouter and require authentication

// Route for verifying the access token
globalRouter.get(
  "/verify-access-token",
  RequireAuth,
  (_, res: ExpressResponse) => {
    res.json({ success: true, message: "Access token valid" });
  },
);

export default globalRouter; // Export the router instance for use in other parts of the application
