import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: process.env.NEXT_PUBLIC_AUTH_BASE_PATH!,
});

export const { signIn, signUp, signOut, useSession  } = authClient;
