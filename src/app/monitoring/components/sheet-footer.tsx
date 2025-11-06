"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { SystemsEngineerDataType } from "@/types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { FirstFieldDialog } from "@/app/monitoring/components/first-dialog";
import { SecondFieldDialog } from "@/app/monitoring/components/second-dialog";
import { insertSystemsEngineer } from "@/app/actions/insert-systems-engineer";
import { updateSystemsEngineer } from "@/app/actions/update-systems-engineer";

type FieldValueType = {
  id?: number;
  name: string;
  title: string;
};

export const SheetFooter = ({
  engineers,
  isEditable,
}: {
  engineers: SystemsEngineerDataType;
  isEditable: boolean;
}) => {
  const firstField = engineers.filter((item) => item.field_number === 1);
  const secondField = engineers.filter((item) => item.field_number === 2);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);

  const [firstFieldData, setFirstFieldData] = useState<FieldValueType>({
    id: firstField[0]?.id || undefined,
    name: firstField[0]?.name || "",
    title: firstField[0]?.title || "",
  });

  const [secondFieldData, setSecondFieldData] = useState<FieldValueType>({
    id: secondField[0]?.id || 0,
    name: secondField[0]?.name || "",
    title: secondField[0]?.title || "",
  });

  const handleAddFirstField = () => {
    if (!isEditable) return;
    setIsFirstDialogOpen(true);
  };

  const handleAddSecondField = () => {
    if (!isEditable) return;
    setIsSecondDialogOpen(true);
  };

  const handleDialogSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    field_number: number
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const title = formData.get("title") as string;

      if (!name || !title) {
        return;
      }

      if (id && Number(id) !== 0) {
        const data = await updateSystemsEngineer(Number(id), name, title);
        if (field_number === 1) {
          setFirstFieldData({
            id: data.id,
            name: data.name,
            title: data.title,
          });
        } else if (field_number === 2) {
          setSecondFieldData({
            id: data.id,
            name: data.name,
            title: data.title,
          });
        }
      } else {
        const data = await insertSystemsEngineer(name, title, field_number);

        if (field_number === 1) {
          setFirstFieldData({
            id: data.id,
            name: data.name,
            title: data.title,
          });
        } else if (field_number === 2) {
          setSecondFieldData({
            id: data.id,
            name: data.name,
            title: data.title,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      if (field_number === 1) {
        setIsFirstDialogOpen(false);
      } else if (field_number === 2) {
        setIsSecondDialogOpen(false);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <FirstFieldDialog
        open={isFirstDialogOpen}
        setOpen={setIsFirstDialogOpen}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        firstFieldData={firstFieldData}
      />

      <SecondFieldDialog
        open={isSecondDialogOpen}
        setOpen={setIsSecondDialogOpen}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        secondFieldData={secondFieldData}
      />

      <footer className="flex justify-between mx-auto max-w-4xl print:max-w-[700px] gap-x-8">
        {firstFieldData.name ? (
          <div
            onClick={handleAddFirstField}
            className={cn(
              "flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm",
              isEditable &&
                "border-2 border-dashed border-gray-400 active:border-primary active:scale-95"
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {firstFieldData.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700">
              {firstFieldData.title}
            </p>
          </div>
        ) : (
          <Empty
            onClick={handleAddFirstField}
            className="transition-all rounded-sm gap-0 py-2 border-2 border-dashed border-gray-400  active:border-primary active:scale-95"
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
        )}

        {secondFieldData.name ? (
          <div
            onClick={handleAddSecondField}
            className={cn(
              "flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm",
              isEditable &&
                "border-2 border-dashed border-gray-400 active:border-primary active:scale-95"
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {secondFieldData.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700">
              {secondFieldData.title}
            </p>
          </div>
        ) : (
          <Empty
            onClick={handleAddSecondField}
            className="transition-all rounded-sm gap-0 py-2 border-2 border-dashed border-gray-400  active:border-primary active:scale-95"
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
        )}
      </footer>
    </React.Fragment>
  );
};
