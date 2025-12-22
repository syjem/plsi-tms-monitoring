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
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { OperationResult } from '@/utils/with-error-handler';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

export const Signatories = ({
  isEditable,
  signature,
}: {
  isEditable: boolean;
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['signatories'],
    queryFn: getSignatories,
    refetchOnWindowFocus: false,
  });

  const signatories = data?.success ? data.data : [];

  const firstSignatory = signatories.find((s) => s.id === 1) || {
    name: '',
    title: '',
  };

  const secondSignatory = signatories.find((s) => s.id === 2) || {
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

      const updatedSignatories = [
        ...signatories.filter((s) => s.id !== id),
        newSignatory,
      ].sort((a, b) => a.id - b.id);

      const result = await setEngineerSignatory(updatedSignatories);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      await refetch();

      if (id === 1) setIsFirstDialogOpen(false);
      if (id === 2) setIsSecondDialogOpen(false);

      toast.success('Signatories updated successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update signatories',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-between mx-auto max-w-4xl gap-x-8 px-2 md:px-8 py-4">
        <Skeleton className="h-20 w-full flex-1" />
        <Skeleton className="h-20 w-full flex-1" />
      </div>
    );
  }

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
              'relative flex-1 flex flex-col items-stretch px-2 md:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            {signature.success && signature.data && (
              <Image
                src={signature.data}
                alt="Engineer Signature"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                width={200}
                height={200}
              />
            )}
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
