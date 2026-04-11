"use server";

import { getSession } from "@/lib/auth/auth";
import connectDB from "../db";
import { Board, Column, TrainingApplication } from "../models";
import { revalidatePath } from "next/cache";

interface CreateTrainingApplicationParams {
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

export async function createTrainingApplication(
  data: CreateTrainingApplicationParams,
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
  const maxOrder = await TrainingApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean();

  const order = maxOrder ? maxOrder.order + 1 : 0;

  const newTrainingApplication = await TrainingApplication.create({
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
    $push: { trainingApplications: newTrainingApplication._id },
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(newTrainingApplication)) };
}

export async function updateApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    salary?: string;
    description?: string;
    tags?: string[];
    jobUrl?: string;
    notes?: string;
    order?: number;
    columnId?: string;
  },
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const trainingApplication = await TrainingApplication.findById(id);

  if (!trainingApplication) {
    return { error: "Training application not found" };
  }
  if (trainingApplication.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const { columnId, order, ...otherUpdate } = updates;
  const updatedToApply: Partial<{
    company: string;
    position: string;
    location: string;
    salary: string;
    description: string;
    tags: string[];
    jobUrl: string;
    notes: string;
    order: number;
    columnId: string;
  }> = otherUpdate;

  const currentColumn = trainingApplication.columnId.toString();
  const newColumnId = columnId?.toString();

  const isMovingToDifferentColumn =
    newColumnId && newColumnId !== currentColumn;

  if (isMovingToDifferentColumn) {
    // Remove from old column
    await Column.findByIdAndUpdate(currentColumn, {
      $pull: { trainingApplications: id },
    });

    const applicationInTargetColumn = await TrainingApplication.find({
      _id: { $ne: id },
      columnId: newColumnId,
    })
      .sort({ order: 1 })
      .lean();

    let newOrderValue: number;

    if (order !== undefined && order !== null) {
      newOrderValue = order * 100;

      const applicationsToReorder = applicationInTargetColumn?.slice(order);
      for (const app of applicationsToReorder || []) {
        await TrainingApplication.findByIdAndUpdate(app._id, {
          $set: { order: app.order + 100 },
        });
      }
    } else {
      if (applicationInTargetColumn?.length > 0) {
        const lastOrder =
          applicationInTargetColumn[applicationInTargetColumn.length - 1]
            .order || 0;
        newOrderValue = lastOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }

    updatedToApply.order = newOrderValue;
    updatedToApply.columnId = newColumnId;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { trainingApplications: id },
    });
  } else if (order !== undefined && order !== null) {
    const applicationInSameColumn = await TrainingApplication.find({
      _id: { $ne: id },
      columnId: currentColumn,
    })
      .sort({ order: 1 })
      .lean();

    const currentApplicationOrder = trainingApplication.order || 0;
    const currentIndex = applicationInSameColumn.findIndex(
      (app: any) => app.order > currentApplicationOrder,
    );
    const oldPositionIndex =
      currentIndex === -1 ? applicationInSameColumn.length : currentIndex;

    const newOrderValue = order * 100;

    if (oldPositionIndex > order) {
      const applicationsToShiftDown = applicationInSameColumn.slice(
        order,
        oldPositionIndex,
      );
      for (const app of applicationsToShiftDown) {
        await TrainingApplication.findByIdAndUpdate(app._id, {
          $set: { order: app.order + 100 },
        });
      }
    } else if (order > oldPositionIndex) {
      const applicationsToShiftUp = applicationInSameColumn.slice(
        oldPositionIndex,
        order,
      );
      for (const app of applicationsToShiftUp) {
        const newOrder = Math.max(0, app.order - 100);
        await TrainingApplication.findByIdAndUpdate(app._id, {
          $set: { order: newOrder },
        });
      }
    }

    updatedToApply.order = newOrderValue;
  }

  const updated = await TrainingApplication.findByIdAndUpdate(
    id,
    updatedToApply,
    {
      new: true,
    },
  );

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(updated)) };
}
