import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signatorySchema } from '@/lib/zod/schema';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import z from 'zod';

export function FirstSignatoryDialog({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
  firstSignatory,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: {
    id: number;
    name: string;
    title: string;
    includeSignature: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
  firstSignatory: { name: string; title: string };
}) {
  const [errors, setErrors] = useState<{
    name?: string;
    title?: string;
  }>({});

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data = {
      id: Number(formData.get('id')),
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      includeSignature: formData.get('includeSignature') === 'on',
    };

    // Validate with Zod
    const result = signatorySchema.safeParse(data);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      setErrors({
        name: tree.properties?.name?.errors[0],
        title: tree.properties?.title?.errors[0],
      });
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!firstSignatory.name ? 'Add' : 'Edit'} Signatory
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input type="hidden" name="id" defaultValue={1} />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={firstSignatory.name}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Position</Label>
              <Input
                id="title"
                name="title"
                defaultValue={firstSignatory.title}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <Label
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-green-50 
              cursor-pointer"
            >
              <Checkbox
                name="includeSignature"
                defaultChecked
                id="signatory-1"
                className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  Add Signature
                </p>
                <p className="text-muted-foreground text-sm">
                  Include your signature in this signatory.
                </p>
              </div>
            </Label>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
