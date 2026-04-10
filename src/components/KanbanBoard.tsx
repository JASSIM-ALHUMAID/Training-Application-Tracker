"use client"

import { Board } from "@/lib/models/models.types";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

const KanbanBoard = ({ board, userId }: KanbanBoardProps) => {
  return (
    <div>KanbanBoard</div>
  )
}

export default KanbanBoard