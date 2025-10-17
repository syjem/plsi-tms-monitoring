"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddBlankSheet() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/monitoring/new");
  };

  return (
    <div
      onClick={handleClick}
      className="group flex-1 rounded-lg border-2 border-dashed bg-white p-8 transition-all duration-500 border-gray-300 hover:border-gray-400 hover:shadow-md flex items-center justify-center cursor-pointer"
    >
      <div className="rounded-full bg-gray-100 p-4">
        <Plus className="h-8 w-8 text-gray-600" />
      </div>
    </div>
  );
}
