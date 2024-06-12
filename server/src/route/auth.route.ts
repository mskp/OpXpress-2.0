import { Router } from "express";
import { Login, Logout, Signup } from "../controller/auth.controller"; // Import the authentication controller functions

const authRouter = Router(); // Create a new router instance for authentication routes

// Route for user signup
authRouter.post("/signup", Signup); // Handle POST requests to /signup with the Signup controller

// Route for user login
authRouter.post("/login", Login); // Handle POST requests to /login with the Login controller

// Route for user logout
authRouter.delete("/logout", Logout); // Handle DELETE requests to /logout with the Logout controller

export default authRouter; // Export the router instance for use in other parts of the application
