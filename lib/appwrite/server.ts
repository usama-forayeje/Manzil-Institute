import { Client, Account, Databases } from "node-appwrite";
import { cookies } from "next/headers";

/**
 * Error thrown when no session cookie is found
 */
export class NoSessionError extends Error {
  constructor(message = "No session found") {
    super(message);
    this.name = "NoSessionError";
  }
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");
  
  if (!session?.value) throw new NoSessionError();


  client.setSession(session.value);

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}

// Admin client for server-side operations
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}
