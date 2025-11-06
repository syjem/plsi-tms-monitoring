import { Loader } from "lucide-react";
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

export function SecondFieldDialog({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
  secondFieldData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, field_number: number) => void;
  isSubmitting: boolean;
  secondFieldData: { id?: number; name: string; title: string };
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Second Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => onSubmit(e, 2)}>
          <Input type="hidden" name="id" defaultValue={secondFieldData.id} />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={secondFieldData.name}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={secondFieldData.title}
                required
              />
            </div>
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
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
