"use client";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { cn, toTitleCase } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FooterProps = {
  isEditable: boolean;
  employeeName: string;
};

type EmployeeStats = {
  name: string;
  title: string;
};

type DialogMode = "employee" | "officer" | null;

export function Footer({ isEditable, employeeName }: FooterProps) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [employee, setEmployee] = useState<EmployeeStats>({
    name: employeeName,
    title: "Systems Engineer",
  });
  const [officer, setOfficer] = useState<EmployeeStats>({
    name: "",
    title: "",
  });

  const [tempData, setTempData] = useState<EmployeeStats>({
    name: "",
    title: "",
  });

  const openDialog = (mode: "employee" | "officer") => {
    if (!isEditable) return;

    // Load the correct data based on mode
    const data = mode === "employee" ? employee : officer;
    setTempData({ ...data });
    setDialogMode(mode);
  };

  const handleDialogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (dialogMode === "employee") {
      setEmployee({ ...tempData });
    } else if (dialogMode === "officer") {
      setOfficer({ ...tempData });
    }

    toast.success("Changes saved!");
    setDialogMode(null);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setTempData({ name: "", title: "" });
  };

  return (
    <React.Fragment>
      <FooterDialog
        open={dialogMode !== null}
        setOpen={(open) => {
          if (!open) closeDialog();
        }}
        name={tempData.name}
        title={tempData.title}
        handler={handleDialogChange}
        onSave={handleSave}
        dialogTitle={
          dialogMode === "employee" ? "Edit Employee" : "Edit Officer"
        }
      />
      <footer className="flex justify-between mx-auto max-w-4xl print:max-w-[700px] gap-x-8">
        {officer.name ? (
          <div
            onClick={() => openDialog("officer")}
            className={cn(
              "flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm",
              isEditable &&
                "border-2 border-dashed border-gray-400 active:border-primary active:scale-95"
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {toTitleCase(officer.name)}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700">
              {officer.title}
            </p>
          </div>
        ) : (
          <EmptyComponent
            isEditable={isEditable}
            onAdd={() => openDialog("officer")}
          />
        )}
        {employee.name ? (
          <div
            onClick={() => openDialog("employee")}
            className={cn(
              "flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm",
              isEditable &&
                "border-2 border-dashed border-gray-400 active:border-primary active:scale-95"
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {toTitleCase(employee.name)}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700">
              {employee.title}
            </p>
          </div>
        ) : (
          <EmptyComponent
            isEditable={isEditable}
            onAdd={() => openDialog("employee")}
          />
        )}
      </footer>
    </React.Fragment>
  );
}

function FooterDialog({
  open,
  name,
  title,
  setOpen,
  handler,
  onSave,
  dialogTitle,
}: {
  open: boolean;
  name: string;
  title: string;
  setOpen: (open: boolean) => void;
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: React.MouseEventHandler<HTMLButtonElement>;
  dialogTitle: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={name} onChange={handler} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" name="title" value={title} onChange={handler} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={onSave}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EmptyComponent({
  isEditable,
  onAdd,
}: {
  isEditable: boolean;
  onAdd: () => void;
}) {
  return (
    <Empty
      onClick={onAdd}
      className={cn(
        "transition-all rounded-sm gap-0 py-2",
        isEditable &&
          "border-2 border-dashed border-gray-400  active:border-primary active:scale-95"
      )}
    >
      {isEditable ? (
        <EmptyHeader className="gap-0">
          <EmptyMedia variant="icon" className="bg-gray-200">
            <Plus className="size-5" />
          </EmptyMedia>
          <EmptyDescription>Add a new field</EmptyDescription>
        </EmptyHeader>
      ) : null}
    </Empty>
  );
}
