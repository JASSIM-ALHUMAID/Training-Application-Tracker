import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/KanbanBoard";

const DashBoard = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  await connectDB();

  const board = await Board.findOne({
    userId: session.user.id,
    name: "Train Hunt",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Train Hunt</h1>
          <p className="text-gray-600">Track your train applications</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
};

export default DashBoard;
