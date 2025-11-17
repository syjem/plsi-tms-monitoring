"use client";

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
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={saveSheet}
                className="cursor-pointer dark:text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              Save
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={handlePrint}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 dark:text-white"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              Print
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={enableEditing}
                className="cursor-pointer dark:text-white"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              Edit
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
