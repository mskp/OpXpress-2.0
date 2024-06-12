import { Router } from "express";
import {
  GetAllProducts,
  GetProductById,
  GetProductsByCategory,
} from "../controller/product.controller"; // Import the product controller functions

const productRouter = Router(); // Create a new router instance for product routes

// Route to get all products
productRouter.route("").get(GetAllProducts); // Handle GET requests to retrieve all products

// Route to get a product by its ID
productRouter.get("/:id", GetProductById); // Handle GET requests to retrieve a product by its ID

// Route to get products by category
productRouter.get("/category/:category", GetProductsByCategory); // Handle GET requests to retrieve products by category

export default productRouter; // Export the router instance for use in other parts of the application
