import { Card, CardBody, Button } from "@heroui/react";

export default function StreakPage() {
  return (
    <div className="px-4 pt-6 flex flex-col items-center gap-6">

      <Card className="w-full bg-gray-900 text-center py-10 border border-gray-700">
        <CardBody>
          <p className="text-gray-400">Your Streak</p>
          <p className="text-7xl font-bold text-yellow-400">
            12🔥
          </p>
          <p className="text-gray-500 mt-2">days in a row</p>

          <Button
            className="mt-8 bg-yellow-400 text-black font-semibold text-lg py-6"
            size="lg"
          >
            Check In
          </Button>
        </CardBody>
      </Card>

    </div>
  );
}
