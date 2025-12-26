'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader, Printer, Save, SquarePen } from 'lucide-react';

type ButtonActionsProps = {
  isSaving: boolean;
  isEditable: boolean;
  saveSheet: () => void;
  enableEditing: () => void;
};

export function SheetControls({
  isSaving,
  isEditable,
  saveSheet,
  enableEditing,
}: ButtonActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed right-4 z-99 bottom-4 print:hidden">
      {isEditable ? (
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                disabled={isSaving}
                onClick={saveSheet}
                className="cursor-pointer"
              >
                {isSaving ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
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
                className="cursor-pointer bg-blue-500 hover:bg-blue-600"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4} className="print:hidden">
              Print
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
            <TooltipContent side="left" sideOffset={4} className="print:hidden">
              Edit
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
