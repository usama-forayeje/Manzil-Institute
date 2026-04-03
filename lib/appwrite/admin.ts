// ============================================================
// APPWRITE ADMIN CLIENT — API Key দিয়ে (Full permissions)
// শুধুমাত্র Server Actions এ use করবে
// কখনো client-side এ expose করবে না!
// Use cases: callback এ user doc বানানো, bulk operations,
//            audit log লেখা, admin-only queries
// ============================================================

import { Client, Account, Databases, Storage, Users } from "node-appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/config/appwrite";

export async function createAdminClient() {
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "APPWRITE_API_KEY is not set. Add it to .env.local (server-only)."
    );
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(apiKey);

  return {
    get account()   { return new Account(client); },
    get databases() { return new Databases(client); },
    get storage()   { return new Storage(client); },
    get users()     { return new Users(client); },   // user labels/prefs পরিবর্তনে লাগবে
  };
}