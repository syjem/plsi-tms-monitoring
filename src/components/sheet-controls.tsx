import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Printer, Save, SquarePen } from "lucide-react";

type ButtonActionsProps = {
  isEditable: boolean;
  saveSheet: () => void;
  enableEditing: () => void;
};

export function SheetControls({
  isEditable,
  saveSheet,
  enableEditing,
}: ButtonActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed right-4 bottom-4 print:hidden">
      {isEditable ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={saveSheet} className="cursor-pointer">
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={4}>
            Save
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={handlePrint}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              <p>Print</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={enableEditing}
                className="cursor-pointer"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
