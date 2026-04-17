import { Client, Account, Databases, Storage, Users } from 'node-appwrite';
import { cookies } from 'next/headers';

export class NoSessionError extends Error {
  constructor(message: string = 'No active session') {
    super(message);
    this.name = 'NoSessionError';
  }
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  // Get session from cookies - cookies() is now async in Next.js 16
  const cookieStore = await cookies();
  const session = cookieStore.get('appwrite-session')?.value;

  if (!session) {
    throw new NoSessionError();
  }

  client.setSession(session);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
}
