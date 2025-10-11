"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { cn, toTitleCase } from "@/lib/utils";
import { Empty, EmptyMedia } from "@/components/ui/empty";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FooterProps = {
  isEditable: boolean;
  employeeName: string;
};

type EmployeeStats = {
  name: string;
  title: string;
};

export function Footer({ isEditable, employeeName }: FooterProps) {
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<EmployeeStats>({
    name: employeeName,
    title: "Systems Engineer",
  });

  useEffect(() => {
    setEmployee((prev) => ({
      ...prev,
      name: employeeName,
    }));
  }, [employeeName]);

  const dialogHandler = () => {
    if (!isEditable) return;
    setOpen(true);
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    toast.success("Saved changes!");
    setOpen(false);
  };

  return (
    <>
      <EmployeeDialog
        open={open}
        setOpen={setOpen}
        employeeName={employee.name}
        employeeTitle={employee.title}
        handler={handleEmployeeChange}
        onSave={handleSave}
      />

      <footer className="flex justify-between mx-auto max-w-4xl print:max-w-[700px] gap-x-8">
        <Empty
          className={cn(
            "transition-colors rounded-sm gap-0 py-2",
            isEditable &&
              "border-2 border-dashed hover:border-gray-400  active:border-primary active:scale-95"
          )}
        >
          <EmptyMedia variant="icon">
            <Plus />
          </EmptyMedia>
        </Empty>
        <div
          onClick={dialogHandler}
          className={cn(
            "flex-1 flex flex-col px-8 py-4 transition-colors rounded-sm",
            isEditable &&
              "border-2 border-dashed hover:border-gray-400 active:border-primary active:scale-95"
          )}
        >
          <h5 className="text-center text-2xl font-semibold print:text-xl">
            {toTitleCase(employee.name)}
          </h5>

          <p className="text-center text-sm text-gray-700">{employee.title}</p>
        </div>
      </footer>
    </>
  );
}

function EmployeeDialog({
  open,
  employeeName,
  employeeTitle,
  setOpen,
  handler,
  onSave,
}: {
  open: boolean;
  employeeName: string;
  employeeTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={employeeName}
                onChange={handler}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={employeeTitle}
                onChange={handler}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={onSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
