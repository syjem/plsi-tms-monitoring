'use client';

import { FirstFieldDialog } from '@/app/monitoring/components/first-dialog';
import { SecondFieldDialog } from '@/app/monitoring/components/second-dialog';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

type SignatoryNames = {
  id: number;
  name: string;
  title: string;
}[];

export const SheetFooter = ({ isEditable }: { isEditable: boolean }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [signatoryNames, setSignatoryNames] = useState<SignatoryNames>([]);

  const firstFieldData = signatoryNames.find((s) => s.id === 1) || {
    name: '',
    title: '',
  };
  const secondFieldData = signatoryNames.find((s) => s.id === 2) || {
    name: '',
    title: '',
  };

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
    id: number,
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const id = Number(formData.get('id'));
      const name = formData.get('name') as string;
      const title = formData.get('title') as string;

      if (!name || !title) {
        return;
      }

      if (id) {
        // Update existing signatory
        setSignatoryNames((prev) =>
          prev.map((signatory) =>
            signatory.id === id ? { ...signatory, name, title } : signatory,
          ),
        );
      } else {
        // Add new signatory
        const newId =
          signatoryNames.length > 0
            ? Math.max(...signatoryNames.map((s) => s.id)) + 1
            : 1;
        setSignatoryNames((prev) => [...prev, { id: newId, name, title }]);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);

      if (id === 1) setIsFirstDialogOpen(false);
      else if (id === 2) setIsSecondDialogOpen(false);
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
              'flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {firstFieldData.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700 dark:text-gray-400 dark:print:text-gray-700">
              {firstFieldData.title}
            </p>
          </div>
        ) : (
          <Empty
            onClick={handleAddFirstField}
            className={cn(
              'transition-all rounded-sm gap-0 py-2 border-2 border-dashed active:scale-95',
              isEditable
                ? 'border-slate-700  active:border-primary'
                : 'border-transparent active:border-transparent',
            )}
          >
            {isEditable ? (
              <EmptyHeader className="gap-0">
                <EmptyMedia
                  variant="icon"
                  className="bg-gray-200 dark:bg-slate-800"
                >
                  <Plus className="size-4" />
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
              'flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {secondFieldData.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700 dark:text-gray-400 dark:print:text-gray-700">
              {secondFieldData.title}
            </p>
          </div>
        ) : (
          <Empty
            onClick={handleAddSecondField}
            className={cn(
              'transition-all rounded-sm gap-0 py-2 border-2 border-dashed active:scale-95',
              isEditable
                ? 'border-slate-700  active:border-primary'
                : 'border-transparent active:border-transparent',
            )}
          >
            {isEditable ? (
              <EmptyHeader className="gap-0">
                <EmptyMedia
                  variant="icon"
                  className="bg-gray-200 dark:bg-slate-800"
                >
                  <Plus className="size-4" />
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
