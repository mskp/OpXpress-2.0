import { z } from "zod";

/**
 * Schema for validating the request body of authentication endpoints.
 */
export const authSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
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

/**
 * Schema for validating the query param of fetch products controller
 */
export const fetchProductsQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  category: z
    .enum(["men's clothing", "women's clothing", "accessories"])
    .optional(),
});

/**
 * Schema for validating the query params of fetch products controller
 */
export const searchProductsQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  limit: z.coerce.number().int().optional(),
  offset: z.coerce.number().int().optional(),
});

/**
 * Schema for validating the path params of fetch products by id controller
 */
export const fetchProductsByProductIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});
