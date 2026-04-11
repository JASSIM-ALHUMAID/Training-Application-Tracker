"use server";

import { getSession } from "@/lib/auth/auth";
import connectDB from "../db";
import { Board, Column, TrainApplication } from "../models";

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
    return { error: "Unauthorized" };
  }
  await connectDB();

  const {
    company,
    position,
    location,
    salary,
    description,
    tags,
    trainingUrl,
    notes,
    columnId,
    boardId,
  } = data;

  if (!company || !position) {
    return { error: "Company and position are required" };
  }

  // verify board ownership
  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board) {
    return { error: "Board not found or unauthorized" };
  }

  // verify column ownership
  const column = await Column.findOne({ _id: columnId, boardId: boardId });
  if (!column) {
    return { error: "Column not found or unauthorized" };
  }

  // get the last order number for this column
  const maxOrder = await TrainApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean();

  const order = maxOrder ? maxOrder.order + 1 : 0;

  const trainApplication = await TrainApplication.create({
    company,
    position,
    location,
    salary,
    description,
    tags: tags || [],
    jobUrl: trainingUrl,
    notes,
    columnId,
    boardId,
    userId: session.user.id,
    status: "applied",
    order,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { trainApplications: trainApplication._id },
  });

  return { data: JSON.parse(JSON.stringify(trainApplication)) };
}
