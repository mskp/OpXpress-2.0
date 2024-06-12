import { Router } from "express";
import {
  AddToCart,
  ClearCartController,
  DeleteCartItem,
  GetAllCartItems,
  UpdateCartItem,
} from "../controller/cart.controller"; // Import the cart controller functions

const cartRouter = Router(); // Create a new router instance for cart routes

// Define the routes for cart operations
cartRouter
  .route("")
  .get(GetAllCartItems) // Handle GET requests to retrieve all cart items
  .post(AddToCart) // Handle POST requests to add an item to the cart
  .patch(UpdateCartItem) // Handle PATCH requests to update an existing cart item
  .delete(DeleteCartItem); // Handle DELETE requests to remove an item from the cart

cartRouter.delete("/all", ClearCartController); // Handle DELETE request to clear the user cart

export default cartRouter; // Export the router instance for use in other parts of the application
