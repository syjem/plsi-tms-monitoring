import { addEngineerSignature } from '@/app/actions/engineers/add-signature';
import { getEngineerById } from '@/app/actions/engineers/get-engineer';
import SignaturePad from '@/components/signature-pad';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthUser } from '@/provider/auth-user.provider';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { Fragment, ReactNode, useCallback, useState } from 'react';
import { toast } from 'sonner';

function SignatureMenu({ children }: { children: ReactNode }) {
  const { user } = useAuthUser();
  const [edit, setEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryFn: () => getEngineerById(user!.id),
    queryKey: [user?.id],
  });

  const handleSaveSignature = async (signatureData: string) => {
    try {
      // enable loader
      setSubmitting(true);

      if (!user) throw new Error('user not found!');

      return toast.promise(() => addEngineerSignature(user.id, signatureData), {
        loading: 'Saving signature...',
        success: (data) => {
          if (!data.success) throw new Error(data.error.message);

          // fetch data from the database
          refetch();
          // reset edit mode
          setEdit(false);
          // reset loader
          setSubmitting(false);

          return 'Signature saved successfully!';
        },
        error: (e) => {
          setSubmitting(false);
          return (
            e?.message || 'Something went wrong while tyring to save signature!'
          );
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e?.message || 'Something went wrong!');
      }
      // reset state
      setSubmitting(false);
    }
  };

  const shouldShowCanvas = edit || !data?.success;

  const onEditClick = useCallback(() => {
    setEdit((prev) => !prev);
  }, []);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[425px] md:max-w-fit">
          <DialogHeader>
            <DialogTitle>My Signature</DialogTitle>
            <DialogDescription>
              {data?.success
                ? 'Manage your signature!'
                : 'Enter your signature here!'}
            </DialogDescription>
          </DialogHeader>
          <div className="pb-4">
            {isFetching ? (
              <div className="flex flex-col items-end">
                <Skeleton className="w-[500px] h-[300px]" />
                <Skeleton className="w-[100px] h-9 mt-4" />
              </div>
            ) : (
              <Fragment>
                {shouldShowCanvas ? (
                  <SignaturePad
                    width={500}
                    height={300}
                    onSaveSignature={handleSaveSignature}
                    strokeWidth={1.2}
                    isSavingSignature={submitting}
                  />
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="w-[500px] h-[300px] bg-muted rounded-md">
                      <Image
                        src={data.data?.signature as string}
                        alt="signature"
                        width={500}
                        height={300}
                      />
                    </div>
                    <Button variant="outline" onClick={onEditClick}>
                      <Pencil /> Edit Signature
                    </Button>
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default SignatureMenu;
