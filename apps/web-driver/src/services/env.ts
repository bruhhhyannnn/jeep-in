import { z } from "zod";

// The native app's EXPO_PUBLIC_FIREBASE_* values, as VITE_* (see .env.example).
const schema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) {
  throw new Error(
    `Missing or invalid env vars — copy .env.example to .env.local:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
