"use server";

import { createAdminClient } from "@/lib/appwrite/admin";
import { DATABASE_ID, COLLECTIONS } from "@/config/appwrite";
import { Query } from "appwrite";

// Types
export interface MICCurriculumData {
  id: string;
  title: string;
  content: string;
  language: string;
  grade?: string;
  subject?: string;
  [key: string]: any;
}

export interface MNCCurriculumData {
  id: string;
  title: string;
  content: string;
  language: string;
  grade?: string;
  subject?: string;
  [key: string]: any;
}

// Mock implementation for MIC curriculum
export async function getMICCurriculum(language: string = 'en'): Promise<MICCurriculumData[]> {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CURRICULUM_DATA || "",
      [
        Query.equal("language", language),
        Query.equal("type", "mic")
      ]
    );
    return response.documents as unknown as MICCurriculumData[];
  } catch (error) {
    console.error("Error fetching MIC curriculum:", error);
    // Return mock data for development
    return [
      {
        id: "1",
        title: "MIC Curriculum",
        content: "Man Integrated Curriculum details",
        language: language,
        type: "mic"
      }
    ];
  }
}

// Mock implementation for MNC curriculum
export async function getMNCCurriculum(language: string = 'en'): Promise<MNCCurriculumData[]> {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CURRICULUM_DATA || "",
      [
        Query.equal("language", language),
        Query.equal("type", "mnc")
      ]
    );
    return response.documents as unknown as MNCCurriculumData[];
  } catch (error) {
    console.error("Error fetching MNC curriculum:", error);
    // Return mock data for development
    return [
      {
        id: "1",
        title: "MNC Curriculum",
        content: "Man National Curriculum details",
        language: language,
        type: "mnc"
      }
    ];
  }
}