"use server";

import { getSession } from "@/lib/auth";

interface CreateTrainApplicationParams {
  company: string;
  position: string;
  location?: string;
  salary?: string;
  description?: string;
  tags?: string[];
  trainingUrl?: string;
  notes?: string;
  columnId: string;
  boardId: string;
}

export async function createTrainApplication(
  data: CreateTrainApplicationParams,
) {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return { error: "User not authenticated" };
  }
  
  
}
