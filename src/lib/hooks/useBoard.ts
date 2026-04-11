"use client";
import { Board, Column } from "../models/models.types";
import { useEffect, useState } from "react";

export function useBoard(initialBoard: Board | null = null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);
      setColumns(initialBoard.columns || []);
    }
  }, [initialBoard]);

  async function moveApplication(
    applicationId: string,
    newColumnId: string,
    newOrder: number,
  ) {}
  return { board, columns, error, moveApplication };
}
