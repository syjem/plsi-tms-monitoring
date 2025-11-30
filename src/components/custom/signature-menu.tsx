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

function SignatureMenu({ children }: { children: ReactNode }) {
  const { user } = useAuthUser();
  const handleSaveSignature = (signatureData: string) => {
    try {
    } catch (e) {
      console.warn(e);
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
