import { z } from "zod";

// Define schema for environment variables with regex validation
const environmentSchema = z.object({
  DATABASE_URL: z
    .string()
    .regex(
      /^(postgres|mysql|mongodb|mongodb\+srv):\/\/[^\s]+$/,
      "Invalid DATABASE_URL format. Must be a valid database connection URL.",
    ),

  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION: z.string().optional(),
  ALLOWED_ORIGIN: z.string(),
  PORT: z.coerce.number().optional(),
});

// Destructure environment variables
const {
  DATABASE_URL,
  ACCESS_TOKEN_SECRET,
  ALLOWED_ORIGIN,
  ACCESS_TOKEN_EXPIRATION,
  PORT,
} = process.env;

// Parse environment variables against the schema
const parsedResults = environmentSchema.safeParse({
  DATABASE_URL,
  ACCESS_TOKEN_SECRET,
  ALLOWED_ORIGIN,
  ACCESS_TOKEN_EXPIRATION,
  PORT,
});

// Throw error if environment variables don't match schema
if (!parsedResults.success) {
  const errorDetails = parsedResults.error.errors
    .map((err) => `${err.path.join(".")} - ${err.message}`)
    .join(", ");
  const errorMessage = `Environment variables validation error: ${errorDetails}`;
  throw new Error(errorMessage);
}

// Infer the type from the schema
type EnvVarSchemaType = z.infer<typeof environmentSchema>;

// Augment the ProcessEnv interface with the inferred type
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVarSchemaType {}
  }
}
