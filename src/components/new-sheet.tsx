"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NewSheet() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 right-4 shadow-lg cursor-pointer"
          onClick={() => router.push("/monitoring?key=new")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipTrigger>

      <TooltipContent side="left" sideOffset={4}>
        Create New
      </TooltipContent>
    </Tooltip>
  );
}
