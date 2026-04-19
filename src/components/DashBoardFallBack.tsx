import { Card, CardContent, CardHeader } from "./ui/card";

const columnColors = [
  "bg-cyan-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
];

const DashBoardFallBack = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6 space-y-3">
          <div className="h-10 w-64 animate-pulse rounded-md bg-gray-200" />
          <div className="h-5 w-56 animate-pulse rounded-md bg-gray-100" />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {columnColors.map((color, index) => (
            <Card
              key={index}
              className="min-w-[300px] shrink-0 border-gray-200 p-0 shadow-md"
            >
              <CardHeader className={`${color} rounded-t-lg pb-3 pt-3`}>
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 animate-pulse rounded-md bg-white/35" />
                  <div className="h-6 w-6 animate-pulse rounded-full bg-white/25" />
                </div>
              </CardHeader>

              <CardContent className="min-h-[400px] space-y-3 rounded-b-lg bg-gray-50/50 pt-4">
                {[0, 1, 2].map((card) => (
                  <div
                    key={card}
                    className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-100" />
                    <div className="space-y-2">
                      <div className="h-3 w-full animate-pulse rounded-md bg-gray-100" />
                      <div className="h-3 w-5/6 animate-pulse rounded-md bg-gray-100" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 animate-pulse rounded-full bg-blue-100" />
                      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                    </div>
                  </div>
                ))}

                <div className="h-10 w-full animate-pulse rounded-md border-2 border-dashed border-gray-200 bg-white" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoardFallBack;
