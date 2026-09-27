import { Client, Account, Databases, Storage, Users } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // Admin key

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const users = new Users(client);

// Modern TablesDB vocabulary compliance (docs/appwrite.md §1)
export const tablesDB = databases;

export function createAdminClient() {
  return {
    client,
    account,
    databases,
    tablesDB,
    storage,
    users,
  };
}