'use client';

import { getSignatories } from '@/app/actions/profiles/get-signatories';
import { setSignatory as setEngineerSignatory } from '@/app/actions/profiles/set-signatory';
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
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type SignatoryNames = {
  id: number;
  name: string;
  title: string;
}[];

export const Signatories = ({ isEditable }: { isEditable: boolean }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [signatory, setSignatory] = useState<SignatoryNames>([]);

  useEffect(() => {
    const loadSignatories = async () => {
      const result = await getSignatories();
      if (result.success) {
        setSignatory(result.data);
      } else {
        console.error('Failed to load signatories:', result.error.message);
      }
    };
    loadSignatories();
  }, []);

  const firstSignatory = signatory.find((s) => s.id === 1) || {
    name: '',
    title: '',
  };
  const secondSignatory = signatory.find((s) => s.id === 2) || {
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

  const handleDialogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const id = Number(formData.get('id'));
      const name = formData.get('name') as string;
      const title = formData.get('title') as string;

      if (!id || !name || !title) return;

      const newSignatory = { id, name, title };

      // Compute the updated signatory array
      const updatedSignatories = [
        ...signatory.filter((s) => s.id !== id),
        newSignatory,
      ].sort((a, b) => a.id - b.id);

      // Update state
      setSignatory(updatedSignatories);

      // Pass the updated array to the server action
      const result = await setEngineerSignatory(updatedSignatories);
      if (!result.success) {
        throw new Error(result.error.message);
      }

      if (id === 1) setIsFirstDialogOpen(false);
      else if (id === 2) setIsSecondDialogOpen(false);

      toast.success('Signatories updated successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        toast.error(error?.message || 'Failed to update signatories');
      }
    } finally {
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
        firstSignatory={firstSignatory}
      />

      <SecondFieldDialog
        open={isSecondDialogOpen}
        setOpen={setIsSecondDialogOpen}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        secondSignatory={secondSignatory}
      />

      <footer className="flex justify-between mx-auto max-w-4xl print:max-w-[700px] gap-x-8">
        {firstSignatory.name ? (
          <div
            onClick={handleAddFirstField}
            className={cn(
              'flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {firstSignatory.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700 dark:text-gray-400 dark:print:text-gray-700">
              {firstSignatory.title}
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
                <EmptyDescription>Add a signatory</EmptyDescription>
              </EmptyHeader>
            ) : null}
          </Empty>
        )}

        {secondSignatory.name ? (
          <div
            onClick={handleAddSecondField}
            className={cn(
              'flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {secondSignatory.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700 dark:text-gray-400 dark:print:text-gray-700">
              {secondSignatory.title}
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
                <EmptyDescription>Add a signatory</EmptyDescription>
              </EmptyHeader>
            ) : null}
          </Empty>
        )}
      </footer>
    </React.Fragment>
  );
};
