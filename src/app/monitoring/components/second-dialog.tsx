import { Button } from '@/components/ui/button';
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
import { Loader } from 'lucide-react';

export function SecondFieldDialog({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
  secondSignatory,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  secondSignatory: { name: string; title: string };
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!secondSignatory.name ? 'Add Signatory' : 'Edit Signatory'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => onSubmit(e)}>
          <Input type="hidden" name="id" defaultValue={2} />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={secondSignatory.name}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Position</Label>
              <Input
                id="title"
                name="title"
                defaultValue={secondSignatory.title}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="dark:text-gray-100"
            >
              {isSubmitting ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
