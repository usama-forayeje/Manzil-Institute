"use server";

import { createAdminClient } from "@/lib/appwrite/admin";
import { DATABASE_ID, COLLECTIONS } from "@/config/appwrite";
import { Query } from "appwrite";

// Types
export interface AdmissionData {
  id: string;
  title: string;
  content: string;
  language: string;
  [key: string]: any;
}

// Mock implementation for admission data
export async function getAdmissionData(language: string = 'en'): Promise<AdmissionData[]> {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMISSION_DATA || "",
      [Query.equal("language", language)]
    );
    return response.documents as AdmissionData[];
  } catch (error) {
    console.error("Error fetching admission data:", error);
    // Return mock data for development
    return [
      {
        id: "1",
        title: "Admission Information",
        content: "Admission details for Manzil Institute",
        language: language,
      }
    ];
  }
}