import { addEngineerSignature } from '@/app/actions/engineers/add-signature';
import SignaturePad from '@/components/signature-pad';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthUser } from '@/provider/auth-user.provider';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ReactNode } from 'react';
import { toast } from 'sonner';

function SignatureMenu({ children }: { children: ReactNode }) {
  const { user } = useAuthUser();
  const handleSaveSignature = (signatureData: string) => {
    try {
      if (!user) throw new Error('user not found!');

      toast.promise(() => addEngineerSignature(user.id, signatureData), {
        loading: 'Saving signature...',
        error: (e) =>
          e?.message || 'Something went wrong while tyring to save signature!',
      });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e?.message || 'Something went wrong!');
      }
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[425px] md:max-w-fit">
          <DialogHeader>
            <DialogTitle>My Signature</DialogTitle>
            <DialogDescription>Enter your signature here!</DialogDescription>
          </DialogHeader>
          <div className="pb-4">
            <SignaturePad
              width={500}
              height={300}
              onSaveSignature={handleSaveSignature}
            />
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default SignatureMenu;
