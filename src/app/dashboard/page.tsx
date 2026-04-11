import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/KanbanBoard";
import { Suspense } from "react";
import DashBoardFallBack from "@/components/DashBoardFallBack";

async function getBoard(userId: string) {
  "use cache";
  await connectDB();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Training Tracker",
  }).populate({
    path: "columns",
    populate: {
      path: "trainingApplications",
    },
  });

  const board = boardDoc ? JSON.parse(JSON.stringify(boardDoc)) : null;

  return board;
}

async function DashBoardPage() {
  const session = await getSession();
  const board = await getBoard(session?.user.id || "");

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board?.name || "Training Tracker"}</h1>
          <p className="text-gray-600">Track your training applications</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

const DashBoard = async () => {
  const session = await getSession();
  const board = await getBoard(session?.user.id || "");

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={<DashBoardFallBack />}>
      <DashBoardPage />
    </Suspense>
  );
};

export default DashBoard;
