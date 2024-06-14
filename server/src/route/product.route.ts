import { Router } from "express";
import {
  GetProductById,
  GetProducts,
  SearchProducts,
} from "../controller/product.controller"; // Import the product controller functions

const productRouter = Router(); // Create a new router instance for product routes

// Route to get all products
productRouter.route("").get(GetProducts); // Handle GET requests to retrieve all products

// Route to get a product by search query
productRouter.get("/search", SearchProducts); // Handle GET requests to retrieve a product by search query

// Route to get a product by its ID
productRouter.get("/:id", GetProductById); // Handle GET requests to retrieve a product by its ID


export default productRouter; // Export the router instance for use in other parts of the application
