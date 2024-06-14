import { z } from "zod";

// Define schema for environment variables
const environmentSchema = z.object({
  API_BASE_URL: z.string().url(),
});

// Destructure environment variables
const { API_BASE_URL } = process.env;

// Parse environment variables against the schema
const parsedResults = environmentSchema.safeParse({
  API_BASE_URL,
});

// Throw error if environment variables don't match schema
if (!parsedResults.success) {
  throw new Error("Environment doesn't match the schema");
}

// Infer the type from the schema
type EnvVarSchemaType = z.infer<typeof environmentSchema>;

// Augment the ProcessEnv interface with the inferred type
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVarSchemaType {}
  }
}
