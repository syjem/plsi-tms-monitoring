import { cn, toTitleCase } from "@/lib/utils";
import React from "react";

type FooterProps = {
  isEditable: boolean;
  employee: {
    id: string;
    name: string;
  };
};

export function Footer({ isEditable, employee }: FooterProps) {
  return (
    <footer className="flex justify-between mx-auto max-w-4xl print:max-w-[700px]">
      <div
        className={cn(
          "relative group flex flex-col p-4 transition-colors rounded-sm",
          isEditable && "border border-transparent hover:border-primary"
        )}
      >
        <input
          type="text"
          defaultValue="Enter name here.."
          readOnly={!isEditable}
          className="text-center text-2xl font-semibold print:text-xl outline-0"
        />

        <input
          type="text"
          defaultValue="Systems Engineer"
          readOnly={!isEditable}
          className="text-center text-sm text-gray-700 outline-0"
        />
      </div>
      <div
        className={cn(
          "flex flex-col p-4 transition-colors rounded-sm",
          isEditable && "border border-transparent hover:border-primary"
        )}
      >
        <input
          type="text"
          defaultValue={toTitleCase(employee.name) || "Enter your name here.."}
          readOnly={!isEditable}
          className="text-center text-2xl font-semibold print:text-xl outline-0"
        />

        <input
          type="text"
          defaultValue="Systems Engineer"
          readOnly={!isEditable}
          className="text-center text-sm text-gray-700 outline-0"
        />
      </div>
    </footer>
  );
}
