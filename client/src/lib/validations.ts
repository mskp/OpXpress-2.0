import { z } from "zod";

/**
 * Schema for validating the signup form.
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((ctx) => ctx.password === ctx.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

/**
 * Schema for validating the login form.
 */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Schema for validating the checkout form.
 */
export const checkoutSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  pincode: z
    .string()
    .length(6, "Pincode must be 6 digits long")
    .regex(/^\d+$/, "Pincode must contain only digits"),
  city: z.string().min(1, "City is required"),
});
