import { Router } from "express";
import { CreateNewOrder, GetAllOrders } from "../controller/order.controller"; // Import the order controller functions

const orderRouter = Router(); // Create a new router instance for order routes

// Define the routes for order operations
orderRouter
  .route("")
  .get(GetAllOrders) // Handle GET requests to retrieve all orders
  .post(CreateNewOrder); // Handle POST requests to create a new order

export default orderRouter; // Export the router instance for use in other parts of the application
