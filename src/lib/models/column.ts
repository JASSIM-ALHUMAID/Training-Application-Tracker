import mongoose, { Schema, Document } from "mongoose";

export interface IColumn extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  trainingApplications: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Board -> Columns -> TrainingApplications

const ColumnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    trainingApplications: [
      {
        type: Schema.Types.ObjectId,
        ref: "TrainingApplication",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Column ||
  mongoose.model<IColumn>("Column", ColumnSchema);
