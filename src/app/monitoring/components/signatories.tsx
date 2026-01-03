'use client';

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
import { OperationResult } from '@/utils/with-error-handler';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type SignatoriesProps = {
  isEditable: boolean;
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
  signatories: OperationResult<
    {
      id: number;
      name: string;
      title: string;
    }[],
    Record<string, unknown>
  >;
};

type Signatory = { id: number; name: string; title: string };

export const Signatories = ({
  isEditable,
  signature,
  signatories,
}: SignatoriesProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);

  const [optimisticData, setOptimisticData] = useState<Signatory[] | null>(
    null,
  );

  const serverData = signatories.success ? signatories.data : [];
  const data = optimisticData ?? serverData;

  const firstSignatory = data.find((s) => s.id === 1) || {
    name: '',
    title: '',
  };

  const secondSignatory = data.find((s) => s.id === 2) || {
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

  const handleDialogSubmit = async (formData: {
    id: number;
    name: string;
    title: string;
  }) => {
    setIsSubmitting(true);

    const { id, name, title } = formData;

    if (!id || !name || !title) {
      setIsSubmitting(false);
      return;
    }

    const newSignatory = { id, name, title };

    const updatedSignatories = [
      ...data.filter((s) => s.id !== id),
      newSignatory,
    ].sort((a, b) => a.id - b.id);

    // Store the previous state for rollback in case of error
    const previousData = data;

    try {
      setOptimisticData(updatedSignatories);

      if (id === 1) setIsFirstDialogOpen(false);
      if (id === 2) setIsSecondDialogOpen(false);
      toast.success('Signatories updated successfully');

      const result = await setEngineerSignatory(updatedSignatories);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      router.refresh();
    } catch (error) {
      // Rollback on error
      setOptimisticData(previousData);

      console.error('Error submitting form:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update signatories',
      );

      // Reopen the dialog on error so user can retry
      if (id === 1) setIsFirstDialogOpen(true);
      if (id === 2) setIsSecondDialogOpen(true);
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
            <p className="text-center text-xs md:text-sm text-gray-700">
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
                <EmptyMedia variant="icon" className="bg-gray-200">
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
            <p className="text-center text-xs md:text-sm text-gray-700">
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
                <EmptyMedia variant="icon" className="bg-gray-200">
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
